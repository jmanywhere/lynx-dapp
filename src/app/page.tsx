import Image from "next/image";
import LogoImg from "../../public/logo.png";

export default function Home() {
  return (
    <main className="flex h-[calc(100vh-96px)] flex-col items-center justify-center relative overflow-y-auto">
      {/* Relative Image Background */}
      <Image
        src={LogoImg}
        alt="bg-logo"
        width={700}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none"
      />
      <div>Actual content here</div>
    </main>
  );
}
