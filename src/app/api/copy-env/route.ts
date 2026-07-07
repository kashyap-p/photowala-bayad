import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Only allow if the correct secret is provided
  const body = await req.json();
  if (body?.secret !== "copy-env-photowala-2026") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const targetProjectId = body?.targetProjectId;
  const vercelToken = body?.vercelToken;
  if (!targetProjectId || !vercelToken) {
    return NextResponse.json({ ok: false, error: "Missing targetProjectId or vercelToken" }, { status: 400 });
  }

  // Read the env vars from THIS runtime (they're available here)
  const envVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
  };

  const results = [];
  for (const [key, value] of Object.entries(envVars)) {
    if (!value) continue;
    const res = await fetch(`https://api.vercel.com/v9/projects/${targetProjectId}/env?teamId=kashyap-projects`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        value,
        type: "encrypted",
        target: ["production", "preview"],
      }),
    });
    const data = await res.json();
    results.push({ key, ok: !!data.key, error: data.error?.message });
  }

  return NextResponse.json({ ok: true, results });
}
