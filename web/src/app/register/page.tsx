"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, Check, Upload } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const INTERESTS = [
  "Travel ✈️","Music 🎵","Food 🍽️","Sports ⚽","Reading 📚","Dancing 💃",
  "Movies 🎬","Fitness 💪","Art 🎨","Gaming 🎮","Cooking 👨‍🍳","Nature 🌿",
  "Photography 📸","Fashion 👗","Tech 💻","Business 📈",
];
const GOALS    = [
  { id:"relationship", label:"Serious Relationship", emoji:"💍" },
  { id:"casual",       label:"Casual Dating",        emoji:"😊" },
  { id:"friendship",   label:"Friendship First",     emoji:"🤝" },
  { id:"marriage",     label:"Marriage",             emoji:"💒" },
];
const GENDERS  = ["Man","Woman","Non-binary","Prefer not to say"];
const COUNTIES = [
  "Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Nyeri","Meru","Thika",
  "Machakos","Kitale","Kericho","Garissa","Malindi","Kakamega","Kisii",
  "Embu","Bungoma","Migori","Homa Bay","Kilifi",
];
const TOTAL = 5;

export default function RegisterPage() {
  const { login } = useAuth();
  const [step,       setStep]       = useState(1);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [photos,     setPhotos]     = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const fileRefs = useRef<(HTMLInputElement|null)[]>([]);

  const [form, setForm] = useState({
    email:"", phone:"", password:"", name:"", dob:"",
    gender:"", seeking:"", goal:"", interests:[] as string[],
    city:"Nairobi", county:"Nairobi", bio:"",
  });

  const u = (k: string, v: string|string[]) => setForm(p => ({ ...p, [k]:v }));
  const age = (dob: string) => Math.floor((Date.now() - new Date(dob).getTime()) / (1000*60*60*24*365.25));

  const toggleInterest = (i: string) =>
    u("interests", form.interests.includes(i)
      ? form.interests.filter(x => x !== i)
      : form.interests.length < 10 ? [...form.interests, i] : form.interests);

  const pickPhoto = (i: number, file: File) => {
    const url = URL.createObjectURL(file);
    const p = [...photos]; p[i] = url; setPhotos(p);
    const f = [...photoFiles]; f[i] = file; setPhotoFiles(f);
  };

  const validate = (): string|null => {
    if (step===1) {
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email address.";
      if (!form.password || form.password.length < 6) return "Password must be at least 6 characters.";
    }
    if (step===2) {
      if (!form.name.trim()) return "Enter your first name.";
      if (!form.dob) return "Enter your date of birth.";
      if (age(form.dob) < 18) return "You must be at least 18 years old.";
      if (!form.gender) return "Select your gender.";
      if (!form.seeking) return "Select who you are looking for.";
    }
    if (step===3 && !form.goal) return "Select what you are looking for.";
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
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          email: form.email,
          ...(form.phone ? { phoneNumber: `254${form.phone.replace(/^0/,"")}` } : {}),
          password: form.password, displayName: form.name, age: age(form.dob),
          gender: form.gender, seeking: form.seeking, goal: form.goal,
          bio: form.bio||null, interests: form.interests,
          city: form.city, county: form.county,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed.");

      if (data.token && data.user) {
        for (const file of photoFiles.filter(Boolean)) {
          try {
            const fd = new FormData(); fd.append("file", file);
            await fetch(`${API}/users/upload-photo`, { method:"POST", headers:{ Authorization:`Bearer ${data.token}` }, body:fd });
          } catch {}
        }
        login(data.token, data.user);
        return;
      }
      setError("Account created. Please sign in.");
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  const stepTitles = [
    { title:"Create account",           sub:"Join thousands of Kenyans finding love" },
    { title:"About you",                sub:"Tell us a little about yourself" },
    { title:"What are you looking for?",sub:"Be honest — it helps us match you" },
    { title:"Your interests",           sub:"Pick up to 10 things you love" },
    { title:"Add photos & location",    sub:"Show your best self" },
  ];

  // Shared input style — dark filled, no border, rounded
  const inp = "w-full rounded-2xl px-5 text-white placeholder:text-white/25 outline-none transition-all";
  const inpStyle = { height:56, fontSize:16, background:"#222", border:"none" };
  const onFocus  = (e: React.FocusEvent<HTMLInputElement|HTMLSelectElement>) => { e.target.style.outline = "2px solid #E8336D"; };
  const onBlur   = (e: React.FocusEvent<HTMLInputElement|HTMLSelectElement>) => { e.target.style.outline = "none"; };

  const selBtn = (active: boolean) => ({
    background: active ? "rgba(232,51,109,0.15)" : "#222",
    border: `2px solid ${active ? "#E8336D" : "transparent"}`,
    color:  active ? "white" : "rgba(255,255,255,0.4)",
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#151515" }}>
      <div className="flex-1 flex justify-center px-6 py-10 lg:py-16">
        <div className="w-full max-w-[400px]">

          {/* Logo */}
          <div className="mb-10">
            <Link href="/" className="no-underline">
              <span className="text-2xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                Kenya<span style={{ color: "#E8336D" }}>dates</span>
              </span>
            </Link>
          </div>

          {/* Step heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2 leading-tight">
              {stepTitles[step-1].title}
            </h1>
            <p className="text-white/40 text-base">{stepTitles[step-1].sub}</p>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 mb-8">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <div key={i} className="h-1 rounded-full flex-1 transition-all duration-300"
                style={{ background: i + 1 <= step ? "#E8336D" : "#2a2a2a" }} />
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-2xl px-4 py-3.5 mb-6 text-sm text-red-400"
              style={{ background:"rgba(232,65,65,0.1)", border:"1px solid rgba(232,65,65,0.2)" }}>
              {error}
            </div>
          )}

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">Email</label>
                <input type="email" placeholder="you@example.com" value={form.email} onChange={e=>u("email",e.target.value)}
                  autoComplete="email" className={inp} style={inpStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">
                  Phone <span className="normal-case font-normal">(optional)</span>
                </label>
                <div className="flex rounded-2xl overflow-hidden" style={{ background:"#222", height:56 }}>
                  <span className="flex items-center px-4 text-white/40 text-sm whitespace-nowrap flex-shrink-0">🇰🇪 +254</span>
                  <input type="tel" placeholder="7XX XXX XXX" value={form.phone} onChange={e=>u("phone",e.target.value)}
                    autoComplete="tel" className="flex-1 px-2 text-white placeholder:text-white/25 outline-none bg-transparent"
                    style={{ fontSize:16 }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">Password</label>
                <div className="relative">
                  <input type={showPass?"text":"password"} placeholder="At least 6 characters" value={form.password}
                    onChange={e=>u("password",e.target.value)} autoComplete="new-password"
                    className={inp} style={{ ...inpStyle, paddingRight:52 }} onFocus={onFocus} onBlur={onBlur} />
                  <button type="button" onClick={()=>setShowPass(s=>!s)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPass ? <EyeOff size={19}/> : <Eye size={19}/>}
                  </button>
                </div>
                {form.password && (
                  <div className="flex gap-2 mt-3">
                    {[...Array(4)].map((_,i)=>(
                      <div key={i} className="flex-1 h-1.5 rounded-full transition-all"
                        style={{ background: form.password.length>i*2+2
                          ? (form.password.length>=10?"#4caf82":form.password.length>=6?"#f5c542":"#E8336D")
                          : "#2a2a2a" }} />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-center" style={{ color:"rgba(255,255,255,0.25)" }}>
                By continuing you agree to our{" "}
                <Link href="/terms" className="no-underline hover:underline" style={{ color:"#E8336D" }}>Terms</Link>
                {" "}&{" "}
                <Link href="/privacy" className="no-underline hover:underline" style={{ color:"#E8336D" }}>Privacy Policy</Link>
              </p>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">Your Name</label>
                <input placeholder="e.g. Amina" value={form.name} onChange={e=>u("name",e.target.value)}
                  className={inp} style={inpStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">Date of Birth</label>
                <input type="date" value={form.dob} onChange={e=>u("dob",e.target.value)}
                  max={new Date(Date.now()-18*365.25*24*3600000).toISOString().split("T")[0]}
                  className={inp} style={{ ...inpStyle, colorScheme:"dark" } as any} onFocus={onFocus} onBlur={onBlur} />
                {form.dob && <p className="text-sm mt-2" style={{ color:"#4caf82" }}>Age: {age(form.dob)} years old</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">I am a</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {GENDERS.map(g=>(
                    <button key={g} type="button" onClick={()=>u("gender",g)}
                      className="py-3.5 rounded-2xl text-sm font-semibold transition-all" style={selBtn(form.gender===g)}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Looking for</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {["Men","Women","Everyone"].map(g=>(
                    <button key={g} type="button" onClick={()=>u("seeking",g)}
                      className="py-3.5 rounded-2xl text-sm font-semibold transition-all" style={selBtn(form.seeking===g)}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div className="space-y-3">
              {GOALS.map(g=>(
                <button key={g.id} type="button" onClick={()=>u("goal",g.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all"
                  style={selBtn(form.goal===g.id)}>
                  <span className="text-2xl flex-shrink-0">{g.emoji}</span>
                  <span className="font-semibold text-base" style={{ color:form.goal===g.id?"white":"rgba(255,255,255,0.45)" }}>{g.label}</span>
                  {form.goal===g.id && (
                    <div className="ml-auto w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background:"#E8336D" }}>
                      <Check size={12} color="white" strokeWidth={3}/>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* ── STEP 4 ── */}
          {step === 4 && (
            <div>
              <p className="text-sm mb-4" style={{ color:"rgba(255,255,255,0.35)" }}>
                {form.interests.length}/10 selected
              </p>
              <div className="flex flex-wrap gap-2.5 max-h-[340px] overflow-y-auto pr-1 pb-2">
                {INTERESTS.map(i=>{
                  const on = form.interests.includes(i);
                  return (
                    <button key={i} type="button" onClick={()=>toggleInterest(i)}
                      className="px-4 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap"
                      style={selBtn(on)}>
                      {i}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 5 ── */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Photos</label>
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({length:6}).map((_,i)=>(
                    <label key={i}
                      className="aspect-[3/4] rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative transition-all"
                      style={{ background:"#222", border:`2px dashed ${i===0?"rgba(232,51,109,0.5)":"rgba(255,255,255,0.1)"}` }}>
                      <input type="file" accept="image/*" className="hidden"
                        ref={el=>{ fileRefs.current[i]=el; }}
                        onChange={e=>{ if(e.target.files?.[0]) pickPhoto(i,e.target.files[0]); }} />
                      {photos[i] ? (
                        <img src={photos[i]} className="absolute inset-0 w-full h-full object-cover" alt=""/>
                      ) : (
                        <>
                          <Upload size={20} style={{ color:i===0?"#E8336D":"rgba(255,255,255,0.2)" }}/>
                          {i===0 && <span className="text-[10px] font-bold mt-1.5 text-center px-1" style={{ color:"#E8336D" }}>MAIN</span>}
                        </>
                      )}
                    </label>
                  ))}
                </div>
                <p className="text-xs mt-2" style={{ color:"rgba(255,255,255,0.25)" }}>Tap a slot to add a photo</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">City</label>
                  <input placeholder="Nairobi" value={form.city} onChange={e=>u("city",e.target.value)}
                    className={inp} style={inpStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">County</label>
                  <select value={form.county} onChange={e=>u("county",e.target.value)}
                    className="w-full rounded-2xl px-4 text-white outline-none transition-all"
                    style={{ ...inpStyle, background:"#222", colorScheme:"dark" } as any}
                    onFocus={onFocus as any} onBlur={onBlur as any}>
                    {COUNTIES.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="rounded-2xl px-5 py-4" style={{ background:"rgba(245,197,66,0.06)", border:"1px solid rgba(245,197,66,0.15)" }}>
                <p className="text-sm font-semibold" style={{ color:"#F5C542" }}>🎁 150 welcome coins on signup!</p>
                <p className="text-xs mt-0.5" style={{ color:"rgba(255,255,255,0.3)" }}>Verify your phone after signup to earn the ✅ badge.</p>
              </div>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button type="button" onClick={()=>{ setStep(s=>s-1); setError(""); }}
                className="flex items-center justify-center rounded-2xl font-semibold transition-all px-5"
                style={{ height:56, background:"#222", color:"rgba(255,255,255,0.5)", border:"none" }}>
                <ArrowLeft size={20}/>
              </button>
            )}
            <button type="button" onClick={step<TOTAL ? next : register} disabled={loading}
              className="flex-1 flex items-center justify-center font-black text-white text-lg rounded-full transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              style={{ height:56, background:"linear-gradient(135deg, #E8336D 0%, #C2185B 100%)" }}>
              {loading
                ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
                : step === TOTAL ? "Create account" : "Continue →"}
            </button>
          </div>

          <p className="text-center text-sm mt-6" style={{ color:"rgba(255,255,255,0.3)" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-bold no-underline" style={{ color:"#E8336D" }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
