import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button, buttonVariants } from "./Button";

describe("buttonVariants", () => {
  describe("variant", () => {
    it("defaults to primary", () => {
      expect(buttonVariants().split(" ")).toContain("bg-brand-primary");
    });

    it("secondary", () => {
      expect(buttonVariants({ variant: "secondary" }).split(" ")).toContain(
        "bg-brand-primary-subtle"
      );
    });

    it("outline", () => {
      expect(buttonVariants({ variant: "outline" }).split(" ")).toContain(
        "border-brand-primary"
      );
    });

    it("ghost", () => {
      expect(buttonVariants({ variant: "ghost" }).split(" ")).toContain(
        "text-brand-primary"
      );
    });
  });

  describe("size", () => {
    it("defaults to md", () => {
      const cls = buttonVariants().split(" ");
      expect(cls).toContain("px-4");
      expect(cls).toContain("py-2");
    });

    it("sm", () => {
      const cls = buttonVariants({ size: "sm" }).split(" ");
      expect(cls).toContain("px-3");
      expect(cls).toContain("py-1.5");
    });
  });
});

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Save Note</Button>);
    expect(
      screen.getByRole("button", { name: "Save Note" })
    ).toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(<Button className="my-class">Button</Button>);
    expect(screen.getByRole("button")).toHaveClass("my-class");
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

    it("renders the loading icon", () => {
      render(<Button loading>Save</Button>);
      expect(screen.getByText("progress_activity")).toBeInTheDocument();
    });
  });

  describe("iconLeft", () => {
    it("renders the icon when iconLeft is provided", () => {
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

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
