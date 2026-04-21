import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
  it("renders a checkbox with role switch", () => {
    render(<Toggle />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("is unchecked by default", () => {
    render(<Toggle />);
    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("renders as checked when defaultChecked is true", () => {
    render(<Toggle defaultChecked />);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("toggles on click without an onChange handler (native form usage)", async () => {
    render(<Toggle />);
    const toggle = screen.getByRole("switch");
    await userEvent.click(toggle);
    expect(toggle).toBeChecked();
  });

  describe("onChange callback", () => {
    it("calls onChange with true when toggled on", async () => {
      const onChange = vi.fn();
      render(<Toggle onChange={onChange} />);
      await userEvent.click(screen.getByRole("switch"));
      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it("calls onChange with false when toggled off", async () => {
      const onChange = vi.fn();
      render(<Toggle defaultChecked onChange={onChange} />);
      await userEvent.click(screen.getByRole("switch"));
      expect(onChange).toHaveBeenCalledWith(false);
    });
  });

  describe("keyboard interaction", () => {
    it("can be focused with Tab", async () => {
      render(<Toggle />);
      await userEvent.tab();
      expect(screen.getByRole("switch")).toHaveFocus();
    });

    it("toggles via Space key when focused", async () => {
      render(<Toggle />);
      screen.getByRole("switch").focus();
      await userEvent.keyboard(" ");
      expect(screen.getByRole("switch")).toBeChecked();
    });
  });

  it("accepts a name prop for native form submission", () => {
    render(<Toggle name="canMessage" />);
    expect(screen.getByRole("switch")).toHaveAttribute("name", "canMessage");
  });

  it("renders label text when label is provided", () => {
    render(<Toggle label="Allow messaging" />);
    expect(screen.getByText("Allow messaging")).toBeInTheDocument();
  });

  it("does not render label text when label is omitted", () => {
    const { container } = render(<Toggle />);
    expect(container.querySelector("span")).not.toBeInTheDocument();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Toggle disabled />);
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("does not toggle when disabled", async () => {
    render(<Toggle disabled />);
    const toggle = screen.getByRole("switch");
    await userEvent.click(toggle);
    expect(toggle).not.toBeChecked();
  });
});
