import Image from "next/image";
import LogoImg from "../../public/logo.png";
import DividendCard from "@/components/DividendCard";
import DividendExecutionTable from "@/components/DividendExecutionTable";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-96px)] flex-col items-center justify-center relative overflow-y-auto pt-11">
      {/* Relative Image Background */}
      <Image
        src={LogoImg}
        alt="bg-logo"
        width={700}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none"
      />
      <DividendCard />
      {/* <section className="py-12 px-4">
        <DividendExecutionTable />
      </section> */}
    </main>
  );
}
