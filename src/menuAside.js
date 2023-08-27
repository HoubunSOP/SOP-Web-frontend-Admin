import {
  mdiMonitor,
  mdiLock,
  mdiTable,
  mdiTelevisionGuide,
  mdiBookEdit,
  mdiNoteEdit,
} from "@mdi/js";

export default [
  {
    to: "/",
    icon: mdiMonitor,
    label: "Dashboard",
  },
  {
    to: "/tables",
    label: "Tables",
    icon: mdiTable,
  },
  {
    to: "/ui",
    label: "UI",
    icon: mdiTelevisionGuide,
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
  {
    to: "/login",
    label: "Login",
    icon: mdiLock,
  },
];
