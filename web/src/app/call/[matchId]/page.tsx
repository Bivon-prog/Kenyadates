"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { io, Socket } from "socket.io-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CallPage() {
  const { matchId } = useParams() as { matchId: string };
  const searchParams = useSearchParams();
  const callType = (searchParams.get("type") || "video") as "audio" | "video";
  const isIncoming = searchParams.get("incoming") === "1";
  const router = useRouter();

  const [callStatus, setCallStatus] = useState<"calling" | "connected" | "ended">("calling");
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [duration, setDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";

  useEffect(() => {
    startCall();
    return () => endCall();
  }, []);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === "video",
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pcRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      const socket = io(`${API}/chat`, { query: { userId } });
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("joinRoom", { matchId });
        if (!isIncoming) initiateCall(pc, socket);
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", { matchId, candidate: event.candidate });
        }
      };

      socket.on("callAnswer", async ({ answer }: any) => {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        setCallStatus("connected");
        startTimer();
      });

      socket.on("iceCandidate", async ({ candidate }: any) => {
        if (candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
      });

      socket.on("callOffer", async ({ offer }: any) => {
        if (isIncoming) {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("callAnswer", { matchId, answer });
          setCallStatus("connected");
          startTimer();
        }
      });

      socket.on("callEnd", () => {
        setCallStatus("ended");
        cleanup();
        setTimeout(() => router.push(`/chat/${matchId}`), 2000);
      });
    } catch (err) {
      alert("Could not access camera/microphone. Please check permissions.");
      router.back();
    }
  };

  const initiateCall = async (pc: RTCPeerConnection, socket: Socket) => {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("callOffer", { matchId, callerId: userId, offer, callType });
  };

  const startTimer = () => {
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
    setTimeout(() => router.push(`/chat/${matchId}`), 1500);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-between relative overflow-hidden">
      {/* Remote video (full screen) */}
      {callType === "video" && (
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Dark overlay for audio calls */}
      {callType === "audio" && (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
      )}

      {/* Overlay content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-between h-screen p-8">
        {/* Status bar */}
        <div className="text-center mt-8">
          <h2 className="text-white text-xl font-bold">
            {callType === "video" ? "Video Call" : "Audio Call"}
          </h2>
          <p className="text-white/60 mt-1">
            {callStatus === "calling" && (isIncoming ? "Incoming call..." : "Calling...")}
            {callStatus === "connected" && formatDuration(duration)}
            {callStatus === "ended" && "Call ended"}
          </p>
          {callStatus === "calling" && (
            <div className="flex justify-center gap-1 mt-3">
              {[0, 150, 300].map((d) => (
                <div key={d} className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          )}
        </div>

        {/* Local video (PiP) */}
        {callType === "video" && (
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="self-end w-28 h-40 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
          />
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <button
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isMuted ? "bg-red-500" : "bg-white/20 hover:bg-white/30"
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>

          {callType === "video" && (
            <button
              onClick={toggleCamera}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isCamOff ? "bg-red-500" : "bg-white/20 hover:bg-white/30"
              }`}
            >
              {isCamOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
            </button>
          )}

          <button
            onClick={endCall}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-xl active:scale-95"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
