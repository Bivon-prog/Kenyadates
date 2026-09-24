"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { io } from 'socket.io-client';
import { Heart, MessageCircle, User, Home, Compass, Send, Phone, Video, MoreVertical, Search, ArrowLeft, Smile, Paperclip, Mic, Shield, Globe, Gift, Image } from "lucide-react";

const CONVERSATIONS = [
  { id: 1, name: "Amina", emoji: "👩🏾", online: true, lastMsg: "That sounds amazing! When are you free?", time: "2m", unread: 2, verified: true },
  { id: 2, name: "Grace", emoji: "👩🏿", online: true, lastMsg: "Haha yes! Kisumu has the best fish 🐟", time: "15m", unread: 0, verified: true },
  { id: 3, name: "Fatuma", emoji: "👩🏾", online: false, lastMsg: "I loved your photos! Very creative ✨", time: "1h", unread: 1, verified: true },
  { id: 4, name: "Kevin", emoji: "👨🏽", online: true, lastMsg: "Are you into hiking? There's a great trail near Ngong Hills", time: "3h", unread: 0, verified: false },
  { id: 5, name: "Cynthia", emoji: "👩🏽", online: false, lastMsg: "Thank you for the gift! 🌹", time: "1d", unread: 0, verified: true },
];

const MOCK_MESSAGES = [
  { id: 1, from: "them", text: "Hey! I saw your profile and I love that you're into travel too! 😊", time: "10:30 AM" },
  { id: 2, from: "me", text: "Hi Amina! Yes, I've been to 12 countries so far 🌍 Which is your favorite destination?", time: "10:32 AM" },
  { id: 3, from: "them", text: "Oh wow! Mine has to be Zanzibar — the beaches there are just 😍", time: "10:33 AM" },
  { id: 4, from: "me", text: "Zanzibar is incredible! The food, the culture... Stone Town is just magical", time: "10:35 AM" },
  { id: 5, from: "them", text: "Exactly! We should plan a trip there together sometime 😄", time: "10:36 AM" },
  { id: 6, from: "me", text: "Ha! I'd be up for that. Maybe after we get to know each other a bit more? 😊", time: "10:37 AM" },
  { id: 7, from: "them", text: "That sounds amazing! When are you free to chat more?", time: "10:38 AM" },
];

const QUICK_MESSAGES = ["👋 Hey there!", "😊 You seem interesting!", "☕ Coffee sometime?", "🌟 Love your profile!", "💬 Let's chat more!"];

