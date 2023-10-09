import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Web3Providers from "./ClientProviders";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lynx Token",
  description:
    "Lynx Tech is a Web3 project development company committed to enhancing everyones Web3 experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} bg-base-100`}>
        <Web3Providers>
          <Header />
          {children}
        </Web3Providers>
      </body>
    </html>
  );
}

import Image from "next/image";
import Link from "next/link";
import LogoImage from "../../public/logo.png";
import { IoMenuSharp } from "react-icons/io5";

const Header = () => {
  return (
    <header className="pl-4 md:px-8 lg:px-12 py-6 sticky top-0 bg-base-100 z-30">
      <nav className="flex flex-row justify-between items-center">
        <Image src={LogoImage} alt="Lynx Tech Logo" width={50} height={50} />
        <a
          href="https://lynxtech.io/"
          className="md:text-lg text-2xl font-bold hover:text-primary hidden md:block"
        >
          Home
        </a>
        <a
          href="https://lynxtech.io/index.php/deadshot/"
          className="md:text-lg text-2xl font-bold hover:text-primary hidden md:block"
        >
          Deadshot
        </a>
        <Link
          href="/"
          className="md:text-lg text-2xl font-bold hover:text-primary hidden md:block"
        >
          Reward
        </Link>
        <a
          href="https://lynxtech.io/index.php/lynx/"
          className="md:text-lg text-2xl font-bold hover:text-primary hidden md:block"
        >
          $LYNX
        </a>
        <a
          href="https://lynxtech.io/lynxtechwp.pdf"
          className="md:text-lg text-2xl font-bold hover:text-primary hidden md:block"
        >
          Whitepaper
        </a>
        <w3m-button balance="hide" />
        <div className="dropdown dropdown-end md:hidden">
          <div className="pr-4">
            <label tabIndex={0} className="btn btn-primary">
              <IoMenuSharp className="text-2xl" />
            </label>
          </div>
          <div className="dropdown-content shadow w-screen">
            <nav className="flex flex-col items-center gap-2 bg-accent-background">
              <a
                href="https://lynxtech.io/"
                className="text-lg py-2 font-medium hover:text-white text-center hover:bg-secondary w-full"
              >
                Home
              </a>
              <a
                href="https://lynxtech.io/index.php/deadshot/"
                className="text-lg py-2 font-medium hover:text-white text-center hover:bg-secondary w-full"
              >
                Deadshot
              </a>
              <Link
                href="/"
                className="text-lg py-2 font-medium hover:text-white text-center hover:bg-secondary w-full"
              >
                Reward
              </Link>
              <a
                href="https://lynxtech.io/index.php/lynx/"
                className="text-lg py-2 font-medium hover:text-white text-center hover:bg-secondary w-full"
              >
                $LYNX
              </a>
              <a
                href="https://lynxtech.io/lynxtechwp.pdf"
                className="text-lg py-2 font-medium hover:text-white text-center hover:bg-secondary w-full"
              >
                Whitepaper
              </a>
            </nav>
          </div>
        </div>
      </nav>
    </header>
  );
};
