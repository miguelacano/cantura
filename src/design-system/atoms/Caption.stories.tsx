import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Caption } from "./Caption";

const meta = {
  title: "Design System/Atoms/Caption",
  component: Caption,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    subtle: { control: "boolean" },
  },
} satisfies Meta<typeof Caption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Updated 2 hours ago · Read" },
};

export const Subtle: Story = {
  args: { children: "Joined March 2024", subtle: true },
};
