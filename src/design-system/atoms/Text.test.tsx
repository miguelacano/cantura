import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Text, textVariants } from "./Text";

describe("textVariants", () => {
  describe("size", () => {
    it("defaults to md", () => {
      const cls = textVariants().split(" ");
      expect(cls).toContain("text-base");
      expect(cls).toContain("leading-relaxed");
    });

    it("lg", () => {
      const cls = textVariants({ size: "lg" }).split(" ");
      expect(cls).toContain("text-lg");
      expect(cls).toContain("leading-relaxed");
    });

    it("sm", () => {
      const cls = textVariants({ size: "sm" }).split(" ");
      expect(cls).toContain("text-sm");
      expect(cls).toContain("leading-relaxed");
    });
  });

  describe("muted", () => {
    it("defaults to primary color", () => {
      expect(textVariants().split(" ")).toContain("text-text-primary");
    });

    it("muted color", () => {
      expect(textVariants({ muted: true }).split(" ")).toContain(
        "text-text-muted"
      );
    });
  });
});

describe("Text", () => {
  it("renders as a p element", () => {
    render(<Text>Body copy</Text>);
    expect(screen.getByText("Body copy").tagName).toBe("P");
  });

  it("renders children", () => {
    render(<Text>Practice notes</Text>);
    expect(screen.getByText("Practice notes")).toBeInTheDocument();
  });

  it("forwards custom className", () => {
    const { container } = render(<Text className="my-class">Text</Text>);
    expect(container.firstChild).toHaveClass("my-class");
  });
});
