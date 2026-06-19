import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

const faqs = [
  { q: "Is this real tax advice?", a: "No. TaxWise helps you choose the right software product only. Always consult a qualified tax professional for actual tax advice." },
  { q: "How does the recommendation work?", a: "You answer a few questions about your tax situation and our engine matches you to the best product based on your answers." },
  { q: "Can I change my answers?", a: "Yes. At any point during the questionnaire you can go back and change your answers." },
  { q: "What if I have both salary and freelance income?", a: "Select all income sources that apply. The engine will recommend the product that covers your full situation." },
];

const previewProducts = [
  { name: "Free", price: 0, desc: "Simple personal return. Salary and student income.", icon: "📄" },
  { name: "Deluxe", price: 30, desc: "Common deductions — medical, donations, employment.", icon: "⭐" },
  { name: "Premier", price: 50, desc: "Investments, capital gains, rental and foreign income.", icon: "📈" },
  { name: "Self-Employed", price: 70, desc: "Freelancers, gig workers, and sole proprietors.", icon: "💼" },
];

const steps = [
  { num: "1", title: "Answer a few questions", desc: "Tell us about your income, deductions, and how much help you want.", icon: "📝" },
  { num: "2", title: "Get your recommendation", desc: "Our engine matches your situation to the right product instantly.", icon: "⚡" },
  { num: "3", title: "Review and decide", desc: "See why the product was recommended and explore alternatives.", icon: "✅" },
];

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} style={{ ...faqS.item, cursor: "pointer" }}>
      <div style={faqS.q}>
        <span>{q}</span>
        <span style={{ fontSize: "20px", color: "#1F4E5C" }}>{open ? "−" : "+"}</span>
      </div>
      {open && <p style={faqS.a}>{a}</p>}
    </div>
  );
}

const faqS = {
  item: { borderBottom: "1px solid #e0e0e0", padding: "20px 0" },
  q: { display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "700", fontSize: "16px", color: "#1F4E5C" },
  a: { color: "#555", fontSize: "14px", lineHeight: 1.7, marginTop: "10px" },
};

