import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Avatar } from "./Avatar";

// next/image requires the Next.js runtime — mock it with a plain <img>
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    width,
    height,
    className,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  ),
}));

describe("Avatar", () => {
  describe("initials fallback", () => {
    it("renders initials when no src is provided", () => {
      render(<Avatar initials="MC" />);
      expect(screen.getByText("MC")).toBeInTheDocument();
    });

    it("renders '?' when neither src nor initials are provided", () => {
      render(<Avatar />);
      expect(screen.getByText("?")).toBeInTheDocument();
    });
  });

  describe("image rendering", () => {
    it("renders an img element when src is provided", () => {
      render(<Avatar src="/photo.jpg" alt="Mia Chen" />);
      const img = screen.getByRole("img", { name: "Mia Chen" });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "/photo.jpg");
    });

    it("does not render initials when src is provided", () => {
      render(<Avatar src="/photo.jpg" initials="MC" alt="Mia Chen" />);
      expect(screen.queryByText("MC")).not.toBeInTheDocument();
    });
  });

  describe("size prop", () => {
    it("applies correct width and height for sm", () => {
      render(<Avatar src="/photo.jpg" alt="test" size="sm" />);
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("width", "24");
      expect(img).toHaveAttribute("height", "24");
    });

    it("applies correct width and height for md (default)", () => {
      render(<Avatar src="/photo.jpg" alt="test" />);
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("width", "32");
      expect(img).toHaveAttribute("height", "32");
    });

    it("applies correct width and height for lg", () => {
      render(<Avatar src="/photo.jpg" alt="test" size="lg" />);
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("width", "40");
      expect(img).toHaveAttribute("height", "40");
    });
  });

  describe("status dot", () => {
    it("renders a status dot when status is provided", () => {
      const { container } = render(<Avatar initials="MC" status="online" />);
      const dot = container.querySelector("span");
      expect(dot).toBeInTheDocument();
    });

    it("does not render a status dot when status is omitted", () => {
      const { container } = render(<Avatar initials="MC" />);
      expect(container.querySelector("span")).not.toBeInTheDocument();
    });

    it("applies the online color class for status online", () => {
      const { container } = render(<Avatar initials="MC" status="online" />);
      expect(container.querySelector("span")).toHaveClass("bg-success-bold");
    });

    it("applies the away color class for status away", () => {
      const { container } = render(<Avatar initials="MC" status="away" />);
      expect(container.querySelector("span")).toHaveClass("bg-warning-icon");
    });

    it("applies the offline color class for status offline", () => {
      const { container } = render(<Avatar initials="MC" status="offline" />);
      expect(container.querySelector("span")).toHaveClass("bg-text-subtle");
    });
  });

  describe("className forwarding", () => {
    it("merges custom className onto the wrapper div", () => {
      const { container } = render(
        <Avatar initials="MC" className="my-custom-class" />
      );
      expect(container.firstChild).toHaveClass("my-custom-class");
    });
  });
});
