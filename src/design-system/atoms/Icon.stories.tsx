import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Icon } from "./Icon";

const meta = {
  title: "Design System/Atoms/Icon",
  component: Icon,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    filled: { control: "boolean" },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: "music_note" },
};

export const Filled: Story = {
  args: { name: "star", filled: true },
};

export const Small: Story = {
  args: { name: "check_circle", size: "sm" },
};

export const Large: Story = {
  args: { name: "school", size: "lg" },
};

export const ExtraLarge: Story = {
  args: { name: "person", size: "xl" },
};

export const Sampler: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4 bg-surface-light">
      {[
        "music_note",
        "piano",
        "school",
        "person",
        "check_circle",
        "star",
        "notifications",
        "search",
        "arrow_forward",
        "expand_more",
        "edit",
        "delete",
        "add",
        "close",
        "menu",
        "calendar_today",
        "assignment",
        "chat",
        "flag",
        "tune",
      ].map((name) => (
        <div key={name} className="flex flex-col items-center gap-1">
          <Icon name={name} size="md" className="text-text-primary" />
          <span className="text-xs text-text-subtle font-mono">{name}</span>
        </div>
      ))}
    </div>
  ),
};
