"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Heart, Search, Phone, Video, Send, Shield, MapPin, Sparkles } from "lucide-react";
import { getProfileAvatar } from "@/lib/avatar";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Match {
  id: string;
  user1: { id: string; profile: { displayName: string; photos: string[]; city: string; bio?: string } | null };
  user2: { id: string; profile: { displayName: string; photos: string[]; city: string; bio?: string } | null };
  messages: { content: string; createdAt: string; senderId?: string }[];
}

const MOCK: Match[] = [
  { id:"m1", user1:{id:"me",profile:null}, user2:{id:"u1",profile:{displayName:"Amina",  photos:[],city:"Nairobi", bio:"Coffee lover, dancer & tech enthusiast ☕️✨"}}, messages:[{content:"Hey! How is your week going?", createdAt:new Date(Date.now()-120000).toISOString()}] },
  { id:"m2", user1:{id:"me",profile:null}, user2:{id:"u2",profile:{displayName:"Wanjiru", photos:[],city:"Mombasa", bio:"Beach sunsets & seafood 🌊🦀"}}, messages:[{content:"Would love to catch up over coffee sometime!", createdAt:new Date(Date.now()-3600000*3).toISOString()}] },
  { id:"m3", user1:{id:"me",profile:null}, user2:{id:"u3",profile:{displayName:"Fatuma",  photos:[],city:"Kisumu",  bio:"Architectural designer 🌿"}}, messages:[] },
  { id:"m4", user1:{id:"me",profile:null}, user2:{id:"u4",profile:{displayName:"Njeri",   photos:[],city:"Nakuru",  bio:"Hiking & wildlife photography 📸"}}, messages:[{content:"That sounds amazing! Let's plan it.", createdAt:new Date(Date.now()-86400000).toISOString()}] },
];

