import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PHOTOWALA BAYAD — Photography Studio",
  description:
    "PHOTOWALA BAYAD — Capturing weddings, portraits, events & the streets of India. A photography studio crafting timeless frames with light, story and soul.",
  keywords: [
    "PHOTOWALA BAYAD",
    "photography",
    "wedding photography",
    "portrait photography",
    "event photography",
    "Bayad photographer",
    "Gujarat photographer",
    "Indian wedding photography",
  ],
  authors: [{ name: "PHOTOWALA BAYAD" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "PHOTOWALA BAYAD — Photography Studio",
    description:
      "Capturing weddings, portraits, events & the streets of India. Timeless frames with light, story and soul.",
    siteName: "PHOTOWALA BAYAD",
    type: "website",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PHOTOWALA BAYAD — Photography Studio",
    description:
      "Capturing weddings, portraits, events & the streets of India.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bebas.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
