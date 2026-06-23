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

const cssAnim = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
  @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  @keyframes loginBoxIn { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-20px); } }
  @keyframes gradSpin { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }
  @keyframes shimmer { 0% { left:-100%; } 100% { left:100%; } }
  @keyframes slideBar { 0% { background-position:0%; } 100% { background-position:200%; } }
  .nav-btn { transition: all 0.2s; }
  .plan-card-hover { transition: transform 0.2s; }
  .plan-card-hover:hover { transform: translateY(-4px); }
  .submit-btn::before { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent); animation:shimmer 2.5s infinite; }
  input::placeholder { color: rgba(255,255,255,0.2) !important; }
  select option { background: #0f2a15; color: #fff; }
`;function TrustMarquee() {
  const text = "✅ 1,000,000+ Trusted People • 💰 Safe & Secure Investments • 🏆 #1 Investment Platform • 🌍 Worldwide Trusted • ";
  return (
    <div style={{ overflow:"hidden", margin:"24px 0 0", background:"rgba(246,201,14,0.06)", borderTop:"1px solid rgba(246,201,14,0.15)", borderBottom:"1px solid rgba(246,201,14,0.15)", padding:"10px 0" }}>
      <div style={{ display:"inline-block", animation:"marquee 18s linear infinite", whiteSpace:"nowrap" }}>
        <span style={{ fontSize:13, fontWeight:700, color:"#f6c90e" }}>{text}{text}</span>
      </div>
    </div>
  );
}

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
    } catch (e) { setError("⚠️ Email nahi mila ya kuch galat hua"); }
    setLoading(false);
  }

  async function handleGoogle() {
    setError(""); setLoading(true);
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (e) { setError("⚠️ Google login failed"); setLoading(false); }
  }

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#060d0a,#0a1f0e,#060d0a)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, position:"relative", overflow:"hidden" }}>
      <style>{cssAnim}</style>
      <div style={{ position:"fixed", top:-100, left:-80, width:350, height:350, borderRadius:"50%", background:"rgba(34,197,94,0.1)", filter:"blur(80px)", pointerEvents:"none" }} />
      <div style={{ position:"fixed", bottom:0, right:-60, width:280, height:280, borderRadius:"50%", background:"rgba(16,185,129,0.08)", filter:"blur(70px)", pointerEvents:"none" }} />
      <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:28, padding:"36px 28px", maxWidth:380, width:"100%", border:"1px solid rgba(255,255,255,0.1)", backdropFilter:"blur(30px)", animation:"loginBoxIn 0.5s ease", display:"flex", flexDirection:"column", gap:14, position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:4 }}>
          <div style={{ width:64, height:64, background:"linear-gradient(135deg,rgba(74,222,128,0.2),rgba(16,185,129,0.1))", border:"1px solid rgba(74,222,128,0.3)", borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, margin:"0 auto 12px" }}>💰</div>
          <div style={{ fontSize:26, fontWeight:900, background:"linear-gradient(90deg,#4ade80,#f6c90e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>InvestBot</div>
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginTop:4 }}>Smart Investing • 1 Month Returns</p>
        </div>
        <div style={{ display:"flex", borderRadius:12, overflow:"hidden", border:"1px solid rgba(255,255,255,0.08)", background:"rgba(0,0,0,0.2)" }}>
          {["login","register"].map(m => (
            <button key={m} style={{ flex:1, padding:"11px 0", background: mode===m ? "rgba(74,222,128,0.15)" : "none", border:"none", color: mode===m ? "#4ade80" : "rgba(255,255,255,0.4)", fontWeight:700, fontSize:14, cursor:"pointer" }} onClick={() => { setMode(m); setError(""); }}>
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
        <button style={{ padding:"14px 0", borderRadius:13, border:"none", background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer", opacity: loading ? 0.7 : 1, position:"relative", overflow:"hidden" }} className="submit-btn" onClick={handleEmailAuth} disabled={loading}>
          {loading ? "⏳ Please wait..." : mode === "login" ? "🔑 Login" : "📝 Register"}
        </button>
        <div style={{ textAlign:"center", color:"rgba(255,255,255,0.25)", fontSize:12 }}>ya</div>
        <button style={{ padding:"12px 0", borderRadius:12, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.05)", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity: loading ? 0.7 : 1 }} onClick={handleGoogle} disabled={loading}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" style={{ width:20, height:20 }} /> Google se Login
        </button>
      </div>
    </div>
  );
}export default function App() {
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
    const sure = window.confirm("⚠️ Pakka account delete karna hai?");
    if (!sure) return;
    try {
      await deleteUser(auth.currentUser);
    } catch (e) {
      if (e.code === "auth/requires-recent-login") {
        alert("Security ke liye pehle logout karke dobara login karo.");
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

  const navItems = [
    { id:"home", icon:"🏠", label:"Home" },
    { id:"withdraw", icon:"💸", label:"Withdraw" },
    { id:"profile", icon:"👤", label:"Profile" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#060d0a", color:"#fff", position:"relative", overflow:"hidden", paddingBottom:40 }}>
      <style>{cssAnim}</style>
      <div style={{ position:"fixed", top:-100, left:-80, width:350, height:350, borderRadius:"50%", background:"rgba(34,197,94,0.08)", filter:"blur(80px)", pointerEvents:"none", animation:"float 8s ease-in-out infinite" }} />
      <div style={{ position:"fixed", bottom:0, right:-60, width:280, height:280, borderRadius:"50%", background:"rgba(16,185,129,0.06)", filter:"blur(70px)", pointerEvents:"none", animation:"float 10s ease-in-out infinite 3s" }} />

      <div style={{ display:"flex", background:"rgba(0,0,0,0.6)", backdropFilter:"blur(30px)", borderBottom:"1px solid rgba(255,255,255,0.05)", position:"sticky", top:0, zIndex:100 }}>
        {navItems.map(n => (
          <button key={n.id} className="nav-btn" style={{ flex:1, padding:"12px 0", background:"none", border:"none", color: page===n.id ? "#4ade80" : "rgba(255,255,255,0.4)", fontWeight:700, fontSize:11, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, borderBottom: page===n.id ? "2px solid #4ade80" : "2px solid transparent" }} onClick={() => setPage(n.id)}>
            <span style={{ fontSize:18, filter: page===n.id ? "drop-shadow(0 0 6px rgba(74,222,128,0.6))" : "none" }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
        <button className="nav-btn" style={{ flex:1, padding:"12px 0", background:"none", border:"none", color:"#f87171", fontWeight:700, fontSize:11, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, borderBottom:"2px solid transparent" }} onClick={() => signOut(auth)}>
          <span style={{ fontSize:18 }}>🚪</span>Logout
        </button>
      </div>

      <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:50, padding:"5px 14px", fontSize:11, color:"rgba(255,255,255,0.4)" }}>
          👋 <span style={{ color:"#4ade80", fontWeight:600 }}>{user.displayName || user.email}</span>
        </div>
      </div>

      {page === "home" && (
        <div style={{ animation:"fadeUp 0.4s ease" }}>
          <div style={{ textAlign:"center", padding:"32px 24px 20px" }}>
            <div style={{ width:72, height:72, background:"linear-gradient(135deg,rgba(74,222,128,0.2),rgba(246,201,14,0.1))", border:"1px solid rgba(74,222,128,0.25)", borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 16px" }}>💰</div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"rgba(74,222,128,0.6)", marginBottom:8 }}>InvestBot</div>
            <h1 style={{ fontSize:30, fontWeight:900, margin:"0 0 8px", letterSpacing:-1 }}>
              Apna Paisa <span style={{ background:"linear-gradient(90deg,#4ade80,#f6c90e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Grow</span> Karo
            </h1>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14, lineHeight:1.5 }}>Invest today, double your money in 1 month.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, padding:"0 20px 24px" }}>
            {[["500+","Investors","#4ade80"],["98%","Success","#f6c90e"],["1 Mo","Returns","#60a5fa"]].map(([val,lbl,clr]) => (
              <div key={lbl} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"14px 8px", textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:900, color:clr }}>{val}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:2, textTransform:"uppercase" }}>{lbl}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,255,255,0.25)", padding:"0 20px 12px" }}>💼 Investment Plans</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, padding:"0 16px", maxWidth:480, margin:"0 auto" }}>
            {plans.map((plan) => (
              <div key={plan.id} className="plan-card-hover" style={{ background:"rgba(255,255,255,0.03)", borderRadius:18, padding:"18px 14px", display:"flex", flexDirection:"column", alignItems:"center", gap:6, border:"1px solid rgba(255,255,255,0.07)", borderTop:`3px solid ${plan.color}` }}>
                <div style={{ fontSize:30 }}>{plan.icon}</div>
                <div style={{ fontSize:15, fontWeight:800, color:"#fff" }}>{plan.label}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", background:"rgba(255,255,255,0.06)", borderRadius:20, padding:"2px 10px" }}>1 Month Plan</div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:6 }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>Invest</div>
                    <div style={{ fontSize:16, fontWeight:800, color:"#f6c90e" }}>₹{plan.invest}</div>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.2)", fontSize:14 }}>→</div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>Return</div>
                    <div style={{ fontSize:16, fontWeight:800, color:plan.color }}>₹{plan.returns}</div>
                  </div>
                </div>
                <div style={{ background:"rgba(76,175,80,0.12)", color:"#4ade80", fontSize:10, borderRadius:20, padding:"3px 12px", border:"1px solid rgba(76,175,80,0.25)", fontWeight:700 }}>+₹{plan.returns - plan.invest} Profit</div>
                <button style={{ marginTop:6, width:"100%", padding:"10px 0", borderRadius:11, border:"none", background:plan.color, color:"#000", fontWeight:800, fontSize:13, cursor:"pointer" }} onClick={() => { setSelected(plan); setShowModal(true); }}>
                  Invest Now
                </button>
              </div>
            ))}
          </div>
          <TrustMarquee />
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,255,255,0.25)", padding:"28px 20px 12px" }}>⚡ Kaise Kaam Karta Hai?</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10, padding:"0 20px", maxWidth:440, margin:"0 auto" }}>
            {[["1","Plan Select Karo","Budget ke hisaab se chunein","#4ade80"],["2","Telegram Join Karo","Payment karo aur confirm karo","#f6c90e"],["3","Return Pao","1 mahine mein doubled amount","#60a5fa"]].map(([num,title,desc,clr]) => (
              <div key={num} style={{ background:"rgba(255,255,255,0.03)", borderRadius:14, padding:"14px 16px", display:"flex", alignItems:"flex-start", gap:14, border:"1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ minWidth:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${clr},${clr}88)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#000", fontWeight:900, fontSize:15 }}>{num}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:"#fff", marginBottom:2 }}>{title}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ margin:"24px 20px 0", padding:"14px 16px", background:"rgba(255,152,0,0.05)", borderRadius:14, border:"1px solid rgba(255,152,0,0.15)" }}>
            <button style={{ background:"none", border:"none", color:"#ff9800", fontWeight:700, fontSize:13, cursor:"pointer", padding:0 }} onClick={() => setShowDisclaimer(!showDisclaimer)}>
              ⚠️ Disclaimer {showDisclaimer ? "▲" : "▼"}
            </button>
            {showDisclaimer && <p style={{ color:"rgba(255,255,255,0.35)", fontSize:11, marginTop:10, lineHeight:1.7 }}>{disclaimer}</p>}
          </div>
          <div style={{ textAlign:"center", color:"rgba(255,255,255,0.15)", fontSize:11, marginTop:28 }}>© 2024 InvestBot • All Rights Reserved</div>
        </div>
      )}{page === "withdraw" && (
        <div style={{ animation:"fadeUp 0.4s ease", paddingBottom:40 }}>
          <div style={{ textAlign:"center", padding:"28px 24px 20px" }}>
            <div style={{ width:72, height:72, background:"linear-gradient(135deg,rgba(74,222,128,0.2),rgba(16,185,129,0.1))", border:"1px solid rgba(74,222,128,0.25)", borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 14px" }}>💸</div>
            <h2 style={{ fontSize:26, fontWeight:900, margin:"0 0 6px", letterSpacing:-0.5 }}>Withdrawal Request</h2>
            <p style={{ color:"rgba(255,255,255,0.35)", fontSize:13 }}>Apna invest + profit nikaal lo</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, margin:"0 20px 24px" }}>
            <div style={{ background:"rgba(74,222,128,0.06)", border:"1px solid rgba(74,222,128,0.25)", borderRadius:16, padding:"16px 12px", textAlign:"center" }}>
              <div style={{ fontSize:22, marginBottom:8 }}>✅</div>
              <div style={{ fontSize:12, fontWeight:700, color:"#4ade80", marginBottom:4 }}>Allowed</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", lineHeight:1.4 }}>1 Month ke baad withdrawal</div>
            </div>
            <div style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:16, padding:"16px 12px", textAlign:"center" }}>
              <div style={{ fontSize:22, marginBottom:8 }}>🚫</div>
              <div style={{ fontSize:12, fontWeight:700, color:"#f87171", marginBottom:4 }}>Blocked</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", lineHeight:1.4 }}>1 Month se pehle nahi</div>
            </div>
          </div>
          <div style={{ margin:"0 20px 16px" }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"rgba(74,222,128,0.6)", marginBottom:10 }}>Personal Info</div>
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:"20px" }}>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.6)", marginBottom:8 }}>👤 Aapka Naam</label>
                <input style={{ width:"100%", background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:14, outline:"none" }} placeholder="Naam likhein" value={wName} onChange={e => setWName(e.target.value)} />
              </div>
              <div>
                <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.6)", marginBottom:8 }}>💰 Amount (₹)</label>
                <input style={{ width:"100%", background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:14, outline:"none" }} type="number" placeholder="Kitna nikalna hai?" value={wAmount} onChange={e => setWAmount(e.target.value)} />
                {wAmount && (
                  <div style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(74,222,128,0.06)", border:"1px solid rgba(74,222,128,0.15)", borderRadius:12, padding:"10px 14px", marginTop:8 }}>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)", flex:1 }}>Withdrawal Amount</span>
                    <span style={{ fontSize:18, fontWeight:800, color:"#4ade80" }}>₹{parseInt(wAmount).toLocaleString("en-IN")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div style={{ margin:"0 20px 16px" }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"rgba(74,222,128,0.6)", marginBottom:10 }}>Investment Details</div>
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:"20px" }}>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.6)", marginBottom:8 }}>📦 Plan</label>
                <div style={{ position:"relative" }}>
                  <select style={{ width:"100%", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"13px 16px", color: wPlan ? "#fff" : "rgba(255,255,255,0.3)", fontSize:14, outline:"none", appearance:"none", WebkitAppearance:"none" }} value={wPlan} onChange={e => setWPlan(e.target.value)}>
                    <option value="">-- Plan chunein --</option>
                    {plans.map(p => (<option key={p.id} value={p.label}>{p.icon} {p.label} — ₹{p.invest} → ₹{p.returns}</option>))}
                  </select>
                  <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.3)", pointerEvents:"none" }}>▾</span>
                </div>
              </div>
              <div>
                <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.6)", marginBottom:8 }}>📅 Invest Ki Tarikh</label>
                <input style={{ width:"100%", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:14, outline:"none", colorScheme:"dark" }} type="date" value={wInvestDate} onChange={e => setWInvestDate(e.target.value)} />
                {wInvestDate && (
                  <div style={{ marginTop:8, padding:"10px 14px", borderRadius:10, border:"1px solid", textAlign:"center", fontSize:12, fontWeight:700, background: isOneMonthPassed(wInvestDate) ? "rgba(74,222,128,0.08)" : "rgba(239,68,68,0.08)", borderColor: isOneMonthPassed(wInvestDate) ? "rgba(74,222,128,0.3)" : "rgba(239,68,68,0.3)", color: isOneMonthPassed(wInvestDate) ? "#4ade80" : "#f87171" }}>
                    {isOneMonthPassed(wInvestDate) ? "✅ Withdrawal allowed!" : "⏳ 1 Month nahi hua abhi"}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div style={{ margin:"0 20px" }}>
            <button className="submit-btn" style={{ width:"100%", padding:"16px", background:"linear-gradient(135deg,#22c55e,#16a34a)", border:"none", borderRadius:14, color:"#fff", fontSize:16, fontWeight:800, cursor:"pointer", position:"relative", overflow:"hidden", opacity: wLoading ? 0.7 : 1 }} onClick={handleWithdraw} disabled={wLoading}>
              {wLoading ? "⏳ Processing..." : "🚀 Withdrawal Request Bhejo"}
            </button>
            {wMsg && (
              <div style={{ marginTop:12, padding:"14px 16px", borderRadius:12, border:"1px solid", fontSize:13, fontWeight:600, textAlign:"center", background: wMsg.type==="success" ? "rgba(74,222,128,0.1)" : wMsg.type==="warn" ? "rgba(255,152,0,0.1)" : "rgba(239,68,68,0.1)", borderColor: wMsg.type==="success" ? "rgba(74,222,128,0.3)" : wMsg.type==="warn" ? "rgba(255,152,0,0.3)" : "rgba(239,68,68,0.3)", color: wMsg.type==="success" ? "#4ade80" : wMsg.type==="warn" ? "#ff9800" : "#f87171" }}>
                {wMsg.text}
              </div>
            )}
            <div style={{ display:"flex", alignItems:"flex-start", gap:10, background:"rgba(251,191,36,0.05)", border:"1px solid rgba(251,191,36,0.12)", borderRadius:12, padding:"12px 14px", marginTop:14 }}>
              <span style={{ fontSize:16, flexShrink:0 }}>⚠️</span>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.35)", lineHeight:1.6 }}><span style={{ color:"rgba(251,191,36,0.7)", fontWeight:600 }}>Note:</span> Request process hone mein 24-48 ghante lag sakte hain.</span>
            </div>
          </div>
          <TrustMarquee />
          <div style={{ textAlign:"center", color:"rgba(255,255,255,0.15)", fontSize:11, marginTop:24 }}>© 2024 InvestBot • All Rights Reserved</div>
        </div>
      )}{page === "profile" && (
        <div style={{ animation:"fadeUp 0.4s ease", paddingBottom:40 }}>
          <div style={{ textAlign:"center", padding:"28px 24px 20px" }}>
            <div style={{ width:92, height:92, borderRadius:"50%", background:"linear-gradient(135deg,#22c55e,#f6c90e,#22c55e)", backgroundSize:"200% 200%", animation:"gradSpin 4s linear infinite", padding:3, margin:"0 auto 14px", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:"#0d1f12", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36 }}>👤</div>
            </div>
            <div style={{ fontSize:20, fontWeight:800, color:"#fff", marginBottom:4 }}>{user.displayName || "Investor"}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginBottom:10 }}>{user.email}</div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:50, padding:"4px 14px", fontSize:11, fontWeight:700, color:"#4ade80" }}>✅ Verified Investor</div>
          </div>
          <div style={{ margin:"0 20px 16px" }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"rgba(255,255,255,0.25)", marginBottom:10 }}>Account Info</div>
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, overflow:"hidden" }}>
              {[
                { icon:"📧", iconBg:"rgba(74,222,128,0.12)", label:"Email", value:user.email },
                { icon:"📅", iconBg:"rgba(96,165,250,0.12)", label:"Member Since", value: user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString("en-IN") : "N/A" },
              ].map((row, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", gap:12 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:row.iconBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{row.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginBottom:2 }}>{row.label}</div>
                    <div style={{ fontSize:13, color:"#fff", fontWeight:600 }}>{row.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ margin:"0 20px 16px" }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"rgba(255,255,255,0.25)", marginBottom:10 }}>Security</div>
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:"18px" }}>
              <button style={{ width:"100%", padding:"13px", borderRadius:13, border:"none", background:"linear-gradient(135deg,rgba(74,222,128,0.2),rgba(16,185,129,0.1))", color:"#4ade80", fontWeight:700, fontSize:14, cursor:"pointer", opacity: pLoading ? 0.7 : 1 }} onClick={handleChangePassword} disabled={pLoading}>
                {pLoading ? "⏳ Please wait..." : "🔑 Change Password"}
              </button>
              {pMsg && (
                <div style={{ marginTop:10, padding:"10px 14px", borderRadius:10, fontSize:13, textAlign:"center", color: pMsg.type==="error" ? "#f87171" : "#4ade80", background: pMsg.type==="error" ? "rgba(239,68,68,0.08)" : "rgba(74,222,128,0.08)", border:`1px solid ${pMsg.type==="error" ? "rgba(239,68,68,0.2)" : "rgba(74,222,128,0.2)"}` }}>{pMsg.text}</div>
              )}
            </div>
          </div>
          <div style={{ margin:"0 20px 16px" }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"rgba(255,255,255,0.25)", marginBottom:10 }}>Settings & Support</div>
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, overflow:"hidden" }}>
              <div style={{ display:"flex", alignItems:"center", padding:"16px", borderBottom:"1px solid rgba(255,255,255,0.04)", gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:"rgba(251,191,36,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🔄</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:"#fff", fontWeight:600 }}>Auto-Renewal</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>Plan automatically renew hoga</div>
                </div>
                <div onClick={toggleAutoRenew} style={{ width:44, height:24, borderRadius:12, background: autoRenew ? "#22c55e" : "rgba(255,255,255,0.12)", position:"relative", cursor:"pointer", transition:"background 0.2s" }}>
                  <div style={{ width:20, height:20, borderRadius:"50%", background:"#fff", position:"absolute", top:2, left: autoRenew ? 22 : 2, transition:"left 0.2s" }} />
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", padding:"16px", borderBottom:"1px solid rgba(255,255,255,0.04)", gap:12, cursor:"pointer" }} onClick={() => alert("📖 Help Center\n\n• Investment ek mahine baad return milta hai\n• Withdrawal sirf 1 month baad allowed hai\n• Koi bhi sawal ho to Contact Support use karo")}>
                <div style={{ width:38, height:38, borderRadius:10, background:"rgba(96,165,250,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📖</div>
                <div style={{ flex:1, fontSize:13, color:"#fff", fontWeight:600 }}>Help Center</div>
                <span style={{ color:"rgba(255,255,255,0.2)", fontSize:16 }}>›</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", padding:"16px", gap:12, cursor:"pointer" }} onClick={() => window.open(TELEGRAM_GROUP_LINK, "_blank")}>
                <div style={{ width:38, height:38, borderRadius:10, background:"rgba(96,165,250,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>💬</div>
                <div style={{ flex:1, fontSize:13, color:"#fff", fontWeight:600 }}>Contact Support</div>
                <span style={{ color:"rgba(255,255,255,0.2)", fontSize:16 }}>›</span>
              </div>
            </div>
          </div>
          <div style={{ margin:"0 20px 16px", background:"linear-gradient(135deg,rgba(251,191,36,0.1),rgba(245,158,11,0.05))", border:"1px solid rgba(251,191,36,0.2)", borderRadius:18, padding:"18px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#f6c90e" }}>🎁 Refer & Earn</div>
              <div style={{ fontSize:11, color:"rgba(251,191,36,0.5)" }}>₹50 per referral</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", background:"rgba(0,0,0,0.25)", border:"1px solid rgba(251,191,36,0.12)", borderRadius:12, overflow:"hidden" }}>
              <div style={{ flex:1, padding:"12px 14px", fontSize:14, fontWeight:800, color:"#f6c90e", letterSpacing:2 }}>{user.uid.slice(0,8).toUpperCase()}</div>
              <button style={{ padding:"12px 14px", background:"rgba(251,191,36,0.15)", fontSize:12, fontWeight:700, color:"#f6c90e", border:"none", borderLeft:"1px solid rgba(251,191,36,0.12)", cursor:"pointer" }} onClick={() => { navigator.clipboard.writeText(`https://abmindia.vercel.app/?ref=${user.uid.slice(0,8)}`); alert("✅ Referral link copied!"); }}>
                📋 Copy
              </button>
            </div>
          </div>
          <div style={{ margin:"0 20px 8px" }}>
            <button style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, width:"100%", padding:"14px", background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:14, color:"#f87171", fontSize:14, fontWeight:700, cursor:"pointer" }} onClick={() => signOut(auth)}>
              🚪 Logout
            </button>
          </div>
          <div style={{ margin:"0 20px" }}>
            <button style={{ width:"100%", padding:"12px", background:"none", border:"none", color:"rgba(255,255,255,0.2)", fontSize:12, cursor:"pointer" }} onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
          <div style={{ height:3, background:"linear-gradient(90deg,#22c55e,#f6c90e,#22c55e)", backgroundSize:"200%", animation:"slideBar 3s linear infinite", margin:"20px 20px 0", borderRadius:2, opacity:0.5 }} />
        </div>
      )}

      {showModal && selected && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:20 }} onClick={() => setShowModal(false)}>
          <div style={{ background:"linear-gradient(160deg,#0f2a0f,#1a1a05)", borderRadius:24, padding:"32px 24px", maxWidth:340, width:"100%", textAlign:"center", border:"1px solid rgba(246,201,14,0.2)", animation:"loginBoxIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize:48, marginBottom:12 }}>{selected.icon}</div>
            <h2 style={{ fontSize:20, fontWeight:900, margin:"0 0 14px" }}>{selected.label} Plan</h2>
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center", background:"rgba(255,255,255,0.05)", borderRadius:14, padding:"14px 18px", marginBottom:16, gap:12 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>Invest</div>
                <div style={{ fontSize:22, fontWeight:900, color:"#f6c90e" }}>₹{selected.invest}</div>
              </div>
              <div style={{ color:"rgba(255,255,255,0.2)", fontSize:20 }}>→</div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>Return</div>
                <div style={{ fontSize:22, fontWeight:900, color:selected.color }}>₹{selected.returns}</div>
              </div>
            </div>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, lineHeight:1.6, marginBottom:20 }}>Telegram Group join karo aur payment karke invest shuru karo!</p>
            <button style={{ width:"100%", padding:"14px", borderRadius:13, background:"linear-gradient(90deg,#2196f3,#00bcd4)", color:"#fff", fontWeight:800, fontSize:15, border:"none", cursor:"pointer", marginBottom:10 }} onClick={() => { window.open(TELEGRAM_GROUP_LINK, "_blank"); setShowModal(false); }}>
              📱 Telegram Join Karo
            </button>
            <button style={{ width:"100%", padding:"11px", borderRadius:12, background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.4)", fontWeight:600, fontSize:13, border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer" }} onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}