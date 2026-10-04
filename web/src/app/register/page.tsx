"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { Heart, ArrowRight, ArrowLeft, Check, Camera, MapPin, User, Target, Smile, Eye, EyeOff, Mail, AlertCircle, Upload } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const INTERESTS = ["Travel ✈️","Music 🎵","Food 🍽️","Sports ⚽","Reading 📚","Dancing 💃","Movies 🎬","Fitness 💪","Art 🎨","Gaming 🎮","Cooking 👨‍🍳","Nature 🌿","Photography 📸","Fashion 👗","Tech 💻","Business 📈"];
const GOALS    = [{id:"relationship",label:"Serious Relationship",emoji:"💍"},{id:"casual",label:"Casual Dating",emoji:"😊"},{id:"friendship",label:"Friendship First",emoji:"🤝"},{id:"marriage",label:"Marriage",emoji:"💒"}];
const GENDERS  = ["Man","Woman","Non-binary","Prefer not to say"];
const COUNTIES = ["Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Nyeri","Meru","Thika","Machakos","Kitale","Kericho","Garissa","Malindi","Kakamega","Kisii","Embu","Bungoma","Migori","Homa Bay","Kilifi"];
const STEPS    = 5;

const inputStyle = { minHeight: 56, fontSize: 16 };

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
      if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email.";
      if (!form.password || form.password.length<6) return "Password must be at least 6 characters.";
    }
    if (step===2) {
      if (!form.name.trim()) return "Enter your name.";
      if (!form.dob) return "Enter your date of birth.";
      if (calcAge(form.dob)<18) return "You must be at least 18 years old.";
      if (!form.gender) return "Select your gender.";
      if (!form.seeking) return "Select who you're looking for.";
    }
    if (step===3) if (!form.goal) return "Select what you're looking for.";
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
        // Upload photos before redirecting
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
      // Fallback — should not reach here with new backend
      setError("Account created. Please log in.");
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  const progress = Math.round((step/STEPS)*100);

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 no-underline">
            <div className="w-11 h-11 rounded-2xl bg-[#E8336D] flex items-center justify-center">
              <Heart size={22} fill="white" color="white" />
            </div>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:"white" }}>
              Kenya<span style={{ background:"var(--gradient-primary)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>dates</span>
            </span>
          </Link>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-white/50">Step {step} of {STEPS}</span>
            <span className="text-sm font-semibold" style={{ color:"var(--accent-secondary)" }}>{progress}%</span>
          </div>
          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-400" style={{ width:`${progress}%`, background:"var(--gradient-primary)" }} />
          </div>
          {/* Step icons */}
          <div className="flex justify-between mt-3 px-1">
            {[Mail,User,Target,Smile,Camera].map((Icon,i) => (
              <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{ background: i+1<step ? "var(--gradient-primary)" : i+1===step ? "rgba(232,51,109,0.15)" : "rgba(255,255,255,0.05)", border: i+1===step ? "2px solid #E8336D" : "2px solid transparent" }}>
                {i+1<step ? <Check size={13} color="white" /> : <Icon size={13} color={i+1===step?"#E8336D":"rgba(255,255,255,0.3)"} />}
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#111118] border border-white/8 rounded-3xl p-6">
          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/25 rounded-2xl px-4 py-3.5 mb-5 text-[#ff6b9d] text-sm">
              <AlertCircle size={16} className="flex-shrink-0" />{error}
            </div>
          )}

          {/* STEP 1 */}
          {step===1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">Create Account</h2>
                <p className="text-white/45 text-base">Start your journey to finding love</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/55 mb-2">Email Address *</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
                  <input className="input" type="email" placeholder="you@example.com" style={{ ...inputStyle, paddingLeft:48 }}
                    value={form.email} onChange={e=>u("email",e.target.value)} autoComplete="email" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/55 mb-2">Phone <span className="text-white/30 font-normal">(optional)</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-base pointer-events-none">🇰🇪 +254</span>
                  <input className="input" type="tel" placeholder="7XX XXX XXX" style={{ ...inputStyle, paddingLeft:100 }}
                    value={form.phone} onChange={e=>u("phone",e.target.value)} autoComplete="tel" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/55 mb-2">Password *</label>
                <div className="relative">
                  <input className="input" type={showPass?"text":"password"} placeholder="At least 6 characters" style={{ ...inputStyle, paddingRight:52 }}
                    value={form.password} onChange={e=>u("password",e.target.value)} autoComplete="new-password" />
                  <button type="button" onClick={()=>setShowPass(s=>!s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                    {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                  </button>
                </div>
                {form.password && (
                  <div className="flex gap-1.5 mt-2">
                    {[...Array(4)].map((_,i)=>(
                      <div key={i} className="flex-1 h-1.5 rounded-full"
                        style={{ background: form.password.length>i*2+2 ? (form.password.length>=10?"#4caf82":form.password.length>=6?"#f5c542":"#e8336d") : "rgba(255,255,255,0.08)" }} />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-white/30">By continuing you agree to our <Link href="/terms" className="text-[#FF6B9D] no-underline">Terms</Link> & <Link href="/privacy" className="text-[#FF6B9D] no-underline">Privacy Policy</Link></p>
            </div>
          )}

          {/* STEP 2 */}
          {step===2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">About You</h2>
                <p className="text-white/45 text-base">How you&apos;ll appear to others</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/55 mb-2">First Name *</label>
                <input className="input" placeholder="e.g. Amina" style={inputStyle} value={form.name} onChange={e=>u("name",e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/55 mb-2">Date of Birth *</label>
                <input className="input" type="date" style={{ ...inputStyle, colorScheme:"dark" }} value={form.dob}
                  onChange={e=>u("dob",e.target.value)} max={new Date(Date.now()-18*365.25*24*3600*1000).toISOString().split("T")[0]} />
                {form.dob && <p className="text-sm text-white/35 mt-1.5">Age: {calcAge(form.dob)} years old</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/55 mb-2">I am a… *</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {GENDERS.map(g=>(
                    <button key={g} onClick={()=>u("gender",g)} className="py-3.5 rounded-2xl border-2 font-semibold text-base transition-all"
                      style={{ borderColor:form.gender===g?"#E8336D":"rgba(255,255,255,0.1)", background:form.gender===g?"rgba(232,51,109,0.1)":"rgba(255,255,255,0.03)", color:form.gender===g?"white":"rgba(255,255,255,0.5)" }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/55 mb-2">Looking for… *</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {["Men","Women","Everyone"].map(g=>(
                    <button key={g} onClick={()=>u("seeking",g)} className="py-3.5 rounded-2xl border-2 font-semibold text-base transition-all"
                      style={{ borderColor:form.seeking===g?"#E8336D":"rgba(255,255,255,0.1)", background:form.seeking===g?"rgba(232,51,109,0.1)":"rgba(255,255,255,0.03)", color:form.seeking===g?"white":"rgba(255,255,255,0.5)" }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step===3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">Your Goal</h2>
                <p className="text-white/45 text-base">Be honest — it helps us match you better</p>
              </div>
              <div className="space-y-3">
                {GOALS.map(g=>(
                  <button key={g.id} onClick={()=>u("goal",g.id)}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all"
                    style={{ borderColor:form.goal===g.id?"#E8336D":"rgba(255,255,255,0.1)", background:form.goal===g.id?"rgba(232,51,109,0.1)":"rgba(255,255,255,0.02)" }}>
                    <span className="text-3xl flex-shrink-0">{g.emoji}</span>
                    <span className="font-semibold text-base" style={{ color:form.goal===g.id?"white":"rgba(255,255,255,0.55)" }}>{g.label}</span>
                    {form.goal===g.id && <div className="ml-auto w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background:"var(--gradient-primary)" }}><Check size={12} color="white"/></div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step===4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">Your Interests</h2>
                <p className="text-white/45 text-base">Pick up to 10 things you love ({form.interests.length}/10)</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {INTERESTS.map(i=>(
                  <button key={i} onClick={()=>toggleInterest(i)}
                    className="px-4 py-2.5 rounded-full border-2 text-sm font-semibold transition-all"
                    style={{ borderColor:form.interests.includes(i)?"#E8336D":"rgba(255,255,255,0.1)", background:form.interests.includes(i)?"rgba(232,51,109,0.12)":"rgba(255,255,255,0.03)", color:form.interests.includes(i)?"white":"rgba(255,255,255,0.5)" }}>
                    {i}
                  </button>
                ))}
              </div>
              <p className="text-sm text-white/30">You can skip and add later from your profile.</p>
            </div>
          )}

          {/* STEP 5 */}
          {step===5 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">Almost Done!</h2>
                <p className="text-white/45 text-base">Add photos and your location</p>
              </div>
              {/* Photo grid — uses <img> tags NOT background-image to avoid the render bug */}
              <div className="grid grid-cols-3 gap-3">
                {Array.from({length:6}).map((_,i)=>(
                  <label key={i} className="aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden relative bg-[#0D0D0D] transition-all hover:border-[#E8336D]/50"
                    style={{ borderColor: i===0?"rgba(232,51,109,0.55)":"rgba(255,255,255,0.1)" }}>
                    <input type="file" accept="image/*" className="hidden"
                      ref={el=>{ fileRefs.current[i]=el; }}
                      onChange={e=>{ if(e.target.files?.[0]) selectPhoto(i,e.target.files[0]); }} />
                    {photos[i] ? (
                      <img src={photos[i]} className="absolute inset-0 w-full h-full object-cover" alt="" />
                    ) : (
                      <>
                        <Upload size={22} className={i===0?"text-[#E8336D]":"text-white/25"} />
                        {i===0 && <span className="text-[10px] text-[#E8336D] font-bold mt-1.5 text-center px-1">MAIN PHOTO</span>}
                      </>
                    )}
                  </label>
                ))}
              </div>
              <p className="text-sm text-white/35">Tap any slot to add a photo</p>
              {/* Location */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-white/55 mb-2">City</label>
                  <input className="input" style={inputStyle} placeholder="e.g. Nairobi" value={form.city} onChange={e=>u("city",e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white/55 mb-2">County</label>
                  <select className="input" style={inputStyle} value={form.county} onChange={e=>u("county",e.target.value)}>
                    {COUNTIES.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-yellow-500/6 border border-yellow-500/20">
                <p className="text-sm text-yellow-400 font-semibold mb-1">🎁 150 coins on signup!</p>
                <p className="text-xs text-white/40">Verify your phone after signing up to earn more coins and the ✅ badge.</p>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex gap-3 mt-7">
            {step>1 && (
              <button onClick={()=>{ setStep(s=>s-1); setError(""); }}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border border-white/12 text-white/70 font-semibold text-base hover:bg-white/5 transition-colors">
                <ArrowLeft size={18}/> Back
              </button>
            )}
            <button onClick={step<STEPS ? next : register}
              className="flex-[2] py-4 rounded-2xl font-bold text-white text-base hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background:"var(--gradient-primary)" }} disabled={loading}>
              {loading ? "Creating account…" : step===STEPS
                ? "Create My Profile 🎉"
                : <><span>Continue</span><ArrowRight size={18}/></>}
            </button>
          </div>
        </div>

        <p className="text-center mt-5 text-base text-white/40">
          Already have an account? <Link href="/login" className="text-[#FF6B9D] font-bold no-underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
