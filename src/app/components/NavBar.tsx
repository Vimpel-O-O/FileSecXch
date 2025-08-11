import Image from "next/image";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image src="/logo.png" width={48} height={48} alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            FileSecXch
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
