import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge, badgeVariants } from "./Badge";

describe("badgeVariants", () => {
  it("defaults to neutral", () => {
    const cls = badgeVariants().split(" ");
    expect(cls).toContain("bg-surface-elevated");
    expect(cls).toContain("text-text-muted");
  });

  it("success", () => {
    const cls = badgeVariants({ variant: "success" }).split(" ");
    expect(cls).toContain("bg-success-bg");
    expect(cls).toContain("text-success-text");
  });

  it("warning", () => {
    const cls = badgeVariants({ variant: "warning" }).split(" ");
    expect(cls).toContain("bg-warning-bg");
    expect(cls).toContain("text-warning-text");
  });

  it("error", () => {
    const cls = badgeVariants({ variant: "error" }).split(" ");
    expect(cls).toContain("bg-error-bg");
    expect(cls).toContain("text-error-text");
  });

  it("info", () => {
    const cls = badgeVariants({ variant: "info" }).split(" ");
    expect(cls).toContain("bg-info-bg");
    expect(cls).toContain("text-info-text");
  });
});

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Completed</Badge>);
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("forwards custom className", () => {
    const { container } = render(<Badge className="my-class">Badge</Badge>);
    expect(container.firstChild).toHaveClass("my-class");
  });
});
