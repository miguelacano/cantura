import type { Preview } from "@storybook/react";
import "../src/app/globals.css";

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  // Apply Manrope font to every story canvas
  decorators: [
    (Story) => {
      if (typeof document !== "undefined") {
        document.body.style.fontFamily = '"Manrope", system-ui, sans-serif';
      }
      return Story();
    },
  ],
};

export default preview;
