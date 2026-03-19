import { describe, it, expect } from "vitest";
import { CreateStudentSchema, fullName } from "../studentService";

const validGuardian = {
  firstName: "Alex",
  lastName: "Chen",
  email: "alex@example.com",
};

describe("CreateStudentSchema", () => {
  it("accepts valid input", () => {
    expect(() =>
      CreateStudentSchema.parse({
        firstName: "Jamie",
        lastName: "Chen",
        guardian: validGuardian,
      })
    ).not.toThrow();
  });

  it("accepts input with optional level", () => {
    expect(() =>
      CreateStudentSchema.parse({
        firstName: "Jamie",
        lastName: "Chen",
        level: "Beginner",
        guardian: validGuardian,
      })
    ).not.toThrow();
  });

  it("rejects empty firstName", () => {
    expect(() =>
      CreateStudentSchema.parse({
        firstName: "",
        lastName: "Chen",
        guardian: validGuardian,
      })
    ).toThrow();
  });

  it("rejects empty lastName", () => {
    expect(() =>
      CreateStudentSchema.parse({
        firstName: "Jamie",
        lastName: "",
        guardian: validGuardian,
      })
    ).toThrow();
  });

  it("rejects invalid guardian email", () => {
    expect(() =>
      CreateStudentSchema.parse({
        firstName: "Jamie",
        lastName: "Chen",
        guardian: { ...validGuardian, email: "not-an-email" },
      })
    ).toThrow();
  });

  it("rejects missing guardian", () => {
    expect(() =>
      CreateStudentSchema.parse({ firstName: "Jamie", lastName: "Chen" })
    ).toThrow();
  });
});

describe("fullName", () => {
  it("concatenates first and last name", () => {
    expect(fullName({ firstName: "Jamie", lastName: "Chen" })).toBe(
      "Jamie Chen"
    );
  });
});
