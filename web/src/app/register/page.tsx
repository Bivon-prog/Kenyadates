"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart, ArrowRight, ArrowLeft, Check, Camera, MapPin,
  User, Target, Smile, Eye, EyeOff, Mail, AlertCircle
} from "lucide-react";

const INTERESTS = [
  "Travel ✈️", "Music 🎵", "Food 🍽️", "Sports ⚽", "Reading 📚",
  "Dancing 💃", "Movies 🎬", "Fitness 💪", "Art 🎨", "Gaming 🎮",
  "Cooking 👨‍🍳", "Nature 🌿", "Photography 📸", "Fashion 👗", "Tech 💻", "Business 📈"
];

const GOALS = [
  { id: "relationship", label: "Serious Relationship", emoji: "💍" },
  { id: "casual", label: "Casual Dating", emoji: "😊" },
  { id: "friendship", label: "Friendship First", emoji: "🤝" },
  { id: "marriage", label: "Marriage", emoji: "💒" },
];

const GENDERS = ["Man", "Woman", "Non-binary", "Prefer not to say"];

const COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Nyeri", "Meru",
  "Thika", "Machakos", "Kitale", "Kericho", "Garissa", "Malindi", "Kakamega",
  "Kisii", "Embu", "Bungoma", "Migori", "Homa Bay", "Kilifi"
];

function PhoneIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z" />
    </svg>
  );
}

