import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { mockDoctor } from "@/lib/api/mockData";

export const runtime = "nodejs";

type LoginPayload = { email?: unknown; password?: unknown };

function matches(value: string, expected: string): boolean {
  const receivedHash = createHash("sha256").update(value).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(receivedHash, expectedHash);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginPayload | null;
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const expectedEmail = process.env.MOCK_DOCTOR_EMAIL?.trim().toLowerCase();
  const expectedPassword = process.env.MOCK_DOCTOR_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    return NextResponse.json(
      { error: "Demo login is not configured." },
      { status: 503 },
    );
  }

  if (!matches(email, expectedEmail) || !matches(password, expectedPassword)) {
    return NextResponse.json(
      { error: "Email or password is incorrect." },
      { status: 401 },
    );
  }

  return NextResponse.json({ account: mockDoctor });
}
