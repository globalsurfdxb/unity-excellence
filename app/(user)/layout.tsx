import type { Metadata } from "next";
import "../globals.css";
import Header from "@/app/components/common/Header";
import Footer from "@/app/components/common/Footer";
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
      <Header data={headerData} />
      <div className="relative z-10 flex min-h-full flex-col bg-background">{children}</div>
      <Footer data={footerData} />
    </div>
  );
}
