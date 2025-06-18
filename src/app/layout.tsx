import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Outfit({
  subsets: ["latin"],
});

const geistMono = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Proposal and Quotation Generator",
  description:
    "Generate professional proposals and quotations for your freelance projects using AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} ${geistMono.className} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
