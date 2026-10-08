"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, Check, Upload, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const INTERESTS = [
  "Travel ✈️", "Music 🎵", "Food 🍽️", "Sports ⚽", "Reading 📚", "Dancing 💃",
  "Movies 🎬", "Fitness 💪", "Art 🎨", "Gaming 🎮", "Cooking 👨‍🍳", "Nature 🌿",
  "Photography 📸", "Fashion 👗", "Tech 💻", "Business 📈",
];
const GOALS = [
  { id: "relationship", label: "Serious Relationship", emoji: "💍", desc: "Looking for something real and lasting" },
  { id: "casual",       label: "Casual Dating",        emoji: "😊", desc: "Keep it light, see where it goes" },
  { id: "friendship",   label: "Friendship First",     emoji: "🤝", desc: "Start as friends, maybe more" },
  { id: "marriage",     label: "Marriage",             emoji: "💒", desc: "Ready to find my life partner" },
];
const GENDERS  = ["Man", "Woman", "Non-binary", "Prefer not to say"];
const COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Nyeri", "Meru", "Thika",
  "Machakos", "Kitale", "Kericho", "Garissa", "Malindi", "Kakamega", "Kisii",
  "Embu", "Bungoma", "Migori", "Homa Bay", "Kilifi",
];
const TOTAL = 5;
const STEP_META = [
  { title: "Create your account",       sub: "Join thousands of Kenyans finding love" },
  { title: "Tell us about yourself",    sub: "This helps us find your best matches" },
  { title: "What are you looking for?", sub: "Be honest — it helps us match you better" },
  { title: "Your interests",            sub: "Pick up to 10 things you love" },
  { title: "Final touches",             sub: "Add photos and your location" },
];

