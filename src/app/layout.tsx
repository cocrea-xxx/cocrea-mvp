import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";

const retroFont = VT323({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-retro",
  display: "swap",
});
export const metadata: Metadata = {
  title: "CoCrea | Matrix OS",
  description: "Sistema de Control de Obra Centralizado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={retroFont.className}>{children}</body>
    </html>
  );
}
