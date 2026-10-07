"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, RefreshCw } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { getProfileAvatar } from "@/lib/avatar";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function CallContent() {
  const { matchId } = useParams() as { matchId: string };
  const searchParams = useSearchParams();
  const callType = (searchParams.get("type") || "video") as "audio" | "video";
  const isIncoming = searchParams.get("incoming") === "1";
  const router = useRouter();

  const [callStatus, setCallStatus] = useState<"calling" | "connected" | "ended">("calling");
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [duration, setDuration] = useState(0);
  const [otherName, setOtherName] = useState("Match");
  const [otherPhoto, setOtherPhoto] = useState("");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);

  const userId = typeof window !== "undefined" ? (() => {
    try {
      return JSON.parse(localStorage.getItem("kd_user")!).id || "me";
    } catch {
      return "me";
    }
  })() : "me";

  useEffect(() => {
    startCall();
    return () => endCall();
  }, []);

  const startCall = async () => {
    try {
      // 1. Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === "video" ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" } : false,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      // 2. Setup RTCPeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
        ],
      });
      pcRef.current = pc;

      // Add tracks
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Remote stream track handler
      pc.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // 3. Setup Socket.IO connection
      const socket = io(`${API}/chat`, { query: { userId }, transports: ["websocket"] });
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("joinRoom", { matchId });
        if (!isIncoming) initiateCall(pc, socket);
      });

      // ICE candidate gathering
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", { matchId, candidate: event.candidate });
        }
      };

      // Incoming offer answer
      socket.on("callAnswer", async ({ answer }: any) => {
        if (pc.signalingState !== "stable") {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          // Process buffered ICE candidates
          for (const cand of pendingCandidates.current) {
            await pc.addIceCandidate(new RTCIceCandidate(cand));
          }
          pendingCandidates.current = [];
          setCallStatus("connected");
          startTimer();
        }
      });

      // Incoming ICE candidates
      socket.on("iceCandidate", async ({ candidate }: any) => {
        if (candidate) {
          if (pc.remoteDescription) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } else {
            pendingCandidates.current.push(candidate);
          }
        }
      });

      // Incoming offer if receiver joins
      socket.on("callOffer", async ({ offer, callerName, callerPhoto }: any) => {
        if (isIncoming && pc.signalingState === "stable") {
          if (callerName) setOtherName(callerName);
          if (callerPhoto) setOtherPhoto(callerPhoto);
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("callAnswer", { matchId, answer });
          setCallStatus("connected");
          startTimer();
        }
      });

      // Call end signal
      socket.on("callEnd", () => {
        setCallStatus("ended");
        cleanup();
        setTimeout(() => router.push(`/chat/${matchId}`), 1800);
      });

    } catch (err) {
      alert("Could not access camera/microphone. Please check permissions.");
      router.back();
    }
  };

  const initiateCall = async (pc: RTCPeerConnection, socket: Socket) => {
    let callerName = "Me";
    let callerPhoto = "";
    try {
      const u = JSON.parse(localStorage.getItem("kd_user") ?? "{}");
      callerName = u.profile?.displayName ?? "User";
      callerPhoto = u.profile?.photos?.[0] ?? "";
    } catch {}

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("callOffer", { matchId, callerId: userId, callerName, callerPhoto, offer, callType });
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const toggleMute = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = isMuted));
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = isCamOff));
    setIsCamOff(!isCamOff);
  };

  const cleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    pcRef.current?.close();
    socketRef.current?.disconnect();
  };

  const endCall = () => {
    socketRef.current?.emit("callEnd", { matchId, userId });
    setCallStatus("ended");
    cleanup();
    setTimeout(() => router.push(`/chat/${matchId}`), 1200);
  };

  const displayAvatar = getProfileAvatar(otherPhoto, otherName, 0);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col items-center justify-between relative overflow-hidden select-none">
      
      {/* Remote Video Stream (Full Screen) */}
      {callType === "video" && (
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}

      {/* Dark Ambient Backdrop for Audio Call or when camera is off */}
      {(callType === "audio" || callStatus !== "connected") && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#141424] via-[#0D0D12] to-[#0A0A0F] z-0 flex flex-col items-center justify-center p-8">
          <div className="relative mb-6">
            {callStatus === "calling" && (
              <span className="absolute inset-0 rounded-full bg-[#E8336D] animate-ping opacity-60" />
            )}
            <div className="w-36 h-36 rounded-full border-4 border-[#E8336D] overflow-hidden shadow-2xl relative bg-[#1E1E2E]">
              <img src={displayAvatar} className="w-full h-full object-cover" alt={otherName} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white mb-1">{otherName}</h2>
          <p className="text-white/60 text-base font-semibold">
            {callStatus === "calling" ? (isIncoming ? "Incoming call…" : "Ringing…") : callStatus === "connected" ? formatDuration(duration) : "Call ended"}
          </p>
        </div>
      )}

      {/* Overlay UI Controls */}
      <div className="relative z-10 w-full flex flex-col items-center justify-between h-screen p-6 md:p-10 pointer-events-none">
        
        {/* Top Header status bar */}
        <div className="text-center pt-4 pointer-events-auto bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl">
          <p className="text-sm font-extrabold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            {callType === "video" ? "HD Video Call" : "Audio Call"} · {callStatus === "connected" ? formatDuration(duration) : callStatus === "calling" ? "Connecting…" : "Ended"}
          </p>
        </div>

        {/* Local Video Stream (PiP floating window bottom-right) */}
        {callType === "video" && (
          <div className="self-end pointer-events-auto w-32 h-44 sm:w-40 sm:h-56 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-[#14141F] relative group">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {isCamOff && (
              <div className="absolute inset-0 bg-[#1A1A26] flex items-center justify-center text-xs font-bold text-white/50">
                Camera Off
              </div>
            )}
          </div>
        )}

        {/* Bottom Floating Control Bar */}
        <div className="pointer-events-auto flex items-center justify-center gap-6 mb-6 bg-black/60 backdrop-blur-xl px-8 py-4 rounded-full border border-white/15 shadow-2xl">
          {/* Mute Audio */}
          <button
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg ${
              isMuted ? "bg-red-500 text-white" : "bg-white/15 hover:bg-white/25 text-white border border-white/10"
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Toggle Camera (Video call mode) */}
          {callType === "video" && (
            <button
              onClick={toggleCamera}
              title={isCamOff ? "Turn Camera On" : "Turn Camera Off"}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg ${
                isCamOff ? "bg-red-500 text-white" : "bg-white/15 hover:bg-white/25 text-white border border-white/10"
              }`}
            >
              {isCamOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>
          )}

          {/* End Call */}
          <button
            onClick={endCall}
            title="End Call"
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all active:scale-95 shadow-2xl"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>
        </div>

      </div>
    </div>
  );
}

export default function CallPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white">
        <p className="text-base font-bold animate-pulse">Connecting WebRTC Call…</p>
      </div>
    }>
      <CallContent />
    </Suspense>
  );
}
