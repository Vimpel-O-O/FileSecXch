import { NextResponse } from "next/server";
import { s3Client, BUCKET_NAME } from "../../utils/s3Client";
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const runtime = "nodejs";

const PRESIGN_EXPIRES_IN = 600; // 15 minutes

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const lookupId = searchParams.get("id");

    if (!lookupId) {
        return NextResponse.json({ error: "Missing file id" }, { status: 400 });
    }

    try {
        // Verify file exists before generating URLs
        await s3Client.send(
            new HeadObjectCommand({
                Bucket: BUCKET_NAME,
                Key: `${lookupId}.bin`,
            })
        );

        // Generate presigned GET URLs for all 3 objects
        const [ivUrl, binUrl, metaUrl] = await Promise.all([
            getSignedUrl(
                s3Client,
                new GetObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: `${lookupId}.iv`,
                }),
                { expiresIn: PRESIGN_EXPIRES_IN }
            ),
            getSignedUrl(
                s3Client,
                new GetObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: `${lookupId}.bin`,
                }),
                { expiresIn: PRESIGN_EXPIRES_IN }
            ),
            getSignedUrl(
                s3Client,
                new GetObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: `${lookupId}.json`,
                }),
                { expiresIn: PRESIGN_EXPIRES_IN }
            ),
        ]);

        return NextResponse.json({
            urls: { iv: ivUrl, bin: binUrl, meta: metaUrl },
        });
    } catch (e: unknown) {
        const errorName = (e as { name?: string })?.name;
        if (errorName === "NotFound" || errorName === "NoSuchKey") {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        console.error(e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}