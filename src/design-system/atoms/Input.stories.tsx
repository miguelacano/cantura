import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./Input";

const meta = {
  title: "Design System/Atoms/Input",
  component: Input,
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
    type: {
      control: "select",
      options: ["text", "email", "password", "search"],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "Enter student name" },
};

export const WithIcon: Story = {
  args: {
    leadingIcon: "search",
    placeholder: "Search students…",
    type: "search",
  },
};

export const Email: Story = {
  args: { type: "email", placeholder: "guardian@email.com" },
};

export const Password: Story = {
  args: { type: "password", placeholder: "Password" },
};

export const WithError: Story = {
  args: {
    type: "email",
    defaultValue: "not-an-email",
    error: "Please enter a valid email address.",
  },
};

export const Disabled: Story = {
  args: { placeholder: "Cannot edit", disabled: true },
};
