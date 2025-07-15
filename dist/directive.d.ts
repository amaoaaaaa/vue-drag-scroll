import { Directive } from 'vue';
export interface DragState {
    isDragging: boolean;
    startX: number;
    startY: number;
    startPageX: number;
    startPageY: number;
    scrollLeft: number;
    scrollTop: number;
    target: HTMLElement | null;
    moved: boolean;
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
declare const dragScroll: Directive;
export default dragScroll;
