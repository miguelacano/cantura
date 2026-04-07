import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Caption, captionVariants } from "./Caption";

describe("captionVariants", () => {
  it("includes base typography classes", () => {
    const cls = captionVariants().split(" ");
    expect(cls).toContain("text-xs");
    expect(cls).toContain("font-medium");
  });

  describe("subtle", () => {
    it("defaults to muted color", () => {
      expect(captionVariants().split(" ")).toContain("text-text-muted");
    });

    it("subtle color", () => {
      expect(captionVariants({ subtle: true }).split(" ")).toContain(
        "text-text-subtle"
      );
    });
  });
});

describe("Caption", () => {
  it("renders children", () => {
    render(<Caption>Joined March 2024</Caption>);
    expect(screen.getByText("Joined March 2024")).toBeInTheDocument();
  });

  it("forwards custom className", () => {
    const { container } = render(<Caption className="my-class">Text</Caption>);
    expect(container.firstChild).toHaveClass("my-class");
  });
});
