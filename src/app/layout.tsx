import type { Metadata, Viewport } from "next";
import { Caveat, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import SwRegister from "@/components/shared/sw-register";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { ThemeSync } from "@/components/shared/theme-sync";
import { scriptTemaInicial } from "@/lib/tema";
import { STORAGE_KEY as SETTINGS_KEY } from "@/store/settings-store";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveatFont = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "El Golazo Club | Sistema de gestión deportiva",
  description: "Gestión de alumnos, asistencia, pagos y actividades de El Golazo Club.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "El Golazo Club",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#070d1a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-theme="light"
      suppressHydrationWarning
      className={`${jakartaSans.variable} ${geistMono.variable} ${caveatFont.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTemaInicial(SETTINGS_KEY) }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeSync />
        <ErrorBoundary>{children}</ErrorBoundary>
        <SwRegister />
      </body>
    </html>
  );
}
