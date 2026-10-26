import type { Metadata } from "next";
import "../globals.css";
import Footer from "@/app/components/common/Footer";
import { footerData } from "@/app/components/common/data";

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
    <div className={`h-full antialiased`}>
      <div className="min-h-full flex flex-col">{children}</div>
      <Footer data={footerData} />
    </div>
  );
}
