import { NextResponse } from "next/server";
import { BUCKET_NAME, s3Client } from "../../utils/s3Client";
import {
    PutObjectCommand,
} from "@aws-sdk/client-s3";

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

        // convert number arrays from JSON into binary Buffers
        const iv = Buffer.from(body.iv);
        const encrypted = Buffer.from(body.encrypted);
        
        // upload files aws commands
        const putIV = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `${body.lookupId}.iv`,
            Body: iv,
            ContentType: 'application/octet-stream',
        })

        const putEncrypted = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `${body.lookupId}.bin`,
            Body: encrypted,
            ContentType: 'application/octet-stream',
        })

        const putMeta = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `${body.lookupId}.json`,
            Body: JSON.stringify(body.meta ?? {}, null, 2),
            ContentType: 'application/json',
        })

        await Promise.all([
            s3Client.send(putIV),
            s3Client.send(putEncrypted),
            s3Client.send(putMeta)
        ]);

        return NextResponse.json({ ok: true });
    } catch(e) {
        console.error(e);
        return NextResponse.json({ error: "Server error"}, { status: 500 });
    }
}