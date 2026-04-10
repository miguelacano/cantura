import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Label, labelVariants } from "./Label";

describe("labelVariants", () => {
  it("includes base typography classes", () => {
    const cls = labelVariants().split(" ");
    expect(cls).toContain("uppercase");
    expect(cls).toContain("tracking-widest");
    expect(cls).toContain("font-bold");
  });

  describe("muted", () => {
    it("defaults to primary color", () => {
      expect(labelVariants().split(" ")).toContain("text-text-primary");
    });

    it("muted color", () => {
      expect(labelVariants({ muted: true }).split(" ")).toContain(
        "text-text-muted"
      );
    });
  });
});

describe("Label", () => {
  it("renders as a label element", () => {
    render(<Label>Instrument</Label>);
    expect(screen.getByText("Instrument").tagName).toBe("LABEL");
  });

  it("renders children", () => {
    render(<Label>Instrument</Label>);
    expect(screen.getByText("Instrument")).toBeInTheDocument();
  });

  it("associates with an input via htmlFor", () => {
    render(<Label htmlFor="name-input">Name</Label>);
    expect(screen.getByText("Name")).toHaveAttribute("for", "name-input");
  });

  it("forwards custom className", () => {
    const { container } = render(<Label className="my-class">Label</Label>);
    expect(container.firstChild).toHaveClass("my-class");
  });
});
