import type { Preview } from "@storybook/react"; // インポート元変更
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
    nextjs: {
      appDirectory: true, // App Router対応
      // ここでグローバルなパラメータ設定を追加
      navigation: {
        query: { redirect_to: "/bbs/create" },
      },
    },
  },
};

export default preview;
