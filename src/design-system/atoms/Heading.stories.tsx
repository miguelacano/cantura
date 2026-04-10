import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Heading } from "./Heading";

const meta = {
  title: "Design System/Atoms/Heading",
  component: Heading,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    level: { control: "select", options: ["lg", "md", "sm", "xs"] },
    as: { control: "select", options: ["h1", "h2", "h3", "h4"] },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Large: Story = {
  args: { level: "lg", children: "Music shapes the soul." },
};

export const Medium: Story = {
  args: { level: "md", children: "Today's Lessons" },
};

export const Small: Story = {
  args: { level: "sm", children: "Mia Chen — Piano" },
};

export const XSmall: Story = {
  args: { level: "xs", children: "Technique Notes" },
};

export const Scale: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-6 bg-surface-light">
      <Heading level="lg">Display Large — Hero headings</Heading>
      <Heading level="md">Display Medium — Section headings</Heading>
      <Heading level="sm">Display Small — Card titles</Heading>
      <Heading level="xs">Display XSmall — Subsection labels</Heading>
    </div>
  ),
};
