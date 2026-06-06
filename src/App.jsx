import { useState, useEffect, useRef } from "react";

// ===================== CONFIG =====================
const TELEGRAM_GROUP_LINK = "https://t.me/+J9-VwYyIYVdiYjI1"; // <-- Apna group link
const TELEGRAM_BOT_TOKEN = "8997855038:AAEWt7J6hgNwo_biR7MSdVXWtMFVXHdeVmg";                // <-- Apna bot token
const TELEGRAM_CHAT_ID = "-5202050403";                    // <-- Apna chat/group ID
// ==================================================

const plans = [
  { id: 1, invest: 100, returns: 200, label: "Starter", icon: "🌱", color: "#f6c90e" },
  { id: 2, invest: 200, returns: 400, label: "Growth", icon: "📈", color: "#4caf50" },
  { id: 3, invest: 500, returns: 900, label: "Pro", icon: "💎", color: "#00bcd4" },
  { id: 4, invest: 1000, returns: 2100, label: "Elite", icon: "🚀", color: "#ff9800" },
];

const disclaimer = `Investment Disclaimer: Investments are subject to market risks. Before making any investment decision, carefully consider your financial situation, investment objectives, and risk tolerance. Past performance is not indicative of future results. The information provided is for educational and informational purposes only and should not be considered financial, investment, legal, or tax advice. Always conduct your own research and, if necessary, consult a qualified financial advisor before investing.`;

// Send Telegram message to admin
async function sendTelegramNotification(message) {
  if (TELEGRAM_BOT_TOKEN === "8997855038:AAEWt7J6hgNwo_biR7MSdVXWtMFVXHdeVmg") return; // skip if not configured
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "HTML" }),
    });
  } catch (e) {}
}

// Animated counter
function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}</span>;
}

