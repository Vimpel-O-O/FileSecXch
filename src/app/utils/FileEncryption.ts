

export async function encryptFile(file: File) {
    // convert file to binary
    const plaintextBuffer = await file.arrayBuffer();

    // Generate key
    const key = await crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true, // extractable
        ["encrypt", "decrypt"]
    );

    // Generate random IV (Initialization Vector)
    const iv = crypto.getRandomValues( new Uint8Array(12));

    // Encrypt
    const encryptedBuffer = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        plaintextBuffer
    );

    // Export key for user to keep
    const exportedKey = await crypto.subtle.exportKey("raw", key);

    return {
        encrypted: new Uint8Array(encryptedBuffer),
        iv,
        key : new Uint8Array(exportedKey),
        // metadata
        mimeType: file.type || "application/octet-stream",
        fileName: file.name,
        fileSize: file.size
    }
}