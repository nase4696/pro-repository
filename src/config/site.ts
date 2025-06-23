import { SiteConfig } from "@/types/config";

export const siteConfig: SiteConfig = {
  name: "Next BBS",
  //   掲示板の以外の機能を追加した場合はその内容についても追記する
  description:
    "共通の趣味でつながることが出来るNext.jsを使用した掲示板サイトです",
  // 本来はデプロイした先のURLになるがとりあえず開発環境のURLにする
  url: "http://localhost:3000",
  ogImage: "",
  //   自分のxやgithubのリンクを載せる
  links: {
    x: "",
    github: "",
  },
};
