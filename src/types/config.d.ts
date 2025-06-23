export type NavItem = {
  title: string;
  href: string;
  //   ページを作成中などの場合にアクセス出来ないようにする為の型
  disabled?: boolean;
};

export type MainNavConfig = {
  mainNav: NavItem[];
};

export type MobileNavConfig = {
  mobileNav: NavItem[];
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links?: {
    x: string;
    github: string;
  };
};