function Sidebar({ active }: { active: string }) {
  const navItems = [
    { icon: Home, label: "Home", href: "/app" },
    { icon: Compass, label: "Explore", href: "/app/explore" },
    { icon: Heart, label: "Favorites", href: "/app/favorites" },
    { icon: MessageCircle, label: "Chat", href: "/app/chat" },
    { icon: User, label: "Me", href: "/app/me" },
  ];
  return (
    <aside style={{ width: 240, background: "var(--bg-surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, padding: "24px 16px" }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 36, padding: "0 8px" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Heart size={18} fill="white" color="white" />
        </div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>
          Kenya<span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>dates</span>
        </span>
      </Link>
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        {navItems.map(item => {
          const isActive = active === item.label;
          return (
            <Link key={item.label} href={item.href} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: "var(--radius-md)",
              textDecoration: "none", transition: "all 0.2s",
              background: isActive ? "rgba(232,51,109,0.1)" : "transparent",
              color: isActive ? "var(--accent-secondary)" : "var(--text-secondary)",
              fontWeight: isActive ? 700 : 500, fontSize: 15
            }}>
              <item.icon size={20} color={isActive ? "var(--accent-primary)" : "var(--text-secondary)"} />
              {item.label}
              {item.label === "Chat" && <span style={{ marginLeft: "auto", background: "var(--gradient-primary)", borderRadius: "var(--radius-full)", fontSize: 11, fontWeight: 700, padding: "2px 7px" }}>3</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default function ChatPage() {
  const [activeConvo, setActiveConvo] = useState(CONVERSATIONS[0]);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [showTranslate, setShowTranslate] = useState(false);
  const [showQuick, setShowQuick] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000/chat');

    socketRef.current.on('connect', () => {
      console.log('Connected to chat server');
    });

    socketRef.current.on('newMessage', (msg: any) => {
      // Map received message to our UI structure
      const newMsg = {
        id: msg.id || Date.now(),
        from: msg.senderId === 'me' ? 'me' : 'them',
        text: msg.content,
        time: "Now"
      };
      setMessages(prev => [...prev, newMsg as any]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Join room when active conversation changes
    if (socketRef.current && activeConvo) {
      // Create a mock matchId based on active convo
      const matchId = `match_${activeConvo.id}`;
      socketRef.current.emit('joinRoom', { matchId });
    }
  }, [activeConvo]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const msgData = {
      matchId: `match_${activeConvo.id}`,
      senderId: 'me', // Mocking my senderId
      content: input,
    };
    
    // Optimistic UI update can be done here or handled by newMessage event
    // Let's add it optimistically and rely on backend for others
    // Actually the backend emits back to the room, so we'll receive it via 'newMessage'
    // But since we just want it to work instantly on UI:
    setMessages(prev => [...prev, { id: Date.now(), from: "me", text: input, time: "Now" }]);
    
    socketRef.current?.emit('sendMessage', msgData);
    
    setInput("");
    setShowQuick(false);
  };

  return (
    <div style={{ display: "flex", background: "var(--bg-primary)", height: "100vh", overflow: "hidden" }}>
      <Sidebar active="Chat" />

      {/* Conversations List */}
      <div style={{ width: 320, background: "var(--bg-surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>Messages</h2>
          <div style={{ position: "relative" }}>
            <Search size={15} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input className="input" placeholder="Search conversations..." style={{ paddingLeft: 36, fontSize: 13 }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {CONVERSATIONS.map(c => (
            <div key={c.id} onClick={() => setActiveConvo(c)} style={{
              padding: "14px 16px", cursor: "pointer", display: "flex", gap: 12, alignItems: "center",
              borderBottom: "1px solid var(--border)", transition: "background 0.2s",
              background: activeConvo.id === c.id ? "rgba(232,51,109,0.08)" : "transparent"
            }}
              onMouseEnter={e => { if (activeConvo.id !== c.id) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
              onMouseLeave={e => { if (activeConvo.id !== c.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{c.emoji}</div>
                {c.online && <div style={{ position: "absolute", bottom: 1, right: 1, width: 12, height: 12, background: "var(--success)", borderRadius: "50%", border: "2px solid var(--bg-surface)" }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{c.name} {c.verified && "✅"}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{c.time}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.lastMsg}</div>
              </div>
              {c.unread > 0 && <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{c.unread}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Chat header */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{activeConvo.emoji}</div>
            {activeConvo.online && <div style={{ position: "absolute", bottom: 1, right: 1, width: 11, height: 11, background: "var(--success)", borderRadius: "50%", border: "2px solid var(--bg-surface)" }} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}>
              {activeConvo.name} {activeConvo.verified && <Shield size={13} color="var(--success)" />}
            </div>
            <div style={{ fontSize: 12, color: activeConvo.online ? "var(--success)" : "var(--text-muted)" }}>
              {activeConvo.online ? "Online now" : "Last seen recently"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowTranslate(!showTranslate)} style={{ width: 38, height: 38, borderRadius: "50%", background: showTranslate ? "rgba(232,51,109,0.2)" : "var(--bg-card)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Translate">
              <Globe size={16} color={showTranslate ? "var(--accent-primary)" : "var(--text-secondary)"} />
            </button>
            <button style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Phone size={16} color="var(--text-secondary)" />
            </button>
            <button style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Video size={16} color="var(--text-secondary)" />
            </button>
            <button style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MoreVertical size={16} color="var(--text-secondary)" />
            </button>
          </div>
        </div>

        {/* Translation bar */}
        {showTranslate && (
          <div className="glass-accent" style={{ padding: "10px 24px", display: "flex", alignItems: "center", gap: 10 }}>
            <Globe size={14} color="var(--accent-primary)" />
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Auto-translating from</span>
            <span className="badge badge-pink" style={{ fontSize: 11 }}>Swahili</span>
            <span style={{ color: "var(--text-muted)" }}>→</span>
            <span className="badge badge-pink" style={{ fontSize: 11 }}>English</span>
            <button style={{ marginLeft: "auto", fontSize: 12, color: "var(--accent-secondary)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>See Original</button>
          </div>
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map(m => (
            <div key={m.id} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start", gap: 8 }}>
              {m.from === "them" && (
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, alignSelf: "flex-end" }}>{activeConvo.emoji}</div>
              )}
              <div>
                <div style={{
                  padding: "12px 16px", borderRadius: m.from === "me" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                  background: m.from === "me" ? "var(--gradient-primary)" : "var(--bg-surface)",
                  maxWidth: 380, lineHeight: 1.6, fontSize: 14
                }}>{m.text}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, textAlign: m.from === "me" ? "right" : "left" }}>{m.time} {m.from === "me" && "✓✓"}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick messages */}
        {showQuick && (
          <div style={{ padding: "12px 24px", display: "flex", gap: 8, overflowX: "auto", borderTop: "1px solid var(--border)" }}>
            {QUICK_MESSAGES.map(q => (
              <button key={q} onClick={() => { setInput(q); setShowQuick(false); }} style={{
                padding: "8px 14px", borderRadius: "var(--radius-full)", border: "1px solid var(--border-accent)", cursor: "pointer",
                background: "rgba(232,51,109,0.08)", color: "var(--accent-secondary)", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap"
              }}>{q}</button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", display: "flex", gap: 10, alignItems: "flex-end" }}>
          <button onClick={() => setShowQuick(!showQuick)} style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Smile size={18} color="var(--text-secondary)" />
          </button>
          <button style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Gift size={18} color="var(--accent-gold)" />
          </button>
          <div style={{ flex: 1, position: "relative" }}>
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Type a message..." rows={1}
              style={{ width: "100%", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", color: "white", fontSize: 14, padding: "10px 44px 10px 16px", resize: "none", outline: "none", fontFamily: "Inter, sans-serif", lineHeight: 1.5 }} />
            <button style={{ position: "absolute", right: 10, bottom: 8, background: "none", border: "none", cursor: "pointer" }}>
              <Mic size={18} color="var(--text-muted)" />
            </button>
          </div>
          <button onClick={sendMessage} style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--gradient-primary)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}>
            <Send size={18} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
