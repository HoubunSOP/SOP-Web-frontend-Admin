import {
  mdiMonitor,
  mdiBookEdit,
  mdiNoteEdit,
  mdiFormatListBulletedSquare,
  mdiFormatListText,
  mdiFormatListBulletedTriangle,
} from "@mdi/js";

export default [
  {
    to: "/",
    icon: mdiMonitor,
    label: "主页",
  },
  {
    to: "/list/post",
    label: "文章列表",
    icon: mdiFormatListBulletedSquare,
  },
  {
    to: "/list/comic",
    label: "漫画列表",
    icon: mdiFormatListText,
  },
  {
    to: "/list/postcat",
    label: "文章分类列表",
    icon: mdiFormatListBulletedTriangle,
  },
  {
    to: "/comic/new",
    label: "新漫画",
    icon: mdiBookEdit,
  },
  {
    to: "/post/new",
    label: "新文章",
    icon: mdiNoteEdit,
  },
];
