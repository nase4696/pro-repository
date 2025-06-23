// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import unicorn from "eslint-plugin-unicorn";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [...compat.extends("next/core-web-vitals", "next/typescript"), {
  files: ["**/*.ts", "**/*.tsx"],
  plugins: {
    "@typescript-eslint": typescript,
    unicorn: unicorn,
    import: importPlugin,
  },
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      project: "./tsconfig.json",
    },
  },
  rules: {
    ...(typescript.configs?.["recommended-type-checked"]?.rules ?? {}),
    ...(typescript.configs?.["stylistic-type-checked"]?.rules ?? {}),
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: { attributes: false },
      },
    ],
    "unicorn/filename-case": [
      "error",
      {
        case: "kebabCase",
      },
    ],
    "func-style": ["error", "declaration", { allowArrowFunctions: false }],
    "prefer-arrow-callback": ["error", { allowNamedFunctions: false }],
    "import/no-default-export": "error",
  },
}, {
  files: [
    "**/page.tsx",
    "**/layout.tsx",
    "next.config.ts",
    "postcss.config.mjs",
    "tailwind.config.ts",
  ],
  rules: {
    "import/no-default-export": "off",
    "import/prefer-default-export": "error",
  },
}, {
  ignores: ["src/components/ui/*", "*.md"],
}, ...storybook.configs["flat/recommended"]];

export default config;
