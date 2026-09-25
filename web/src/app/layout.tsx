import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KenyaDates — Real People. Real Connections.",
  description: "Meet verified people from Kenya and East Africa. Instant mobile PWA app, Swahili chat translation, and M-Pesa STK push.",
  keywords: "Kenya dating, East Africa dating, Kenyan singles, online dating Kenya, Swahili chat, M-Pesa dating",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KenyaDates",
  },
  openGraph: {
    title: "KenyaDates — Real People. Real Connections.",
    description: "Meet verified people from Kenya and around the world.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#E8336D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
