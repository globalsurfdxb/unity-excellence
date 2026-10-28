import type { Metadata } from "next";
import "../globals.css";
import Header from "@/app/components/common/Header";
import Footer from "@/app/components/common/Footer";
import Intro from "@/app/components/common/Intro";
import { headerData, footerData } from "@/app/components/common/data";

export const metadata: Metadata = {
  title: "Unity Excellence",
  description: "Every community, Expertly managed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`relative h-full antialiased`}>
      <Intro />
      <Header data={headerData} />
      <div className="relative z-10 flex min-h-full flex-col bg-background">
        {children}
        {/* marks the end of the content, so the footer underneath knows when it starts to show */}
        <span data-page-end aria-hidden="true" />
      </div>
      <Footer data={footerData} />
    </div>
  );
}
