import { NextResponse } from "next/server";
import { error } from "node:console";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

type Payload = {
    lookupId: string;
    iv: number[];
    encrypted: number[];
    meta?: {
        mimeType?: string;
        fileName?: string;
        fileSize?: number;
    };
};

export function storageDir() {
    const dir = process.env.STORAGE_DIR;
    if (!dir) {
        throw error("Storage dir invalid.");
    }
    return path.resolve(dir);
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as Payload;

        if (
            !body.lookupId ||
            !Array.isArray(body.iv) ||
            !Array.isArray(body.encrypted)
        ) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }
        if (body.iv.length !== 12) {
            return NextResponse.json({ error: "IV must be 12 bytes" }, { status: 400 });
        }

        const dir = storageDir();

        // convert number arrays from JSON into binary Buffers
        const iv = Buffer.from(body.iv);
        const encrypted = Buffer.from(body.encrypted);

        // write files
        await fs.writeFile(path.join(dir, `${body.lookupId}.iv`), iv);
        await fs.writeFile(path.join(dir, `${body.lookupId}.bin`), encrypted)
        await fs.writeFile(
            path.join(dir, `${body.lookupId}.json`), 
            JSON.stringify(body.meta ?? {}, null, 2), 
            "utf8"
        );

        return NextResponse.json({ ok: true });
    } catch(e) {
        console.error(e);
        return NextResponse.json({ error: "Server error"}, { status: 500 });
    }
}