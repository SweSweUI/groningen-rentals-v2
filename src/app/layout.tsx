import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Improve font loading performance
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Improve font loading performance
  preload: false, // Only preload if needed
});

export const metadata: Metadata = {
  title: "GroningenRentals - Find Your Perfect Home",
  description: "Exclusive rental platform for Groningen. Search verified listings from all major rental platforms.",
  keywords: "groningen, rental, apartments, housing, real estate, verhuur",
  authors: [{ name: "GroningenRentals" }],
  robots: "index, follow",
  openGraph: {
    title: "GroningenRentals - Find Your Perfect Home",
    description: "Exclusive rental platform for Groningen",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.grunoverhuur.nl" />
        <link rel="dns-prefetch" href="https://www.vandermeulenmakelaars.nl" />
        <link rel="dns-prefetch" href="https://maxxhuren.nl" />
        <link rel="dns-prefetch" href="https://www.rotsvast.nl" />

        {/* Viewport meta for mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
