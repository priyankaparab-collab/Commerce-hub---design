import type { Metadata } from "next";
import "./compiled.css";
import "./globals.css";
import "@cimpress-ui/react/styles.css";
import { ClipboardPolyfill } from "@/components/ClipboardPolyfill";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Commerce Hub",
  description: "Commerce Hub — Order Management Prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-cim-style-root className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full" style={{ backgroundColor: 'white' }}>
        <ClipboardPolyfill />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
