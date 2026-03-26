import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ServiceWorkerRegister } from "@/components/sw-register";
import { validateEnv } from "@/lib/env";
import "./globals.css";

validateEnv();

export const metadata: Metadata = {
  metadataBase: new URL("https://amex-portal.vercel.app"),
  title: {
    default: "CreditOS — Maximize Your Amex Card Benefits",
    template: "%s | CreditOS",
  },
  description:
    "Stop leaving money on the table. Track and maximize $4,500+/year in Amex Platinum & Gold card credits with smart reminders, streak tracking, and ROI analytics.",
  keywords: [
    "amex",
    "american express",
    "platinum card",
    "gold card",
    "credit card benefits",
    "rewards tracker",
    "membership rewards",
  ],
  openGraph: {
    title: "CreditOS — Maximize Your Amex Card Benefits",
    description:
      "Track and maximize $4,500+/year in Amex Platinum & Gold card credits.",
    siteName: "CreditOS",
    type: "website",
    url: "https://amex-portal.vercel.app",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CreditOS — Maximize Your Amex Card Benefits",
    description:
      "Track and maximize $4,500+/year in Amex Platinum & Gold card credits.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" style={{ fontFamily: "'Satoshi', sans-serif" }}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a1a2e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#fafaf9] text-[#111111]">
        <ClerkProvider>
          {children}
          <Toaster />
          <ServiceWorkerRegister />
        </ClerkProvider>
      </body>
    </html>
  );
}