export default function MatchesPage() {
  const router = useRouter();
  const [matches,      setMatches]      = useState<Match[]>([]);
  const [selectedMatch,setSelectedMatch] = useState<Match | null>(null);
  const [chatMessage,  setChatMessage]  = useState("");
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const myId = "me";

  useEffect(() => {
    const token = localStorage.getItem("kd_token");
    fetch(`${API}/chat/matches`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(d => {
        const list = Array.isArray(d) && d.length ? d : MOCK;
        setMatches(list);
        if (list.length > 0) setSelectedMatch(list[0]);
      })
      .catch(() => {
        setMatches(MOCK);
        setSelectedMatch(MOCK[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getOther = (m: Match) => m.user1.id === myId ? m.user2 : m.user1;
  const fmt = (iso: string) => {
    const d = Date.now() - new Date(iso).getTime();
    if (d < 60000)    return "just now";
    if (d < 3600000)  return `${Math.floor(d/60000)}m ago`;
    if (d < 86400000) return `${Math.floor(d/3600000)}h ago`;
    return new Date(iso).toLocaleDateString("en-KE", { day:"numeric", month:"short" });
  };

  const filtered = matches.filter(m => {
    const p = getOther(m).profile;
    return !search || p?.displayName?.toLowerCase().includes(search.toLowerCase());
  });

  const newM  = filtered.filter(m => m.messages.length === 0);
  const convs = filtered.filter(m => m.messages.length > 0);

  const activeOther = selectedMatch ? getOther(selectedMatch) : null;
  const activeProfile = activeOther?.profile;

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedMatch) return;
    const newMsg = { content: chatMessage, createdAt: new Date().toISOString(), senderId: myId };
    setSelectedMatch(prev => prev ? ({ ...prev, messages: [newMsg, ...prev.messages] }) : null);
    setMatches(prev => prev.map(m => m.id === selectedMatch.id ? ({ ...m, messages: [newMsg, ...m.messages] }) : m));
    setChatMessage("");
  };

  return (
    <div className="min-h-screen bg-[#0D0D12] text-white page-pb">

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-6 border-b border-white/10 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Messages & Matches</h1>
          <p className="text-white/60 text-base mt-1">Connect with verified singles who matched with you</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#E8336D] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-8 bg-[#14141F] border border-white/10 rounded-3xl p-8">
            <Heart className="w-16 h-16 text-[#E8336D] mb-4 animate-bounce" />
            <h3 className="text-2xl font-extrabold text-white mb-2">No matches yet</h3>
            <p className="text-white/60 text-base mb-6">Keep swiping on Discover to find your match!</p>
            <button onClick={() => router.push("/discover")} className="px-8 py-3.5 rounded-full text-white text-base font-extrabold bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] shadow-lg">Start Swiping</button>
          </div>
        ) : (
          /* Desktop Split View: Left Column (Matches List), Right Column (Chat Pane) */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Search & Conversation List */}
            <div className="md:col-span-5 bg-[#14141F] border border-white/10 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search matches by name…"
                  className="w-full bg-[#1C1C2A] border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder:text-white/40 text-sm font-medium outline-none focus:border-[#E8336D] transition-colors"
                />
              </div>

              {/* New Matches Row */}
              {newM.length > 0 && (
                <div>
                  <h2 className="text-xs font-black text-white/50 uppercase tracking-wider mb-3">New Matches ({newM.length})</h2>
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {newM.map((m, idx) => {
                      const p = getOther(m).profile;
                      const photoUrl = getProfileAvatar(p?.photos?.[0], p?.displayName, idx);
                      return (
                        <button key={m.id} onClick={() => { setSelectedMatch(m); }} className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
                          <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#E8336D] to-[#FF6B9D] shadow-md group-hover:scale-105 transition-transform">
                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#14141F] bg-[#1E1E2E]">
                              <img src={photoUrl} className="w-full h-full object-cover" alt={p?.displayName} />
                            </div>
                          </div>
                          <span className="text-xs font-bold text-white/80 max-w-[64px] truncate">{p?.displayName??"User"}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Active Conversations List */}
              <div>
                <h2 className="text-xs font-black text-white/50 uppercase tracking-wider mb-3">Conversations</h2>
                <div className="space-y-2 divide-y divide-white/5">
                  {convs.map((m, idx) => {
                    const other = getOther(m);
                    const p = other.profile;
                    const last = m.messages[0];
                    const isSelected = selectedMatch?.id === m.id;
                    const photoUrl = getProfileAvatar(p?.photos?.[0], p?.displayName, idx);

                    return (
                      <button key={m.id} onClick={() => setSelectedMatch(m)}
                        className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all text-left ${
                          isSelected ? "bg-[#E8336D]/15 border border-[#E8336D]/40 shadow-md" : "hover:bg-white/5 border border-transparent"
                        }`}>
                        <div className="relative flex-shrink-0">
                          <img src={photoUrl} className="w-13 h-13 rounded-full object-cover border border-white/10" style={{ width: 52, height: 52 }} alt={p?.displayName} />
                          <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#14141F] rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-extrabold text-white text-base truncate">{p?.displayName??"User"}</span>
                            {last && <span className="text-[11px] text-white/40 flex-shrink-0 ml-2">{fmt(last.createdAt)}</span>}
                          </div>
                          <p className="text-xs text-white/60 truncate font-medium">{last?.content || "Say hello 👋"}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Desktop Chat Pane */}
            <div className="md:col-span-7 bg-[#14141F] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col min-h-[560px]">
              {selectedMatch && activeProfile ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-3.5">
                      <img src={getProfileAvatar(activeProfile.photos?.[0], activeProfile.displayName, 0)} className="w-12 h-12 rounded-full object-cover border border-white/20 shadow-md" alt={activeProfile.displayName} />
                      <div>
                        <h3 className="text-lg font-extrabold text-white flex items-center gap-1.5">
                          {activeProfile.displayName}
                          <Shield className="w-4 h-4 text-blue-400 fill-blue-400/20" />
                        </h3>
                        <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Active now · {activeProfile.city}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => router.push(`/call/${selectedMatch.id}`)} className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10" title="Audio Call">
                        <Phone size={18} />
                      </button>
                      <button onClick={() => router.push(`/call/${selectedMatch.id}`)} className="p-2.5 rounded-full bg-[#E8336D]/20 hover:bg-[#E8336D] text-white transition-colors border border-[#E8336D]/40" title="Video Call">
                        <Video size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Messages Bubble Area */}
                  <div className="flex-1 space-y-4 overflow-y-auto max-h-[360px] p-2 pr-4 scrollbar-hide">
                    <div className="text-center py-4">
                      <span className="px-4 py-1.5 rounded-full bg-white/5 text-white/50 text-xs font-semibold border border-white/10">
                        You matched with {activeProfile.displayName}! Say hi 💬
                      </span>
                    </div>

                    {[...(selectedMatch.messages || [])].reverse().map((msg, i) => {
                      const isMe = msg.senderId === myId;
                      return (
                        <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-md ${
                            isMe ? "bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] text-white rounded-br-none" : "bg-[#1C1C2A] text-white/90 border border-white/10 rounded-bl-none"
                          }`}>
                            <p>{msg.content}</p>
                            <span className="text-[10px] opacity-60 block mt-1 text-right">{fmt(msg.createdAt)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Message Input Box */}
                  <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                    <input
                      value={chatMessage}
                      onChange={e => setChatMessage(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleSendMessage(); }}
                      placeholder={`Message ${activeProfile.displayName}…`}
                      className="flex-1 bg-[#1C1C2A] border border-white/10 rounded-2xl px-5 py-3 text-white placeholder:text-white/40 text-sm font-medium outline-none focus:border-[#E8336D] transition-colors"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] text-white font-extrabold text-sm flex items-center gap-2 shadow-lg hover:opacity-95 transition-opacity active:scale-95"
                    >
                      <Send size={16} /> Send
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <Sparkles className="w-12 h-12 text-[#E8336D] mb-3" />
                  <h3 className="text-xl font-bold text-white mb-1">Select a match</h3>
                  <p className="text-white/50 text-sm">Choose a conversation from the left to start messaging.</p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
