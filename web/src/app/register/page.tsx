"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { Heart, ArrowRight, ArrowLeft, Check, Camera, MapPin, User, Target, Smile, Eye, EyeOff, Mail, AlertCircle, Upload, ShieldCheck, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const INTERESTS = ["Travel ✈️","Music 🎵","Food 🍽️","Sports ⚽","Reading 📚","Dancing 💃","Movies 🎬","Fitness 💪","Art 🎨","Gaming 🎮","Cooking 👨‍🍳","Nature 🌿","Photography 📸","Fashion 👗","Tech 💻","Business 📈"];
const GOALS    = [{id:"relationship",label:"Serious Relationship",emoji:"💍"},{id:"casual",label:"Casual Dating",emoji:"😊"},{id:"friendship",label:"Friendship First",emoji:"🤝"},{id:"marriage",label:"Marriage",emoji:"💒"}];
const GENDERS  = ["Man","Woman","Non-binary","Prefer not to say"];
const COUNTIES = ["Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Nyeri","Meru","Thika","Machakos","Kitale","Kericho","Garissa","Malindi","Kakamega","Kisii","Embu","Bungoma","Migori","Homa Bay","Kilifi"];
const STEPS    = 5;

export default function RegisterPage() {
  const { login } = useAuth();
  const [step,      setStep]      = useState(1);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [photos,    setPhotos]    = useState<string[]>([]);
  const [photoFiles,setPhotoFiles]= useState<File[]>([]);
  const fileRefs = useRef<(HTMLInputElement|null)[]>([]);

  const [form, setForm] = useState({
    email:"", phone:"", password:"", name:"", dob:"", gender:"", seeking:"",
    goal:"", interests:[] as string[], city:"Nairobi", county:"Nairobi", bio:""
  });

  const u = (k: string, v: string|string[]) => setForm(p => ({ ...p, [k]:v }));

  const calcAge = (dob: string) => {
    if (!dob) return 0;
    return Math.floor((Date.now() - new Date(dob).getTime()) / (1000*60*60*24*365.25));
  };

  const toggleInterest = (i: string) => {
    const curr = form.interests;
    u("interests", curr.includes(i) ? curr.filter(x=>x!==i) : curr.length<10 ? [...curr,i] : curr);
  };

  const selectPhoto = (i: number, file: File) => {
    const url = URL.createObjectURL(file);
    const p = [...photos]; p[i]=url; setPhotos(p);
    const f = [...photoFiles]; f[i]=file; setPhotoFiles(f);
  };

  const validate = (): string|null => {
    if (step===1) {
      if (!form.email) return "Email is required.";
      if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email address.";
      if (!form.password || form.password.length<6) return "Password must be at least 6 characters.";
    }
    if (step===2) {
      if (!form.name.trim()) return "Enter your name.";
      if (!form.dob) return "Enter your date of birth.";
      if (calcAge(form.dob)<18) return "You must be at least 18 years old to use KenyaDates.";
      if (!form.gender) return "Select your gender.";
      if (!form.seeking) return "Select who you are looking for.";
    }
    if (step===3) if (!form.goal) return "Select what you are looking for.";
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError(""); setStep(s=>s+1);
  };

  const register = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/auth/register`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          email:form.email,
          ...(form.phone ? { phoneNumber:`254${form.phone.replace(/^0/,"")}` } : {}),
          password:form.password, displayName:form.name, age:calcAge(form.dob),
          gender:form.gender, seeking:form.seeking, goal:form.goal,
          bio:form.bio||null, interests:form.interests, city:form.city, county:form.county,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message||"Registration failed");

      if (data.token && data.user) {
        const validFiles = photoFiles.filter(Boolean);
        for (const file of validFiles) {
          try {
            const fd = new FormData(); fd.append("file", file);
            await fetch(`${API}/users/upload-photo`, { method:"POST", headers:{Authorization:`Bearer ${data.token}`}, body:fd });
          } catch {}
        }
        login(data.token, data.user);
        return;
      }
      setError("Account created. Please sign in.");
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  const progress = Math.round((step/STEPS)*100);

  return (
    <div className="min-h-screen bg-[#0D0D12] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-[#E8336D]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-[#FF6B9D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md my-auto relative z-10 flex flex-col items-center">

        {/* Brand Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <Link href="/" className="inline-flex items-center gap-3 no-underline mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E8336D] to-[#FF6B9D] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform" style={{ width: 48, height: 48 }}>
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-extrabold tracking-tight text-white">
              Kenya<span className="text-[#E8336D]">dates</span>
            </span>
          </Link>
        </div>

        {/* Progress Header */}
        <div className="w-full mb-6 space-y-3">
          <div className="flex items-center justify-between text-sm font-bold">
            <span className="text-white/60">Step {step} of {STEPS}</span>
            <span className="text-[#E8336D] font-extrabold">{progress}%</span>
          </div>
          <div className="h-2 bg-[#1C1C2A] border border-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: "linear-gradient(to right, #E8336D, #FF6B9D)" }} />
          </div>

          {/* Step Icons Row */}
          <div className="flex items-center justify-between px-2 pt-1">
            {[Mail, User, Target, Smile, Camera].map((Icon, i) => {
              const active = i + 1 === step;
              const completed = i + 1 < step;
              return (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    completed
                      ? "bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] text-white shadow-md"
                      : active
                      ? "bg-[#E8336D]/20 border-2 border-[#E8336D] text-[#E8336D]"
                      : "bg-[#1C1C2A] border border-white/10 text-white/30"
                  }`}
                >
                  {completed ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="w-full bg-[#14141F]/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 bg-red-500/15 border border-red-500/40 rounded-2xl p-4 text-red-400 text-sm font-bold animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Account Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-black text-white tracking-tight mb-1">Create Account</h2>
                <p className="text-white/60 text-sm font-medium">Start your journey to finding real love</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/70 mb-2.5 tracking-wide">
                  Email Address <span className="text-[#E8336D]">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => u("email", e.target.value)}
                    autoComplete="email"
                    className="w-full bg-[#1C1C2A] border border-white/12 rounded-2xl pl-12 pr-4 py-4 text-white text-base placeholder:text-white/35 outline-none focus:border-[#E8336D] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/70 mb-2.5 tracking-wide">
                  Phone Number <span className="text-white/40 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-base font-bold pointer-events-none">
                    🇰🇪 +254
                  </span>
                  <input
                    type="tel"
                    placeholder="7XX XXX XXX"
                    value={form.phone}
                    onChange={(e) => u("phone", e.target.value)}
                    autoComplete="tel"
                    className="w-full bg-[#1C1C2A] border border-white/12 rounded-2xl pl-24 pr-4 py-4 text-white text-base placeholder:text-white/35 outline-none focus:border-[#E8336D] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/70 mb-2.5 tracking-wide">
                  Password <span className="text-[#E8336D]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={(e) => u("password", e.target.value)}
                    autoComplete="new-password"
                    className="w-full bg-[#1C1C2A] border border-white/12 rounded-2xl pl-12 pr-12 py-4 text-white text-base placeholder:text-white/35 outline-none focus:border-[#E8336D] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-white/50 leading-relaxed text-center pt-1">
                By continuing you agree to our{" "}
                <Link href="/terms" className="text-[#FF6B9D] font-bold no-underline hover:underline">Terms</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-[#FF6B9D] font-bold no-underline hover:underline">Privacy Policy</Link>
              </p>
            </div>
          )}

          {/* STEP 2: Basic Profile Info */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight mb-1">About You</h2>
                <p className="text-white/60 text-sm font-medium">How you will appear to potential matches</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/70 mb-2.5 tracking-wide">First Name <span className="text-[#E8336D]">*</span></label>
                <input
                  placeholder="e.g. Amina"
                  value={form.name}
                  onChange={(e) => u("name", e.target.value)}
                  className="w-full bg-[#1C1C2A] border border-white/12 rounded-2xl px-5 py-4 text-white text-base placeholder:text-white/35 outline-none focus:border-[#E8336D] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white/70 mb-2.5 tracking-wide">Date of Birth <span className="text-[#E8336D]">*</span></label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => u("dob", e.target.value)}
                  max={new Date(Date.now() - 18 * 365.25 * 24 * 3600 * 1000).toISOString().split("T")[0]}
                  className="w-full bg-[#1C1C2A] border border-white/12 rounded-2xl px-5 py-4 text-white text-base outline-none focus:border-[#E8336D] transition-colors"
                  style={{ colorScheme: "dark" }}
                />
                {form.dob && <p className="text-xs text-emerald-400 font-bold mt-2">Age: {calcAge(form.dob)} years old</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-white/70 mb-2.5 tracking-wide">I am a… <span className="text-[#E8336D]">*</span></label>
                <div className="grid grid-cols-2 gap-3">
                  {GENDERS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => u("gender", g)}
                      className={`py-3.5 rounded-2xl border-2 font-bold text-sm sm:text-base transition-all ${
                        form.gender === g
                          ? "border-[#E8336D] bg-[#E8336D]/15 text-white shadow-md"
                          : "border-white/10 bg-[#1C1C2A] text-white/60 hover:border-white/30"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/70 mb-2.5 tracking-wide">Looking for… <span className="text-[#E8336D]">*</span></label>
                <div className="grid grid-cols-3 gap-3">
                  {["Men", "Women", "Everyone"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => u("seeking", g)}
                      className={`py-3.5 rounded-2xl border-2 font-bold text-sm sm:text-base transition-all ${
                        form.seeking === g
                          ? "border-[#E8336D] bg-[#E8336D]/15 text-white shadow-md"
                          : "border-white/10 bg-[#1C1C2A] text-white/60 hover:border-white/30"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Goal */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight mb-1">Your Relationship Goal</h2>
                <p className="text-white/60 text-sm font-medium">Be honest — it helps us match you with compatible singles</p>
              </div>

              <div className="space-y-3.5">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => u("goal", g.id)}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                      form.goal === g.id
                        ? "border-[#E8336D] bg-[#E8336D]/15 text-white shadow-lg"
                        : "border-white/10 bg-[#1C1C2A] text-white/60 hover:border-white/30"
                    }`}
                  >
                    <span className="text-3xl flex-shrink-0">{g.emoji}</span>
                    <span className="font-extrabold text-base flex-1">{g.label}</span>
                    {form.goal === g.id && (
                      <div className="w-6 h-6 rounded-full bg-[#E8336D] flex items-center justify-center flex-shrink-0 shadow-md">
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Interests */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight mb-1">Your Interests & Hobbies</h2>
                <p className="text-white/60 text-sm font-medium">Select up to 10 things you enjoy ({form.interests.length}/10 selected)</p>
              </div>

              <div className="flex flex-wrap gap-2.5 max-h-64 overflow-y-auto pr-1">
                {INTERESTS.map((i) => {
                  const selected = form.interests.includes(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleInterest(i)}
                      className={`px-4 py-2.5 rounded-full border-2 text-sm font-bold transition-all ${
                        selected
                          ? "border-[#E8336D] bg-[#E8336D]/20 text-white shadow-md"
                          : "border-white/10 bg-[#1C1C2A] text-white/60 hover:border-white/30"
                      }`}
                    >
                      {i}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Photos & City */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight mb-1">Almost Ready!</h2>
                <p className="text-white/60 text-sm font-medium">Add profile photos and select your location</p>
              </div>

              {/* Photo Upload 6-Grid */}
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <label
                    key={i}
                    className={`aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden relative bg-[#1C1C2A] transition-all hover:border-[#E8336D] ${
                      i === 0 ? "border-[#E8336D]/60" : "border-white/12"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={(el) => { fileRefs.current[i] = el; }}
                      onChange={(e) => { if (e.target.files?.[0]) selectPhoto(i, e.target.files[0]); }}
                    />
                    {photos[i] ? (
                      <img src={photos[i]} className="absolute inset-0 w-full h-full object-cover" alt="" />
                    ) : (
                      <>
                        <Upload className={`w-6 h-6 mb-1 ${i === 0 ? "text-[#E8336D]" : "text-white/30"}`} />
                        {i === 0 && <span className="text-[10px] text-[#E8336D] font-black tracking-wider">MAIN</span>}
                      </>
                    )}
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-white/70 mb-2">City</label>
                  <input
                    placeholder="e.g. Nairobi"
                    value={form.city}
                    onChange={(e) => u("city", e.target.value)}
                    className="w-full bg-[#1C1C2A] border border-white/12 rounded-2xl px-4 py-3.5 text-white text-base outline-none focus:border-[#E8336D]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/70 mb-2">County</label>
                  <select
                    value={form.county}
                    onChange={(e) => u("county", e.target.value)}
                    className="w-full bg-[#1C1C2A] border border-white/12 rounded-2xl px-4 py-3.5 text-white text-base outline-none focus:border-[#E8336D]"
                  >
                    {COUNTIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Action Navigation Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            {step > 1 && (
              <button
                type="button"
                onClick={() => { setStep((s) => s - 1); setError(""); }}
                className="flex-1 py-4 rounded-2xl border border-white/15 text-white/70 font-extrabold text-base flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
            )}
            <button
              type="button"
              onClick={step < STEPS ? next : register}
              disabled={loading}
              className="flex-[2] py-4 rounded-2xl font-black text-white text-base bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl active:scale-[0.98]"
              style={{ minHeight: 56 }}
            >
              {loading ? (
                "Creating Account…"
              ) : step === STEPS ? (
                "Create Profile 🎉"
              ) : (
                <>
                  Continue <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

        </div>

        {/* Footer Redirect Link */}
        <div className="pt-6 text-center">
          <p className="text-sm sm:text-base text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="text-[#FF6B9D] font-black no-underline hover:underline ml-1">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
