import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const SUGGESTED = [
  "I have salary income and donations. Which product should I use?",
  "I am a freelancer with home-office expenses. Can I use Free?",
  "I own an incorporated company with no revenue. What should I choose?",
  "What is the difference between Premier and Self-Employed?",
  "I want someone else to file for me. What should I select?",
  "Can you guarantee I will get a refund?",
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function Assistant() {
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      answer: "Hi! I'm TaxWise Assistant. Ask me anything about our tax software products and I'll help you find the right one for your situation.",
      disclaimer: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (question) => {
    const q = question || input.trim();
    if (!q || loading) return;
    setInput("");
    setLoading(true);
    setShowSuggestions(false);

    setMessages((prev) => [...prev, { role: "user", text: q }]);

    try {
      const res = await fetch("https://taxwise-product-advisor-production.up.railway.app/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [...prev, {
          role: "assistant",
          answer: data.error || "Something went wrong. Please try again.",
          disclaimer: null,
        }]);
      } else {
        setMessages((prev) => [...prev, {
          role: "assistant",
          answer: data.answer,
          recommendedProduct: data.recommendedProduct,
          confidence: data.confidence,
          reasons: data.reasons,
          disclaimer: data.disclaimer,
        }]);
      }
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        answer: "Could not connect to the server. Please make sure the backend is running.",
        disclaimer: null,
      }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={s.page}>
      <Navbar active="assistant" />

      <div style={s.hero}>
        <div style={s.heroBadge}>🤖 AI Powered</div>
        <h1 style={s.heroTitle}>TaxWise Assistant</h1>
        <p style={s.heroSub}>Ask me anything about our products. I'll help you find the right one — based on the product rules, nothing else.</p>
      </div>

      <div style={{ ...s.layout, gridTemplateColumns: isMobile ? "1fr" : "1fr 340px" }}>

        {/* Chat area */}
        <div style={s.chatWrap}>
          <div style={{ ...s.messages, minHeight: isMobile ? "320px" : "480px", maxHeight: isMobile ? "420px" : "560px" }}>
            {messages.map((msg, i) => (
              <div key={i} style={msg.role === "user" ? s.userRow : s.assistantRow}>
                {msg.role === "assistant" && (
                  <div style={s.avatar}>🤖</div>
                )}
                <div style={msg.role === "user" ? s.userBubble : s.assistantBubble}>
                  {msg.role === "user" ? (
                    <p style={s.userText}>{msg.text}</p>
                  ) : (
                    <div>
                      <p style={s.answerText}>{msg.answer}</p>

                      {msg.recommendedProduct && (
                        <div style={s.productTag}>
                          ✨ Recommended: <strong>{msg.recommendedProduct}</strong>
                          {msg.confidence && (
                            <span style={s.confidenceBadge}>{msg.confidence} confidence</span>
                          )}
                        </div>
                      )}

                      {msg.reasons && msg.reasons.length > 0 && (
                        <div style={s.reasons}>
                          {msg.reasons.map((r, j) => (
                            <p key={j} style={s.reason}>• {r}</p>
                          ))}
                        </div>
                      )}

                      {msg.disclaimer && (
                        <p style={s.disclaimer}>{msg.disclaimer}</p>
                      )}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div style={s.userAvatar}>👤</div>
                )}
              </div>
            ))}

            {loading && (
              <div style={s.assistantRow}>
                <div style={s.avatar}>🤖</div>
                <div style={s.assistantBubble}>
                  <div style={s.typing}>
                    <span style={s.dot} />
                    <span style={s.dot} />
                    <span style={s.dot} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Mobile suggestions - shown inside chat area on mobile */}
          {isMobile && showSuggestions && (
            <div style={s.mobileSuggestions}>
              <p style={s.mobileSuggestTitle}>💡 Try these questions</p>
              <div style={s.suggestionsScroll}>
                {SUGGESTED.map((q, i) => (
                  <button key={i} style={s.suggestionChip} onClick={() => sendMessage(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div style={s.inputRow}>
            <textarea
              style={s.input}
              placeholder="Ask a question about our products..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={2}
              disabled={loading}
            />
            <button
              style={{ ...s.sendBtn, opacity: loading || !input.trim() ? 0.5 : 1 }}
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              Send →
            </button>
          </div>
          {!isMobile && <p style={s.inputHint}>Press Enter to send · Shift+Enter for new line</p>}
        </div>

        {/* Sidebar — desktop only */}
        {!isMobile && (
          <div style={s.sidebar}>
            <div style={s.sideCard}>
              <h3 style={s.sideTitle}>💡 Try these questions</h3>
              <div style={s.suggestions}>
                {SUGGESTED.map((q, i) => (
                  <button key={i} style={s.suggestion} onClick={() => sendMessage(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div style={s.sideCard}>
              <h3 style={s.sideTitle}>⚠️ Important</h3>
              <p style={s.sideText}>This assistant provides product guidance only. It is not a tax professional and cannot provide tax, legal, or financial advice.</p>
              <Link to="/recommend" style={s.wizardLink}>
                Try the recommendation wizard instead →
              </Link>
            </div>
          </div>
        )}

        {/* Mobile Important card — below chat */}
        {isMobile && (
          <div style={s.sideCard}>
            <h3 style={s.sideTitle}>⚠️ Important</h3>
            <p style={s.sideText}>This assistant provides product guidance only. It is not a tax professional and cannot provide tax, legal, or financial advice.</p>
            <Link to="/recommend" style={s.wizardLink}>
              Try the recommendation wizard instead →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#f0f4f8", fontFamily: "system-ui, sans-serif" },
  hero: { background: "linear-gradient(135deg, #1a3f4c, #1F4E5C, #2A7F8F)", padding: "48px 24px", textAlign: "center" },
  heroBadge: { display: "inline-block", background: "rgba(255,255,255,0.15)", color: "#fff", padding: "5px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" },
  heroTitle: { color: "#fff", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: "900", marginBottom: "12px" },
  heroSub: { color: "#cde8ec", fontSize: "15px", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 },
  layout: { display: "grid", gap: "24px", maxWidth: "1200px", margin: "0 auto", padding: "24px 16px", alignItems: "start" },
  chatWrap: { background: "#fff", borderRadius: "16px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden", display: "flex", flexDirection: "column" },
  messages: { padding: "16px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" },
  assistantRow: { display: "flex", gap: "10px", alignItems: "flex-start" },
  userRow: { display: "flex", gap: "10px", alignItems: "flex-start", justifyContent: "flex-end" },
  avatar: { fontSize: "24px", flexShrink: 0, marginTop: "2px" },
  userAvatar: { fontSize: "24px", flexShrink: 0, marginTop: "2px" },
  assistantBubble: { background: "#f7fafb", borderRadius: "0 12px 12px 12px", padding: "14px 16px", maxWidth: "85%", border: "1px solid #e8eef0" },
  userBubble: { background: "#1F4E5C", borderRadius: "12px 0 12px 12px", padding: "12px 16px", maxWidth: "80%" },
  answerText: { color: "#333", fontSize: "14px", lineHeight: 1.7, margin: 0 },
  userText: { color: "#fff", fontSize: "14px", lineHeight: 1.6, margin: 0 },
  productTag: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", background: "#EAF2F3", borderRadius: "8px", padding: "8px 12px", marginTop: "12px", fontSize: "13px", color: "#1F4E5C" },
  confidenceBadge: { background: "#1F4E5C", color: "#fff", fontSize: "11px", padding: "2px 8px", borderRadius: "10px", fontWeight: "700" },
  reasons: { marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #e8eef0" },
  reason: { color: "#555", fontSize: "13px", marginBottom: "4px", lineHeight: 1.5 },
  disclaimer: { marginTop: "10px", fontSize: "11px", color: "#999", fontStyle: "italic", lineHeight: 1.5, borderTop: "1px solid #eee", paddingTop: "8px" },
  typing: { display: "flex", gap: "4px", alignItems: "center", padding: "4px 0" },
  dot: { width: "8px", height: "8px", background: "#1F4E5C", borderRadius: "50%", opacity: 0.5 },
  inputRow: { display: "flex", gap: "10px", padding: "12px 16px", borderTop: "1px solid #eee", background: "#fafafa" },
  input: { flex: 1, border: "2px solid #e0e0e0", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", resize: "none", fontFamily: "inherit", outline: "none", lineHeight: 1.5, cursor: "text" },
  sendBtn: { background: "#1F4E5C", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 18px", fontWeight: "700", fontSize: "14px", cursor: "pointer", whiteSpace: "nowrap", alignSelf: "flex-end" },
  inputHint: { textAlign: "center", fontSize: "11px", color: "#bbb", padding: "8px", background: "#fafafa" },
  sidebar: { display: "flex", flexDirection: "column", gap: "20px" },
  sideCard: { background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" },
  sideTitle: { color: "#1F4E5C", fontSize: "15px", fontWeight: "800", marginBottom: "14px" },
  suggestions: { display: "flex", flexDirection: "column", gap: "8px" },
  suggestion: { background: "#f7fafb", border: "1px solid #e0e8ea", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", color: "#333", cursor: "pointer", textAlign: "left", lineHeight: 1.4 },
  mobileSuggestions: { padding: "12px 16px", borderTop: "1px solid #eee", background: "#fafafa" },
  mobileSuggestTitle: { fontSize: "12px", fontWeight: "700", color: "#1F4E5C", marginBottom: "10px" },
  suggestionsScroll: { display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto" },
  suggestionChip: { background: "#f7fafb", border: "1px solid #e0e8ea", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", color: "#333", cursor: "pointer", textAlign: "left", lineHeight: 1.4 },
  sideText: { color: "#666", fontSize: "13px", lineHeight: 1.6, marginBottom: "14px" },
  wizardLink: { color: "#1F4E5C", fontSize: "13px", fontWeight: "700", cursor: "pointer" },
};

export default Assistant;
