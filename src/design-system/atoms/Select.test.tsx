import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Select } from "./Select";

describe("Select", () => {
  it("renders a select element", () => {
    render(
      <Select>
        <option value="piano">Piano</option>
      </Select>
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders children options", () => {
    render(
      <Select>
        <option value="piano">Piano</option>
        <option value="violin">Violin</option>
      </Select>
    );
    expect(screen.getByRole("option", { name: "Piano" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Violin" })).toBeInTheDocument();
  });

  it("renders a disabled placeholder option when placeholder is provided", () => {
    render(
      <Select placeholder="Select instrument">
        <option value="piano">Piano</option>
      </Select>
    );
    const placeholder = screen.getByRole("option", {
      name: "Select instrument",
    });
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toBeDisabled();
  });

  it("renders the expand_more icon", () => {
    render(
      <Select>
        <option value="a">A</option>
      </Select>
    );
    expect(screen.getByText("expand_more")).toBeInTheDocument();
  });

  describe("error state", () => {
    it("renders error message when error prop is provided", () => {
      render(
        <Select error="Please select an instrument.">
          <option value="piano">Piano</option>
        </Select>
      );
      expect(
        screen.getByText("Please select an instrument.")
      ).toBeInTheDocument();
    });

    it("does not render error message when error is omitted", () => {
      const { container } = render(
        <Select>
          <option value="a">A</option>
        </Select>
      );
      expect(
        container.querySelector(".text-error-text")
      ).not.toBeInTheDocument();
    });

    it("sets aria-invalid when error is provided", () => {
      render(
        <Select error="Required">
          <option value="a">A</option>
        </Select>
      );
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-invalid",
        "true"
      );
    });

    it("does not set aria-invalid when error is omitted", () => {
      render(
        <Select>
          <option value="a">A</option>
        </Select>
      );
      expect(screen.getByRole("combobox")).not.toHaveAttribute("aria-invalid");
    });

    it("links select to error message via aria-describedby when id is provided", () => {
      render(
        <Select id="instrument" error="Required">
          <option value="a">A</option>
        </Select>
      );
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-describedby",
        "instrument-error"
      );
      expect(screen.getByText("Required")).toHaveAttribute(
        "id",
        "instrument-error"
      );
    });
  });

  it("is disabled when disabled prop is set", () => {
    render(
      <Select disabled>
        <option value="piano">Piano</option>
      </Select>
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
