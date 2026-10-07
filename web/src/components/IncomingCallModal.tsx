"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Phone, PhoneOff, Video } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { getProfileAvatar } from "@/lib/avatar";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface IncomingCallData {
  matchId: string;
  callerId: string;
  callerName?: string;
  callerPhoto?: string;
  callType: "audio" | "video";
  offer?: any;
}

export default function IncomingCallModal() {
  const router = useRouter();
  const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("kd_token");
    if (!token) return;

    let userId = "";
    try {
      const u = JSON.parse(localStorage.getItem("kd_user") ?? "{}");
      userId = u.id || "me";
    } catch {
      userId = "me";
    }

    const socket = io(`${API}/chat`, {
      query: { userId },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      // Listen for incoming call notifications
    });

    socket.on("incomingCall", (data: IncomingCallData) => {
      if (data.callerId !== userId) {
        setIncomingCall(data);
      }
    });

    socket.on("callOffer", (data: IncomingCallData) => {
      if (data.callerId !== userId) {
        setIncomingCall(data);
      }
    });

    socket.on("callEnd", () => {
      setIncomingCall(null);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleAccept = () => {
    if (!incomingCall) return;
    const { matchId, callType } = incomingCall;
    setIncomingCall(null);
    router.push(`/call/${matchId}?type=${callType}&incoming=1`);
  };

  const handleDecline = () => {
    if (!incomingCall) return;
    socketRef.current?.emit("callEnd", { matchId: incomingCall.matchId, userId: "me" });
    setIncomingCall(null);
  };

  if (!incomingCall) return null;

  const callerPhoto = getProfileAvatar(incomingCall.callerPhoto, incomingCall.callerName ?? "Match", 0);
  const callerName = incomingCall.callerName ?? "Incoming Match";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
      <div className="rounded-3xl p-8 max-w-sm w-full bg-[#14141F] border border-white/20 shadow-2xl text-center flex flex-col items-center">
        
        {/* Pulsing ring animation */}
        <div className="relative mb-6">
          <span className="absolute inset-0 rounded-full bg-[#E8336D] animate-ping opacity-75" />
          <div className="w-28 h-28 rounded-full border-4 border-[#E8336D] overflow-hidden shadow-2xl relative bg-[#1E1E2E]">
            <img src={callerPhoto} className="w-full h-full object-cover" alt={callerName} />
          </div>
        </div>

        <h3 className="text-2xl font-black text-white mb-1">{callerName}</h3>
        <p className="text-white/60 text-sm font-semibold flex items-center justify-center gap-2 mb-8">
          {incomingCall.callType === "video" ? (
            <>
              <Video className="w-4 h-4 text-[#E8336D]" /> Incoming Video Call…
            </>
          ) : (
            <>
              <Phone className="w-4 h-4 text-emerald-400" /> Incoming Audio Call…
            </>
          )}
        </p>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-6 w-full">
          {/* Decline */}
          <button
            onClick={handleDecline}
            className="flex-1 py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
          >
            <PhoneOff className="w-5 h-5" /> Decline
          </button>

          {/* Accept */}
          <button
            onClick={handleAccept}
            className="flex-1 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
          >
            {incomingCall.callType === "video" ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />} Accept
          </button>
        </div>

      </div>
    </div>
  );
}
