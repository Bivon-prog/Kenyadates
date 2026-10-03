"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Phone, Video, Mic, Send, Globe } from "lucide-react";
import { io, Socket } from "socket.io-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const BRAND = "#E8336D";
const BRAND2 = "#FF6B9D";

interface Message {
  id: string;
  senderId: string;
  content: string;
  translatedText?: string;
  isRead: boolean;
  createdAt: string;
}

// Avatar for gradient placeholders
function Avatar({ photos, name, size = 40 }: { photos?: string[]; name?: string; size?: number }) {
  const photo = photos?.[0] ?? "";
  if (photo.startsWith("gradient:")) {
    return (
      <div
        className={`rounded-full bg-gradient-to-br ${photo.replace("gradient:", "")} flex items-center justify-center font-bold text-white flex-shrink-0`}
        style={{ width: size, height: size, fontSize: size * 0.38 }}
      >
        {name?.[0]?.toUpperCase() ?? "?"}
      </div>
    );
  }
  return (
    <img
      src={photo || `https://ui-avatars.com/api/?name=${name}&background=E8336D&color=fff`}
      className="rounded-full object-cover flex-shrink-0"
      style={{ width: size, height: size }}
      alt={name}
    />
  );
}

// Mock messages for when API is unavailable
const MOCK_MESSAGES: Message[] = [
  { id: "1", senderId: "other", content: "Hey! I saw your profile and I think we have a lot in common 😊", translatedText: "Habari! Nimeona wasifu wako na nafikiri tuna mambo mengi yanayofanana 😊", isRead: true, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "2", senderId: "me", content: "Hi! Thanks, I thought the same thing. You mentioned you love hiking?", translatedText: null as any, isRead: true, createdAt: new Date(Date.now() - 3500000).toISOString() },
  { id: "3", senderId: "other", content: "Yes! I go to Ngong Hills almost every weekend. Do you hike?", translatedText: "Ndiyo! Huenda Ngong Hills karibu kila wikendi. Je, unaenda milimani?", isRead: true, createdAt: new Date(Date.now() - 3400000).toISOString() },
  { id: "4", senderId: "me", content: "I've been to Ngong once, it's beautiful! I prefer Karura Forest though 🌿", translatedText: null as any, isRead: true, createdAt: new Date(Date.now() - 60000).toISOString() },
];

