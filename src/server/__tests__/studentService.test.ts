import { describe, it, expect } from "vitest";
import { CreateStudentSchema, fullName } from "../studentService";

const validGuardian = {
  firstName: "Alex",
  lastName: "Chen",
  email: "alex@example.com",
};

const validInput = {
  firstName: "Jamie",
  lastName: "Chen",
  instrumentId: "instrument-cuid-123",
  guardian: validGuardian,
};

describe("CreateStudentSchema", () => {
  it("accepts valid input", () => {
    expect(() => CreateStudentSchema.parse(validInput)).not.toThrow();
  });

  it("accepts input with optional level", () => {
    expect(() =>
      CreateStudentSchema.parse({ ...validInput, level: "Beginner" })
    ).not.toThrow();
  });

  it("rejects empty firstName", () => {
    expect(() =>
      CreateStudentSchema.parse({ ...validInput, firstName: "" })
    ).toThrow();
  });

  it("rejects empty lastName", () => {
    expect(() =>
      CreateStudentSchema.parse({ ...validInput, lastName: "" })
    ).toThrow();
  });

  it("rejects missing instrumentId", () => {
    const { instrumentId: _, ...rest } = validInput;
    expect(() => CreateStudentSchema.parse(rest)).toThrow();
  });

  it("rejects empty instrumentId", () => {
    expect(() =>
      CreateStudentSchema.parse({ ...validInput, instrumentId: "" })
    ).toThrow();
  });

  it("rejects invalid guardian email", () => {
    expect(() =>
      CreateStudentSchema.parse({
        ...validInput,
        guardian: { ...validGuardian, email: "not-an-email" },
      })
    ).toThrow();
  });

  it("rejects missing guardian", () => {
    const { guardian: _, ...rest } = validInput;
    expect(() => CreateStudentSchema.parse(rest)).toThrow();
  });
});

describe("fullName", () => {
  it("concatenates first and last name", () => {
    expect(fullName({ firstName: "Jamie", lastName: "Chen" })).toBe(
      "Jamie Chen"
    );
  });
});
