"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle, Loader2, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

const API   = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const BRAND = "#E8336D";
type Step   = "intro"|"camera"|"preview"|"processing"|"done";

export default function VerifyPage() {
  const router = useRouter();
  const [step,    setStep]    = useState<Step>("intro");
  const [image,   setImage]   = useState<string|null>(null);
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream|null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:"user",width:480,height:480 } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStep("camera");
    } catch { alert("Camera access denied. Please allow camera access and try again."); }
  };

  const takeSelfie = useCallback(() => {
    const video = videoRef.current, canvas = canvasRef.current;
    if (!video||!canvas) return;
    canvas.width=video.videoWidth; canvas.height=video.videoHeight;
    const ctx=canvas.getContext("2d");
    if (!ctx) return;
    ctx.translate(canvas.width,0); ctx.scale(-1,1); ctx.drawImage(video,0,0);
    setImage(canvas.toDataURL("image/jpeg",0.8));
    streamRef.current?.getTracks().forEach(t=>t.stop());
    setStep("preview");
  }, []);

  const submit = async () => {
    setStep("processing");
    try {
      const token = localStorage.getItem("kd_token");
      await fetch(`${API}/users/verify`, { method:"POST", headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"}, body:JSON.stringify({selfieUrl:image}) });
    } catch {}
    await new Promise(r=>setTimeout(r,3000));
    setStep("done");
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
      {step==="intro" && (
        <div className="p-5">
          <Link href="/profile" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-base transition-colors no-underline">
            <ArrowLeft size={18} /> Back
          </Link>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm">

          {/* INTRO */}
          {step==="intro" && (
            <div className="text-center space-y-6">
              <div className="w-24 h-24 rounded-3xl bg-[#111118] border-2 border-[#E8336D]/30 flex items-center justify-center mx-auto">
                <Camera className="w-12 h-12 text-[#E8336D]" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white mb-3">Get Verified</h1>
                <p className="text-white/55 text-base leading-relaxed">A quick selfie gets you the blue badge — showing others you&apos;re a real person.</p>
              </div>
              <div className="bg-[#111118] border border-white/8 rounded-2xl p-5 text-left space-y-4">
                {["Face the camera in good light","Remove glasses or hats if possible","Your selfie is never shown publicly","Earn 50 free coins after verification"].map(tip => (
                  <div key={tip} className="flex items-start gap-3">
                    <Shield size={16} className="flex-shrink-0 mt-0.5" style={{ color:BRAND }} />
                    <span className="text-white/65 text-base">{tip}</span>
                  </div>
                ))}
              </div>
              <button onClick={startCamera} className="w-full py-4 rounded-2xl font-bold text-lg text-white hover:opacity-90 active:scale-95 transition-all" style={{ background:`linear-gradient(135deg,${BRAND},#FF6B9D)` }}>
                Open Camera
              </button>
            </div>
          )}

          {/* CAMERA */}
          {step==="camera" && (
            <div className="text-center space-y-6">
              <h2 className="text-xl font-bold text-white">Centre your face</h2>
              <div className="relative mx-auto" style={{ width:280, height:280 }}>
                <div className="absolute inset-0 rounded-full border-[3px] border-dashed z-10 pointer-events-none" style={{ borderColor:BRAND }} />
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full rounded-full object-cover" style={{ transform:"scaleX(-1)" }} />
              </div>
              <button onClick={takeSelfie} className="rounded-full bg-white border-4 flex items-center justify-center mx-auto hover:scale-105 active:scale-95 transition-transform"
                style={{ width:72, height:72, borderColor:BRAND }}>
                <div className="w-14 h-14 rounded-full" style={{ background:BRAND }} />
              </button>
              <p className="text-white/35 text-sm">Tap to capture</p>
            </div>
          )}

          {/* PREVIEW */}
          {step==="preview" && image && (
            <div className="text-center space-y-6">
              <h2 className="text-xl font-bold text-white">Looking good!</h2>
              <img src={image} className="w-48 h-48 rounded-full mx-auto object-cover border-4" style={{ borderColor:BRAND }} alt="Selfie" />
              <div className="flex gap-3">
                <button onClick={async () => { setImage(null); await startCamera(); }}
                  className="flex-1 py-4 bg-[#111118] border border-white/10 text-white font-semibold rounded-2xl text-base hover:bg-white/8 transition-colors">Retake</button>
                <button onClick={submit}
                  className="flex-1 py-4 rounded-2xl font-bold text-white text-base hover:opacity-90 active:scale-95 transition-all" style={{ background:`linear-gradient(135deg,${BRAND},#FF6B9D)` }}>Submit ✓</button>
              </div>
            </div>
          )}

          {/* PROCESSING */}
          {step==="processing" && (
            <div className="text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-[#111118] flex items-center justify-center mx-auto">
                <Loader2 className="w-12 h-12 animate-spin" style={{ color:BRAND }} />
              </div>
              <h2 className="text-2xl font-bold text-white">Verifying…</h2>
              <p className="text-white/50 text-base">Checking your selfie. Just a moment.</p>
              <div className="w-full bg-white/8 rounded-full h-2 overflow-hidden">
                <div className="h-full rounded-full animate-pulse" style={{ width:"70%", background:`linear-gradient(90deg,${BRAND},#FF6B9D)` }} />
              </div>
            </div>
          )}

          {/* DONE */}
          {step==="done" && (
            <div className="text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-green-500/12 border-2 border-green-500/35 flex items-center justify-center mx-auto">
                <CheckCircle className="w-14 h-14 text-green-400" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white mb-3">You&apos;re Verified! ✅</h1>
                <p className="text-white/55 text-base leading-relaxed">Your blue badge is now active. We also added <strong className="text-yellow-400">50 free coins</strong> to your wallet!</p>
              </div>
              <button onClick={() => router.push("/discover")}
                className="w-full py-4 rounded-2xl font-bold text-lg text-white hover:opacity-90 active:scale-95 transition-all" style={{ background:`linear-gradient(135deg,${BRAND},#FF6B9D)` }}>
                Start Discovering 🚀
              </button>
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
