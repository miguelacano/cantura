import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Text } from "./Text";

const meta = {
  title: "Design System/Atoms/Text",
  component: Text,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["lg", "md", "sm"] },
    muted: { control: "boolean" },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BodyLarge: Story = {
  args: {
    size: "lg",
    children: "Practice the first 8 bars with a metronome at ♩=80.",
  },
};

export const BodyMedium: Story = {
  args: {
    size: "md",
    children: "Practice the first 8 bars with a metronome at ♩=80.",
  },
};

export const BodySmall: Story = {
  args: { size: "sm", children: "Next lesson on Thursday at 4:00 PM." },
};

export const Muted: Story = {
  args: {
    muted: true,
    children: "Secondary description or hint text.",
  },
};
