import type { Metadata } from "next";
import "../globals.css";

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
    </div>
  );
}
