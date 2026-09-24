"use client";

import { useState, useEffect } from "react";
import { Smartphone, Download, X, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export default function InstallPwaModal() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("KenyaDates SW registered:", reg))
        .catch((err) => console.log("SW registration error:", err));
    }

    // Capture PWA Install Prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback for browsers that don't support beforeinstallprompt (e.g. iOS Safari)
      alert("To install KenyaDates on your phone:\n1. Tap the Share button in your browser\n2. Select 'Add to Home Screen'\n3. Open KenyaDates like a native app!");
    }
  };

  return (
    <>
      {/* Download App Button in Header / Page */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-rose-500/25 transition-all transform hover:scale-105"
      >
        <Smartphone className="w-4 h-4" />
        <span>Download Mobile App</span>
        <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full text-white">APK / PWA</span>
      </button>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#161622] border border-rose-500/30 rounded-3xl p-6 text-white shadow-2xl overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon Header */}
            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="w-20 h-20 bg-gradient-to-tr from-[#E8336D] to-[#F5C542] rounded-3xl p-0.5 shadow-xl shadow-rose-500/30 mb-4 flex items-center justify-center">
                <div className="w-full h-full bg-[#0D0D0D] rounded-[22px] flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-[#FF6B9D]" />
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-rose-100 to-amber-200 bg-clip-text text-transparent">
                KenyaDates Web APK
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Install directly on your phone browser — No Android Studio or Play Store required!
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 mb-6 bg-white/5 p-4 rounded-2xl border border-white/10 text-sm">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-gray-200">Works 100% offline & launches instantly</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-rose-400 shrink-0" />
                <span className="text-gray-200">Safaricom M-Pesa STK push top-ups</span>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-gray-200">Real-time Swahili/English chat translation</span>
              </div>
            </div>

            {/* Install Action */}
            {isInstalled ? (
              <div className="text-center p-3 bg-emerald-500/20 text-emerald-300 rounded-xl font-medium text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>KenyaDates App is installed on your device!</span>
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 bg-gradient-to-r from-[#E8336D] via-[#FF6B9D] to-[#F5C542] text-white font-bold rounded-2xl shadow-xl hover:shadow-rose-500/30 transition-all flex items-center justify-center gap-2 transform active:scale-98"
              >
                <Download className="w-5 h-5" />
                <span>Install Mobile App (Instant Web APK)</span>
              </button>
            )}

            <p className="text-xs text-center text-gray-500 mt-4">
              Compatible with Android Chrome, Samsung Internet, Edge & iOS Safari
            </p>
          </div>
        </div>
      )}
    </>
  );
}
