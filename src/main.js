import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { useStyleStore } from "@/stores/style.js";
import { darkModeKey } from "@/config.js";
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import "./css/main.css";
import { post, put, get } from "./stores/api";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
/* Init Pinia */
const pinia = createPinia();

/* Create Vue app */

const app = createApp(App);
app.config.globalProperties.$post = post;
app.config.globalProperties.$put = put;
app.config.globalProperties.$get = get;

const options = {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true,
};
app.use(Toast, options).use(router).use(pinia).use(mavonEditor).mount("#app");

/* Init Pinia stores */
const styleStore = useStyleStore(pinia);

/* Fetch sample data */

/* App style */
styleStore.setStyle("white");

/* Dark mode */
if (
  (!localStorage[darkModeKey] &&
    window.matchMedia("(prefers-color-scheme: dark)").matches) ||
  localStorage[darkModeKey] === "1"
) {
  styleStore.setDarkMode(true);
}

/* Default title tag */
const defaultDocumentTitle = "芳文观星台 - 网站后台";

/* Set document title from route meta */
router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle;
});
