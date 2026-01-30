// eslint.config.cjs
const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: ["node_modules/**", "coverage/**", "dist/**", "build/**", ".data/**"],
  },

  js.configs.recommended,

  // Browser (public client scripts)
  {
    files: ["src/public/js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
      },
    },
  },

  // Node (server + scripts)
  {
    files: ["src/**/*.js", "scripts/**/*.js"],
    ignores: ["src/public/js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
    },
  },
];
