import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import BottomNav from "@/components/BottomNav";
import AppShell from "@/components/AppShell";
import IncomingCallModal from "@/components/IncomingCallModal";

export const metadata: Metadata = {
  title: "KenyaDates — Real People. Real Connections.",
  description: "Meet verified singles from Kenya. Face-verified profiles, Swahili chat translation, and M-Pesa payments.",
  keywords: "Kenya dating, Kenyan singles, online dating Kenya, Swahili chat, M-Pesa dating, Nairobi dating",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KenyaDates",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon-192x192.png",
  },
  openGraph: {
    title: "KenyaDates — Real People. Real Connections.",
    description: "Kenya's premier dating app. Verified profiles, real connections.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#E8336D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
          <BottomNav />
          <IncomingCallModal />
        </AuthProvider>
      </body>
    </html>
  );
}
