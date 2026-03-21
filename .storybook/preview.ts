import type { Preview } from "@storybook/react";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Group stories in the sidebar by their title prefix
    options: {
      storySort: {
        order: [
          "Design Tokens",
          ["Colors", "Typography", "Radius & Spacing", "Theme Overview"],
          "Atoms",
          "Molecules",
          "Organisms",
        ],
      },
    },
  },
  // Apply Manrope font to every story canvas
  decorators: [
    (Story) => {
      if (typeof document !== "undefined") {
        document.body.style.fontFamily =
          '"Manrope", system-ui, sans-serif';
      }
      return Story();
    },
  ],
};

export default preview;
