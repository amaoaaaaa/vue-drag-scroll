import { App } from "vue";
import dragScroll from "./directive";

export default {
    install(app: App) {
        app.directive("drag-scroll", dragScroll);
    },
};

export { dragScroll };
