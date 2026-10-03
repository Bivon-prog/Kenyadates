"use client";

import { useEffect, useState } from "react";
import { Smartphone, Download } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setIsVisible(false);
    } else {
      // iOS / unsupported browser fallback
      alert(
        "To install KenyaDates:\n\n" +
        "📱 iOS Safari: Tap Share → Add to Home Screen\n" +
        "🤖 Android Chrome: Tap ⋮ menu → Add to Home Screen"
      );
    }
  };

  // Always render — clicking triggers install or shows instructions
  return (
    <button
      onClick={handleInstall}
      className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 text-sm font-medium transition-all hover:bg-white/5"
    >
      <Smartphone size={15} />
      <span>Install App</span>
    </button>
  );
}
