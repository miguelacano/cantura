import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="Enter name" />);
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
  });

  it("forwards type prop", () => {
    render(<Input type="email" placeholder="Email" />);
    expect(screen.getByPlaceholderText("Email")).toHaveAttribute(
      "type",
      "email"
    );
  });

  describe("error state", () => {
    it("renders error message when error prop is provided", () => {
      render(<Input error="This field is required." />);
      expect(screen.getByText("This field is required.")).toBeInTheDocument();
    });

    it("does not render error message when error is omitted", () => {
      const { container } = render(<Input placeholder="Name" />);
      expect(
        container.querySelector(".text-error-text")
      ).not.toBeInTheDocument();
    });

    it("applies error border class when error is provided", () => {
      render(<Input error="Required" />);
      const input = screen.getByRole("textbox");
      expect(input.className).toContain("border-error-text");
    });

    it("sets aria-invalid when error is provided", () => {
      render(<Input error="Required" />);
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "aria-invalid",
        "true"
      );
    });

    it("does not set aria-invalid when error is omitted", () => {
      render(<Input placeholder="Name" />);
      expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
    });

    it("links input to error message via aria-describedby when id is provided", () => {
      render(<Input id="name" error="Required" />);
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "aria-describedby",
        "name-error"
      );
      expect(screen.getByText("Required")).toHaveAttribute("id", "name-error");
    });
  });

  describe("leading icon", () => {
    it("renders icon text when leadingIcon is provided", () => {
      render(<Input leadingIcon="search" placeholder="Search" />);
      expect(screen.getByText("search")).toBeInTheDocument();
    });

    it("applies leading padding when leadingIcon is provided", () => {
      render(<Input leadingIcon="search" placeholder="Search" />);
      expect(screen.getByPlaceholderText("Search")).toHaveClass("pl-9");
    });

    it("applies standard padding without leadingIcon", () => {
      render(<Input placeholder="Name" />);
      expect(screen.getByPlaceholderText("Name")).toHaveClass("px-3");
    });
  });

  it("is disabled when disabled prop is set", () => {
    render(<Input disabled placeholder="Disabled" />);
    expect(screen.getByPlaceholderText("Disabled")).toBeDisabled();
  });
});
