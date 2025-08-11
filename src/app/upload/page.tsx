"use client";

import Image from "next/image";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import { useState } from "react";
import { encryptFile } from "../utils/FileEncryption";
import { getFileID } from "../utils/FileIDGen";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [busy, setBusy] = useState(false);

  // When file selected
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // When file dropped
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); // prevent opening file in tab
    e.stopPropagation(); // prevent event bubbling
    setIsDragging(false); // to reset UI

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  // hovering over dropzone
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); // allow dropping
    setIsDragging(true);
  };

  // drag away from dropzone
  const handleDragLeave = () => {
    setIsDragging(false); // to reset UI
  };

  // upload process
  const handleUpload = async () => {
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      alert("File is too big, MAX 50MB");
      return;
    }

    setBusy(true);
    try {
      // encrypt
      const { encrypted, iv, key, mimeType, fileName, fileSize } =
        await encryptFile(file);

      // get file lookup id
      const lookupId = await getFileID(key); // derive using HMAC

      // send payload to server
      await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lookupId,
          iv: Array.from(iv),
          encrypted: Array.from(encrypted),
          meta: { mimeType, fileName, fileSize },
        }),
      });

      // Give user a key
      const keyHex = Array.from(key)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      console.log(`Save this key securely:\n\n${keyHex}`);
    } catch (e) {
      console.error(e);
      alert("Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main>
      <NavBar></NavBar>

      {/* File Upload Zone */}
      <div className="mx-auto max-w-300 items-center p-6 flex gap-4 mt-6">
        <label
          htmlFor="dropzone-file"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                        ${
                          isDragging
                            ? "bg-gray-600 border-blue-400"
                            : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        }
                    `}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Image src="/upload.png" width={48} height={48} alt="Logo" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              (MAX 50MB)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleFileChange} // listed for file selection
          />
        </label>
      </div>

      {/* Uploaded File Info */}
      <div className="mx-auto max-w-250 p-6">
        {file ? (
          <p className="text-lg leading-relaxed text-white">
            Selected file: <span className="font-semibold">{file.name}</span> (
            {(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        ) : (
          <p className="text-lg leading-relaxed">Time to upload your file :)</p>
        )}
        <br />
        <Button color="blue" disabled={!file || busy} onClick={handleUpload}>
          {busy ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </main>
  );
}
