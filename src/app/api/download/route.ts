import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { storageDir } from "../upload/route";

export const runtime = "nodejs";

export async function GET(req: Request) {
    // Parse id from URL
    const { searchParams } = new URL(req.url);
    const lookupId = searchParams.get("id");

    if (!lookupId) {
        return NextResponse.json({ error: "Missing file id" }, { status: 400 });
    }

    // define file paths to lookup
    const dir = storageDir();
    const ivPath = path.join(dir, `${lookupId}.iv`);
    const encryptedPath = path.join(dir, `${lookupId}.bin`);
    const metaPath = path.join(dir, `${lookupId}.json`);

    try {
        // Read files
        const [ivBuf, encryptedBuf, metaBuf] = await Promise.all([
            fs.readFile(ivPath),
            fs.readFile(encryptedPath),
            fs.readFile(metaPath),
        ]);

        // convert binary Buffers to JSON-safe number arrays
        const iv = Array.from(ivBuf.values());
        const encrypted = Array.from(encryptedBuf.values());
        const meta = JSON.parse(metaBuf.toString("utf8"));

        return NextResponse.json({ iv, encrypted, meta });
    } catch(e) {
        console.error(e);
        return NextResponse.json( { error: "Not found" }, { status: 400 });
    }
}