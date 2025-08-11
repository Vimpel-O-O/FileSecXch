

export async function decryptFile(
    encrypted: Uint8Array,
    iv: Uint8Array, 
    key: Uint8Array,
    mimeType = "application/octet-stream"
): Promise<Blob> {
        // import key
        const importedKey = await crypto.subtle.importKey(
            "raw",
            key,
            { name: "AES-GCM"},
            false,
            ["decrypt"]
        );
        
        // Decrypt
        const decryptedBuffer = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv,
            },
            importedKey,
            encrypted
        );

        return new Blob([decryptedBuffer], { type: mimeType })
}