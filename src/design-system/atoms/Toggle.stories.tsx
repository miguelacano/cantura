import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toggle } from "./Toggle";

const meta = {
  title: "Design System/Atoms/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {
  args: { label: "Allow messaging", id: "toggle-off" },
};

export const On: Story = {
  args: { label: "Allow messaging", id: "toggle-on", defaultChecked: true },
};

export const NoLabel: Story = {
  args: { id: "toggle-no-label" },
};

export const Disabled: Story = {
  args: {
    label: "Notifications disabled",
    id: "toggle-disabled",
    disabled: true,
  },
};
