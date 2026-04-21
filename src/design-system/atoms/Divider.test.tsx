import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Divider } from "./Divider";

describe("Divider", () => {
  describe("without label", () => {
    it("renders an hr element", () => {
      const { container } = render(<Divider />);
      expect(container.querySelector("hr")).toBeInTheDocument();
    });

    it("applies the background color class", () => {
      const { container } = render(<Divider />);
      expect(container.querySelector("hr")).toHaveClass("bg-border-default");
    });
  });

  describe("with label", () => {
    it("renders the label text", () => {
      render(<Divider label="or continue with" />);
      expect(screen.getByText("or continue with")).toBeInTheDocument();
    });

    it("does not render an hr when label is provided", () => {
      const { container } = render(<Divider label="or" />);
      expect(container.querySelector("hr")).not.toBeInTheDocument();
    });

    it("renders two decorative lines flanking the label", () => {
      const { container } = render(<Divider label="or" />);
      const lines = container.querySelectorAll(".bg-border-default");
      expect(lines).toHaveLength(2);
    });
  });

  it("forwards custom className", () => {
    const { container } = render(<Divider className="my-class" />);
    expect(container.firstChild).toHaveClass("my-class");
  });
});
