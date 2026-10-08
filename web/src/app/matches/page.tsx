"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Heart, Search, Phone, Video, Send, Shield, Sparkles } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Match {
  id: string;
  user1: { id: string; profile: { displayName: string; photos: string[]; city: string; bio?: string } | null };
  user2: { id: string; profile: { displayName: string; photos: string[]; city: string; bio?: string } | null };
  messages: { content: string; createdAt: string; senderId?: string }[];
}

// Mock — all messages from the other person (no senderId = received)
const MOCK: Match[] = [
  { id:"m1", user1:{id:"me",profile:null}, user2:{id:"u1",profile:{displayName:"Amina",   photos:[],city:"Nairobi", bio:"Coffee lover & dancer ☕✨"}},   messages:[{content:"Hey! How is your week going?",                    createdAt:new Date(Date.now()-120000).toISOString(),  senderId:"u1"}] },
  { id:"m2", user1:{id:"me",profile:null}, user2:{id:"u2",profile:{displayName:"Wanjiru",  photos:[],city:"Mombasa", bio:"Beach sunsets & seafood 🌊🦀"}},  messages:[{content:"Would love to catch up over coffee sometime!",    createdAt:new Date(Date.now()-3600000*3).toISOString(),senderId:"u2"}] },
  { id:"m3", user1:{id:"me",profile:null}, user2:{id:"u3",profile:{displayName:"Fatuma",   photos:[],city:"Kisumu",  bio:"Architectural designer 🌿"}},      messages:[] },
  { id:"m4", user1:{id:"me",profile:null}, user2:{id:"u4",profile:{displayName:"Njeri",    photos:[],city:"Nakuru",  bio:"Hiking & wildlife photography 📸"}},messages:[{content:"That sounds amazing! Let's plan it.",            createdAt:new Date(Date.now()-86400000).toISOString(), senderId:"u4"}] },
];

const BG = ["bg-pink-500","bg-purple-500","bg-blue-500","bg-emerald-500","bg-amber-500"];

