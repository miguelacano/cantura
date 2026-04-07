import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Design System/Atoms/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["success", "warning", "error", "info", "neutral"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: { variant: "success", children: "Completed" },
};

export const Warning: Story = {
  args: { variant: "warning", children: "In Progress" },
};

export const Error: Story = {
  args: { variant: "error", children: "Late" },
};

export const Info: Story = {
  args: { variant: "info", children: "Online" },
};

export const Neutral: Story = {
  args: { variant: "neutral", children: "Draft" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 p-6 bg-surface-light">
      <Badge variant="success">Completed</Badge>
      <Badge variant="warning">In Progress</Badge>
      <Badge variant="error">Late</Badge>
      <Badge variant="info">Online</Badge>
      <Badge variant="neutral">Draft</Badge>
    </div>
  ),
};
