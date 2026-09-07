import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Marci Metzger | Pahrump Realtor — The Ridge Realty Group",
  description:
    "Marci Metzger, realtor for nearly 3 decades with The Ridge Realty Group in Pahrump, Nevada. Buying, selling, and finding a home you'll stay in for years.",
  icons: {
    icon: "/images/marci-metzger-logo.png",
    apple: "/images/marci-metzger-logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
