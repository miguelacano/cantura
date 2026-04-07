import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Icon, iconVariants } from "./Icon";

describe("iconVariants", () => {
  it("defaults to md", () => {
    expect(iconVariants().split(" ")).toContain("text-xl");
  });

  it("sm", () => {
    expect(iconVariants({ size: "sm" }).split(" ")).toContain("text-base");
  });

  it("lg", () => {
    expect(iconVariants({ size: "lg" }).split(" ")).toContain("text-2xl");
  });

  it("xl", () => {
    expect(iconVariants({ size: "xl" }).split(" ")).toContain("text-3xl");
  });
});

describe("Icon", () => {
  it("renders the icon name as text content", () => {
    render(<Icon name="music_note" />);
    expect(screen.getByText("music_note")).toBeInTheDocument();
  });

  it("includes the material-symbols-outlined class", () => {
    const { container } = render(<Icon name="star" />);
    expect(container.firstChild).toHaveClass("material-symbols-outlined");
  });

  it("sets FILL to 1 when filled", () => {
    const { container } = render(<Icon name="star" filled />);
    expect(
      (container.firstChild as HTMLElement).style.fontVariationSettings
    ).toContain("'FILL' 1");
  });

  it("sets FILL to 0 by default", () => {
    const { container } = render(<Icon name="star" />);
    expect(
      (container.firstChild as HTMLElement).style.fontVariationSettings
    ).toContain("'FILL' 0");
  });

  it("is hidden from assistive technology", () => {
    const { container } = render(<Icon name="star" />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards custom className", () => {
    const { container } = render(
      <Icon name="star" className="text-brand-primary" />
    );
    expect(container.firstChild).toHaveClass("text-brand-primary");
  });
});
