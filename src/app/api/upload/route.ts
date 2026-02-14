import { NextResponse } from "next/server";
import { BUCKET_NAME, s3Client } from "../../utils/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const runtime = "nodejs";

const PRESIGN_EXPIRES_IN = 600; // 15 minutes

type Payload = {
    lookupId: string;
};

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as Payload;

        if (!body.lookupId || typeof body.lookupId !== "string") {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        // Generate presigned PUT URLs for each S3 object
        const [ivUrl, binUrl, metaUrl] = await Promise.all([
            getSignedUrl(
                s3Client,
                new PutObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: `${body.lookupId}.iv`,
                    ContentType: "application/octet-stream",
                }),
                { expiresIn: PRESIGN_EXPIRES_IN }
            ),
            getSignedUrl(
                s3Client,
                new PutObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: `${body.lookupId}.bin`,
                    ContentType: "application/octet-stream",
                }),
                { expiresIn: PRESIGN_EXPIRES_IN }
            ),
            getSignedUrl(
                s3Client,
                new PutObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: `${body.lookupId}.json`,
                    ContentType: "application/json",
                }),
                { expiresIn: PRESIGN_EXPIRES_IN }
            ),
        ]);

        return NextResponse.json({
            urls: { iv: ivUrl, bin: binUrl, meta: metaUrl },
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}