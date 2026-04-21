import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Textarea } from "./Textarea";

const meta = {
  title: "Design System/Atoms/Textarea",
  component: Textarea,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "24rem" }}>
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "Add a practice note…" },
};

export const Filled: Story = {
  args: {
    defaultValue:
      "Practice the first 8 bars slowly, then gradually increase tempo. Focus on the left hand passage in measure 5.",
  },
};

export const WithError: Story = {
  args: { placeholder: "Required", error: "Note cannot be empty." },
};

export const Disabled: Story = {
  args: { placeholder: "Read only", disabled: true },
};
