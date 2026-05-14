import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select } from "./Select";

const meta = {
  title: "Design System/Atoms/Select",
  component: Select,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select placeholder="Select instrument">
      <option value="piano">Piano</option>
      <option value="violin">Violin</option>
      <option value="guitar">Guitar</option>
      <option value="cello">Cello</option>
    </Select>
  ),
};

export const WithValue: Story = {
  render: () => (
    <Select defaultValue="piano">
      <option value="piano">Piano</option>
      <option value="violin">Violin</option>
      <option value="guitar">Guitar</option>
    </Select>
  ),
};

export const WithError: Story = {
  render: () => (
    <Select
      placeholder="Select instrument"
      error="Please select an instrument."
    >
      <option value="piano">Piano</option>
      <option value="violin">Violin</option>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled defaultValue="piano">
      <option value="piano">Piano</option>
    </Select>
  ),
};
