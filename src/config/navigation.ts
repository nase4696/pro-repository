import { MainNavConfig, MobileNavConfig } from "@/types/config";

export const mainNavConfig: MainNavConfig = {
  mainNav: [
    {
      title: "掲示板一覧",
      href: "/home",
    },
    {
      title: "掲示板の作成",
      href: "/bbs/create",
    },
    {
      title: "掲示板の編集",
      href: "/bbs/editor",
    },
    {
      title: "設定",
      href: "/home/config",
    },
  ],
};

export const mobileNavConfig: MobileNavConfig = {
  mobileNav: [
    {
      title: "お問い合わせ",
      href: "/home/customer",
    },
    {
      title: "プロフィール",
      href: "/home/profile",
    },
    {
      title: "設定",
      href: "/home/config",
    },
  ],
};
