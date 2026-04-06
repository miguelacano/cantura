import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from "./Avatar";

const meta = {
  title: "Design System/Atoms/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    status: {
      control: "select",
      options: [undefined, "online", "offline", "away"],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInitials: Story = {
  args: { initials: "MC", size: "md" },
};

export const WithStatus: Story = {
  args: { initials: "MC", size: "md", status: "online" },
};

export const Small: Story = {
  args: { initials: "JD", size: "sm" },
};

export const Large: Story = {
  args: { initials: "SA", size: "lg", status: "away" },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-6 bg-surface-light">
      <Avatar initials="MC" size="sm" status="online" />
      <Avatar initials="MC" size="md" status="online" />
      <Avatar initials="MC" size="lg" status="online" />
    </div>
  ),
};
