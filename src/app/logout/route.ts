import { signOut } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await signOut({ redirect: false });
  return NextResponse.redirect(new URL("/login", request.url));
}