const STEP_ICONS = [Mail, User, Target, Smile, MapPin, Camera];
const TOTAL_STEPS = 5;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "", phone: "", password: "",
    name: "", dob: "", gender: "", seeking: "",
    goal: "", interests: [] as string[],
    city: "Nairobi", county: "Nairobi", bio: ""
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verifyUrl, setVerifyUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const update = (key: string, value: string | string[]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const toggleInterest = (interest: string) => {
    const curr = form.interests;
    update("interests", curr.includes(interest)
      ? curr.filter(i => i !== interest)
      : curr.length < 10 ? [...curr, interest] : curr
    );
  };

  const calcAge = (dob: string) => {
    if (!dob) return 0;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const validate = (): string | null => {
    if (step === 1) {
      if (!form.email) return "Email address is required.";
      if (!/\S+@\S+\.\S+/.test(form.email)) return "Please enter a valid email address.";
      if (!form.password) return "Password is required.";
      if (form.password.length < 6) return "Password must be at least 6 characters.";
    }
    if (step === 2) {
      if (!form.name.trim()) return "Please enter your name.";
      if (!form.dob) return "Please enter your date of birth.";
      if (calcAge(form.dob) < 18) return "You must be at least 18 years old.";
      if (!form.gender) return "Please select your gender.";
      if (!form.seeking) return "Please select who you're looking for.";
    }
    if (step === 3) {
      if (!form.goal) return "Please select what you're looking for.";
    }
    return null;
  };

  const nextStep = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setStep(s => s + 1);
  };

  const handlePhotoSelect = (index: number, file: File) => {
    const url = URL.createObjectURL(file);
    const newPhotos = [...photos];
    const newFiles = [...photoFiles];
    newPhotos[index] = url;
    newFiles[index] = file;
    setPhotos(newPhotos);
    setPhotoFiles(newFiles);
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          phoneNumber: form.phone || `254${Date.now()}`,
          password: form.password,
          displayName: form.name,
          age: calcAge(form.dob),
          gender: form.gender,
          city: form.city,
          county: form.county,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      if (data.verifyUrl) setVerifyUrl(data.verifyUrl);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ position: "fixed", top: "-10%", right: "-10%", width: 500, height: 500, background: "rgba(232,51,109,0.08)", borderRadius: "50%", filter: "blur(100px)" }} />
        <div className="glass animate-fade-in" style={{ width: "100%", maxWidth: 440, borderRadius: "var(--radius-xl)", padding: 48, textAlign: "center", position: "relative" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, rgba(76,175,130,0.2), rgba(76,175,130,0.05))", border: "2px solid rgba(76,175,130,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
            <Check size={36} color="#4caf82" />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>Check your email! 📬</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6, marginBottom: 12 }}>
            We sent a verification link to:
          </p>
          <p style={{ color: "white", fontWeight: 700, fontSize: 16, marginBottom: 24, padding: "12px 20px", background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
            {form.email}
          </p>

          {verifyUrl && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: "var(--radius-md)", padding: "16px 20px", marginBottom: 16 }}>
                <p style={{ color: "#a0a0b8", fontSize: 12, margin: "0 0 10px", fontWeight: 600 }}>
                  📌 CLICK BELOW TO VERIFY YOUR EMAIL
                </p>
                <a
                  href={verifyUrl}
                  style={{ display: "block", background: "var(--gradient-primary)", color: "white", textDecoration: "none", padding: "14px 24px", borderRadius: "var(--radius-full)", fontWeight: 700, fontSize: 15, textAlign: "center" }}
                >
                  ✅ Verify My Email Now
                </a>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: 11, textAlign: "center" }}>
                (This link also arrives in your inbox for future logins)
              </p>
            </div>
          )}

          <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
            Once verified, you'll be signed in automatically and taken to the app.
          </p>
          <Link href="/login" className="btn-secondary" style={{ display: "block", padding: "14px", fontSize: 15, textDecoration: "none", textAlign: "center" }}>
            Go to Login instead →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: "-10%", right: "-10%", width: 500, height: 500, background: "rgba(232,51,109,0.08)", borderRadius: "50%", filter: "blur(100px)" }} />
      <div style={{ position: "fixed", bottom: "-10%", left: "-10%", width: 400, height: 400, background: "rgba(108,99,255,0.06)", borderRadius: "50%", filter: "blur(80px)" }} />

      <div style={{ width: "100%", maxWidth: 480, position: "relative" }} className="animate-fade-in">
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Heart size={20} fill="white" color="white" />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "white" }}>
              Kenya<span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>dates</span>
            </span>
          </Link>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Step {step} of {TOTAL_STEPS}</span>
            <span style={{ fontSize: 13, color: "var(--accent-secondary)" }}>{Math.round((step / TOTAL_STEPS) * 100)}% complete</span>
          </div>
          <div style={{ height: 4, background: "var(--bg-surface)", borderRadius: 99 }}>
            <div style={{ height: "100%", width: `${(step / TOTAL_STEPS) * 100}%`, background: "var(--gradient-primary)", borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            {STEP_ICONS.slice(0, TOTAL_STEPS).map((Icon, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: i + 1 < step ? "var(--gradient-primary)" : i + 1 === step ? "rgba(232,51,109,0.15)" : "var(--bg-surface)",
                  border: i + 1 === step ? "2px solid var(--accent-primary)" : "2px solid transparent",
                  transition: "all 0.3s"
                }}>
                  {i + 1 < step
                    ? <Check size={14} color="white" />
                    : <Icon size={14} color={i + 1 === step ? "var(--accent-primary)" : "var(--text-muted)"} />
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="glass" style={{ borderRadius: "var(--radius-xl)", padding: 32 }}>

          {/* Error banner */}
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(232,51,109,0.1)", border: "1px solid rgba(232,51,109,0.3)", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: 20, color: "#ff6b9d", fontSize: 14 }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          {/* ── STEP 1: Account ── */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Create Account 💖</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>Start your journey to finding love</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>
                    Email Address <span style={{ color: "var(--accent-primary)" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      className="input"
                      type="email"
                      placeholder="you@example.com"
                      style={{ paddingLeft: 42 }}
                      value={form.email}
                      onChange={e => update("email", e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
                    📧 We'll send a verification link here to activate your account
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>
                    Phone Number <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14 }}>🇰🇪 +254</span>
                    <input
                      className="input"
                      type="tel"
                      placeholder="7XX XXX XXX"
                      style={{ paddingLeft: 90 }}
                      value={form.phone}
                      onChange={e => update("phone", e.target.value)}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>
                    Password <span style={{ color: "var(--accent-primary)" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="input"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 6 characters"
                      style={{ paddingRight: 48 }}
                      value={form.password}
                      onChange={e => update("password", e.target.value)}
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {form.password && (
                    <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                      {[...Array(4)].map((_, i) => (
                        <div key={i} style={{
                          flex: 1, height: 3, borderRadius: 99,
                          background: form.password.length > i * 2 + 2
                            ? (form.password.length >= 10 ? "#4caf82" : form.password.length >= 6 ? "#f5c542" : "#e8336d")
                            : "var(--bg-surface)"
                        }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 20 }}>
                By continuing, you agree to our{" "}
                <Link href="#" style={{ color: "var(--accent-secondary)" }}>Terms</Link> &{" "}
                <Link href="#" style={{ color: "var(--accent-secondary)" }}>Privacy Policy</Link>
              </p>
            </div>
          )}

          {/* ── STEP 2: Profile ── */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Tell us about you ✨</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>This is how you'll appear to others</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>
                    Your First Name <span style={{ color: "var(--accent-primary)" }}>*</span>
                  </label>
                  <input className="input" placeholder="e.g. Amina" value={form.name} onChange={e => update("name", e.target.value)} />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>
                    Date of Birth <span style={{ color: "var(--accent-primary)" }}>*</span>
                  </label>
                  <input
                    className="input"
                    type="date"
                    value={form.dob}
                    onChange={e => update("dob", e.target.value)}
                    style={{ colorScheme: "dark" }}
                    max={new Date(Date.now() - 18 * 365.25 * 24 * 3600 * 1000).toISOString().split("T")[0]}
                  />
                  {form.dob && <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>Age: {calcAge(form.dob)} years old</p>}
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>
                    I am a... <span style={{ color: "var(--accent-primary)" }}>*</span>
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {GENDERS.map(g => (
                      <button key={g} onClick={() => update("gender", g)} style={{
                        padding: "12px", borderRadius: "var(--radius-md)", border: "2px solid", cursor: "pointer", fontWeight: 600, fontSize: 14,
                        borderColor: form.gender === g ? "var(--accent-primary)" : "var(--border)",
                        background: form.gender === g ? "rgba(232,51,109,0.1)" : "var(--bg-surface)",
                        color: form.gender === g ? "white" : "var(--text-secondary)",
                        transition: "all 0.2s"
                      }}>{g}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>
                    Looking for... <span style={{ color: "var(--accent-primary)" }}>*</span>
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {["Men", "Women", "Everyone"].map(g => (
                      <button key={g} onClick={() => update("seeking", g)} style={{
                        padding: "12px", borderRadius: "var(--radius-md)", border: "2px solid", cursor: "pointer", fontWeight: 600, fontSize: 14,
                        borderColor: form.seeking === g ? "var(--accent-primary)" : "var(--border)",
                        background: form.seeking === g ? "rgba(232,51,109,0.1)" : "var(--bg-surface)",
                        color: form.seeking === g ? "white" : "var(--text-secondary)",
                        transition: "all 0.2s"
                      }}>{g}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Goals ── */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>What are you looking for? 💘</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>Be honest — it helps us find your best matches</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {GOALS.map(g => (
                  <button key={g.id} onClick={() => update("goal", g.id)} style={{
                    padding: "16px 20px", borderRadius: "var(--radius-md)", border: "2px solid", cursor: "pointer", textAlign: "left",
                    borderColor: form.goal === g.id ? "var(--accent-primary)" : "var(--border)",
                    background: form.goal === g.id ? "rgba(232,51,109,0.1)" : "var(--bg-surface)",
                    transition: "all 0.2s", display: "flex", alignItems: "center", gap: 16
                  }}>
                    <span style={{ fontSize: 30 }}>{g.emoji}</span>
                    <span style={{ fontWeight: 600, fontSize: 15, color: form.goal === g.id ? "white" : "var(--text-secondary)" }}>{g.label}</span>
                    {form.goal === g.id && (
                      <div style={{ marginLeft: "auto", width: 24, height: 24, borderRadius: "50%", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Check size={13} color="white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 4: Interests ── */}
          {step === 4 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Your interests 🎯</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>
                Pick up to 10 things you love ({form.interests.length}/10)
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
                {INTERESTS.map(interest => (
                  <button key={interest} onClick={() => toggleInterest(interest)} style={{
                    padding: "10px 16px", borderRadius: "var(--radius-full)", border: "2px solid", cursor: "pointer", fontSize: 13, fontWeight: 600,
                    borderColor: form.interests.includes(interest) ? "var(--accent-primary)" : "var(--border)",
                    background: form.interests.includes(interest) ? "rgba(232,51,109,0.15)" : "var(--bg-surface)",
                    color: form.interests.includes(interest) ? "white" : "var(--text-secondary)",
                    transition: "all 0.2s"
                  }}>{interest}</button>
                ))}
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>You can skip this and add later from your profile settings.</p>
            </div>
          )}

          {/* ── STEP 5: Photos & Location ── */}
          {step === 5 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Almost done! 📸</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>Add photos and your location</p>

              {/* Photo grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <label
                    key={i}
                    style={{
                      aspectRatio: "3/4",
                      borderRadius: "var(--radius-md)",
                      border: `2px dashed ${i === 0 ? "var(--accent-primary)" : "var(--border)"}`,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      gap: 6, cursor: "pointer",
                      background: photos[i] ? "transparent" : (i === 0 ? "rgba(232,51,109,0.05)" : "var(--bg-surface)"),
                      backgroundImage: photos[i] ? `url(${photos[i]})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      overflow: "hidden",
                      position: "relative",
                      transition: "all 0.2s"
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      ref={el => { fileRefs.current[i] = el; }}
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          handlePhotoSelect(i, e.target.files[0]);
                        }
                      }}
                    />
                    {!photos[i] && (
                      <>
                        <Camera size={20} color={i === 0 ? "var(--accent-primary)" : "var(--text-muted)"} />
                        {i === 0 && <span style={{ fontSize: 9, color: "var(--accent-primary)", fontWeight: 700, letterSpacing: 1 }}>MAIN</span>}
                      </>
                    )}
                    {photos[i] && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "0")}>
                        <Camera size={20} color="white" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>📌 Tap any box to upload a photo from your device</p>

              {/* Location */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>City</label>
                  <input className="input" placeholder="e.g. Nairobi" value={form.city} onChange={e => update("city", e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>County</label>
                  <select className="input" value={form.county} onChange={e => update("county", e.target.value)} style={{ cursor: "pointer" }}>
                    {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 16, padding: 16, background: "rgba(245,197,66,0.08)", borderRadius: "var(--radius-md)", border: "1px solid rgba(245,197,66,0.2)" }}>
                <p style={{ fontSize: 13, color: "#f5c542", fontWeight: 600, marginBottom: 4 }}>🎁 Get 50 Free Coins on signup!</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Verify your phone number after signing up to earn 150 bonus coins and get the ✅ Verified badge.</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            {step > 1 && (
              <button
                onClick={() => { setStep(s => s - 1); setError(""); }}
                className="btn-secondary"
                style={{ flex: 1, padding: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <button
              onClick={step < TOTAL_STEPS ? nextStep : handleRegister}
              className="btn-primary"
              style={{ flex: 2, padding: 14, fontSize: 15, opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              disabled={loading}
            >
              {loading ? "Creating account..." : step === TOTAL_STEPS
                ? "Create My Profile 🎉"
                : <><span>Continue</span> <ArrowRight size={16} /></>
              }
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
