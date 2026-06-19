import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar({ active }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={s.wrapper}>
      <div style={s.topRow}>
        <Link to="/" style={s.logo}>TaxWise</Link>

        {/* Desktop */}
        <div className="nav-desktop" style={s.desktopLinks}>
          <Link to="/products" style={active === "products" ? s.linkActive : s.link}>Products</Link>
          <Link to="/compare" style={active === "compare" ? s.linkActive : s.link}>Compare</Link>
          <Link to="/assistant" style={active === "assistant" ? s.linkActive : s.link}>AI Assistant</Link>
          <Link to="/admin/products" style={active === "admin" ? s.linkActive : s.link}>Admin</Link>
          <Link to="/recommend" style={s.cta}>Find My Product</Link>
        </div>

        {/* Burger */}
        <button className="nav-burger" style={s.burger} onClick={() => setOpen(!open)}>
          <span style={{ ...s.bar, transform: open ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ ...s.bar, opacity: open ? 0 : 1 }} />
          <span style={{ ...s.bar, transform: open ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="nav-mobile" style={s.mobileMenu}>
          <Link to="/products" style={s.mobileLink} onClick={() => setOpen(false)}>Products</Link>
          <Link to="/compare" style={s.mobileLink} onClick={() => setOpen(false)}>Compare</Link>
          <Link to="/assistant" style={s.mobileLink} onClick={() => setOpen(false)}>AI Assistant</Link>
          <Link to="/admin/products" style={s.mobileLink} onClick={() => setOpen(false)}>Admin</Link>
          <Link to="/recommend" style={s.mobileCta} onClick={() => setOpen(false)}>🚀 Find My Product</Link>
        </div>
      )}
    </div>
  );
}

const s = {
  wrapper: { background: "#1F4E5C", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.2)" },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 24px", height: "64px" },
  logo: { color: "#fff", fontWeight: "800", fontSize: "22px" },
  desktopLinks: { alignItems: "center", gap: "24px" },
  link: { color: "#cde8ec", fontSize: "14px" },
  linkActive: { color: "#fff", fontSize: "14px", fontWeight: "700", borderBottom: "2px solid #fff", paddingBottom: "2px" },
  cta: { background: "#fff", color: "#1F4E5C", padding: "9px 18px", borderRadius: "8px", fontWeight: "700", fontSize: "14px", whiteSpace: "nowrap" },
  burger: { flexDirection: "column", gap: "5px", background: "none", border: "none", padding: "4px" },
  bar: { display: "block", width: "24px", height: "2px", background: "#fff", borderRadius: "2px", transition: "all 0.3s" },
  mobileMenu: { flexDirection: "column", background: "#163d4a", borderTop: "1px solid rgba(255,255,255,0.1)", paddingBottom: "12px" },
  mobileLink: { color: "#cde8ec", fontSize: "15px", padding: "13px 24px", display: "block", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  mobileCta: { color: "#fff", fontSize: "15px", fontWeight: "700", padding: "14px 24px", display: "block", background: "rgba(255,255,255,0.1)", margin: "8px 16px", borderRadius: "8px", textAlign: "center" },
};

export default Navbar;