import { mdiLogout, mdiThemeLightDark, mdiGithub, mdiReact } from "@mdi/js";

export default [
  {
    isCurrentUser: true,
    menu: [
      {
        icon: mdiLogout,
        label: "Log Out",
        isLogout: true,
      },
    ],
  },
  {
    icon: mdiThemeLightDark,
    label: "Light/Dark",
    isDesktopNoLabel: true,
    isToggleLightDark: true,
  },
  {
    icon: mdiGithub,
    label: "GitHub",
    isDesktopNoLabel: true,
    href: "https://github.com/justboil/admin-one-vue-tailwind",
    target: "_blank",
  },
  {
    icon: mdiReact,
    label: "React version",
    isDesktopNoLabel: true,
    href: "https://github.com/justboil/admin-one-react-tailwind",
    target: "_blank",
  },
  {
    icon: mdiLogout,
    label: "Log out",
    isDesktopNoLabel: true,
    isLogout: true,
  },
];
