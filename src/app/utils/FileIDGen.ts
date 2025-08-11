export async function getFileID(key: Uint8Array): Promise<string> {
    // import key for HMAC
    const hmacKey = await crypto.subtle.importKey(
        "raw",
        key,
        { name: "HMAC", hash: "SHA-256" },
        false, 
        ["sign"]
    );

    // encode and sign\
    const data = new TextEncoder().encode("fileid-lookup");
    const sig = await crypto.subtle.sign("HMAC", hmacKey, data);
    const out = new Uint8Array(sig);

    return Array.from(out).map(b => b.toString(16).padStart(2, "0")).join("");
}