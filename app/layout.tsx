import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ServiceWorkerRegister } from "@/components/sw-register";
import { validateEnv } from "@/lib/env";
import "./globals.css";

validateEnv();

export const metadata: Metadata = {
  title: {
    default: "CreditOS",
    template: "%s | CreditOS",
  },
  description: "Your credit card rewards command center",
  openGraph: {
    title: "CreditOS",
    description: "Your credit card rewards command center",
    siteName: "CreditOS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CreditOS",
    description: "Your credit card rewards command center",
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
