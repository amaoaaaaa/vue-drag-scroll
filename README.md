# vue-drag-scroll

🖱️ 一个轻量级的 Vue 3 自定义指令，用于通过鼠标拖拽滚动容器内容。支持传入子元素选择器，自动清理监听，含惯性滚动效果。

## ✨ 特性

- 支持任意容器通过鼠标拖拽进行滚动
- 可传入子元素选择器（例如 `.el-scrollbar__wrap`）控制具体滚动目标
- 自动清除事件监听，防止内存泄漏
- 支持惯性滚动体验
- 类型完善，支持 TypeScript

## 📦 安装

```bash
npm install vue-drag-scroll

# 或者使用 pnpm / yarn
pnpm add vue-drag-scroll
```

## 🔧 使用方式

### 注册指令

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { dragScroll } from 'vue-drag-scroll'

const app = createApp(App)

app.directive('drag-scroll', dragScroll)

app.mount('#app')
```

### 示例 1：滚动自己的内容

```vue
<template>
  <div v-drag-scroll class="overflow-auto h-96 bg-gray-100">
    <div class="w-[2000px] h-[2000px]">Huge content...</div>
  </div>
</template>
```

### 示例 2：滚动内部子元素（如 Element Plus 的 el-scrollbar）

```vue
<template>
  <el-scrollbar v-drag-scroll="'.el-scrollbar__wrap'" always height="300px">
    <div style="width: 2000px">Some long content</div>
  </el-scrollbar>
</template>
```

## ⚙️ 参数说明

| 参数类型     | 描述                | 是否必填 | 示例                      |
| -------- | ----------------- | ---- | ----------------------- |
| `string` | 子元素选择器，用于选择内部滚动容器 | 否    | `'.el-scrollbar__wrap'` |

不传参数时，默认滚动当前绑定元素本身。

## 💡 类型支持（TypeScript）

你可以选择拓展 Vue 的类型支持：

```ts
// types/vue-shim.d.ts
import { dragScroll } from 'vue-drag-scroll'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    /**
     * 自定义指令：v-drag-scroll
     *
     * @description 拖拽滚动内容
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
    vDragScroll: typeof dragScroll;
  }
}
```