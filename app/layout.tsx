import type { Metadata } from "next";
import "./globals.css";
import { getSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteTitle = settings.siteTitle || "My Site";
  return {
    title: { default: siteTitle, template: `%s | ${siteTitle}` },
    description: settings.tagline || undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* eslint-disable @next/next/no-page-custom-font -- App Router: layout fonts apply app-wide (no _document.js) */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* eslint-enable @next/next/no-page-custom-font */}
      <body className="antialiased font-sans text-mist-950 dark:text-mist-100">
        {children}
      </body>
    </html>
  );
}
