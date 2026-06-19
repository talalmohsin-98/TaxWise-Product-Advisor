import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const KEY_FEATURES = [
  { key: "salaryIncome", label: "Salary Income" },
  { key: "medicalExpenses", label: "Medical Expenses" },
  { key: "investmentIncome", label: "Investment Income" },
  { key: "rentalIncome", label: "Rental Income" },
  { key: "freelanceIncome", label: "Freelance Income" },
  { key: "expertHelp", label: "Expert Help" },
  { key: "fullService", label: "Full Service" },
  { key: "corporateFiling", label: "Corporate Filing" },
];

const ICONS = { "free": "📄", "deluxe": "⭐", "premier": "📈", "self-employed": "💼", "expert-assist": "🤝", "expert-full-service": "👨‍💼", "business-corporate": "🏢", "nil-corporate": "📋" };

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); });
  }, []);

  return (
    <div style={s.page}>
      <Navbar active="home" />

      <div style={s.hero}>
        <div style={s.heroBadge}>All Products</div>
        <h1 style={s.heroTitle}>Choose Your Plan</h1>
        <p style={s.heroSub}>From free simple returns to full expert service. Every plan is designed for a specific tax situation.</p>
      </div>

      <div style={s.content}>
        {loading ? (
          <div style={s.loadingWrap}>
            <div style={s.spinner} />
            <p style={s.loadingText}>Loading products...</p>
          </div>
        ) : (
          <div style={s.grid}>
            {products.map((p) => (
              <div key={p.id} style={s.card}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.13)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.07)"; }}>
                <div style={s.cardHeader}>
                  <span style={s.cardIcon}>{ICONS[p.id] || "📦"}</span>
                  <div style={s.pricePill}>CAD ${p.price}</div>
                </div>
                <h3 style={s.cardName}>{p.name}</h3>
                <p style={s.cardDesc}>{p.description}</p>
                <div style={s.bestFor}>
                  <span style={s.bestForLabel}>Best for</span>
                  <p style={s.bestForText}>{p.bestFor.join(" · ")}</p>
                </div>
                <div style={s.divider} />
                <div style={s.featureList}>
                  {KEY_FEATURES.map((f) => (
                    <div key={f.key} style={s.featureRow}>
                      <span style={p.supports[f.key] ? s.check : s.cross}>
                        {p.supports[f.key] ? "✓" : "✕"}
                      </span>
                      <span style={{ ...s.featureLabel, color: p.supports[f.key] ? "#333" : "#aaa" }}>
                        {f.label}
                      </span>
                    </div>
                  ))}
                </div>
                <Link to="/recommend" style={s.cardBtn}>Get Recommendation →</Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer style={s.footer}>
        <p style={s.footerText}>© 2026 TaxWise · Product guidance only · Not tax, legal, or financial advice</p>
      </footer>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#f0f4f8", fontFamily: "system-ui, sans-serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 40px", height: "64px", background: "#1F4E5C", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.2)" },
  logo: { color: "#fff", fontWeight: "800", fontSize: "22px", cursor: "pointer" },
  navLinks: { display: "flex", alignItems: "center", gap: "28px" },
  navLink: { color: "#cde8ec", fontSize: "15px", cursor: "pointer" },
  navLinkActive: { color: "#fff", fontSize: "15px", fontWeight: "700", borderBottom: "2px solid #fff", paddingBottom: "2px", cursor: "pointer" },
  navCta: { background: "#fff", color: "#1F4E5C", padding: "9px 20px", borderRadius: "8px", fontWeight: "700", fontSize: "14px", cursor: "pointer" },
  hero: { background: "linear-gradient(135deg, #1a3f4c 0%, #1F4E5C 50%, #2A7F8F 100%)", padding: "60px 40px", textAlign: "center" },
  heroBadge: { display: "inline-block", background: "rgba(255,255,255,0.15)", color: "#fff", padding: "5px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" },
  heroTitle: { color: "#fff", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: "900", marginBottom: "12px", letterSpacing: "-0.5px" },
  heroSub: { color: "#cde8ec", fontSize: "17px", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 },
  content: { maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" },
  loadingWrap: { display: "flex", flexDirection: "column", alignItems: "center", padding: "80px", gap: "16px" },
  spinner: { width: "36px", height: "36px", border: "3px solid #e0e0e0", borderTop: "3px solid #1F4E5C", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  loadingText: { color: "#888", fontSize: "15px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "24px" },
  card: { background: "#fff", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "14px", transition: "transform 0.25s, box-shadow 0.25s", cursor: "default" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardIcon: { fontSize: "32px" },
  pricePill: { background: "#EAF2F3", color: "#1F4E5C", fontWeight: "800", fontSize: "16px", padding: "6px 14px", borderRadius: "20px" },
  cardName: { color: "#1F4E5C", fontSize: "20px", fontWeight: "800", letterSpacing: "-0.3px" },
  cardDesc: { color: "#666", fontSize: "14px", lineHeight: 1.6 },
  bestFor: { background: "#f7fafb", borderRadius: "10px", padding: "12px 14px" },
  bestForLabel: { fontSize: "11px", fontWeight: "800", color: "#1F4E5C", textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: "4px" },
  bestForText: { color: "#444", fontSize: "13px", lineHeight: 1.5 },
  divider: { height: "1px", background: "#f0f0f0" },
  featureList: { display: "flex", flexDirection: "column", gap: "7px" },
  featureRow: { display: "flex", alignItems: "center", gap: "10px" },
  check: { color: "#1A7A4A", fontWeight: "800", fontSize: "13px", width: "16px", flexShrink: 0 },
  cross: { color: "#ddd", fontWeight: "800", fontSize: "13px", width: "16px", flexShrink: 0 },
  featureLabel: { fontSize: "13px" },
  cardBtn: { marginTop: "auto", background: "#1F4E5C", color: "#fff", padding: "13px", borderRadius: "10px", textAlign: "center", fontWeight: "700", fontSize: "14px", cursor: "pointer", display: "block", transition: "background 0.2s" },
  footer: { background: "#111e22", padding: "28px", textAlign: "center", marginTop: "40px" },
  footerText: { color: "#3a5560", fontSize: "13px" },
};

export default Products;