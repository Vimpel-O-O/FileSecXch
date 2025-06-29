import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FileSecXch – Secure File Sharing",
  description: "Upload and share encrypted files safely with expiring links.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}