export default function RegisterPage() {
  const { login } = useAuth();
  const [step,       setStep]       = useState(1);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [photos,     setPhotos]     = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [form, setForm] = useState({
    email: "", phone: "", password: "", name: "", dob: "",
    gender: "", seeking: "", goal: "", interests: [] as string[],
    city: "Nairobi", county: "Nairobi", bio: "",
  });

  const u = (k: string, v: string | string[]) => setForm(p => ({ ...p, [k]: v }));
  const getAge = (dob: string) => Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25));

  const toggleInterest = (i: string) =>
    u("interests", form.interests.includes(i)
      ? form.interests.filter(x => x !== i)
      : form.interests.length < 10 ? [...form.interests, i] : form.interests);

  const pickPhoto = (i: number, file: File) => {
    const url = URL.createObjectURL(file);
    const p = [...photos]; p[i] = url; setPhotos(p);
    const f = [...photoFiles]; f[i] = file; setPhotoFiles(f);
  };

  const removePhoto = (i: number) => {
    const p = [...photos]; p[i] = ""; setPhotos(p);
    const f = [...photoFiles]; delete f[i]; setPhotoFiles(f);
  };

  const passStrength = (len: number) => {
    if (len === 0) return null;
    if (len < 6)   return { label: "Too short", color: "#E8336D", bars: 1 };
    if (len < 10)  return { label: "Good",      color: "#f5c542", bars: 2 };
    return               { label: "Strong",     color: "#4caf82", bars: 4 };
  };

  const validate = (): string | null => {
    if (step === 1) {
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email address.";
      if (!form.password || form.password.length < 6) return "Password must be at least 6 characters.";
    }
    if (step === 2) {
      if (!form.name.trim()) return "Enter your first name.";
      if (!form.dob) return "Enter your date of birth.";
      if (getAge(form.dob) < 18) return "You must be at least 18 years old.";
      if (!form.gender) return "Select your gender.";
      if (!form.seeking) return "Select who you are looking for.";
    }
    if (step === 3 && !form.goal) return "Select what you are looking for.";
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError(""); setStep(s => s + 1);
    window.scrollTo({ top: 0 });
  };

  const register = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          ...(form.phone ? { phoneNumber: `254${form.phone.replace(/^0/, "")}` } : {}),
          password: form.password, displayName: form.name, age: getAge(form.dob),
          gender: form.gender, seeking: form.seeking, goal: form.goal,
          bio: form.bio || null, interests: form.interests,
          city: form.city, county: form.county,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed.");
      if (data.token && data.user) {
        for (const file of photoFiles.filter(Boolean)) {
          try {
            const fd = new FormData(); fd.append("file", file);
            await fetch(`${API}/users/upload-photo`, {
              method: "POST", headers: { Authorization: `Bearer ${data.token}` }, body: fd,
            });
          } catch {}
        }
        login(data.token, data.user);
        return;
      }
      setError("Account created. Please sign in.");
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  const strength = passStrength(form.password.length);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D0D0D",
      display: "flex",
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* ── LEFT BRAND PANEL ── */}
      <div style={{
        display: "none",
        width: "420px",
        minWidth: "420px",
        background: "#111",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 44px",
        position: "relative",
        overflow: "hidden",
      }} className="register-left-panel">

        {/* glow blobs */}
        <div style={{
          position: "absolute", top: -120, left: -120,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,51,109,0.1) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -80, right: -80,
          width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,51,109,0.06) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: "white", fontFamily: "'Playfair Display', serif" }}>
            Kenya<span style={{ color: "#E8336D" }}>dates</span>
          </span>
        </Link>

        {/* Middle copy + steps */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: "white", lineHeight: 1.2, marginBottom: 16 }}>
            Your story starts<br />
            <span style={{ color: "#E8336D" }}>right here.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
            50,000+ verified singles across Kenya.<br />
            Real profiles, real conversations.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {STEP_META.map((s, i) => {
              const done    = i + 1 < step;
              const current = i + 1 === step;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12,
                  opacity: done ? 0.5 : current ? 1 : 0.22, transition: "opacity 0.3s" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 900,
                    background: done ? "#E8336D" : current ? "rgba(232,51,109,0.15)" : "rgba(255,255,255,0.05)",
                    border: `1.5px solid ${done || current ? "#E8336D" : "rgba(255,255,255,0.1)"}`,
                    color: done ? "white" : current ? "#E8336D" : "rgba(255,255,255,0.3)",
                  }}>
                    {done ? <Check size={12} strokeWidth={3} /> : i + 1}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: current ? "white" : "rgba(255,255,255,0.5)" }}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.18)", position: "relative", zIndex: 1 }}>
          🔒 Your data is private and never sold.
        </p>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{
          flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start",
          padding: "48px 24px",
        }}>
          <div style={{ width: "100%", maxWidth: 420 }}>

            {/* Mobile logo */}
            <div className="register-mobile-logo" style={{ marginBottom: 32 }}>
              <Link href="/" style={{ textDecoration: "none" }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: "white", fontFamily: "'Playfair Display', serif" }}>
                  Kenya<span style={{ color: "#E8336D" }}>dates</span>
                </span>
              </Link>
            </div>

            {/* Progress bar */}
            <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
              {Array.from({ length: TOTAL }).map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 3, borderRadius: 99,
                  background: i + 1 <= step ? "#E8336D" : "rgba(255,255,255,0.08)",
                  transition: "background 0.4s",
                }} />
              ))}
            </div>

            {/* Step label + heading */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#E8336D",
                textTransform: "uppercase", marginBottom: 8 }}>
                Step {step} of {TOTAL}
              </p>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "white", lineHeight: 1.2, marginBottom: 6 }}>
                {STEP_META[step - 1].title}
              </h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.38)" }}>
                {STEP_META[step - 1].sub}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                borderRadius: 16, padding: "12px 16px", marginBottom: 20,
                background: "rgba(232,65,65,0.08)", border: "1px solid rgba(232,65,65,0.2)",
                display: "flex", gap: 10, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <span style={{ fontSize: 13, color: "#ff7b7b" }}>{error}</span>
              </div>
            )}

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Field label="Email address">
                  <input type="email" placeholder="you@example.com" value={form.email}
                    onChange={e => u("email", e.target.value)} autoComplete="email"
                    style={inputSt} onFocus={focusSt} onBlur={blurSt} />
                </Field>

                <Field label="Phone" hint="optional">
                  <div style={{ ...inputSt, display: "flex", alignItems: "center", padding: 0, overflow: "hidden" }}>
                    <span style={{ padding: "0 14px", color: "rgba(255,255,255,0.32)", fontSize: 13,
                      borderRight: "1px solid rgba(255,255,255,0.07)", whiteSpace: "nowrap", height: "100%",
                      display: "flex", alignItems: "center" }}>
                      🇰🇪 +254
                    </span>
                    <input type="tel" placeholder="7XX XXX XXX" value={form.phone}
                      onChange={e => u("phone", e.target.value)} autoComplete="tel"
                      style={{ flex: 1, padding: "0 16px", background: "transparent", border: "none",
                        outline: "none", color: "white", fontSize: 15, height: "100%" }} />
                  </div>
                </Field>

                <Field label="Password">
                  <div style={{ position: "relative" }}>
                    <input type={showPass ? "text" : "password"} placeholder="At least 6 characters"
                      value={form.password} onChange={e => u("password", e.target.value)}
                      autoComplete="new-password"
                      style={{ ...inputSt, paddingRight: 48 }} onFocus={focusSt} onBlur={blurSt} />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.28)",
                        display: "flex", alignItems: "center" }}>
                      {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {strength && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
                        {[1, 2, 3, 4].map(n => (
                          <div key={n} style={{
                            flex: 1, height: 3, borderRadius: 99,
                            background: n <= strength.bars ? strength.color : "rgba(255,255,255,0.07)",
                            transition: "background 0.3s",
                          }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 12, color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                    </div>
                  )}
                </Field>

                <p style={{ fontSize: 12, textAlign: "center", color: "rgba(255,255,255,0.22)" }}>
                  By continuing you agree to our{" "}
                  <Link href="/terms" style={{ color: "#E8336D", textDecoration: "none" }}>Terms</Link>
                  {" "}&amp;{" "}
                  <Link href="/privacy" style={{ color: "#E8336D", textDecoration: "none" }}>Privacy Policy</Link>
                </p>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                <Field label="Your first name">
                  <input placeholder="e.g. Amina" value={form.name} onChange={e => u("name", e.target.value)}
                    style={inputSt} onFocus={focusSt} onBlur={blurSt} />
                </Field>

                <Field label="Date of birth">
                  <input type="date" value={form.dob} onChange={e => u("dob", e.target.value)}
                    max={new Date(Date.now() - 18 * 365.25 * 24 * 3600000).toISOString().split("T")[0]}
                    style={{ ...inputSt, colorScheme: "dark" } as React.CSSProperties}
                    onFocus={focusSt} onBlur={blurSt} />
                  {form.dob && getAge(form.dob) >= 18 && (
                    <span style={{ fontSize: 12, color: "#4caf82", fontWeight: 600, marginTop: 6, display: "block" }}>
                      ✓ {getAge(form.dob)} years old
                    </span>
                  )}
                </Field>

                <Field label="I am a">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {GENDERS.map(g => (
                      <Chip key={g} active={form.gender === g} onClick={() => u("gender", g)}>{g}</Chip>
                    ))}
                  </div>
                </Field>

                <Field label="Looking for">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {["Men", "Women", "Everyone"].map(g => (
                      <Chip key={g} active={form.seeking === g} onClick={() => u("seeking", g)}>{g}</Chip>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {GOALS.map(g => (
                  <button key={g.id} type="button" onClick={() => u("goal", g.id)} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
                    borderRadius: 18, textAlign: "left", cursor: "pointer", transition: "all 0.15s",
                    background: form.goal === g.id ? "rgba(232,51,109,0.09)" : "#161616",
                    border: `1.5px solid ${form.goal === g.id ? "#E8336D" : "rgba(255,255,255,0.07)"}`,
                  }}>
                    <span style={{ fontSize: 24, flexShrink: 0 }}>{g.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: form.goal === g.id ? "white" : "rgba(255,255,255,0.55)", marginBottom: 2 }}>
                        {g.label}
                      </p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{g.desc}</p>
                    </div>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: form.goal === g.id ? "#E8336D" : "transparent",
                      border: `1.5px solid ${form.goal === g.id ? "#E8336D" : "rgba(255,255,255,0.15)"}`,
                      transition: "all 0.15s",
                    }}>
                      {form.goal === g.id && <Check size={10} color="white" strokeWidth={3.5} />}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* ── STEP 4 ── */}
            {step === 4 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Pick up to 10</p>
                  <span style={{
                    fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 99,
                    background: form.interests.length > 0 ? "rgba(232,51,109,0.12)" : "rgba(255,255,255,0.05)",
                    color: form.interests.length > 0 ? "#E8336D" : "rgba(255,255,255,0.3)",
                  }}>
                    {form.interests.length}/10
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {INTERESTS.map(i => {
                    const active = form.interests.includes(i);
                    return (
                      <Chip key={i} active={active} onClick={() => toggleInterest(i)} pill>{i}</Chip>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── STEP 5 ── */}
            {step === 5 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                {/* Photos */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <Label>Photos</Label>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
                      {photos.filter(Boolean).length} added
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} style={{ position: "relative", aspectRatio: "3/4" }}>
                        <label style={{
                          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                          width: "100%", height: "100%", borderRadius: 16, cursor: "pointer",
                          overflow: "hidden", position: "relative",
                          background: "#161616",
                          border: `1.5px dashed ${i === 0 ? "rgba(232,51,109,0.5)" : photos[i] ? "transparent" : "rgba(255,255,255,0.09)"}`,
                          transition: "border-color 0.2s",
                        }}>
                          <input type="file" accept="image/*" style={{ display: "none" }}
                            ref={el => { fileRefs.current[i] = el; }}
                            onChange={e => { if (e.target.files?.[0]) pickPhoto(i, e.target.files[0]); }} />
                          {photos[i] ? (
                            <img src={photos[i]} alt=""
                              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                              <Upload size={17} color={i === 0 ? "#E8336D" : "rgba(255,255,255,0.2)"} />
                              {i === 0 && (
                                <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.1em", color: "#E8336D" }}>
                                  MAIN
                                </span>
                              )}
                            </div>
                          )}
                        </label>
                        {photos[i] && (
                          <button type="button" onClick={() => removePhoto(i)} style={{
                            position: "absolute", top: 6, right: 6, width: 22, height: 22,
                            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                            background: "rgba(0,0,0,0.65)", border: "none", cursor: "pointer", zIndex: 2,
                          }}>
                            <X size={11} color="white" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 8 }}>
                    Tap a slot to upload · Main photo shown first
                  </p>
                </div>

                {/* Location */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="City">
                    <input placeholder="Nairobi" value={form.city} onChange={e => u("city", e.target.value)}
                      style={inputSt} onFocus={focusSt} onBlur={blurSt} />
                  </Field>
                  <Field label="County">
                    <select value={form.county} onChange={e => u("county", e.target.value)}
                      style={{ ...inputSt, colorScheme: "dark" } as React.CSSProperties}
                      onFocus={e => (e.target.style.borderColor = "#E8336D")}
                      onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}>
                      {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                </div>

                {/* Bio */}
                <Field label="Bio" hint="optional">
                  <textarea placeholder="A short intro about yourself..." value={form.bio}
                    onChange={e => u("bio", e.target.value)} rows={3}
                    style={{
                      ...inputSt, height: "auto", padding: "14px 16px", resize: "none",
                    } as React.CSSProperties}
                    onFocus={focusSt} onBlur={blurSt} />
                </Field>

                {/* Bonus */}
                <div style={{
                  borderRadius: 16, padding: "14px 18px",
                  background: "rgba(245,197,66,0.05)", border: "1px solid rgba(245,197,66,0.12)",
                  display: "flex", gap: 12, alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: 20 }}>🎁</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#F5C542" }}>150 welcome coins on signup</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 3 }}>
                      Verify your phone after signup to earn the ✅ verified badge.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Navigation ── */}
            <div style={{ display: "flex", gap: 10, marginTop: 32 }}>
              {step > 1 && (
                <button type="button" onClick={() => { setStep(s => s - 1); setError(""); }} style={{
                  width: 54, height: 54, borderRadius: 16, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#161616", border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer", transition: "background 0.15s",
                }}>
                  <ArrowLeft size={18} color="rgba(255,255,255,0.5)" />
                </button>
              )}
              <button type="button" onClick={step < TOTAL ? next : register} disabled={loading} style={{
                flex: 1, height: 54, borderRadius: 99, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(135deg, #E8336D 0%, #C2185B 100%)",
                color: "white", fontSize: 16, fontWeight: 900,
                opacity: loading ? 0.5 : 1, transition: "opacity 0.2s",
              }}>
                {loading
                  ? <span style={{
                      width: 20, height: 20, borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white",
                      animation: "spin 0.7s linear infinite", display: "inline-block",
                    }} />
                  : step === TOTAL ? "Create my account" : "Continue"}
              </button>
            </div>

            <p style={{ textAlign: "center", fontSize: 13, marginTop: 24, color: "rgba(255,255,255,0.25)" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#E8336D", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
            </p>

          </div>
        </div>
      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        @media (min-width: 900px) {
          .register-left-panel { display: flex !important; }
          .register-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Small helper components ── */
const inputSt: React.CSSProperties = {
  width: "100%", height: 52, borderRadius: 14, padding: "0 16px",
  background: "#161616", border: "1px solid rgba(255,255,255,0.08)",
  color: "white", fontSize: 15, outline: "none",
  transition: "border-color 0.15s",
  fontFamily: "'Inter', sans-serif",
};
const focusSt = (e: React.FocusEvent<any>) => (e.target.style.borderColor = "#E8336D");
const blurSt  = (e: React.FocusEvent<any>) => (e.target.style.borderColor = "rgba(255,255,255,0.08)");

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.32)",
      textTransform: "uppercase", marginBottom: 8 }}>
      {children}
    </p>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.32)",
        textTransform: "uppercase", marginBottom: 8, display: "flex", gap: 6, alignItems: "center" }}>
        {label}
        {hint && <span style={{ textTransform: "none", fontWeight: 400, color: "rgba(255,255,255,0.2)", fontSize: 11 }}>({hint})</span>}
      </p>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children, pill }: {
  active: boolean; onClick: () => void; children: React.ReactNode; pill?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: pill ? "9px 16px" : "12px 10px",
      borderRadius: pill ? 99 : 14,
      fontSize: 13, fontWeight: 600, cursor: "pointer",
      transition: "all 0.15s", whiteSpace: "nowrap",
      background: active ? "rgba(232,51,109,0.1)" : "#161616",
      border: `1.5px solid ${active ? "#E8336D" : "rgba(255,255,255,0.08)"}`,
      color: active ? "white" : "rgba(255,255,255,0.4)",
    }}>
      {children}
    </button>
  );
}
