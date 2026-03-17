module.exports = {
  extends: ["stylelint-config-standard"],
  ignoreFiles: [
    "**/.next/**",
    "**/node_modules/**",
    "**/dist/**"
  ],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["theme", "import", "custom-media", "tailwind", "apply", "layer", "config"]
      }
    ]
  }
};
