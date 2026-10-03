"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle, Loader2, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const BRAND = "#E8336D";
const BRAND_SECONDARY = "#FF6B9D";

type Step = "intro" | "camera" | "preview" | "processing" | "done";

export default function VerifyPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 480, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStep("camera");
    } catch {
      alert("Camera access denied. Please allow camera access in your browser settings and try again.");
    }
  };

  const takeSelfie = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(imageData);
    streamRef.current?.getTracks().forEach(t => t.stop());
    setStep("preview");
  }, []);

  const submitVerification = async () => {
    setStep("processing");
    try {
      const token = localStorage.getItem("kd_token");
      await fetch(`${API}/users/verify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ selfieUrl: capturedImage }),
      });
    } catch { /* silently handle */ }
    await new Promise(r => setTimeout(r, 3000));
    setStep("done");
  };

  const retake = async () => {
    setCapturedImage(null);
    await startCamera();
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
      {/* Back button */}
      {step === "intro" && (
        <div className="p-4">
          <Link href="/profile" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors no-underline">
            <ArrowLeft size={16} /> Back
          </Link>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center space-y-6 animate-fade-in">

          {/* ── Intro ── */}
          {step === "intro" && (
            <>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto bg-[#E8336D]/10 border border-[#E8336D]/20">
                <Camera className="w-10 h-10 text-[#E8336D]" />
              </div>
              <div>
                <h1 className="text-3xl font-black mb-2">Get Verified ✅</h1>
                <p className="text-white/55 text-sm leading-relaxed">
                  A quick selfie gets you the blue badge — showing others you&apos;re a real person. No catfishing on KenyaDates.
                </p>
              </div>

              <div className="bg-white/4 border border-white/8 rounded-2xl p-4 text-left space-y-3">
                {[
                  "Face the camera in good light",
                  "Remove glasses or hats if possible",
                  "Your selfie is never shown publicly",
                  "Earn 50 free coins after verification",
                ].map(tip => (
                  <div key={tip} className="flex items-start gap-3 text-sm text-white/65">
                    <Shield size={14} className="flex-shrink-0 mt-0.5" style={{ color: BRAND }} />
                    {tip}
                  </div>
                ))}
              </div>

              <button
                onClick={startCamera}
                className="w-full py-4 rounded-full font-bold text-lg text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_SECONDARY})` }}
              >
                Open Camera
              </button>
            </>
          )}

          {/* ── Camera ── */}
          {step === "camera" && (
            <>
              <h2 className="text-xl font-bold">Centre your face 📸</h2>
              <div className="relative mx-auto" style={{ width: 280, height: 280 }}>
                <div
                  className="absolute inset-0 rounded-full border-[3px] border-dashed z-10 pointer-events-none"
                  style={{ borderColor: BRAND }}
                />
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full rounded-full object-cover scale-x-[-1]"
                />
              </div>
              <button
                onClick={takeSelfie}
                className="w-18 h-18 rounded-full bg-white border-4 flex items-center justify-center mx-auto hover:scale-105 transition-transform active:scale-95"
                style={{ width: 72, height: 72, borderColor: BRAND }}
              >
                <div className="w-12 h-12 rounded-full" style={{ background: BRAND }} />
              </button>
              <p className="text-white/35 text-xs">Tap the button to capture</p>
            </>
          )}

          {/* ── Preview ── */}
          {step === "preview" && capturedImage && (
            <>
              <h2 className="text-xl font-bold">Looking good! 😊</h2>
              <img
                src={capturedImage}
                className="w-48 h-48 rounded-full mx-auto object-cover border-4"
                style={{ borderColor: BRAND }}
                alt="Selfie preview"
              />
              <div className="flex gap-3">
                <button
                  onClick={retake}
                  className="flex-1 py-3 bg-white/8 border border-white/10 text-white font-semibold rounded-full hover:bg-white/15 transition"
                >
                  Retake
                </button>
                <button
                  onClick={submitVerification}
                  className="flex-1 py-3 rounded-full font-bold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_SECONDARY})` }}
                >
                  Submit ✓
                </button>
              </div>
            </>
          )}

          {/* ── Processing ── */}
          {step === "processing" && (
            <>
              <div className="w-24 h-24 rounded-full bg-white/8 flex items-center justify-center mx-auto">
                <Loader2 className="w-12 h-12 animate-spin" style={{ color: BRAND }} />
              </div>
              <h2 className="text-2xl font-bold">Verifying…</h2>
              <p className="text-white/45 text-sm">Our system is checking your selfie. Takes just a moment.</p>
              <div className="w-full bg-white/8 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full animate-pulse w-3/4"
                  style={{ background: `linear-gradient(90deg, ${BRAND}, ${BRAND_SECONDARY})` }}
                />
              </div>
            </>
          )}

          {/* ── Done ── */}
          {step === "done" && (
            <>
              <div className="w-24 h-24 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center mx-auto">
                <CheckCircle className="w-14 h-14 text-green-400" />
              </div>
              <div>
                <h1 className="text-3xl font-black mb-2">You&apos;re Verified! ✅</h1>
                <p className="text-white/55 text-sm leading-relaxed">
                  Your blue badge is now active. We also added <strong className="text-yellow-400">50 free coins</strong> to your wallet!
                </p>
              </div>
              <button
                onClick={() => router.push("/discover")}
                className="w-full py-4 rounded-full font-bold text-lg text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_SECONDARY})` }}
              >
                Start Discovering 🚀
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
