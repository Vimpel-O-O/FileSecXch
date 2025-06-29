'use client';

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react';

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

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

    return (
        <main>
            {/* Nav Bar */}
            <nav className="border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Image src="/logo.png" width={48} height={48} alt="Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">FileSecXch</span>
                </Link>
                </div>
            </nav>

            {/* File Upload Zone */}
            <div className="mx-auto max-w-300 items-center p-6 flex gap-4 mt-6">
                <label
                    htmlFor="dropzone-file"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                        ${isDragging ? 'bg-gray-600 border-blue-400' : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'}
                    `}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Image src="/upload.png" width={48} height={48} alt="Logo" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">(MAX 50MB)</p>
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
                        Selected file: <span className="font-semibold">{file.name}</span> ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                ) : (
                    <p className="text-lg leading-relaxed">
                        Time to upload your file :)
                    </p>
                )}      
            </div>
        </main>
    );
}