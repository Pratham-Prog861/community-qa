import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import eslintPluginPromise from "eslint-plugin-promise";
import eslintPluginNode from "eslint-plugin-n";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    ignores: ["dist/**", "node_modules/**"]
  },
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  eslintPluginPromise.configs["flat/recommended"],
  eslintPluginNode.configs["flat/recommended"],
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly"
      }
    },
    rules: {
      "no-console": ["warn", { allow: ["error"] }],
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "always",
          mjs: "always"
        }
      ]
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".mjs"]
        }
      }
    }
  }
];

