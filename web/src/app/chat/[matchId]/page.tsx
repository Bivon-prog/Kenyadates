"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Phone, Video, Mic, MicOff, Send, Globe } from "lucide-react";
import { io, Socket } from "socket.io-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Message {
  id: string;
  senderId: string;
  content: string;
  translatedText?: string;
  isRead: boolean;
  createdAt: string;
}

export default function ChatPage() {
  const { matchId } = useParams() as { matchId: string };
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [myId, setMyId] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [showTranslation, setShowTranslation] = useState<Record<string, boolean>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [matchInfo, setMatchInfo] = useState<any>(null);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<BlobPart[]>([]);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  useEffect(() => {
    setMyId(userId);
    loadMessages();
    loadMatchInfo();
    connectSocket();
    return () => { socketRef.current?.disconnect(); };
  }, [matchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const connectSocket = () => {
    const socket = io(`${API}/chat`, {
      query: { userId },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinRoom", { matchId });
      socket.emit("markRead", { matchId, userId });
    });

    socket.on("newMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      // Mark as read
      socket.emit("markRead", { matchId, userId });
    });

    socket.on("typing", ({ userId: uid, isTyping: typing }: { userId: string; isTyping: boolean }) => {
      if (uid !== userId) setOtherTyping(typing);
    });

    socket.on("callOffer", (payload: any) => {
      const accept = confirm(`📞 Incoming ${payload.callType === "video" ? "Video" : "Audio"} call! Accept?`);
      if (accept) {
        router.push(`/call/${matchId}?type=${payload.callType}&incoming=1`);
      }
    });
  };

  const loadMessages = async () => {
    try {
      const res = await fetch(`${API}/chat/messages/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setMessages(await res.json());
    } catch { /* ignore */ }
  };

  const loadMatchInfo = async () => {
    try {
      const res = await fetch(`${API}/chat/matches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const matches = await res.json();
        const match = matches.find((m: any) => m.id === matchId);
        setMatchInfo(match);
      }
    } catch { /* ignore */ }
  };

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;
    socketRef.current.emit("sendMessage", { matchId, senderId: userId, content: input.trim() });
    setInput("");
    // Stop typing indicator
    socketRef.current.emit("typing", { matchId, userId, isTyping: false });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!socketRef.current) return;
    socketRef.current.emit("typing", { matchId, userId, isTyping: true });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("typing", { matchId, userId, isTyping: false });
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleTranslation = (msgId: string) => {
    setShowTranslation((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunks.current = [];
      recorder.ondataavailable = (e) => audioChunks.current.push(e.data);
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
            socketRef.current?.emit("sendMessage", { matchId, senderId: userId, content: `[VOICE:${url}]` });
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

  const getOtherProfile = () => {
    if (!matchInfo) return null;
    const other = matchInfo.user1.id === userId ? matchInfo.user2 : matchInfo.user1;
    return other?.profile;
  };

  const otherProfile = getOtherProfile();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-white/10 flex items-center gap-3 px-4 py-3">
        <button onClick={() => router.push("/matches")} className="text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <img
          src={otherProfile?.photos?.[0] || "https://i.pravatar.cc/40"}
          className="w-10 h-10 rounded-full object-cover border-2 border-brand-orange/50"
          alt=""
        />
        <div className="flex-1">
          <h2 className="font-bold text-white text-sm">{otherProfile?.displayName || "Match"}</h2>
          {otherTyping ? (
            <p className="text-xs text-brand-orange animate-pulse">typing...</p>
          ) : (
            <p className="text-xs text-green-400">● Online</p>
          )}
        </div>
        <button
          onClick={() => router.push(`/call/${matchId}?type=audio`)}
          className="p-2 rounded-full bg-white/10 hover:bg-green-500/20 transition-colors text-white/70 hover:text-green-400"
        >
          <Phone className="w-4 h-4" />
        </button>
        <button
          onClick={() => router.push(`/call/${matchId}?type=video`)}
          className="p-2 rounded-full bg-white/10 hover:bg-blue-500/20 transition-colors text-white/70 hover:text-blue-400"
        >
          <Video className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          const isMine = msg.senderId === myId;
          const isVoice = msg.content.startsWith("[VOICE:");
          const voiceUrl = isVoice ? msg.content.slice(7, -1) : null;

          return (
            <div key={msg.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                  isMine
                    ? "bg-gradient-to-br from-brand-orange to-brand-peach text-white rounded-br-sm"
                    : "bg-white/10 text-white rounded-bl-sm"
                }`}
              >
                {isVoice && voiceUrl ? (
                  <audio controls src={voiceUrl} className="max-w-[180px]" />
                ) : (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}
              </div>

              {/* Translation toggle */}
              {!isVoice && msg.translatedText && (
                <button
                  onClick={() => toggleTranslation(msg.id)}
                  className="flex items-center gap-1 mt-1 text-xs text-white/40 hover:text-brand-orange transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  {showTranslation[msg.id] ? msg.translatedText : "Translate"}
                </button>
              )}

              <span className="text-xs text-white/30 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          );
        })}

        {/* Typing indicator */}
        {otherTyping && (
          <div className="flex items-start">
            <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-black/90 backdrop-blur-md border-t border-white/10 px-4 py-3 flex items-center gap-3">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`p-3 rounded-full transition-all ${isRecording ? "bg-red-500 scale-110" : "bg-white/10 hover:bg-white/20"}`}
        >
          <Mic className={`w-5 h-5 ${isRecording ? "text-white animate-pulse" : "text-white/60"}`} />
        </button>

        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message in English or Kiswahili..."
          className="flex-1 bg-white/10 border border-white/10 text-white placeholder-white/30 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-brand-orange/50 transition-colors"
        />

        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="p-3 rounded-full bg-brand-orange hover:opacity-90 disabled:opacity-30 transition-all active:scale-95"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