export default function ChatPage() {
  const { matchId } = useParams() as { matchId: string };
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [myId] = useState("me"); // In real app from AuthContext
  const [otherTyping, setOtherTyping] = useState(false);
  const [showTranslation, setShowTranslation] = useState<Record<string, boolean>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [matchInfo, setMatchInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<BlobPart[]>([]);

  const token = typeof window !== "undefined" ? localStorage.getItem("kd_token") || "" : "";

  useEffect(() => {
    loadMessages();
    loadMatchInfo();
    connectSocket();
    return () => { socketRef.current?.disconnect(); };
  }, [matchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const connectSocket = () => {
    try {
      const socket = io(`${API}`, { query: { userId: myId }, transports: ["websocket"] });
      socketRef.current = socket;
      socket.on("connect", () => {
        socket.emit("joinRoom", { matchId });
        socket.emit("markRead", { matchId, userId: myId });
      });
      socket.on("newMessage", (msg: Message) => {
        setMessages(prev => [...prev, msg]);
        socket.emit("markRead", { matchId, userId: myId });
      });
      socket.on("typing", ({ userId: uid, isTyping }: { userId: string; isTyping: boolean }) => {
        if (uid !== myId) setOtherTyping(isTyping);
      });
    } catch { /* socket optional */ }
  };

  const loadMessages = async () => {
    try {
      const res = await fetch(`${API}/chat/messages/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.length ? data : MOCK_MESSAGES);
      } else {
        setMessages(MOCK_MESSAGES);
      }
    } catch {
      setMessages(MOCK_MESSAGES);
    }
    setLoading(false);
  };

  const loadMatchInfo = async () => {
    try {
      const res = await fetch(`${API}/chat/matches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const matches = await res.json();
        setMatchInfo(matches.find((m: any) => m.id === matchId));
      }
    } catch { /* ignore */ }
  };

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    // Optimistically add to UI
    const optimistic: Message = {
      id: Date.now().toString(),
      senderId: myId,
      content: text,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);
    setInput("");
    socketRef.current?.emit("sendMessage", { matchId, senderId: myId, content: text });
    socketRef.current?.emit("typing", { matchId, userId: myId, isTyping: false });
  }, [input, myId, matchId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    socketRef.current?.emit("typing", { matchId, userId: myId, isTyping: true });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("typing", { matchId, userId: myId, isTyping: false });
    }, 2000);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunks.current = [];
      recorder.ondataavailable = e => audioChunks.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", blob, "voice.webm");
        try {
          const res = await fetch(`${API}/users/upload-voice`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
          if (res.ok) {
            const { url } = await res.json();
            socketRef.current?.emit("sendMessage", { matchId, senderId: myId, content: `[VOICE:${url}]` });
          }
        } catch { /* ignore */ }
      };
      recorder.start();
      setIsRecording(true);
    } catch { alert("Microphone access denied."); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const otherProfile = matchInfo
    ? (matchInfo.user1?.id === myId ? matchInfo.user2 : matchInfo.user1)?.profile
    : null;

  // Fallback name/photo for mock
  const displayName = otherProfile?.displayName ?? "Amina";
  const displayPhotos = otherProfile?.photos ?? ["gradient:from-pink-500 to-rose-500"];

  return (
    <div className="flex flex-col bg-[#0D0D0D] h-[100dvh]">

      {/* ── Header ── */}
      <div className="flex-shrink-0 bg-[#0D0D10]/95 backdrop-blur-md border-b border-white/8 flex items-center gap-3 px-4 py-3 md:px-6">
        <button
          onClick={() => router.push("/matches")}
          className="w-8 h-8 rounded-full bg-white/6 flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-white/60" />
        </button>

        <div className="relative flex-shrink-0">
          <Avatar photos={displayPhotos} name={displayName} size={38} />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#0D0D0D] rounded-full" />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-white text-sm truncate">{displayName}</h2>
          {otherTyping ? (
            <p className="text-xs animate-pulse" style={{ color: BRAND }}>typing…</p>
          ) : (
            <p className="text-xs text-green-400">● Online now</p>
          )}
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => router.push(`/call/${matchId}?type=audio`)}
            className="w-9 h-9 rounded-full bg-white/6 hover:bg-green-500/15 flex items-center justify-center transition-colors"
          >
            <Phone className="w-4 h-4 text-white/60 hover:text-green-400" />
          </button>
          <button
            onClick={() => router.push(`/call/${matchId}?type=video`)}
            className="w-9 h-9 rounded-full bg-white/6 hover:bg-blue-500/15 flex items-center justify-center transition-colors"
          >
            <Video className="w-4 h-4 text-white/60 hover:text-blue-400" />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 md:px-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-[#E8336D] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          messages.map(msg => {
            const isMine = msg.senderId === myId;
            const isVoice = msg.content.startsWith("[VOICE:");
            const voiceUrl = isVoice ? msg.content.slice(7, -1) : null;

            return (
              <div key={msg.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[78%] md:max-w-[60%] px-4 py-2.5 rounded-2xl ${
                    isMine ? "rounded-br-sm" : "rounded-bl-sm bg-white/8"
                  }`}
                  style={isMine ? { background: `linear-gradient(135deg, ${BRAND}, ${BRAND2})` } : {}}
                >
                  {isVoice && voiceUrl ? (
                    <audio controls src={voiceUrl} className="max-w-[200px] h-8" />
                  ) : (
                    <p className="text-sm leading-relaxed text-white">{msg.content}</p>
                  )}
                </div>

                {/* Translation */}
                {!isVoice && msg.translatedText && (
                  <button
                    onClick={() => setShowTranslation(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                    className="flex items-center gap-1 mt-0.5 text-[11px] text-white/30 hover:text-white/60 transition-colors"
                  >
                    <Globe size={10} />
                    {showTranslation[msg.id] ? msg.translatedText : "Show Swahili"}
                  </button>
                )}

                <span className="text-[10px] text-white/25 mt-0.5">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          })
        )}

        {/* Typing dots */}
        {otherTyping && (
          <div className="flex items-start">
            <div className="bg-white/8 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 150, 300].map(d => (
                  <span key={d} className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar ── */}
      <div className="flex-shrink-0 bg-[#0D0D10]/95 backdrop-blur-md border-t border-white/8 px-4 py-3 md:px-6 flex items-center gap-2.5 safe-area-pb">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isRecording ? "bg-red-500 scale-110" : "bg-white/8 hover:bg-white/15"
          }`}
        >
          <Mic className={`w-4 h-4 ${isRecording ? "text-white animate-pulse" : "text-white/50"}`} />
        </button>

        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Message in English or Kiswahili…"
          className="flex-1 bg-white/6 border border-white/8 text-white placeholder-white/30 rounded-full px-4 py-2.5 text-sm focus:outline-none transition-colors"
          style={{ focusBorderColor: BRAND } as any}
          onFocus={e => e.currentTarget.style.borderColor = `${BRAND}60`}
          onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
        />

        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30 hover:opacity-90 active:scale-95"
          style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND2})` }}
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
