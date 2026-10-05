"use client";

import { useEffect, useState } from "react";
import { Smartphone, Download, CheckCircle, X, FileDown } from "lucide-react";

interface InstallPromptProps {
  variant?: "button" | "banner" | "icon" | "badge";
  className?: string;
}

export default function InstallPrompt({ variant = "button", className = "" }: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleDownloadAPK = () => {
    const link = document.createElement("a");
    link.href = "/downloads/kenyadates-v1.0.apk";
    link.download = "KenyaDates-v1.0.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInstall = async () => {
    // Trigger direct APK download immediately on click
    handleDownloadAPK();

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setIsInstalled(true);
      }
    } else {
      setShowModal(true);
    }
  };

  if (isInstalled) {
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold ${className}`}>
        <CheckCircle size={14} /> App Installed
      </div>
    );
  }

  return (
    <>
      {variant === "banner" ? (
        <div className={`w-full bg-gradient-to-r from-[#E8336D]/20 via-purple-600/20 to-[#FF6B9D]/20 border border-[#E8336D]/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl ${className}`}>
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E8336D] to-[#FF6B9D] flex items-center justify-center flex-shrink-0 shadow-lg">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-extrabold text-sm sm:text-base">Download KenyaDates App</p>
              <p className="text-white/60 text-xs sm:text-sm">Install APK directly or add to mobile home screen</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleInstall}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#E8336D] hover:bg-[#FF6B9D] text-white text-xs sm:text-sm font-extrabold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <FileDown size={16} /> Download APK
            </button>
          </div>
        </div>
      ) : variant === "badge" ? (
        <button
          onClick={handleInstall}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] text-white text-xs font-extrabold shadow-md active:scale-95 ${className}`}
        >
          <FileDown size={14} /> APK App
        </button>
      ) : variant === "icon" ? (
        <button
          onClick={handleInstall}
          title="Download APK / Install App"
          className={`flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-[#E8336D] text-white transition-colors border border-white/20 shadow-md ${className}`}
        >
          <Download size={18} />
        </button>
      ) : (
        <button
          onClick={handleInstall}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#E8336D]/50 bg-[#E8336D]/20 hover:bg-[#E8336D] text-white text-xs sm:text-sm font-extrabold transition-all shadow-md active:scale-95 ${className}`}
        >
          <Smartphone size={16} className="text-[#FF6B9D]" />
          <span>Download APK</span>
        </button>
      )}

      {/* Installation Instructions Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161622] border border-white/15 rounded-3xl p-6 max-w-sm w-full relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-1 rounded-full bg-white/5"
            >
              <X size={18} />
            </button>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E8336D] to-[#FF6B9D] flex items-center justify-center mb-4 mx-auto shadow-xl">
              <FileDown className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-extrabold text-white text-center mb-1">Download KenyaDates App</h3>
            <p className="text-white/60 text-xs text-center mb-5">
              APK file is downloading! You can also install the PWA below.
            </p>

            <button
              onClick={handleDownloadAPK}
              className="w-full mb-4 py-3 rounded-2xl bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
            >
              <FileDown size={18} /> Download APK File Directly
            </button>

            <div className="space-y-3 bg-white/5 rounded-2xl p-4 border border-white/10 text-xs text-white/80">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E8336D] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">1</span>
                <div>
                  <span className="font-semibold text-white">Android APK:</span> Open your Downloads folder and tap <span className="text-pink-400 font-bold">KenyaDates-v1.0.apk</span> to install.
                </div>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E8336D] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">2</span>
                <div>
                  <span className="font-semibold text-white">iPhone (Safari):</span> Tap <span className="text-blue-400 font-bold">Share</span> icon → select <span className="text-pink-400 font-bold">"Add to Home Screen"</span>.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-4 py-3 rounded-2xl bg-white/10 text-white font-bold text-sm hover:bg-white/15 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}


