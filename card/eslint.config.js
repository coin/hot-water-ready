import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["node_modules", "build.mjs", "browser-check.mjs", "eslint.config.js"] },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  {
    // Home Assistant's own signatures: the caller names the reply type.
    files: ["src/types.ts"],
    rules: { "@typescript-eslint/no-unnecessary-type-parameters": "off" },
  },
);
