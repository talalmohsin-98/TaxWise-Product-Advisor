import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Wizard() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [answers, setAnswers] = useState({
    filingType: "",
    incomeSources: [],
    deductions: [],
    helpPreference: "",
    hasRevenue: null,
  });

  const toggleArray = (field, value) => {
    setAnswers((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  const validate = () => {
    if (step === 1 && !answers.filingType) return "Please select a filing type.";
    if (step === 2 && answers.incomeSources.length === 0) return "Please select at least one income source.";
    if (step === 3) return "";
    if (step === 4 && !answers.helpPreference) return "Please select how much help you want.";
    if (step === 5 && answers.filingType === "incorporated" && answers.hasRevenue === null)
      return "Please answer the company revenue question.";
    return "";
  };

  const next = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    const nextStep = step === 4 && answers.filingType !== "incorporated" ? 6 : step + 1;
    if (nextStep === 6) { submitWizard(); return; }
    setStep(nextStep);
  };

  const back = () => {
    setError("");
    if (step === 5 && answers.filingType !== "incorporated") { setStep(3); return; }
    setStep((s) => s - 1);
  };

  const restart = () => {
    setStep(1);
    setResult(null);
    setError("");
    setAnswers({ filingType: "", incomeSources: [], deductions: [], helpPreference: "", hasRevenue: null });
  };

  const submitWizard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); setLoading(false); return; }
      setResult(data);
      setStep(6);
    } catch {
      setError("Could not connect to server. Make sure the backend is running.");
    }
    setLoading(false);
  };

  const totalSteps = answers.filingType === "incorporated" ? 5 : 4;
  const currentProgress = Math.min(step, totalSteps);
  const progressPercent = (currentProgress / totalSteps) * 100;

  return (
    <div style={s.page}>
      <Navbar active="wizard" />

      <div style={s.outer}>
        <div style={s.card}>
          <h2 style={s.title}>Find Your Tax Product</h2>

          {step < 6 && (
            <div style={s.progressWrap}>
              <div style={{ ...s.progressBar, width: `${progressPercent}%` }} />
            </div>
          )}
          {step < 6 && (
            <p style={s.stepLabel}>Step {currentProgress} of {totalSteps}</p>
          )}

          {error && <div style={s.errorBox}>{error}</div>}

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h3 style={s.question}>What are you filing for?</h3>
              {[
                { value: "personal", label: "📄 Personal return" },
                { value: "self-employed", label: "💼 Freelancer / Self-employed" },
                { value: "incorporated", label: "🏢 Incorporated company" },
              ].map((opt) => (
                <div key={opt.value}
                  style={{ ...s.option, ...(answers.filingType === opt.value ? s.optionSelected : {}) }}
                  onClick={() => { setAnswers((p) => ({ ...p, filingType: opt.value })); setError(""); }}>
                  {opt.label}
                </div>
              ))}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h3 style={s.question}>Which income sources apply to you?</h3>
              <p style={s.hint}>Select all that apply.</p>
              {[
                { value: "salaryIncome", label: "Salary income" },
                { value: "studentIncome", label: "Student income" },
                { value: "investmentIncome", label: "Investment income" },
                { value: "capitalGains", label: "Capital gains" },
                { value: "rentalIncome", label: "Rental income" },
                { value: "freelanceIncome", label: "Freelance income" },
                { value: "gigWorkIncome", label: "Gig-work income" },
                { value: "businessRevenue", label: "Business revenue" },
                { value: "foreignIncome", label: "Foreign income" },
              ].map((opt) => (
                <div key={opt.value}
                  style={{ ...s.option, ...(answers.incomeSources.includes(opt.value) ? s.optionSelected : {}) }}
                  onClick={() => { toggleArray("incomeSources", opt.value); setError(""); }}>
                  {opt.label}
                </div>
              ))}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h3 style={s.question}>Which deductions or expenses apply to you?</h3>
              <p style={s.hint}>Select all that apply.</p>
              {[
                { value: "medicalExpenses", label: "Medical expenses" },
                { value: "donations", label: "Donations" },
                { value: "employmentExpenses", label: "Employment expenses" },
                { value: "homeOfficeExpenses", label: "Home-office expenses" },
                { value: "vehicleExpenses", label: "Vehicle expenses" },
                { value: "businessExpenses", label: "Business expenses" },
                { value: "noDeductions", label: "No special deductions" },
              ].map((opt) => (
                <div key={opt.value}
                  style={{ ...s.option, ...(answers.deductions.includes(opt.value) ? s.optionSelected : {}) }}
                  onClick={() => { toggleArray("deductions", opt.value); setError(""); }}>
                  {opt.label}
                </div>
              ))}
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <h3 style={s.question}>How much help do you want?</h3>
              {[
                { value: "self", label: "🙋 I want to file myself" },
                { value: "expert-assist", label: "🤝 I want expert help while filing" },
                { value: "expert-full", label: "👨‍💼 I want an expert to file for me" },
              ].map((opt) => (
                <div key={opt.value}
                  style={{ ...s.option, ...(answers.helpPreference === opt.value ? s.optionSelected : {}) }}
                  onClick={() => { setAnswers((p) => ({ ...p, helpPreference: opt.value })); setError(""); }}>
                  {opt.label}
                </div>
              ))}
            </div>
          )}

          {/* STEP 5 — Incorporated only */}
          {step === 5 && (
            <div>
              <h3 style={s.question}>Did the company have revenue?</h3>
              {[
                { value: true, label: "✅ Yes, the company had revenue" },
                { value: false, label: "❌ No, the company had no revenue" },
              ].map((opt) => (
                <div key={String(opt.value)}
                  style={{ ...s.option, ...(answers.hasRevenue === opt.value ? s.optionSelected : {}) }}
                  onClick={() => { setAnswers((p) => ({ ...p, hasRevenue: opt.value })); setError(""); }}>
                  {opt.label}
                </div>
              ))}
            </div>
          )}

          {/* STEP 6 — Result */}
          {step === 6 && result && (
            <div>
              <div style={s.resultBox}>
                <p style={s.resultLabel}>✨ Recommended Product</p>
                <h2 style={s.resultProduct}>{result.recommendedProductName}</h2>
                <p style={s.resultPrice}>CAD ${result.price}</p>
              </div>
              <div style={s.section}>
                <h4 style={s.sectionTitle}>Why this product?</h4>
                {result.reasons.map((r, i) => (
                  <p key={i} style={s.reason}>• {r}</p>
                ))}
              </div>
              <div style={s.section}>
                <h4 style={s.sectionTitle}>Based on your answers</h4>
                <p style={s.matched}>{result.matchedInputs.join(", ")}</p>
              </div>
              <div style={s.disclaimer}>{result.disclaimer}</div>
              <button style={s.restartBtn} onClick={restart}>Start Over</button>
              <div style={s.links}>
                <Link to="/" style={s.link}>← Home</Link>
                <Link to="/products" style={s.link}>View All Products →</Link>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          {step < 6 && (
            <div style={s.navRow}>
              {step > 1 && (
                <button style={s.backBtn} onClick={back}>← Back</button>
              )}
              <button style={s.nextBtn} onClick={next} disabled={loading}>
                {loading ? "Loading..." :
                  (step === 4 && answers.filingType !== "incorporated") || step === 5
                    ? "Get Recommendation →"
                    : "Next →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#f0f4f8", fontFamily: "system-ui, sans-serif" },
  outer: { display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", minHeight: "calc(100vh - 64px)" },
  card: { background: "#fff", borderRadius: "16px", padding: "40px", maxWidth: "600px", width: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" },
  title: { textAlign: "center", color: "#1F4E5C", marginBottom: "24px", fontSize: "24px", fontWeight: "800" },
  progressWrap: { height: "8px", background: "#e0e0e0", borderRadius: "4px", marginBottom: "8px" },
  progressBar: { height: "8px", background: "#1F4E5C", borderRadius: "4px", transition: "width 0.4s ease" },
  stepLabel: { textAlign: "right", fontSize: "12px", color: "#999", marginBottom: "24px" },
  question: { color: "#1F4E5C", marginBottom: "8px", fontSize: "18px", fontWeight: "700" },
  hint: { color: "#999", fontSize: "13px", marginBottom: "14px" },
  option: { padding: "14px 18px", border: "2px solid #e8eef0", borderRadius: "10px", marginBottom: "10px", cursor: "pointer", transition: "all 0.2s", fontSize: "15px", color: "#333", userSelect: "none" },
  optionSelected: { borderColor: "#1F4E5C", background: "#EAF2F3", color: "#1F4E5C", fontWeight: "700" },
  errorBox: { background: "#fdecea", color: "#c0392b", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" },
  navRow: { display: "flex", justifyContent: "space-between", marginTop: "28px", gap: "12px" },
  backBtn: { padding: "12px 24px", border: "2px solid #1F4E5C", background: "transparent", color: "#1F4E5C", borderRadius: "10px", cursor: "pointer", fontSize: "15px", fontWeight: "600" },
  nextBtn: { padding: "12px 28px", background: "#1F4E5C", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "15px", fontWeight: "700", marginLeft: "auto" },
  resultBox: { background: "linear-gradient(135deg, #EAF2F3, #d0eaef)", borderRadius: "14px", padding: "28px", textAlign: "center", marginBottom: "24px" },
  resultLabel: { color: "#1F4E5C", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" },
  resultProduct: { color: "#1F4E5C", fontSize: "30px", fontWeight: "900", margin: "0 0 8px", letterSpacing: "-0.5px" },
  resultPrice: { color: "#2A7F8F", fontSize: "24px", fontWeight: "800" },
  section: { marginBottom: "20px" },
  sectionTitle: { color: "#333", fontSize: "14px", fontWeight: "800", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" },
  reason: { color: "#555", fontSize: "14px", marginBottom: "6px", lineHeight: 1.5 },
  matched: { color: "#888", fontSize: "13px", lineHeight: 1.6 },
  disclaimer: { background: "#fff8e1", border: "1px solid #f0c040", borderRadius: "8px", padding: "12px 16px", fontSize: "12px", color: "#7a6000", marginBottom: "20px", lineHeight: 1.6 },
  restartBtn: { width: "100%", padding: "14px", background: "#1F4E5C", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "700", marginBottom: "16px" },
  links: { display: "flex", justifyContent: "space-between", marginTop: "8px" },
  link: { color: "#1F4E5C", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
};

export default Wizard;