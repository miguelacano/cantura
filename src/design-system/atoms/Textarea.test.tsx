import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders a textarea element", () => {
    render(<Textarea placeholder="Add a note…" />);
    expect(screen.getByPlaceholderText("Add a note…")).toBeInTheDocument();
  });

  it("renders as a textarea tag", () => {
    render(<Textarea placeholder="Note" />);
    expect(screen.getByPlaceholderText("Note").tagName).toBe("TEXTAREA");
  });

  describe("error state", () => {
    it("renders error message when error prop is provided", () => {
      render(<Textarea error="Note cannot be empty." />);
      expect(screen.getByText("Note cannot be empty.")).toBeInTheDocument();
    });

    it("does not render error message when error is omitted", () => {
      const { container } = render(<Textarea placeholder="Note" />);
      expect(
        container.querySelector(".text-error-text")
      ).not.toBeInTheDocument();
    });

    it("applies error border class when error is provided", () => {
      render(<Textarea error="Required" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea.className).toContain("border-error-text");
    });

    it("sets aria-invalid when error is provided", () => {
      render(<Textarea error="Required" />);
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "aria-invalid",
        "true"
      );
    });

    it("does not set aria-invalid when error is omitted", () => {
      render(<Textarea placeholder="Note" />);
      expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
    });

    it("links textarea to error message via aria-describedby when id is provided", () => {
      render(<Textarea id="note" error="Required" />);
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "aria-describedby",
        "note-error"
      );
      expect(screen.getByText("Required")).toHaveAttribute("id", "note-error");
    });
  });

  it("is disabled when disabled prop is set", () => {
    render(<Textarea disabled placeholder="Read only" />);
    expect(screen.getByPlaceholderText("Read only")).toBeDisabled();
  });

  it("forwards custom className onto the wrapper", () => {
    const { container } = render(<Textarea className="my-class" />);
    expect(container.firstChild).toHaveClass("my-class");
  });
});
