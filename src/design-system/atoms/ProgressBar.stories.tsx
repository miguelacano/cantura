import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProgressBar } from "./ProgressBar";

const meta = {
  title: "Design System/Atoms/ProgressBar",
  component: ProgressBar,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error"],
    },
    value: { control: { type: "range", min: 0, max: 100 } },
    showPercent: { control: "boolean" },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 60 },
};

export const WithLabel: Story = {
  args: { value: 75, label: "Repertoire progress", showPercent: true },
};

export const Success: Story = {
  args: {
    value: 100,
    variant: "success",
    label: "Completed",
    showPercent: true,
  },
};

export const Warning: Story = {
  args: {
    value: 45,
    variant: "warning",
    label: "In progress",
    showPercent: true,
  },
};

export const Error: Story = {
  args: {
    value: 20,
    variant: "error",
    label: "Behind schedule",
    showPercent: true,
  },
};

export const AllVariants: Story = {
  args: { value: 0 },
  render: () => (
    <div className="flex flex-col gap-4 p-6 bg-surface-light w-64">
      <ProgressBar value={85} variant="default" label="Default" showPercent />
      <ProgressBar value={100} variant="success" label="Success" showPercent />
      <ProgressBar value={50} variant="warning" label="Warning" showPercent />
      <ProgressBar value={20} variant="error" label="Error" showPercent />
    </div>
  ),
};
