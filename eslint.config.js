import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";
import astro from "eslint-plugin-astro";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import importPlugin from "eslint-plugin-import-x";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";

const UNUSED_VARS_RULE = [
  "error",
  {
    vars: "all",
    varsIgnorePattern: "^_",
    args: "after-used",
    argsIgnorePattern: "^_",
  },
];

const IMPORT_ORDER_BASE = {
  groups: [["builtin", "external"], "internal", ["parent", "sibling", "index"]],
  "newlines-between": "always",
  alphabetize: { order: "asc", caseInsensitive: true },
};

const eslintConfig = defineConfig([
  ...astro.configs.recommended,

  // .astroファイル用
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astro.parser,
      parserOptions: {
        parser: tsParser,
        project: "./tsconfig.json",
        extraFileExtensions: [".astro"],
      },
    },
    plugins: {
      astro,
      "@typescript-eslint": tseslint,
      "unused-imports": unusedImports,
      import: importPlugin,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": UNUSED_VARS_RULE,
      "import/order": [
        "error",
        {
          ...IMPORT_ORDER_BASE,
          pathGroups: [
            { pattern: "astro**", group: "external", position: "before" },
          ],
        },
      ],
    },
  },

  // TS/TSX/JS/JSX
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "react-hooks": reactHooks,
      "unused-imports": unusedImports,
      import: importPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // TypeScript
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: false },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",

      // JavaScript
      "no-implicit-coercion": "error",

      // Import
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": UNUSED_VARS_RULE,
      "import/no-dynamic-require": "error",
      "import/no-unused-modules": "error",
      "import/no-unresolved": "off",
      "import/order": [
        "error",
        {
          ...IMPORT_ORDER_BASE,
          pathGroups: [
            { pattern: "react**", group: "external", position: "before" },
            {
              pattern: "@/components/ui/**",
              group: "external",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
        },
      ],
    },
  },

  // サーバーサイド（Node built-ins禁止）
  {
    files: ["src/components/**", "src/layouts/**"],
    rules: {
      "import/no-nodejs-modules": "error",
    },
  },

  // Tailwind（共通ルール）
  {
    files: ["**/*.{js,jsx,ts,tsx,astro}"],
    plugins: {
      "better-tailwindcss": eslintPluginBetterTailwindcss,
    },
    rules: {
      ...eslintPluginBetterTailwindcss.configs["recommended-error"].rules,
      "better-tailwindcss/enforce-consistent-line-wrapping": [
        "error",
        { group: "newLine", preferSingleLine: true, printWidth: 120 },
      ],
      "better-tailwindcss/no-unnecessary-whitespace": ["error"],
      "better-tailwindcss/enforce-consistent-class-order": [
        "error",
        { order: "official" },
      ],
      "better-tailwindcss/no-duplicate-classes": ["error"],
      "better-tailwindcss/no-unknown-classes": ["error"],
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/styles/global.css",
      },
    },
  },

  // Tailwind（.astro用パーサー）
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astro.parser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".astro"],
      },
    },
  },

  globalIgnores(["dist/**", ".astro/**", "node_modules/**"]),
]);

export default eslintConfig;
