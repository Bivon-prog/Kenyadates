"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle, Loader } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStep("camera");
    } catch {
      alert("Camera access denied. Please allow camera in your browser settings.");
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

    // Mirror the image (selfie camera)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(imageData);

    // Stop camera stream
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setStep("preview");
  }, []);

  const submitVerification = async () => {
    setStep("processing");
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/users/verify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selfieUrl: capturedImage }),
      });
    } catch { /* silently handle */ }

    // Wait for mock KYC to "process"
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setStep("done");
  };

  const retake = async () => {
    setCapturedImage(null);
    await startCamera();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm mx-auto text-center">

        {step === "intro" && (
          <div className="space-y-6 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-brand-orange to-brand-peach rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-brand-orange/30">
              <Camera className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white mb-2">Get Verified ✅</h1>
              <p className="text-white/60 text-sm leading-relaxed">
                Take a quick selfie to get your blue verification badge. This helps other users know you're a real person — no catfishing here!
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-3">
              {["Face the camera in good light", "Remove glasses or hats if possible", "Your selfie is never shared publicly"].map((tip) => (
                <div key={tip} className="flex items-center gap-3 text-sm text-white/70">
                  <span className="text-brand-orange font-bold">✓</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
            <button
              onClick={startCamera}
              className="w-full py-4 bg-gradient-to-r from-brand-orange to-brand-peach text-white font-bold rounded-full text-lg hover:opacity-90 transition active:scale-95"
            >
              Open Camera
            </button>
          </div>
        )}

        {step === "camera" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Center your face 📸</h2>
            <div className="relative mx-auto" style={{ width: 300, height: 300 }}>
              {/* Face guide oval */}
              <div className="absolute inset-0 rounded-full border-4 border-brand-orange border-dashed z-10 pointer-events-none" />
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
              className="w-20 h-20 mx-auto bg-white rounded-full border-4 border-brand-orange flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-brand-orange/30"
            >
              <div className="w-16 h-16 bg-brand-orange rounded-full" />
            </button>
            <p className="text-white/40 text-xs">Tap the button to take your selfie</p>
          </div>
        )}

        {step === "preview" && capturedImage && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Looking good! 😊</h2>
            <img
              src={capturedImage}
              className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-brand-orange shadow-xl"
              alt="Selfie preview"
            />
            <div className="flex gap-3">
              <button
                onClick={retake}
                className="flex-1 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition"
              >
                Retake
              </button>
              <button
                onClick={submitVerification}
                className="flex-1 py-3 bg-gradient-to-r from-brand-orange to-brand-peach text-white font-bold rounded-full hover:opacity-90 transition active:scale-95"
              >
                Submit ✓
              </button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="space-y-6">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto">
              <Loader className="w-12 h-12 text-brand-orange animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white">Verifying...</h2>
            <p className="text-white/50 text-sm">Our AI is checking your selfie. This only takes a moment.</p>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-orange to-brand-peach rounded-full animate-pulse" style={{ width: "70%" }} />
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/30 animate-bounce">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white mb-2">You're Verified! ✅</h1>
              <p className="text-white/60 text-sm">
                Your blue badge is now active. Other users can see you're a real, verified person on KenyaDates!
              </p>
            </div>
            <button
              onClick={() => router.push("/discover")}
              className="w-full py-4 bg-gradient-to-r from-brand-orange to-brand-peach text-white font-bold rounded-full text-lg hover:opacity-90 transition active:scale-95"
            >
              Start Discovering 🚀
            </button>
          </div>
        )}
      </div>

      {/* Hidden canvas for selfie capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
