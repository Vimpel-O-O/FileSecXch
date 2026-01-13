"use client";

import Button from "./components/Button";
import NavBar from "./components/NavBar";
import TextSection from "./components/TextSection";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main>
      <NavBar></NavBar>

      {/* Main Section */}
      <section className="mx-auto max-w-250 p-6">
        <TextSection>
          Hello! <br />
          This is a secure file exchange platform. Here you can upload any file
          (Max 50MB), it will be encrypted locally on your machine and stored in
          database. An encryption key will be provided for temporary download.
          By giving the key, you will get access to download the stored file.
          <br />
          <br />
          <p className="text-lg leading-relaxed text-red-400">
            ATTENTION: Uploaded file auto-deletes after a 24-hour period. A key
            becomes invalid.
          </p>
        </TextSection>
      </section>

      {/* Upload/Download */}
      <div className="mx-auto max-w-sm items-center p-6 flex gap-4 mt-6">
        <Button color="blue" onClick={() => router.push("/upload")}>
          Upload
        </Button>
        <Button color="green" onClick={() => router.push("/download")}>
          Download
        </Button>
      </div>
    </main>
  );
}
