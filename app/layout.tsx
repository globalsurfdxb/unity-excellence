import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import LenisProvider from "@/app/components/providers/LenisProvider";

export const metadata: Metadata = {
  title: "Unity Excellence",
  description: "Every community, Expertly managed",
};

export const viewport: Viewport = {
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
