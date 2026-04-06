import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  describe("rendering", () => {
    it("renders children", () => {
      render(<Button>Save Note</Button>);
      expect(
        screen.getByRole("button", { name: "Save Note" })
      ).toBeInTheDocument();
    });

    it("renders as a button element", () => {
      render(<Button>Click</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("variants", () => {
    it("applies primary variant classes by default", () => {
      render(<Button>Primary</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-brand-primary");
    });

    it("applies secondary variant classes", () => {
      render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-brand-primary-subtle");
    });

    it("applies outline variant classes", () => {
      render(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole("button")).toHaveClass(
        "border",
        "border-brand-primary"
      );
    });

    it("applies ghost variant classes", () => {
      render(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole("button")).toHaveClass("text-brand-primary");
    });
  });

  describe("sizes", () => {
    it("applies md size classes by default", () => {
      render(<Button>Medium</Button>);
      expect(screen.getByRole("button")).toHaveClass("px-4", "py-2");
    });

    it("applies sm size classes", () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole("button")).toHaveClass("px-3", "py-1.5");
    });
  });

  describe("disabled state", () => {
    it("is disabled when disabled prop is set", () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("does not fire onClick when disabled", async () => {
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          Disabled
        </Button>
      );
      await userEvent.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("loading state", () => {
    it("is disabled when loading", () => {
      render(<Button loading>Save</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("renders the loading icon when loading", () => {
      render(<Button loading>Save</Button>);
      expect(screen.getByText("progress_activity")).toBeInTheDocument();
    });
  });

  describe("iconLeft", () => {
    it("renders the icon name when iconLeft is provided", () => {
      render(<Button iconLeft="add">New</Button>);
      expect(screen.getByText("add")).toBeInTheDocument();
    });

    it("does not render iconLeft when loading", () => {
      render(
        <Button loading iconLeft="add">
          New
        </Button>
      );
      expect(screen.queryByText("add")).not.toBeInTheDocument();
    });
  });

  describe("events", () => {
    it("calls onClick when clicked", async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click me</Button>);
      await userEvent.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledOnce();
    });
  });

  describe("className forwarding", () => {
    it("merges custom className", () => {
      render(<Button className="my-class">Button</Button>);
      expect(screen.getByRole("button")).toHaveClass("my-class");
    });
  });
});
