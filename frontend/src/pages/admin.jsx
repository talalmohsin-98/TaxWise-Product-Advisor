import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Admin() {
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
        <h1 style={s.heroTitle}>Admin — Product Configuration</h1>
        <p style={s.heroSub}>Read-only view of all product data and feature flags.</p>
      </div>

      <div style={s.content}>
        <div style={s.banner}>
          <span style={s.bannerIcon}>⚙</span>
          <span>This page displays the live product configuration loaded from the server data file. All fields are read-only.</span>
        </div>

        {loading ? (
          <p style={s.loading}>Loading configuration...</p>
        ) : (
          <div style={s.grid}>
            {products.map((p) => {
              const supported = Object.entries(p.supports).filter(([, v]) => v).map(([k]) => k);
              const unsupported = Object.entries(p.supports).filter(([, v]) => !v).map(([k]) => k);
              const toLabel = (key) => key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

              return (
                <div key={p.id} style={s.card}>
                  <div style={s.cardHeader}>
                    <div>
                      <span style={s.idBadge}>{p.id}</span>
                      <h3 style={s.cardName}>{p.name}</h3>
                    </div>
                    <div style={s.priceBadge}>CAD ${p.price}</div>
                  </div>

                  <p style={s.desc}>{p.description}</p>

                  <div style={s.row}>
                    <span style={s.rowLabel}>Best for</span>
                    <span style={s.rowValue}>{p.bestFor.join(", ")}</span>
                  </div>

                  <div style={s.row}>
                    <span style={s.rowLabel}>Currency</span>
                    <span style={s.rowValue}>{p.currency}</span>
                  </div>

                  <div style={s.featureSection}>
                    <div style={s.featureCol}>
                      <div style={s.featureHeader}>
                        <span style={s.greenDot} />Supported
                      </div>
                      {supported.map((k) => (
                        <div key={k} style={s.featureItem}>✓ {toLabel(k)}</div>
                      ))}
                    </div>
                    <div style={s.featureCol}>
                      <div style={s.featureHeader}>
                        <span style={s.redDot} />Not Supported
                      </div>
                      {unsupported.map((k) => (
                        <div key={k} style={s.featureItemOff}>✕ {toLabel(k)}</div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <footer style={s.footer}>
        <p style={s.footerText}>© 2026 TaxWise · Admin Panel · Read-only configuration view</p>
      </footer>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#f0f4f8", fontFamily: "system-ui, sans-serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", background: "#1F4E5C", position: "sticky", top: 0, zIndex: 100 },
  logo: { color: "#fff", fontWeight: "800", fontSize: "22px" },
  navLinks: { display: "flex", alignItems: "center", gap: "24px" },
  navLink: { color: "#cde8ec", fontSize: "15px" },
  navLinkActive: { color: "#fff", fontSize: "15px", fontWeight: "700", borderBottom: "2px solid #fff", paddingBottom: "2px" },
  hero: { background: "linear-gradient(135deg, #1F4E5C 0%, #2A7F8F 100%)", padding: "48px 40px", textAlign: "center" },
  heroTitle: { color: "#fff", fontSize: "32px", fontWeight: "800", marginBottom: "10px" },
  heroSub: { color: "#cde8ec", fontSize: "16px" },
  content: { maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" },
  banner: { background: "#fff8e1", border: "1px solid #f0c040", borderRadius: "10px", padding: "14px 18px", fontSize: "14px", color: "#7a6000", marginBottom: "28px", display: "flex", alignItems: "center", gap: "10px" },
  bannerIcon: { fontSize: "18px" },
  loading: { textAlign: "center", color: "#888", padding: "60px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" },
  card: { background: "#fff", borderRadius: "14px", padding: "24px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "12px" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  idBadge: { background: "#EAF2F3", color: "#1F4E5C", fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "4px", display: "inline-block", marginBottom: "6px", fontFamily: "monospace" },
  cardName: { color: "#1F4E5C", fontSize: "18px", fontWeight: "800" },
  priceBadge: { background: "#1F4E5C", color: "#fff", padding: "6px 14px", borderRadius: "8px", fontWeight: "800", fontSize: "16px", whiteSpace: "nowrap" },
  desc: { color: "#555", fontSize: "13px", lineHeight: 1.5 },
  row: { display: "flex", gap: "8px", fontSize: "13px", alignItems: "flex-start" },
  rowLabel: { color: "#888", fontWeight: "700", minWidth: "70px" },
  rowValue: { color: "#333" },
  featureSection: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "4px" },
  featureCol: { background: "#f7fafb", borderRadius: "8px", padding: "12px" },
  featureHeader: { display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "12px", color: "#444", marginBottom: "8px", textTransform: "uppercase" },
  greenDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#1A7A4A", display: "inline-block" },
  redDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#c0392b", display: "inline-block" },
  featureItem: { fontSize: "12px", color: "#1A7A4A", padding: "2px 0" },
  featureItemOff: { fontSize: "12px", color: "#c0392b", padding: "2px 0" },
  footer: { background: "#1F4E5C", padding: "24px", textAlign: "center", marginTop: "40px" },
  footerText: { color: "#a0c8d0", fontSize: "13px" },
};

export default Admin;