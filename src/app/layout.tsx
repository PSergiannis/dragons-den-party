import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dragons Den Party",
  description: "Vote for your favorite cocktails and dragons!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-br from-purple-900 to-pink-900 min-h-screen text-white`}
      >
        {children}
      </body>
    </html>
  );
}
