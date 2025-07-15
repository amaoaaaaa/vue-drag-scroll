import { Directive, DirectiveBinding } from "vue";

export interface DragState {
    // 基本拖动
    isDragging: boolean;
    startX: number;
    startY: number;
    startPageX: number;
    startPageY: number;
    scrollLeft: number;
    scrollTop: number;
    target: HTMLElement | null;
    moved: boolean;

    // 增加惯性
    velocityX: number;
    velocityY: number;
    lastTime: number;
    lastX: number;
    lastY: number;
    inertiaFrame: number | null;

    onMouseMove: (e: MouseEvent) => void;
    onMouseUp: (e: MouseEvent) => void;
    onMouseDown: (e: MouseEvent) => void;
}

const dragScrollMap = new WeakMap<HTMLElement, DragState>();

/**
 * 拖拽滚动内容
 *
 * @example
 * // 滚动自己的内容，指令不需要传参数
 * <div v-drag-scroll class="h-96 bg-red-500/50 overflow-auto">
 *     <p class="w-[800px]">{{ Random.csentence(99999) }}</p>
 * </div>
 *
 * @example
 * // 滚动内部子元素，参数传子元素的选择器
 * <el-scrollbar v-drag-scroll="'.el-scrollbar__wrap'" always class="h-60">
 *     ......
 * </el-scrollbar>
 */
const dragScroll: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const state: DragState = {
            isDragging: false,
            startX: 0,
            startY: 0,
            startPageX: 0,
            startPageY: 0,
            scrollLeft: 0,
            scrollTop: 0,
            target: null,
            moved: false,

            velocityX: 0,
            velocityY: 0,
            lastTime: 0,
            lastX: 0,
            lastY: 0,
            inertiaFrame: null,

            onMouseMove: () => {},
            onMouseUp: () => {},
            onMouseDown: () => {},
        };

        /**
         * 获取实际要滚动的元素
         * @returns
         */
        const getTarget = (): HTMLElement | null => {
            const selector = binding.value;

            if (typeof selector === "string") {
                return el.querySelector(selector);
            }

            return el;
        };

        const stopInertia = () => {
            if (state.inertiaFrame != null) {
                cancelAnimationFrame(state.inertiaFrame);
                state.inertiaFrame = null;
            }
        };

        const startInertia = () => {
            stopInertia();

            const decay = 0.95; // 惯性衰减系数
            const minSpeed = 0.5;

            const step = () => {
                if (!state.target) return;

                state.velocityX *= decay;
                state.velocityY *= decay;

                if (Math.abs(state.velocityX) < minSpeed && Math.abs(state.velocityY) < minSpeed) {
                    stopInertia();
                    return;
                }

                state.target.scrollLeft -= state.velocityX;
                state.target.scrollTop -= state.velocityY;

                state.inertiaFrame = requestAnimationFrame(step);
            };

            state.inertiaFrame = requestAnimationFrame(step);
        };

        const cleanup = () => {
            state.isDragging = false;

            document.removeEventListener("mousemove", state.onMouseMove);
            document.removeEventListener("mouseup", state.onMouseUp);
        };

        state.onMouseDown = (e: MouseEvent) => {
            state.target = getTarget();
            if (!state.target) return;

            // 停止上一轮惯性
            stopInertia();

            state.isDragging = true;
            state.moved = false;
            state.startX = e.clientX;
            state.startY = e.clientY;
            state.startPageX = e.pageX;
            state.startPageY = e.pageY;
            state.scrollLeft = state.target.scrollLeft;
            state.scrollTop = state.target.scrollTop;

            state.lastTime = performance.now();
            state.lastX = e.clientX;
            state.lastY = e.clientY;

            document.addEventListener("mousemove", state.onMouseMove);
            document.addEventListener("mouseup", state.onMouseUp);
        };

        state.onMouseMove = (e: MouseEvent) => {
            if (!state.isDragging || !state.target) return;

            // 鼠标经过按下的点时终止事件，防止和 UE 冲突
            if (e.pageX === state.startPageX && e.pageY === state.startPageY) {
                e.preventDefault();
                return;
            }

            const now = performance.now();
            const dx = e.clientX - state.startX;
            const dy = e.clientY - state.startY;

            // 移动距离大于阈值则判断为移动了
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                state.moved = true;
            }

            // 更新速度
            const deltaX = e.clientX - state.lastX;
            const deltaY = e.clientY - state.lastY;
            const dt = now - state.lastTime || 16;

            state.velocityX = (deltaX / dt) * 16;
            state.velocityY = (deltaY / dt) * 16;

            state.lastX = e.clientX;
            state.lastY = e.clientY;
            state.lastTime = now;

            state.target.scrollLeft = state.scrollLeft - dx;
            state.target.scrollTop = state.scrollTop - dy;
        };

        state.onMouseUp = () => {
            // 确实产生了移动
            if (state.isDragging && state.moved) {
                // 阻止下一次点击事件冒泡（防止触发点击）
                const stopClick = (clickEvent: MouseEvent) => {
                    clickEvent.stopImmediatePropagation();
                    clickEvent.preventDefault();
                    document.removeEventListener("click", stopClick, true);
                };
                document.addEventListener("click", stopClick, true);

                // ⚠️ 若速度很小，说明已经停下，不触发惯性
                const speed = Math.sqrt(state.velocityX ** 2 + state.velocityY ** 2);
                const speedThreshold = 1.5; // px/frame，可以根据手感调节

                if (speed > speedThreshold) {
                    // 启动惯性
                    startInertia();
                }
            }

            cleanup();
        };

        el.addEventListener("mousedown", state.onMouseDown);

        // 先存起来，组件 unmounted 时需要清理一些东西
        dragScrollMap.set(el, state);
    },

    unmounted(el: HTMLElement) {
        const state = dragScrollMap.get(el);

        // 移除事件监听器
        if (state) {
            el.removeEventListener("mousedown", state.onMouseDown);
            document.removeEventListener("mousemove", state.onMouseMove);
            document.removeEventListener("mouseup", state.onMouseUp);
            if (state.inertiaFrame !== null) cancelAnimationFrame(state.inertiaFrame);

            dragScrollMap.delete(el);
        }
    },
};

export default dragScroll;
