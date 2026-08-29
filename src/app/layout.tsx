import type { Metadata } from "next";
import { Caveat, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


// 2. Añadida la configuración de Caveat
const caveatFont = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "KickStamp | El Golazo Club",
  description: "Gestión de alumnos y asistencia de El Golazo Club",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${caveatFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

