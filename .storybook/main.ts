import type { StorybookConfig } from "@storybook/nextjs";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
  features: {
    experimentalRSC: true,
  },
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "server-only": path.resolve(__dirname, "../src/mocks/server-only.ts"),
      "@": path.resolve(__dirname, "../src"),
      "#actions": path.resolve(
        __dirname,
        "../src/actions/registerUser.mock.ts"
      ),
      "@/*": path.resolve(__dirname, "../src/*"),
    };
    return config;
  },
};
export default config;
