
import type { Metadata } from "next";
import { Inter as FontSans } from 'next/font/google';
import "./globals.css";
import { Web3Provider } from "@/providers/web3Provider";
import { GlobalStateProvider } from '@/providers/globalStateProvider';
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

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
        <GlobalStateProvider>
          <Web3Provider>
            <Theme 
              appearance="dark"
              accentColor="cyan"
              grayColor="mauve"
              radius="medium"
              scaling="100%"
            >
              <div className="bg-[#1a1a2e] text-[#e0e0e0]">
                {children}
              </div>
            </Theme>
          </Web3Provider>
          <Toaster richColors/>
        </GlobalStateProvider>
      </body>
    </html>
  );
}
