import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { code } = (await request.json().catch(() => ({}))) as { code?: string };
  const configuredCode = process.env.ACCESS_CODE;

  if (!configuredCode) {
    return NextResponse.json(
      { ok: false, message: 'ACCESS_CODE is not configured.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: code === configuredCode });
}
