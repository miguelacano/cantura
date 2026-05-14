import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("sets aria-valuenow to the provided value", () => {
    const { container } = render(<ProgressBar value={60} />);
    const bar = container.querySelector("[role='progressbar']");
    expect(bar).toHaveAttribute("aria-valuenow", "60");
  });

  it("sets aria-label from the label prop", () => {
    const { container } = render(<ProgressBar value={50} label="Completion" />);
    const bar = container.querySelector("[role='progressbar']");
    expect(bar).toHaveAttribute("aria-label", "Completion");
  });

  it("has no aria-label when label is omitted", () => {
    const { container } = render(<ProgressBar value={50} />);
    const bar = container.querySelector("[role='progressbar']");
    expect(bar).not.toHaveAttribute("aria-label");
  });

  it("sets aria-valuemin to 0 and aria-valuemax to 100", () => {
    const { container } = render(<ProgressBar value={50} />);
    const bar = container.querySelector("[role='progressbar']");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  describe("value clamping", () => {
    it("clamps value below 0 to 0", () => {
      const { container } = render(<ProgressBar value={-10} showPercent />);
      expect(screen.getByText("0%")).toBeInTheDocument();
      expect(container.querySelector("[role='progressbar']")).toHaveAttribute(
        "aria-valuenow",
        "0"
      );
    });

    it("clamps value above 100 to 100", () => {
      const { container } = render(<ProgressBar value={150} showPercent />);
      expect(screen.getByText("100%")).toBeInTheDocument();
      expect(container.querySelector("[role='progressbar']")).toHaveAttribute(
        "aria-valuenow",
        "100"
      );
    });
  });

  describe("label and percent", () => {
    it("renders label when provided", () => {
      render(<ProgressBar value={50} label="Progress" />);
      expect(screen.getByText("Progress")).toBeInTheDocument();
    });

    it("renders percent when showPercent is true", () => {
      render(<ProgressBar value={75} showPercent />);
      expect(screen.getByText("75%")).toBeInTheDocument();
    });

    it("renders neither label nor percent by default", () => {
      const { container } = render(<ProgressBar value={50} />);
      expect(container.querySelector("span")).not.toBeInTheDocument();
    });
  });

  describe("variants", () => {
    it("applies default fill class", () => {
      const { container } = render(<ProgressBar value={50} />);
      const fill = container.querySelector(".bg-brand-primary");
      expect(fill).toBeInTheDocument();
    });

    it("applies success fill class", () => {
      const { container } = render(
        <ProgressBar value={100} variant="success" />
      );
      expect(container.querySelector(".bg-success-bold")).toBeInTheDocument();
    });

    it("applies warning fill class", () => {
      const { container } = render(
        <ProgressBar value={50} variant="warning" />
      );
      expect(container.querySelector(".bg-warning-icon")).toBeInTheDocument();
    });

    it("applies error fill class", () => {
      const { container } = render(<ProgressBar value={20} variant="error" />);
      expect(container.querySelector(".bg-error-text")).toBeInTheDocument();
    });
  });
});
