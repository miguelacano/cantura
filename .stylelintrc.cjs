module.exports = {
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["**/.next/**", "**/node_modules/**", "**/dist/**"],
  rules: {
    // Tailwind v4 requires string notation: @import "tailwindcss"
    // url() notation breaks PostCSS processing — do not change this rule.
    "import-notation": "string",
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "theme",
          "import",
          "custom-media",
          "tailwind",
          "apply",
          "layer",
          "config",
        ],
      },
    ],
  },
};
