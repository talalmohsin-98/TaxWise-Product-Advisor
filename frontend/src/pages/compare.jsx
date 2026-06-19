import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const FEATURES = [
  { key: "salaryIncome", label: "Salary Income" },
  { key: "studentIncome", label: "Student Income" },
  { key: "medicalExpenses", label: "Medical Expenses" },
  { key: "donations", label: "Donations" },
  { key: "employmentExpenses", label: "Employment Expenses" },
  { key: "investmentIncome", label: "Investment Income" },
  { key: "capitalGains", label: "Capital Gains" },
  { key: "foreignIncome", label: "Foreign Income" },
  { key: "rentalIncome", label: "Rental Income" },
  { key: "freelanceIncome", label: "Freelance Income" },
  { key: "gigWorkIncome", label: "Gig-Work Income" },
  { key: "businessExpenses", label: "Business Expenses" },
  { key: "homeOfficeExpenses", label: "Home-Office Expenses" },
  { key: "vehicleExpenses", label: "Vehicle Expenses" },
  { key: "expertHelp", label: "Expert Help" },
  { key: "fullService", label: "Full Service" },
  { key: "corporateFiling", label: "Corporate Filing" },
  { key: "nilCorporateReturn", label: "Nil Corporate Return" },
];

function Compare() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://taxwise-product-advisor-production.up.railway.app/api/products")
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); });
  }, []);

  return (
    <div style={s.page}>
      <Navbar active="home" />

      <div style={s.hero}>
        <div style={s.heroBadge}>Side by Side</div>
        <h1 style={s.heroTitle}>Compare All Products</h1>
        <p style={s.heroSub}>See exactly which features each product supports.</p>
      </div>

      <div style={s.content}>
        {loading ? (
          <p style={s.loading}>Loading...</p>
        ) : (
          <>
            <p style={s.scrollHint}>← Scroll horizontally to see all products →</p>
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.thFeature}>Feature</th>
                    {products.map((p) => (
                      <th key={p.id} style={s.th}>
                        <div style={s.thName}>{p.name}</div>
                        <div style={s.thPrice}>CAD ${p.price}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEATURES.map((f, i) => (
                    <tr key={f.key} style={{ background: i % 2 === 0 ? "#fff" : "#f7fafb" }}>
                      <td style={s.tdFeature}>{f.label}</td>
                      {products.map((p) => (
                        <td key={p.id} style={s.td}>
                          {p.supports[f.key]
                            ? <span style={s.check}>✓</span>
                            : <span style={s.cross}>✕</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr style={{ background: "#EAF2F3" }}>
                    <td style={s.tdFeature}><strong>Get Started</strong></td>
                    {products.map((p) => (
                      <td key={p.id} style={s.td}>
                        <Link to="/recommend" style={s.tableBtn}>Select</Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
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
  hero: { background: "linear-gradient(135deg, #1a3f4c, #1F4E5C, #2A7F8F)", padding: "60px 40px", textAlign: "center" },
  heroBadge: { display: "inline-block", background: "rgba(255,255,255,0.15)", color: "#fff", padding: "5px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" },
  heroTitle: { color: "#fff", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: "900", marginBottom: "12px" },
  heroSub: { color: "#cde8ec", fontSize: "17px", lineHeight: 1.7 },
  content: { maxWidth: "1300px", margin: "0 auto", padding: "40px 24px" },
  loading: { textAlign: "center", color: "#888", padding: "60px" },
  scrollHint: { textAlign: "center", color: "#999", fontSize: "13px", marginBottom: "16px" },
  tableWrap: { overflowX: "auto", borderRadius: "16px", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", minWidth: "960px" },
  thFeature: { background: "#1F4E5C", color: "#fff", padding: "18px 20px", textAlign: "left", fontSize: "13px", fontWeight: "700", position: "sticky", left: 0, minWidth: "180px", zIndex: 2 },
  th: { background: "#1F4E5C", color: "#fff", padding: "18px 12px", textAlign: "center", minWidth: "110px" },
  thName: { fontWeight: "800", fontSize: "13px", marginBottom: "4px" },
  thPrice: { fontSize: "12px", color: "#a0d8e0", fontWeight: "600" },
  tdFeature: { padding: "13px 20px", fontWeight: "600", fontSize: "13px", color: "#333", position: "sticky", left: 0, background: "inherit", borderRight: "2px solid #e8eef0", zIndex: 1 },
  td: { padding: "13px", textAlign: "center" },
  check: { color: "#1A7A4A", fontWeight: "900", fontSize: "17px" },
  cross: { color: "#ddd", fontWeight: "700", fontSize: "14px" },
  tableBtn: { background: "#1F4E5C", color: "#fff", padding: "7px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer" },
  footer: { background: "#111e22", padding: "28px", textAlign: "center", marginTop: "40px" },
  footerText: { color: "#3a5560", fontSize: "13px" },
};

export default Compare;