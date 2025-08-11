"use client";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import Input from "../components/Input";
import TextSection from "../components/TextSection";
import { useState } from "react";
import { decryptFile } from "../utils/FileDecryption";
import { getFileID } from "../utils/FileIDGen";

// parse key
function parseHexToBytes(hex: string): Uint8Array {
  const clean = hex.trim().replace(/^0x/, "").toLowerCase();
  if (!/^[0-9a-f]*$/.test(clean) || clean.length % 2 !== 0) {
    throw new Error("Invalid hex key format.");
  }
  const out = new Uint8Array(clean.length / 2);
  if (out.length === 32) {
    for (let i = 0; i < out.length; i++) {
      out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
    }
  } else {
    throw new Error("Invalid key length: System requires 64 hex characters.");
  }
  return out;
}

// download trigger
function downloadFile(blob: Blob, filename = "file") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DownloadPage() {
  const [keyInput, setKeyInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setBusy(true);
    try {
      // parse hex back to bytes
      const key = parseHexToBytes(keyInput.trim());

      // get file id
      const lookupId = await getFileID(key);

      // Fetch encrypted payload + metadata by file id
      const res = await fetch(`/api/download?id=${lookupId}`);
      if (!res.ok) {
        throw new Error(
          res.status === 404 ? "File not found for this key." : "Server error"
        );
      }
      const payload = await res.json();

      // Decrypt
      const blob = await decryptFile(
        new Uint8Array(payload.encrypted),
        new Uint8Array(payload.iv),
        key,
        payload.meta?.mimeType || "application/octet-stream"
      );

      // restore file name
      const filename = payload.meta?.fileName || "file";

      // send for user to download
      downloadFile(blob, filename);

      // clear key input field
      setKeyInput("");
    } catch (e) {
      console.error(e);
      const message =
        e instanceof Error
          ? e.message
          : "Decrypt/download failed. Check your key and try again.";
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main>
      <NavBar></NavBar>
      <TextSection>
        Please provide the encryption key to access a file
      </TextSection>
      <Input
        value={keyInput}
        onChange={(e) => setKeyInput(e.target.value)}
        placeholder="Enter key"
      ></Input>

      <div className="mx-auto max-w-250 p-6">
        {error && <p className="text-red-400 mb-2">{error}</p>}
        <Button
          color="blue"
          disabled={busy || !keyInput}
          onClick={handleDownload}
        >
          {busy ? "Decrypting..." : "Download"}
        </Button>
      </div>
    </main>
  );
}
