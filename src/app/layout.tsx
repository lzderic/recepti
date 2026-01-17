/**
 * @file Root app layout.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { AppProviders } from "./providers";
import SiteHeader from "@/components/layout/site-header";
import Sidebar from "@/components/layout/sidebar";
import { STRINGS } from "@/shared/strings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Global document metadata.
 */
export const metadata: Metadata = {
  title: {
    default: STRINGS.app.name,
    template: `%s | ${STRINGS.app.name}`,
  },
  description: "Mini aplikaciju “Recepti”.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="hr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProviders>
          <div className="min-h-dvh bg-zinc-50 text-zinc-900">
            <div className="flex w-full">
              <Sidebar />

              <div className="min-w-0 flex-1">
                <SiteHeader />
                <main className="cooli-pattern min-w-0 flex-1">
                  <div className="w-full max-w-none px-6 py-6 sm:py-8 lg:px-8 2xl:px-10">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </div>
        </AppProviders>
      </body>
    </html>
  );
};

export default RootLayout;
