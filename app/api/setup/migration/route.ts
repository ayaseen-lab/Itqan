import { readdir, readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Serves SQL migrations. ?fix=1 returns incremental fixes (002+), not the full schema. */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fixOnly = searchParams.get("fix") === "1";
    const dir = path.join(process.cwd(), "supabase/migrations");

    const files = (await readdir(dir))
      .filter((f) => f.endsWith(".sql"))
      .sort();

    const selected = fixOnly ? files.filter((f) => !f.startsWith("001_")) : files;
    const parts = await Promise.all(
      selected.map((f) => readFile(path.join(dir, f), "utf8")),
    );
    const sql = parts.join("\n\n");

    return new NextResponse(sql, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Migration file not found" }, { status: 404 });
  }
}
