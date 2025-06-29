'use client';

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
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

      {/* Main Section */}
      <section className="mx-auto max-w-250 p-6">
        <h1>Hello!</h1>
          <p className="text-lg leading-relaxed">
            This is a secure file exchange platform. Here you can upload any file (Max 50MB), 
            it will be encrypted and stored in database and encryption key will be provided for you for temporary download. 
            By giving the key you will get access to download the stored file.
          </p>
      </section>

      {/* Upload/Download */}
      <div className='mx-auto max-w-sm items-center p-6 flex gap-4 mt-6'>
        <button onClick={() => router.push('/upload')}
        className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
        >
          Upload</button>
        <button className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded'>Download</button>
      </div>
    </main>
  );
}