export default function MatchesPage() {
  const router = useRouter();
  const [matches,       setMatches]       = useState<Match[]>([]);
  const [selected,      setSelected]      = useState<Match | null>(null);
  const [msg,           setMsg]           = useState("");
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const myId = "me";

  useEffect(() => {
    const token = localStorage.getItem("kd_token");
    fetch(`${API}/chat/matches`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(d => { const list = Array.isArray(d) && d.length ? d : MOCK; setMatches(list); })
      .catch(() => setMatches(MOCK))
      .finally(() => setLoading(false));
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [selected?.messages]);

  const getOther = (m: Match) => m.user1.id === myId ? m.user2 : m.user1;

  const fmt = (iso: string) => {
    const d = Date.now() - new Date(iso).getTime();
    if (d < 60000)    return "just now";
    if (d < 3600000)  return `${Math.floor(d/60000)}m ago`;
    if (d < 86400000) return `${Math.floor(d/3600000)}h ago`;
    return new Date(iso).toLocaleDateString("en-KE", { day:"numeric", month:"short" });
  };

  const send = () => {
    if (!msg.trim() || !selected) return;
    const newMsg = { content: msg.trim(), createdAt: new Date().toISOString(), senderId: myId };
    const updated = { ...selected, messages: [...selected.messages, newMsg] };
    setSelected(updated);
    setMatches(prev => prev.map(m => m.id === selected.id ? updated : m));
    setMsg("");
    if (textareaRef.current) { textareaRef.current.style.height = "auto"; }
  };

  const filtered = matches.filter(m => {
    const p = getOther(m).profile;
    return !search || p?.displayName?.toLowerCase().includes(search.toLowerCase());
  });
  const newM  = filtered.filter(m => m.messages.length === 0);
  const convs = filtered.filter(m => m.messages.length > 0);

  const activeProfile = selected ? getOther(selected).profile : null;
  const activeIdx     = selected ? matches.findIndex(m => m.id === selected.id) : 0;

  // ── MOBILE CHAT VIEW ──────────────────────────────────────────────────────
  if (selected && activeProfile) {
    return (
      <div className="fixed inset-0 bg-[#0D0D12] text-white flex flex-col md:hidden" style={{ paddingBottom: 72 }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-[#0D0D12] flex-shrink-0">
          <button onClick={() => setSelected(null)}
            className="w-9 h-9 rounded-xl bg-white/6 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div className={`w-10 h-10 rounded-full ${BG[activeIdx % BG.length]} flex items-center justify-center text-white font-black text-base flex-shrink-0`}>
            {activeProfile.displayName[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-white text-sm flex items-center gap-1 truncate">
              {activeProfile.displayName}
              <Shield className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            </p>
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Active now · {activeProfile.city}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => router.push(`/call/${selected.id}`)} className="w-9 h-9 rounded-xl bg-white/6 flex items-center justify-center">
              <Phone size={16} />
            </button>
            <button onClick={() => router.push(`/call/${selected.id}`)} className="w-9 h-9 rounded-xl bg-[#E8336D]/20 flex items-center justify-center">
              <Video size={16} />
            </button>
          </div>
        </div>

        {/* Messages — scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <div className="text-center mb-2">
            <span className="px-3 py-1.5 rounded-full bg-white/5 text-white/45 text-xs border border-white/10">
              You matched with {activeProfile.displayName}! Say hi 💬
            </span>
          </div>

          {selected.messages.map((m, i) => {
            const isMe = m.senderId === myId;
            return (
              <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                  isMe
                    ? "bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] text-white rounded-br-sm"
                    : "bg-[#1C1C2A] text-white border border-white/10 rounded-bl-sm"
                }`}>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <span className="text-[10px] opacity-55 block mt-1 text-right">{fmt(m.createdAt)}</span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input — sits above bottom nav */}
        <div className="flex-shrink-0 flex items-end gap-2 px-4 py-3 border-t border-white/10 bg-[#0D0D12]">
          <textarea
            ref={textareaRef}
            value={msg}
            onChange={e => setMsg(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            onInput={e => {
              const t = e.currentTarget;
              t.style.height = "auto";
              t.style.height = Math.min(t.scrollHeight, 120) + "px";
            }}
            placeholder={`Message ${activeProfile.displayName}…`}
            rows={1}
            className="flex-1 bg-[#1C1C2A] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder:text-white/35 outline-none focus:border-[#E8336D] transition-colors resize-none"
            style={{ lineHeight: "1.5", minHeight: 46, maxHeight: 120 }}
          />
          <button onClick={send}
            className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] flex items-center justify-center flex-shrink-0 active:scale-95 shadow-lg">
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    );
  }

  // ── LIST VIEW (mobile) + DESKTOP SPLIT ────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0D0D12] text-white page-pb">

      {/* Header */}
      <div className="max-w-6xl mx-auto px-5 pt-6 pb-5 border-b border-white/10 mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">Messages & Matches</h1>
        <p className="text-white/50 text-sm mt-1">Connect with verified singles who matched with you</p>
      </div>

      <div className="max-w-6xl mx-auto px-5">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#E8336D] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center bg-[#14141F] border border-white/10 rounded-3xl p-8">
            <Heart className="w-16 h-16 text-[#E8336D] mb-4 animate-bounce" />
            <h3 className="text-2xl font-extrabold text-white mb-2">No matches yet</h3>
            <p className="text-white/60 mb-6">Keep swiping on Discover to find your match!</p>
            <button onClick={() => router.push("/discover")} className="px-8 py-3.5 rounded-full text-white font-extrabold bg-gradient-to-r from-[#E8336D] to-[#FF6B9D]">Start Swiping</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

            {/* Left: List */}
            <div className="md:col-span-5 bg-[#14141F] border border-white/10 rounded-3xl p-5 shadow-xl space-y-5">

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search matches by name…"
                  className="w-full bg-[#1C1C2A] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-white placeholder:text-white/40 text-sm outline-none focus:border-[#E8336D] transition-colors" />
              </div>

              {newM.length > 0 && (
                <div>
                  <h2 className="text-xs font-black text-white/50 uppercase tracking-wider mb-3">New Matches ({newM.length})</h2>
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {newM.map((m, idx) => {
                      const p = getOther(m).profile;
                      return (
                        <button key={m.id} onClick={() => setSelected(m)} className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
                          <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#E8336D] to-[#FF6B9D] group-hover:scale-105 transition-transform">
                            <div className={`w-14 h-14 rounded-full ${BG[idx % BG.length]} flex items-center justify-center text-white font-black text-xl border-2 border-[#14141F]`}>
                              {p?.displayName?.[0] ?? "?"}
                            </div>
                          </div>
                          <span className="text-xs font-bold text-white/80 max-w-[64px] truncate">{p?.displayName ?? "User"}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-xs font-black text-white/50 uppercase tracking-wider mb-3">Conversations</h2>
                <div className="space-y-1">
                  {convs.map((m, idx) => {
                    const p = getOther(m).profile;
                    const last = m.messages[m.messages.length - 1];
                    const isSelected = selected?.id === m.id;
                    return (
                      <button key={m.id} onClick={() => setSelected(m)}
                        className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl transition-all text-left ${isSelected ? "bg-[#E8336D]/15 border border-[#E8336D]/40" : "hover:bg-white/5 border border-transparent"}`}>
                        <div className="relative flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full ${BG[idx % BG.length]} flex items-center justify-center text-white font-black text-lg`}>
                            {p?.displayName?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#14141F] rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-extrabold text-white text-sm truncate">{p?.displayName ?? "User"}</span>
                            {last && <span className="text-[11px] text-white/40 ml-2 flex-shrink-0">{fmt(last.createdAt)}</span>}
                          </div>
                          <p className="text-xs text-white/55 truncate">{last?.content || "Say hello 👋"}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Desktop chat pane */}
            <div className="hidden md:flex md:col-span-7 bg-[#14141F] border border-white/10 rounded-3xl shadow-xl flex-col min-h-[560px]">
              {selected && activeProfile ? (
                <>
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${BG[activeIdx % BG.length]} flex items-center justify-center text-white font-black`}>
                        {activeProfile.displayName[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-extrabold text-white flex items-center gap-1.5">{activeProfile.displayName}<Shield className="w-4 h-4 text-blue-400" /></p>
                        <p className="text-xs text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Active now · {activeProfile.city}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => router.push(`/call/${selected.id}`)} className="p-2.5 rounded-full bg-white/5 border border-white/10"><Phone size={16} /></button>
                      <button onClick={() => router.push(`/call/${selected.id}`)} className="p-2.5 rounded-full bg-[#E8336D]/20 border border-[#E8336D]/40"><Video size={16} /></button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                    <div className="text-center mb-2">
                      <span className="px-3 py-1.5 rounded-full bg-white/5 text-white/45 text-xs border border-white/10">You matched with {activeProfile.displayName}! Say hi 💬</span>
                    </div>
                    {selected.messages.map((m, i) => {
                      const isMe = m.senderId === myId;
                      return (
                        <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${isMe ? "bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] text-white rounded-br-sm" : "bg-[#1C1C2A] text-white border border-white/10 rounded-bl-sm"}`}>
                            <p className="whitespace-pre-wrap">{m.content}</p>
                            <span className="text-[10px] opacity-55 block mt-1 text-right">{fmt(m.createdAt)}</span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>
                  <div className="flex items-end gap-2 px-5 py-4 border-t border-white/10 flex-shrink-0">
                    <textarea ref={textareaRef} value={msg} onChange={e => setMsg(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                      onInput={e => { const t = e.currentTarget; t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 120) + "px"; }}
                      placeholder={`Message ${activeProfile.displayName}…`} rows={1}
                      className="flex-1 bg-[#1C1C2A] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder:text-white/35 outline-none focus:border-[#E8336D] resize-none transition-colors"
                      style={{ lineHeight: "1.5", minHeight: 46, maxHeight: 120 }} />
                    <button onClick={send} className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] flex items-center justify-center flex-shrink-0 active:scale-95">
                      <Send size={16} className="text-white" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <Sparkles className="w-12 h-12 text-[#E8336D] mb-3" />
                  <h3 className="text-xl font-bold text-white mb-1">Select a match</h3>
                  <p className="text-white/50 text-sm">Choose a conversation to start messaging.</p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