// Marquee trust strip
function TrustMarquee() {
  const text = "✅ 1,000,000+ Trusted People  •  💰 Safe & Secure Investments  •  🏆 #1 Investment Platform  •  🌍 Worldwide Trusted  •  ";
  return (
    <div style={mq.marqueeWrap}>
      <div style={mq.marqueeTrack}>
        <span style={mq.marqueeText}>{text}{text}</span>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home"); // "home" | "withdraw"
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Withdrawal page state
  const [wName, setWName] = useState("");
  const [wAmount, setWAmount] = useState("");
  const [wPlan, setWPlan] = useState("");
  const [wInvestDate, setWInvestDate] = useState("");
  const [wMsg, setWMsg] = useState(null); // {type, text}
  const [wLoading, setWLoading] = useState(false);

  const handleInvest = (plan) => { setSelected(plan); setShowModal(true); };
  const handleJoinTelegram = () => { window.open(TELEGRAM_GROUP_LINK, "_blank"); setShowModal(false); };

  // Check if 1 month has passed
  function isOneMonthPassed(dateStr) {
    if (!dateStr) return false;
    const invested = new Date(dateStr);
    const now = new Date();
    const diff = now - invested;
    return diff >= 30 * 24 * 60 * 60 * 1000;
  }

  async function handleWithdraw() {
    if (!wName || !wAmount || !wPlan || !wInvestDate) {
      setWMsg({ type: "error", text: "⚠️ Sab fields bharein (naam, amount, plan, invest date)" });
      return;
    }
    setWLoading(true);
    setWMsg(null);

    const passed = isOneMonthPassed(wInvestDate);

    if (!passed) {
      // 1 month nahi hua — koi notification nahi, sirf user ko message
      setWMsg({
        type: "warn",
        text: "⏳ Abhi 1 mahina poora nahi hua hai. Aap sirf 1 mahine baad withdrawal kar sakte hain. Notification nahi bheja gaya.",
      });
      setWLoading(false);
      return;
    }

    // 1 month ho gaya — Telegram notification bhejo
    const msg =
      `🔔 <b>WITHDRAWAL REQUEST</b>\n\n` +
      `👤 Naam: <b>${wName}</b>\n` +
      `💰 Amount: <b>₹${wAmount}</b>\n` +
      `📦 Plan: <b>${wPlan}</b>\n` +
      `📅 Invest Date: <b>${wInvestDate}</b>\n` +
      `✅ Status: 1 Month Complete — Withdrawal Approved\n` +
      `🕐 Request Time: ${new Date().toLocaleString("en-IN")}`;

    await sendTelegramNotification(msg);

    setWMsg({
      type: "success",
      text: "✅ Withdrawal request bhej di gayi! Aapke Telegram group par notification aa gaya. Jaldi process hoga.",
    });
    setWLoading(false);
  }

  return (
    <div style={styles.root}>
      <style>{cssAnim}</style>
      <div style={styles.blob1} /><div style={styles.blob2} /><div style={styles.blob3} />

      {/* NAV TABS */}
      <div style={styles.navBar}>
        <button style={{ ...styles.navBtn, ...(page === "home" ? styles.navActive : {}) }} onClick={() => setPage("home")}>🏠 Home</button>
        <button style={{ ...styles.navBtn, ...(page === "withdraw" ? styles.navActive : {}) }} onClick={() => setPage("withdraw")}>💸 Withdrawal</button>
      </div>

      {/* ============ HOME PAGE ============ */}
      {page === "home" && (
        <>
          <div style={styles.header}>
            <div style={styles.logoRow}><span style={styles.logoIcon}>💰</span><span style={styles.logoText}>InvestBot</span></div>
            <p style={styles.tagline}>Smart Investing • 1 Month Returns</p>
          </div>
          <div style={styles.hero}>
            <h1 style={styles.heroTitle}>Apna Paisa <span style={styles.heroAccent}>Grow</span> Karo</h1>
            <p style={styles.heroSub}>Invest today, double your money in 1 month. Trusted & Transparent.</p>
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

          {/* TRUST MARQUEE */}
          <TrustMarquee />

          <div style={styles.sectionTitle}>⚡ Kaise Kaam Karta Hai?</div>
          <div style={styles.stepsRow}>
            {[["1","Plan Select Karo","Apne budget ke hisaab se plan chunein"],["2","Telegram Join Karo","Hamare group mein join ho kar payment karo"],["3","Return Pao","1 mahine mein apna doubled amount pao"]].map(([num,title,desc]) => (
              <div key={num} style={styles.stepCard}>
                <div style={styles.stepNum}>{num}</div>
                <div style={{ flex: 1 }}><div style={styles.stepTitle}>{title}</div><div style={styles.stepDesc}>{desc}</div></div>
              </div>
            ))}
          </div>

          <div style={styles.disclaimerBox}>
            <button style={styles.discBtn} onClick={() => setShowDisclaimer(!showDisclaimer)}>⚠️ Investment Disclaimer {showDisclaimer ? "▲" : "▼"}</button>
            {showDisclaimer && <p style={styles.discText}>{disclaimer}</p>}
          </div>
          <div style={styles.footer}>© 2024 InvestBot • All Rights Reserved</div>
        </>
      )}

      {/* ============ WITHDRAWAL PAGE ============ */}
      {page === "withdraw" && (
        <div style={wd.root}>
          <div style={wd.header}>
            <div style={wd.headerIcon}>💸</div>
            <h2 style={wd.headerTitle}>Withdrawal Request</h2>
            <p style={wd.headerSub}>Apna invest + profit nikaal lo</p>
          </div>

          {/* Info cards */}
          <div style={wd.infoRow}>
            <div style={{ ...wd.infoCard, borderColor: "#4caf50" }}>
              <div style={wd.infoIcon}>✅</div>
              <div style={wd.infoText}>1 Month ke baad withdrawal hogi</div>
            </div>
            <div style={{ ...wd.infoCard, borderColor: "#f44336" }}>
              <div style={wd.infoIcon}>🚫</div>
              <div style={wd.infoText}>1 Month se pehle notification nahi jaega</div>
            </div>
          </div>

          {/* Form */}
          <div style={wd.form}>
            <div style={wd.fieldLabel}>👤 Aapka Naam</div>
            <input style={wd.input} placeholder="Apna naam likhein" value={wName} onChange={e => setWName(e.target.value)} />

            <div style={wd.fieldLabel}>💰 Withdrawal Amount (₹)</div>
            <input style={wd.input} type="number" placeholder="Amount likhein (invest + profit)" value={wAmount} onChange={e => setWAmount(e.target.value)} />

            <div style={wd.fieldLabel}>📦 Plan Select Karo</div>
            <select style={wd.select} value={wPlan} onChange={e => setWPlan(e.target.value)}>
              <option value="">-- Plan chunein --</option>
              {plans.map(p => (
                <option key={p.id} value={p.label}>
                  {p.icon} {p.label} — ₹{p.invest} → ₹{p.returns}
                </option>
              ))}
            </select>

            <div style={wd.fieldLabel}>📅 Invest Ki Tarikh</div>
            <input style={wd.input} type="date" value={wInvestDate} onChange={e => setWInvestDate(e.target.value)} />

            {wInvestDate && (
              <div style={{ ...wd.statusBadge, background: isOneMonthPassed(wInvestDate) ? "rgba(76,175,80,0.15)" : "rgba(244,67,54,0.12)", borderColor: isOneMonthPassed(wInvestDate) ? "#4caf50" : "#f44336", color: isOneMonthPassed(wInvestDate) ? "#4caf50" : "#f44336" }}>
                {isOneMonthPassed(wInvestDate) ? "✅ 1 Month poora ho gaya — Withdrawal allowed!" : "⏳ Abhi 1 month nahi hua — Withdrawal blocked"}
              </div>
            )}

            <button
              style={{ ...wd.withdrawBtn, opacity: wLoading ? 0.7 : 1 }}
              onClick={handleWithdraw}
              disabled={wLoading}
            >
              {wLoading ? "⏳ Processing..." : "💸 Withdrawal Request Bhejo"}
            </button>

            {wMsg && (
              <div style={{
                ...wd.msgBox,
                background: wMsg.type === "success" ? "rgba(76,175,80,0.15)" : wMsg.type === "warn" ? "rgba(255,152,0,0.15)" : "rgba(244,67,54,0.15)",
                borderColor: wMsg.type === "success" ? "#4caf50" : wMsg.type === "warn" ? "#ff9800" : "#f44336",
                color: wMsg.type === "success" ? "#4caf50" : wMsg.type === "warn" ? "#ff9800" : "#f44336",
              }}>
                {wMsg.text}
              </div>
            )}
          </div>

          {/* How withdrawal works */}
          <div style={styles.sectionTitle}>📋 Withdrawal Rules</div>
          <div style={wd.rulesList}>
            {[
              ["🟢", "1 Month baad full amount + profit withdraw kar sakte ho"],
              ["🔴", "1 Month se pehle withdrawal request blocked hai"],
              ["📱", "1 Month baad request karte hi Telegram group par notification aata hai"],
              ["⏱️", "Approval 24-48 ghante mein hogi"],
            ].map(([icon, text], i) => (
              <div key={i} style={wd.ruleItem}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ fontSize: 13, color: "#ccc" }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Trust Marquee */}
          <TrustMarquee />
          <div style={styles.footer}>© 2024 InvestBot • All Rights Reserved</div>
        </div>
      )}

      {/* Invest Modal */}
      {showModal && selected && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalIcon}>{selected.icon}</div>
            <h2 style={styles.modalTitle}>{selected.label} Plan Selected!</h2>
            <div style={styles.modalDetail}>
              <span>Invest: <b style={{ color: "#f6c90e" }}>₹{selected.invest}</b></span>
              <span style={{ margin: "0 10px", color: "#aaa" }}>→</span>
              <span>Return: <b style={{ color: selected.color }}>₹{selected.returns}</b></span>
            </div>
            <p style={styles.modalMsg}>Payment ke liye hamare <b>Telegram Group</b> join karo. Wahan aapko payment details aur support milega.</p>
            <button style={styles.telegramBtn} onClick={handleJoinTelegram}>📱 Telegram Group Join Karo</button>
            <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ MARQUEE CSS ============
const cssAnim = `
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

const mq = {
  marqueeWrap: {
    overflow: "hidden", margin: "24px 0 0",
    background: "rgba(246,201,14,0.08)",
    borderTop: "1px solid rgba(246,201,14,0.2)",
    borderBottom: "1px solid rgba(246,201,14,0.2)",
    padding: "10px 0",
  },
  marqueeTrack: { display: "inline-block", animation: "marquee 18s linear infinite", whiteSpace: "nowrap" },
  marqueeText: { fontSize: 13, fontWeight: 700, color: "#f6c90e", letterSpacing: 0.5 },
};

// ============ WITHDRAWAL PAGE STYLES ============
const wd = {
  root: { padding: "0 0 40px" },
  header: { textAlign: "center", padding: "30px 20px 10px" },
  headerIcon: { fontSize: 48 },
  headerTitle: { fontSize: 24, fontWeight: 900, margin: "8px 0 4px", color: "#fff" },
  headerSub: { color: "#aaa", fontSize: 13 },
  infoRow: { display: "flex", gap: 12, padding: "16px 16px 0", maxWidth: 460, margin: "0 auto" },
  infoCard: {
    flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 12,
    padding: "12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
    border: "1px solid", textAlign: "center",
  },
  infoIcon: { fontSize: 22 },
  infoText: { fontSize: 11, color: "#bbb", lineHeight: 1.4 },
  form: {
    maxWidth: 460, margin: "20px auto 0", padding: "0 16px",
    display: "flex", flexDirection: "column", gap: 10,
  },
  fieldLabel: { fontSize: 13, fontWeight: 700, color: "#ccc", marginBottom: 2 },
  input: {
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14,
    outline: "none", width: "100%", boxSizing: "border-box",
  },
  select: {
    background: "#0f1f0f", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 13,
    outline: "none", width: "100%", boxSizing: "border-box",
  },
  statusBadge: {
    padding: "10px 14px", borderRadius: 10, border: "1px solid",
    fontSize: 12, fontWeight: 700, textAlign: "center",
  },
  withdrawBtn: {
    marginTop: 4, padding: "14px 0", borderRadius: 12, border: "none",
    background: "linear-gradient(90deg, #f6c90e, #4caf50)",
    color: "#000", fontWeight: 900, fontSize: 15, cursor: "pointer",
    letterSpacing: 0.3,
  },
  msgBox: {
    padding: "14px 16px", borderRadius: 12, border: "1px solid",
    fontSize: 13, fontWeight: 600, lineHeight: 1.6, textAlign: "center",
  },
  rulesList: {
    maxWidth: 460, margin: "0 auto", padding: "0 16px",
    display: "flex", flexDirection: "column", gap: 10,
  },
  ruleItem: {
    display: "flex", alignItems: "center", gap: 12,
    background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 14px",
    border: "1px solid rgba(255,255,255,0.07)",
  },
};

// ============ MAIN STYLES ============
const styles = {
  root: { minHeight: "100vh", background: "linear-gradient(135deg, #0a1a0a 0%, #0d2a0d 40%, #1a1a00 100%)", color: "#fff", fontFamily: "'Segoe UI', sans-serif", position: "relative", overflow: "hidden", paddingBottom: 40 },
  blob1: { position: "fixed", top: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(246,201,14,0.08)", filter: "blur(60px)", pointerEvents: "none" },
  blob2: { position: "fixed", bottom: 0, right: -60, width: 250, height: 250, borderRadius: "50%", background: "rgba(76,175,80,0.10)", filter: "blur(50px)", pointerEvents: "none" },
  blob3: { position: "fixed", top: "40%", left: "50%", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,152,0,0.06)", filter: "blur(70px)", pointerEvents: "none" },
  navBar: { display: "flex", borderBottom: "1px solid rgba(246,201,14,0.15)", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 50 },
  navBtn: { flex: 1, padding: "14px 0", background: "none", border: "none", color: "#888", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s" },
  navActive: { color: "#f6c90e", borderBottom: "2px solid #f6c90e" },
  header: { padding: "24px 20px 8px", display: "flex", flexDirection: "column", alignItems: "center" },
  logoRow: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: { fontSize: 32 },
  logoText: { fontSize: 26, fontWeight: 800, letterSpacing: 1, background: "linear-gradient(90deg, #f6c90e, #4caf50)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  tagline: { color: "#aaa", fontSize: 13, margin: "4px 0 0" },
  hero: { textAlign: "center", padding: "30px 20px 10px" },
  heroTitle: { fontSize: 28, fontWeight: 900, margin: 0, lineHeight: 1.2 },
  heroAccent: { background: "linear-gradient(90deg, #f6c90e, #4caf50)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSub: { color: "#bbb", fontSize: 14, marginTop: 10 },
  statsRow: { display: "flex", justifyContent: "center", gap: 12, padding: "16px 20px", flexWrap: "wrap" },
  statBox: { background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 20px", textAlign: "center", minWidth: 80, border: "1px solid rgba(246,201,14,0.15)" },
  statVal: { display: "block", fontSize: 20, fontWeight: 800, color: "#f6c90e" },
  statLbl: { display: "block", fontSize: 11, color: "#888", marginTop: 2 },
  sectionTitle: { textAlign: "center", fontSize: 18, fontWeight: 700, color: "#f6c90e", margin: "28px 0 16px", letterSpacing: 0.5 },
  plansGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, padding: "0 16px", maxWidth: 480, margin: "0 auto" },
  planCard: { background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "18px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" },
  planIcon: { fontSize: 28 },
  planLabel: { fontSize: 15, fontWeight: 800, color: "#fff" },
  planDuration: { fontSize: 11, color: "#888", background: "rgba(255,255,255,0.08)", borderRadius: 20, padding: "2px 10px" },
  planRow: { display: "flex", alignItems: "center", gap: 6, marginTop: 8 },
  planCol: { display: "flex", flexDirection: "column", alignItems: "center" },
  planMeta: { fontSize: 10, color: "#888" },
  planAmt: { fontSize: 17, fontWeight: 800 },
  arrowCol: { fontSize: 16, color: "#555", marginTop: 8 },
  profitBadge: { background: "rgba(76,175,80,0.15)", color: "#4caf50", fontSize: 11, borderRadius: 20, padding: "3px 12px", border: "1px solid rgba(76,175,80,0.3)", fontWeight: 700 },
  investBtn: { marginTop: 6, width: "100%", padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 13, color: "#000", letterSpacing: 0.3 },
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
  modal: { background: "linear-gradient(160deg, #0f2a0f 0%, #1a1a05 100%)", borderRadius: 20, padding: "30px 24px", maxWidth: 340, width: "100%", textAlign: "center", border: "1px solid rgba(246,201,14,0.25)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" },
  modalIcon: { fontSize: 48, marginBottom: 8 },
  modalTitle: { fontSize: 20, fontWeight: 800, margin: "0 0 12px" },
  modalDetail: { display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 16px", marginBottom: 14, fontSize: 16 },
  modalMsg: { color: "#aaa", fontSize: 13, lineHeight: 1.6, marginBottom: 20 },
  telegramBtn: { width: "100%", padding: "13px 0", borderRadius: 12, background: "linear-gradient(90deg, #2196f3, #00bcd4)", color: "#fff", fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", marginBottom: 10, letterSpacing: 0.3 },
  cancelBtn: { width: "100%", padding: "10px 0", borderRadius: 12, background: "rgba(255,255,255,0.07)", color: "#888", fontWeight: 600, fontSize: 13, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" },
};
