import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import testingLibrary from "eslint-plugin-testing-library";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "storybook-static/**", "coverage/**"],
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ["**/*.{spec,test}.{js,jsx,ts,tsx,vue}"],
    ...testingLibrary.configs["flat/vue"],
  },
  {
    files: ["**/*.visual.spec.{js,jsx,ts,tsx}"],
    rules: {
      "testing-library/prefer-screen-queries": "off",
    },
  },
  {
    files: ["src/**/*.{ts,tsx,vue}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^\\.\\./",
              message:
                "Use alias imports com @/ para modulos internos do projeto, evitando imports relativos entre pastas.",
            },
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
];
