import { NextResponse } from "next/server";
import {s3Client, BUCKET_NAME} from "../../utils/s3Client";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";

export async function GET(req: Request) {
    // Parse id from URL
    const { searchParams } = new URL(req.url);
    const lookupId = searchParams.get("id");

    if (!lookupId) {
        return NextResponse.json({ error: "Missing file id" }, { status: 400 });
    }

    // aws s3 files download commands
    const getIV = new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: `${lookupId}.iv`,
    });

    const getEncrypted = new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: `${lookupId}.bin`,
    });

    const getMeta = new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: `${lookupId}.json`,
    });

    try {
        // Read files from S3
        const [ivResponse, encryptedResponse, metaResponse] = await Promise.all([
            s3Client.send(getIV),
            s3Client.send(getEncrypted),
            s3Client.send(getMeta),
        ]);

        // Convert streams to Buffers
        const ivBuf = Buffer.from(await ivResponse.Body!.transformToByteArray());
        const encryptedBuf = Buffer.from(await encryptedResponse.Body!.transformToByteArray());
        const metaBuf = Buffer.from(await metaResponse.Body!.transformToByteArray());

        // Convert binary Buffers to JSON-safe number arrays
        const iv = Array.from(ivBuf);
        const encrypted = Array.from(encryptedBuf);
        const meta = JSON.parse(metaBuf.toString("utf8"));

        return NextResponse.json({ iv, encrypted, meta });
    } catch(e) {
        console.error(e);
        return NextResponse.json( { error: "Not found" }, { status: 400 });
    }
}