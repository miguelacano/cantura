import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Heading, headingVariants } from "./Heading";

describe("headingVariants", () => {
  it("defaults to md", () => {
    const cls = headingVariants().split(" ");
    expect(cls).toContain("text-2xl");
    expect(cls).toContain("font-bold");
  });

  it("lg", () => {
    const cls = headingVariants({ level: "lg" }).split(" ");
    expect(cls).toContain("text-4xl");
    expect(cls).toContain("font-extrabold");
  });

  it("sm", () => {
    const cls = headingVariants({ level: "sm" }).split(" ");
    expect(cls).toContain("text-xl");
    expect(cls).toContain("font-bold");
  });

  it("xs", () => {
    const cls = headingVariants({ level: "xs" }).split(" ");
    expect(cls).toContain("text-base");
    expect(cls).toContain("font-semibold");
  });
});

describe("Heading", () => {
  it("renders children", () => {
    render(<Heading>Today&apos;s Lessons</Heading>);
    expect(screen.getByText("Today's Lessons")).toBeInTheDocument();
  });

  describe("default tag", () => {
    it("renders as h2 by default", () => {
      render(<Heading>Title</Heading>);
      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    });

    it("renders as h1 for lg level", () => {
      render(<Heading level="lg">Title</Heading>);
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    it("renders as h3 for sm level", () => {
      render(<Heading level="sm">Title</Heading>);
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
    });

    it("renders as h4 for xs level", () => {
      render(<Heading level="xs">Title</Heading>);
      expect(screen.getByRole("heading", { level: 4 })).toBeInTheDocument();
    });
  });

  it("overrides tag with as prop", () => {
    render(<Heading as="h4">Title</Heading>);
    expect(screen.getByRole("heading", { level: 4 })).toBeInTheDocument();
  });

  it("forwards custom className", () => {
    const { container } = render(<Heading className="my-class">Title</Heading>);
    expect(container.firstChild).toHaveClass("my-class");
  });
});
