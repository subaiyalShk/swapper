import type { Metadata } from "next";
import { Inter as FontSans } from 'next/font/google';
import "./globals.css";
import { Web3Provider } from "@/providers/web3Provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: "Swapper App",
  description: "Just swap it",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased', fontSans.variable
      )}>
        <Web3Provider>
          {children}
        </Web3Provider>
        <Toaster richColors/>
      </body>
    </html>
  );
}
