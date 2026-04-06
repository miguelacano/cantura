import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";

const meta = {
  title: "Design System/Atoms/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost"],
    },
    size: { control: "select", options: ["sm", "md"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary", children: "Save Note" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Cancel" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "View Profile" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Learn more" },
};

export const Small: Story = {
  args: { variant: "primary", size: "sm", children: "Add Student" },
};

export const WithIcon: Story = {
  args: { variant: "primary", iconLeft: "add", children: "New Lesson" },
};

export const Loading: Story = {
  args: { variant: "primary", loading: true, children: "Saving…" },
};

export const Disabled: Story = {
  args: { variant: "primary", disabled: true, children: "Unavailable" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 p-6 bg-surface-light">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};
