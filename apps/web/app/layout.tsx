import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/context/theme-context";
import { PWAInstaller } from "@/components/pwa-Installer";
import  StoreProvider  from "@/lib/store/StoreProvider";
import 'mapbox-gl/dist/mapbox-gl.css';
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PackPal — Plan trips, Pack smart, Travel happier",
  description: "Create smart itineraries, map routes, store documents, and never forget your packing list.",
  // manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
        <ThemeProvider defaultTheme="system" storageKey="packpal-theme">
          {children}
          {/* <PWAInstaller
            title="Install PackPal"
            subtitle="Install this app on your device for a better experience."
          /> */}
          <Toaster richColors closeButton position="top-right" />
        </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
