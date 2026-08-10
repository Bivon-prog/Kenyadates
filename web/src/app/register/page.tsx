"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, ArrowRight, ArrowLeft, Check, Camera, MapPin, User, Target, Smile } from "lucide-react";

const INTERESTS = ["Travel ✈️", "Music 🎵", "Food 🍽️", "Sports ⚽", "Reading 📚", "Dancing 💃", "Movies 🎬", "Fitness 💪", "Art 🎨", "Gaming 🎮", "Cooking 👨‍🍳", "Nature 🌿", "Photography 📸", "Fashion 👗", "Tech 💻", "Business 📈"];
const GOALS = [
  { id: "relationship", label: "Serious Relationship", emoji: "💍" },
  { id: "casual", label: "Casual Dating", emoji: "😊" },
  { id: "friendship", label: "Friendship First", emoji: "🤝" },
  { id: "marriage", label: "Marriage", emoji: "💒" },
];
const GENDERS = ["Man", "Woman", "Non-binary", "Prefer not to say"];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ phone: "", otp: "", name: "", dob: "", gender: "", seeking: "", goal: "", interests: [] as string[], city: "", country: "Kenya", bio: "" });
  const totalSteps = 6;

  const updateForm = (key: string, value: string | string[]) => setForm(prev => ({ ...prev, [key]: value }));
  const toggleInterest = (interest: string) => {
    const curr = form.interests;
    updateForm("interests", curr.includes(interest) ? curr.filter(i => i !== interest) : curr.length < 10 ? [...curr, interest] : curr);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: "-10%", right: "-10%", width: 500, height: 500, background: "rgba(232,51,109,0.08)", borderRadius: "50%", filter: "blur(100px)" }} />
      <div style={{ position: "fixed", bottom: "-10%", left: "-10%", width: 400, height: 400, background: "rgba(108,99,255,0.06)", borderRadius: "50%", filter: "blur(80px)" }} />

      <div style={{ width: "100%", maxWidth: 480, position: "relative" }} className="animate-fade-in">
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Heart size={20} fill="white" color="white" />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "white" }}>
              Kenya<span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>dates</span>
            </span>
          </Link>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Step {step} of {totalSteps}</span>
            <span style={{ fontSize: 13, color: "var(--accent-secondary)" }}>{Math.round((step / totalSteps) * 100)}% complete</span>
          </div>
          <div style={{ height: 4, background: "var(--bg-surface)", borderRadius: 99 }}>
            <div style={{ height: "100%", width: `${(step / totalSteps) * 100}%`, background: "var(--gradient-primary)", borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            {[{ icon: Phone, label: "Phone" }, { icon: User, label: "You" }, { icon: Target, label: "Goals" }, { icon: Smile, label: "Interests" }, { icon: MapPin, label: "Location" }, { icon: Camera, label: "Photos" }].map((s, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: i + 1 < step ? "var(--gradient-primary)" : i + 1 === step ? "rgba(232,51,109,0.2)" : "var(--bg-surface)",
                  border: i + 1 === step ? "2px solid var(--accent-primary)" : "none", transition: "all 0.3s"
                }}>
                  {i + 1 < step ? <Check size={12} color="white" /> : <s.icon size={12} color={i + 1 === step ? "var(--accent-primary)" : "var(--text-muted)"} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="glass" style={{ borderRadius: "var(--radius-xl)", padding: 36 }}>

          {/* Step 1: Phone */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Enter your phone 📱</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>We&apos;ll send you a verification code</p>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Phone Number</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14 }}>🇰🇪 +254</span>
                  <input className="input" type="tel" placeholder="7XX XXX XXX" style={{ paddingLeft: 90 }} value={form.phone} onChange={e => updateForm("phone", e.target.value)} />
                </div>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 24 }}>By continuing, you agree to our <Link href="#" style={{ color: "var(--accent-secondary)" }}>Terms</Link> & <Link href="#" style={{ color: "var(--accent-secondary)" }}>Privacy Policy</Link></p>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Verify your number 🔐</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>Enter the 6-digit code sent to +254 {form.phone}</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <input key={i} maxLength={1} style={{ width: 48, height: 56, textAlign: "center", fontSize: 22, fontWeight: 700, background: "var(--bg-surface)", border: "2px solid var(--border)", borderRadius: "var(--radius-md)", color: "white", outline: "none", transition: "border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor = "var(--accent-primary)"}
                    onBlur={e => e.target.style.borderColor = "var(--border)"}
                    onChange={e => { if (e.target.value && e.target.nextElementSibling) (e.target.nextElementSibling as HTMLInputElement).focus(); }} />
                ))}
              </div>
              <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
                Didn&apos;t receive it? <button style={{ background: "none", border: "none", color: "var(--accent-secondary)", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Resend code</button>
              </p>
            </div>
          )}

          {/* Step 3: Profile basics */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Tell us about you ✨</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>This is how others will see you</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Your Name</label>
                  <input className="input" placeholder="First name" value={form.name} onChange={e => updateForm("name", e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Date of Birth</label>
                  <input className="input" type="date" value={form.dob} onChange={e => updateForm("dob", e.target.value)} style={{ colorScheme: "dark" }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>I am a...</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {GENDERS.map(g => (
                      <button key={g} onClick={() => updateForm("gender", g)} style={{
                        padding: "12px", borderRadius: "var(--radius-md)", border: "2px solid", cursor: "pointer", fontWeight: 600, fontSize: 14,
                        borderColor: form.gender === g ? "var(--accent-primary)" : "var(--border)",
                        background: form.gender === g ? "rgba(232,51,109,0.1)" : "var(--bg-surface)",
                        color: form.gender === g ? "var(--accent-secondary)" : "var(--text-secondary)",
                        transition: "all 0.2s"
                      }}>{g}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Looking for...</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {GENDERS.slice(0, 2).map(g => (
                      <button key={g} onClick={() => updateForm("seeking", g)} style={{
                        padding: "12px", borderRadius: "var(--radius-md)", border: "2px solid", cursor: "pointer", fontWeight: 600, fontSize: 14,
                        borderColor: form.seeking === g ? "var(--accent-primary)" : "var(--border)",
                        background: form.seeking === g ? "rgba(232,51,109,0.1)" : "var(--bg-surface)",
                        color: form.seeking === g ? "var(--accent-secondary)" : "var(--text-secondary)",
                        transition: "all 0.2s"
                      }}>{g}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Goals */}
          {step === 4 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>What are you looking for? 💘</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>Be honest — it helps us find the right matches</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {GOALS.map(g => (
                  <button key={g.id} onClick={() => updateForm("goal", g.id)} style={{
                    padding: "16px 20px", borderRadius: "var(--radius-md)", border: "2px solid", cursor: "pointer", textAlign: "left",
                    borderColor: form.goal === g.id ? "var(--accent-primary)" : "var(--border)",
                    background: form.goal === g.id ? "rgba(232,51,109,0.1)" : "var(--bg-surface)",
                    transition: "all 0.2s", display: "flex", alignItems: "center", gap: 16
                  }}>
                    <span style={{ fontSize: 28 }}>{g.emoji}</span>
                    <span style={{ fontWeight: 600, fontSize: 15, color: form.goal === g.id ? "white" : "var(--text-secondary)" }}>{g.label}</span>
                    {form.goal === g.id && <div style={{ marginLeft: "auto", width: 22, height: 22, borderRadius: "50%", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={12} color="white" /></div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Interests */}
          {step === 5 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Your interests 🎯</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>Pick up to 10 things you love ({form.interests.length}/10)</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {INTERESTS.map(interest => (
                  <button key={interest} onClick={() => toggleInterest(interest)} style={{
                    padding: "10px 16px", borderRadius: "var(--radius-full)", border: "2px solid", cursor: "pointer", fontSize: 13, fontWeight: 600,
                    borderColor: form.interests.includes(interest) ? "var(--accent-primary)" : "var(--border)",
                    background: form.interests.includes(interest) ? "rgba(232,51,109,0.15)" : "var(--bg-surface)",
                    color: form.interests.includes(interest) ? "var(--accent-secondary)" : "var(--text-secondary)",
                    transition: "all 0.2s"
                  }}>{interest}</button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Photos */}
          {step === 6 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Add your photos 📸</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>First photo is your main photo. Add at least 2.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{
                    aspectRatio: "3/4", borderRadius: "var(--radius-md)", border: `2px dashed ${i === 0 ? "var(--accent-primary)" : "var(--border)"}`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
                    background: i === 0 ? "rgba(232,51,109,0.05)" : "var(--bg-surface)", transition: "all 0.2s"
                  }}>
                    <Camera size={24} color={i === 0 ? "var(--accent-primary)" : "var(--text-muted)"} />
                    {i === 0 && <span style={{ fontSize: 10, color: "var(--accent-primary)", fontWeight: 600 }}>MAIN</span>}
                  </div>
                ))}
              </div>
              <div style={{ padding: "16px", background: "rgba(245,197,66,0.1)", borderRadius: "var(--radius-md)", border: "1px solid rgba(245,197,66,0.2)", marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: "var(--accent-gold)", fontWeight: 600, marginBottom: 4 }}>🎁 Get 150 Free Coins!</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Complete face verification after signup to unlock your welcome reward.</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} className="btn-secondary" style={{ flex: 1, padding: 14 }}>
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <button onClick={() => step < totalSteps ? setStep(s => s + 1) : null} className="btn-primary" style={{ flex: 2, padding: 14, fontSize: 15 }}>
              {step === totalSteps ? "Create My Profile 🎉" : <>Continue <ArrowRight size={16} /></>}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--accent-secondary)", fontWeight: 700, textDecoration: "none" }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

function Phone({ size, color }: { size: number; color: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z"/></svg>;
}