function Landing() {
  return (
    <div style={s.page}>

      {/* NAV */}
      <Navbar active="home" />

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroBadge}>🇨🇦 Canadian Tax Software</div>
        <h1 style={s.heroTitle}>Find the Right Tax Software<br />— In Minutes</h1>
        <p style={s.heroSub}>Answer a few simple questions and we'll match you to the perfect product for your tax situation. No guessing. No confusion.</p>
        <div style={s.heroBtns}>
          <Link to="/recommend" style={s.btnPrimary}>🚀 Find My Product</Link>
          <Link to="/compare" style={s.btnSecondary}>Compare All Products</Link>
        </div>
        <div style={s.heroStats}>
          <div style={s.stat}><strong>8</strong><span>Products</span></div>
          <div style={s.statDivider} />
          <div style={s.stat}><strong>Free</strong><span>to Recommend</span></div>
          <div style={s.statDivider} />
          <div style={s.stat}><strong>2 min</strong><span>Average Time</span></div>
        </div>
      </section>

      {/* PRODUCTS PREVIEW */}
      <section style={s.section}>
        <div style={s.sectionBadge}>Our Products</div>
        <h2 style={s.sectionTitle}>A Plan for Every Situation</h2>
        <p style={s.sectionSub}>From simple returns to full expert service — we have you covered.</p>
        <div style={s.cardGrid}>
          {previewProducts.map((p) => (
            <div key={p.name} style={s.card} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={s.cardIcon}>{p.icon}</div>
              <div style={s.cardPrice}>CAD ${p.price}</div>
              <h3 style={s.cardName}>{p.name}</h3>
              <p style={s.cardDesc}>{p.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <Link to="/products" style={s.btnOutline}>View All 8 Products →</Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={s.sectionAlt}>
        <div style={s.inner}>
          <div style={s.sectionBadge}>How It Works</div>
          <h2 style={s.sectionTitle}>Three Simple Steps</h2>
          <div style={s.stepsRow}>
            {steps.map((st, i) => (
              <div key={st.num} style={s.stepCard}>
                <div style={s.stepIcon}>{st.icon}</div>
                <div style={s.stepNum}>Step {st.num}</div>
                <h3 style={s.stepTitle}>{st.title}</h3>
                <p style={s.stepDesc}>{st.desc}</p>
                {i < steps.length - 1 && <div style={s.stepArrow}>→</div>}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link to="/recommend" style={s.btnPrimaryDark}>Get Started Now →</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={s.section}>
        <div style={s.inner}>
          <div style={s.sectionBadge}>FAQ</div>
          <h2 style={s.sectionTitle}>Common Questions</h2>
          <div style={s.faqWrap}>
            {faqs.map((f, i) => <FAQ key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={s.ctaBanner}>
        <h2 style={s.ctaTitle}>Ready to find your product?</h2>
        <p style={s.ctaSub}>Takes less than 2 minutes. Free to use.</p>
        <Link to="/recommend" style={s.btnPrimary}>Find My Product →</Link>
      </section>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <span style={s.footerLogo}>TaxWise</span>
          <div style={s.footerLinks}>
            <Link to="/products" style={s.footerLink}>Products</Link>
            <Link to="/compare" style={s.footerLink}>Compare</Link>
            <Link to="/recommend" style={s.footerLink}>Get Recommendation</Link>
            <Link to="/assistant" style={s.footerLink}>AI Assistant</Link>
            <Link to="/admin/products" style={s.footerLink}>Admin</Link>
          </div>
        </div>
        <p style={s.footerText}>© 2026 TaxWise · Product guidance only · Not tax, legal, or financial advice</p>
      </footer>
    </div>
  );
}

const s = {
  page: { fontFamily: "system-ui, sans-serif", color: "#222", background: "#fff" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 24px", height: "64px", background: "#1F4E5C", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.2)", flexWrap: "wrap", gap: "8px" },
  logo: { color: "#fff", fontWeight: "800", fontSize: "22px", letterSpacing: "-0.5px", cursor: "pointer" },
  navLinks: { display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" },
  navLink: { color: "#cde8ec", fontSize: "14px", cursor: "pointer !important" },
  navCta: { background: "#fff", color: "#1F4E5C", padding: "8px 16px", borderRadius: "8px", fontWeight: "700", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap" },
  hero: { background: "linear-gradient(135deg, #1a3f4c 0%, #1F4E5C 40%, #2A7F8F 100%)", color: "#fff", padding: "80px 40px", textAlign: "center" },
  heroBadge: { display: "inline-block", background: "rgba(255,255,255,0.15)", color: "#fff", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", marginBottom: "24px", backdropFilter: "blur(10px)" },
  heroTitle: { fontSize: "clamp(30px, 5vw, 52px)", fontWeight: "900", maxWidth: "720px", margin: "0 auto 20px", lineHeight: 1.15, letterSpacing: "-1px" },
  heroSub: { fontSize: "18px", maxWidth: "560px", margin: "0 auto 40px", opacity: 0.88, lineHeight: 1.7 },
  heroBtns: { display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "48px" },
  btnPrimary: { background: "#fff", color: "#1F4E5C", padding: "15px 32px", borderRadius: "10px", fontWeight: "800", fontSize: "16px", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", transition: "transform 0.2s" },
  btnSecondary: { background: "rgba(255,255,255,0.12)", color: "#fff", padding: "15px 32px", borderRadius: "10px", fontWeight: "700", fontSize: "16px", border: "2px solid rgba(255,255,255,0.4)", cursor: "pointer", backdropFilter: "blur(10px)" },
  btnOutline: { background: "transparent", color: "#1F4E5C", padding: "13px 28px", borderRadius: "10px", fontWeight: "700", fontSize: "15px", border: "2px solid #1F4E5C", cursor: "pointer" },
  btnPrimaryDark: { background: "#1F4E5C", color: "#fff", padding: "15px 32px", borderRadius: "10px", fontWeight: "800", fontSize: "16px", cursor: "pointer" },
  heroStats: { display: "flex", justifyContent: "center", alignItems: "center", gap: "32px", flexWrap: "wrap" },
  stat: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", color: "#fff" },
  statDivider: { width: "1px", height: "32px", background: "rgba(255,255,255,0.3)" },
  section: { padding: "80px 40px", maxWidth: "1100px", margin: "0 auto" },
  sectionAlt: { background: "#EAF2F3", padding: "80px 40px" },
  inner: { maxWidth: "1100px", margin: "0 auto" },
  sectionBadge: { display: "inline-block", background: "#EAF2F3", color: "#1F4E5C", padding: "5px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" },
  sectionTitle: { fontSize: "clamp(24px, 4vw, 36px)", fontWeight: "900", color: "#1F4E5C", marginBottom: "12px", letterSpacing: "-0.5px" },
  sectionSub: { color: "#666", fontSize: "16px", marginBottom: "48px", lineHeight: 1.6 },
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "20px" },
  card: { border: "2px solid #e8f0f2", borderRadius: "16px", padding: "28px 24px", transition: "transform 0.25s, box-shadow 0.25s", cursor: "default", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  cardIcon: { fontSize: "32px", marginBottom: "12px" },
  cardPrice: { color: "#2A7F8F", fontWeight: "800", fontSize: "22px", marginBottom: "4px" },
  cardName: { color: "#1F4E5C", fontSize: "18px", fontWeight: "800", marginBottom: "8px" },
  cardDesc: { color: "#666", fontSize: "14px", lineHeight: 1.6 },
  stepsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px", position: "relative" },
  stepCard: { background: "#fff", borderRadius: "16px", padding: "32px 24px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", position: "relative" },
  stepIcon: { fontSize: "36px", marginBottom: "12px" },
  stepNum: { color: "#2A7F8F", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" },
  stepTitle: { color: "#1F4E5C", fontSize: "17px", fontWeight: "800", marginBottom: "10px" },
  stepDesc: { color: "#666", fontSize: "14px", lineHeight: 1.6 },
  stepArrow: { display: "none" },
  faqWrap: { maxWidth: "680px", margin: "40px auto 0" },
  ctaBanner: { background: "linear-gradient(135deg, #1F4E5C, #2A7F8F)", padding: "64px 40px", textAlign: "center" },
  ctaTitle: { color: "#fff", fontSize: "32px", fontWeight: "900", marginBottom: "12px" },
  ctaSub: { color: "#cde8ec", fontSize: "17px", marginBottom: "32px" },
  footer: { background: "#111e22", padding: "40px", textAlign: "center" },
  footerInner: { display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1100px", margin: "0 auto 24px", flexWrap: "wrap", gap: "16px" },
  footerLogo: { color: "#fff", fontWeight: "800", fontSize: "20px" },
  footerLinks: { display: "flex", gap: "24px", flexWrap: "wrap" },
  footerLink: { color: "#7a9ea6", fontSize: "14px", cursor: "pointer", transition: "color 0.2s" },
  footerText: { color: "#3a5560", fontSize: "13px" },
};

export default Landing;