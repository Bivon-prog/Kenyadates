"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Eye, EyeOff, ArrowRight, ArrowLeft, Check, Upload,
  Mail, User, Target, Heart, MapPin, Camera,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const INTERESTS = [
  "Travel ✈️","Music 🎵","Food 🍽️","Sports ⚽","Reading 📚","Dancing 💃",
  "Movies 🎬","Fitness 💪","Art 🎨","Gaming 🎮","Cooking 👨‍🍳","Nature 🌿",
  "Photography 📸","Fashion 👗","Tech 💻","Business 📈",
];
const GOALS    = [
  { id: "relationship", label: "Serious Relationship", emoji: "💍" },
  { id: "casual",       label: "Casual Dating",        emoji: "😊" },
  { id: "friendship",   label: "Friendship First",     emoji: "🤝" },
  { id: "marriage",     label: "Marriage",             emoji: "💒" },
];
const GENDERS  = ["Man", "Woman", "Non-binary", "Prefer not to say"];
const COUNTIES = [
  "Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Nyeri","Meru","Thika",
  "Machakos","Kitale","Kericho","Garissa","Malindi","Kakamega","Kisii",
  "Embu","Bungoma","Migori","Homa Bay","Kilifi",
];

const TOTAL_STEPS = 5;

const STEP_META = [
  { icon: Mail,   title: "Create account",         subtitle: "Start your journey" },
  { icon: User,   title: "About you",               subtitle: "How you'll appear" },
  { icon: Target, title: "Your goal",               subtitle: "What you're looking for" },
  { icon: Heart,  title: "Your interests",          subtitle: "Pick up to 10" },
  { icon: Camera, title: "Photos & location",       subtitle: "Add your best photos" },
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
  const calcAge = (dob: string) => Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25));

  const toggleInterest = (i: string) => {
    u("interests", form.interests.includes(i)
      ? form.interests.filter(x => x !== i)
      : form.interests.length < 10 ? [...form.interests, i] : form.interests);
  };

  const selectPhoto = (i: number, file: File) => {
    const url = URL.createObjectURL(file);
    const p = [...photos]; p[i] = url; setPhotos(p);
    const f = [...photoFiles]; f[i] = file; setPhotoFiles(f);
  };

  const validate = (): string | null => {
    if (step === 1) {
      if (!form.email) return "Email is required.";
      if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email address.";
      if (!form.password || form.password.length < 6) return "Password must be at least 6 characters.";
    }
    if (step === 2) {
      if (!form.name.trim()) return "Enter your first name.";
      if (!form.dob) return "Enter your date of birth.";
      if (calcAge(form.dob) < 18) return "You must be at least 18 years old.";
      if (!form.gender) return "Select your gender.";
      if (!form.seeking) return "Select who you are looking for.";
    }
    if (step === 3) {
      if (!form.goal) return "Select what you are looking for.";
    }
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError(""); setStep(s => s + 1);
    window.scrollTo(0, 0);
  };

  const register = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          ...(form.phone ? { phoneNumber: `254${form.phone.replace(/^0/, "")}` } : {}),
          password: form.password, displayName: form.name, age: calcAge(form.dob),
          gender: form.gender, seeking: form.seeking, goal: form.goal,
          bio: form.bio || null, interests: form.interests,
          city: form.city, county: form.county,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed. Please try again.");

      if (data.token && data.user) {
        for (const file of photoFiles.filter(Boolean)) {
          try {
            const fd = new FormData(); fd.append("file", file);
            await fetch(`${API}/users/upload-photo`, { method: "POST", headers: { Authorization: `Bearer ${data.token}` }, body: fd });
          } catch {}
        }
        login(data.token, data.user);
        return;
      }
      setError("Account created. Please sign in.");
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  const current = STEP_META[step - 1];
  const progress = (step / TOTAL_STEPS) * 100;

  const inputBase = "w-full bg-[#111118] border border-white/8 rounded-2xl px-4 text-white placeholder:text-white/25 outline-none transition-colors focus:border-[#E8336D]/60";
  const inputH    = { height: 52, fontSize: 16 };
  const selBtn    = (active: boolean) => ({
    background: active ? "rgba(232,51,109,0.12)" : "rgba(255,255,255,0.03)",
    borderColor: active ? "#E8336D" : "rgba(255,255,255,0.1)",
    color: active ? "white" : "rgba(255,255,255,0.45)",
  });

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Link href="/" className="inline-flex items-center gap-3 no-underline">
            <div className="w-10 h-10 rounded-2xl bg-[#E8336D] flex items-center justify-center">
              <Heart size={20} fill="white" color="white" />
            </div>
            <span className="text-white font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              Kenya<span style={{ color: "#E8336D" }}>dates</span>
            </span>
          </Link>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-base font-bold text-white">{current.title}</p>
              <p className="text-white/40 text-sm">{current.subtitle}</p>
            </div>
            <span className="text-sm text-white/35">{step}/{TOTAL_STEPS}</span>
          </div>

          {/* Step dots */}
          <div className="flex items-center gap-1.5 mb-3">
            {STEP_META.map((s, i) => {
              const done   = i + 1 < step;
              const active = i + 1 === step;
              return (
                <div key={i} className="relative flex items-center gap-1.5 flex-1">
                  <div className="w-full h-1.5 rounded-full overflow-hidden bg-white/8">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: done ? "100%" : active ? "50%" : "0%", background: "linear-gradient(90deg, #E8336D, #FF6B9D)" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step icon bubbles */}
          <div className="flex items-center justify-between px-0">
            {STEP_META.map((s, i) => {
              const Icon  = s.icon;
              const done  = i + 1 < step;
              const active= i + 1 === step;
              return (
                <div key={i}
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: done ? "#E8336D" : active ? "rgba(232,51,109,0.15)" : "rgba(255,255,255,0.05)",
                    border: active ? "2px solid #E8336D" : "2px solid transparent",
                  }}>
                  {done
                    ? <Check size={13} color="white" strokeWidth={3} />
                    : <Icon size={13} color={active ? "#E8336D" : "rgba(255,255,255,0.3)"} />
                  }
                </div>
              );
            })}
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#111118] border border-white/8 rounded-3xl p-6 mb-4">

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/25 rounded-2xl px-4 py-3.5 text-red-400 text-sm mb-5">
              <span className="flex-shrink-0 mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ── STEP 1 — Account ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white/55 mb-2">Email address <span className="text-[#E8336D]">*</span></label>
                <div className="relative">
                  <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                  <input type="email" placeholder="you@example.com" value={form.email} onChange={e => u("email", e.target.value)}
                    autoComplete="email" className={inputBase} style={{ ...inputH, paddingLeft: 44 }} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/55 mb-2">Phone <span className="text-white/25 font-normal">(optional)</span></label>
                <div className="flex">
                  <div className="flex items-center px-4 bg-[#0D0D0D] border border-white/8 border-r-0 rounded-l-2xl text-white/45 text-sm whitespace-nowrap"
                    style={{ height: 52 }}>🇰🇪 +254</div>
                  <input type="tel" placeholder="7XX XXX XXX" value={form.phone} onChange={e => u("phone", e.target.value)}
                    autoComplete="tel"
                    className="flex-1 bg-[#111118] border border-white/8 rounded-r-2xl px-4 text-white placeholder:text-white/25 outline-none focus:border-[#E8336D]/60 transition-colors"
                    style={inputH} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/55 mb-2">Password <span className="text-[#E8336D]">*</span></label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} placeholder="At least 6 characters" value={form.password}
                    onChange={e => u("password", e.target.value)} autoComplete="new-password"
                    className={inputBase} style={{ ...inputH, paddingRight: 48 }} />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.password && (
                  <div className="flex gap-1.5 mt-2.5">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex-1 h-1.5 rounded-full transition-all"
                        style={{ background: form.password.length > i * 2 + 2 ? (form.password.length >= 10 ? "#4caf82" : form.password.length >= 6 ? "#f5c542" : "#E8336D") : "rgba(255,255,255,0.08)" }} />
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs text-white/30 text-center">
                By continuing you agree to our{" "}
                <Link href="/terms" className="text-[#E8336D] no-underline hover:underline">Terms</Link> and{" "}
                <Link href="/privacy" className="text-[#E8336D] no-underline hover:underline">Privacy Policy</Link>
              </p>
            </div>
          )}

          {/* ── STEP 2 — About ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white/55 mb-2">First name <span className="text-[#E8336D]">*</span></label>
                <input placeholder="e.g. Amina" value={form.name} onChange={e => u("name", e.target.value)}
                  className={inputBase} style={inputH} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/55 mb-2">Date of birth <span className="text-[#E8336D]">*</span></label>
                <input type="date" value={form.dob} onChange={e => u("dob", e.target.value)}
                  max={new Date(Date.now() - 18 * 365.25 * 24 * 3600000).toISOString().split("T")[0]}
                  className={inputBase} style={{ ...inputH, colorScheme: "dark" } as any} />
                {form.dob && <p className="text-sm text-green-400/80 mt-1.5">Age: {calcAge(form.dob)} years old</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/55 mb-2.5">I am a <span className="text-[#E8336D]">*</span></label>
                <div className="grid grid-cols-2 gap-2.5">
                  {GENDERS.map(g => (
                    <button key={g} type="button" onClick={() => u("gender", g)}
                      className="py-3.5 rounded-2xl border-2 text-sm font-semibold transition-all" style={selBtn(form.gender === g)}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/55 mb-2.5">Looking for <span className="text-[#E8336D]">*</span></label>
                <div className="grid grid-cols-3 gap-2.5">
                  {["Men","Women","Everyone"].map(g => (
                    <button key={g} type="button" onClick={() => u("seeking", g)}
                      className="py-3.5 rounded-2xl border-2 text-sm font-semibold transition-all" style={selBtn(form.seeking === g)}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3 — Goal ── */}
          {step === 3 && (
            <div className="space-y-3">
              {GOALS.map(g => (
                <button key={g.id} type="button" onClick={() => u("goal", g.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all" style={selBtn(form.goal === g.id)}>
                  <span className="text-2xl flex-shrink-0">{g.emoji}</span>
                  <span className="font-semibold text-base flex-1" style={{ color: form.goal === g.id ? "white" : "rgba(255,255,255,0.5)" }}>{g.label}</span>
                  {form.goal === g.id && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#E8336D" }}>
                      <Check size={12} color="white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* ── STEP 4 — Interests ── */}
          {step === 4 && (
            <div>
              <p className="text-sm text-white/40 mb-4">Pick up to 10 · {form.interests.length}/10 selected</p>
              <div className="flex flex-wrap gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                {INTERESTS.map(i => {
                  const on = form.interests.includes(i);
                  return (
                    <button key={i} type="button" onClick={() => toggleInterest(i)}
                      className="px-4 py-2.5 rounded-full border-2 text-sm font-semibold transition-all whitespace-nowrap" style={selBtn(on)}>
                      {i}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-white/25 mt-3">You can add more from your profile later.</p>
            </div>
          )}

          {/* ── STEP 5 — Photos & Location ── */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white/55 mb-3">Photos</label>
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <label key={i}
                      className="aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden relative transition-all hover:border-[#E8336D]/50 bg-[#0D0D0D]"
                      style={{ borderColor: i === 0 ? "rgba(232,51,109,0.45)" : "rgba(255,255,255,0.1)" }}>
                      <input type="file" accept="image/*" className="hidden"
                        ref={el => { fileRefs.current[i] = el; }}
                        onChange={e => { if (e.target.files?.[0]) selectPhoto(i, e.target.files[0]); }} />
                      {photos[i] ? (
                        <img src={photos[i]} className="absolute inset-0 w-full h-full object-cover" alt="" />
                      ) : (
                        <>
                          <Upload size={20} className={i === 0 ? "text-[#E8336D]" : "text-white/20"} />
                          {i === 0 && <span className="text-[10px] text-[#E8336D] font-bold mt-1.5 text-center px-1">MAIN</span>}
                        </>
                      )}
                    </label>
                  ))}
                </div>
                <p className="text-xs text-white/30 mt-2">Tap a slot to add a photo</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-white/55 mb-2">City</label>
                  <input placeholder="e.g. Nairobi" value={form.city} onChange={e => u("city", e.target.value)}
                    className={inputBase} style={inputH} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white/55 mb-2">County</label>
                  <select value={form.county} onChange={e => u("county", e.target.value)}
                    className={inputBase} style={{ ...inputH, colorScheme: "dark" } as any}>
                    {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-yellow-500/6 border border-yellow-500/20">
                <p className="text-sm text-yellow-400 font-semibold mb-0.5">🎁 150 welcome coins on signup!</p>
                <p className="text-xs text-white/35">Verify your phone after signing up to earn the ✅ badge + bonus coins.</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button type="button" onClick={() => { setStep(s => s - 1); setError(""); }}
                className="flex items-center justify-center gap-2 px-5 rounded-2xl border border-white/10 text-white/55 font-semibold text-sm hover:bg-white/5 transition-colors"
                style={{ height: 52 }}>
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <button type="button" onClick={step < TOTAL_STEPS ? next : register} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 font-bold text-white text-base rounded-2xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              style={{ height: 52, background: "linear-gradient(135deg, #E8336D, #FF6B9D)" }}>
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating account…</>
                : step === TOTAL_STEPS
                  ? "Create My Profile 🎉"
                  : <><span>Continue</span><ArrowRight size={18} /></>
              }
            </button>
          </div>
        </div>

        <p className="text-center text-base text-white/40">
          Already have an account?{" "}
          <Link href="/login" className="text-[#E8336D] font-bold no-underline hover:opacity-80">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
