import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/HomeView.vue";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { useToast } from "vue-toastification";

NProgress.configure({ showSpinner: false }); // 禁⽤进度环 若为true右侧会出现一个进度环
const routes = [
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: "主页",
    },
    path: "/",
    name: "dashboard",
    component: Home,
  },
  {
    meta: {
      title: "添加漫画",
    },
    path: "/comic/new",
    component: () => import("@/views/ComicView.vue"),
    props: {
      id: 0,
    },
  },
  {
    meta: {
      title: "修改漫画",
    },
    path: "/comic/:id",
    component: () => import("@/views/ComicView.vue"),
    props: true,
  },
  {
    meta: {
      title: "添加文章",
    },
    path: "/post/new",
    component: () => import("@/views/PostView.vue"),
    props: {
      id: 0,
    },
  },
  {
    meta: {
      title: "修改文章",
    },
    path: "/post/:id",
    component: () => import("@/views/PostView.vue"),
    props: true,
  },
  {
    meta: {
      title: "文章列表",
    },
    path: "/list/post",
    component: () => import("@/views/PostTableView.vue"),
  },
  {
    meta: {
      title: "漫画列表",
    },
    path: "/list/comic",
    component: () => import("@/views/ComicTableView.vue"),
  },
  {
    meta: {
      title: "文章分类列表",
    },
    path: "/list/postcat",
    component: () => import("@/views/PostCatTableView.vue"),
  },
  {
    meta: {
      title: "设置",
    },
    path: "/settings",
    component: () => import("@/views/SettingsView.vue"),
  },
  {
    meta: {
      title: "Login",
    },
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/comic/",
    redirect: "/comic/new",
  },
  {
    path: "/post/",
    redirect: "/post/new",
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];
const TIMEOUT_DURATION = 5000;
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  NProgress.start(); // 开始进度条
  let isOffline = false;
  const timer = setTimeout(() => {
    const toast = useToast();
    toast.error("您似乎与Web服务器断开了连接，请检查网络状况或稍后重试吧");
    console.error("您似乎与Web服务器断开了连接，请检查网络状况或稍后重试吧");
    isOffline = true;
  }, TIMEOUT_DURATION);
  next();

  // 路由跳转后
  router.afterEach(() => {
    NProgress.done(); // 结束进度条
    clearTimeout(timer);
    if (isOffline) {
      const toast = useToast();
      toast.success("您与Web服务器重新获得了连接");
    }
  });
});

export default router;
