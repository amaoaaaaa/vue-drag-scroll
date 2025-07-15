import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [dts()],
    build: {
        lib: {
            entry: "./src/index.ts",
            name: "VueDragScroll",
            fileName: (format) => `drag-scroll.${format}.js`,
            formats: ["es", "umd"],
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                globals: {
                    vue: "Vue",
                },
            },
        },
    },
});
