const express = require("express");
const cors = require("cors");
require("dotenv").config();

const products = require("./data/products");
const { recommend } = require("./engine/recommendationEngine");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ── GET /api/products ────────────────────────────────────────────────────────
app.get("/api/products", (req, res) => {
  res.json(products);
});

// ── POST /api/recommend ──────────────────────────────────────────────────────
app.post("/api/recommend", (req, res) => {
  const { filingType, incomeSources, deductions, helpPreference, hasRevenue } =
    req.body;

  if (!filingType) {
    return res.status(400).json({ error: "Filing type is required." });
  }
  if (!incomeSources || incomeSources.length === 0) {
    return res.status(400).json({ error: "At least one income source is required." });
  }
  if (!helpPreference) {
    return res.status(400).json({ error: "Help preference is required." });
  }
  if (filingType === "incorporated" && hasRevenue === null) {
    return res.status(400).json({ error: "Company revenue answer is required." });
  }

  const result = recommend({
    filingType,
    incomeSources,
    deductions: deductions || [],
    helpPreference,
    hasRevenue,
  });

  res.json(result);
});

// ── POST /api/assistant ──────────────────────────────────────────────────────
app.post("/api/assistant", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required." });
  }

  try {
    const Groq = require("groq-sdk");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const productSummary = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      currency: p.currency,
      description: p.description,
      bestFor: p.bestFor,
      supports: p.supports,
    }));

    const systemPrompt = `
You are TaxWise Assistant, a product guidance assistant for a Canadian tax software company.

Your ONLY job is to help users choose the right tax software product from the 8 products below.
You must answer based ONLY on the product data and rules provided. Never invent features.

PRODUCTS:
${JSON.stringify(productSummary, null, 2)}

RECOMMENDATION RULES (priority order):
1. Incorporated company → Business Corporate (with revenue) or Nil Corporate Return (no revenue). Overrides everything.
2. "Expert files for me" → Expert Full Service
3. "Expert help while filing" → Expert Assist
4. Freelance/gig income, business/home-office/vehicle expenses → Self-Employed
5. Investment income, capital gains, rental income, foreign income → Premier
6. Medical expenses, donations, employment expenses → Deluxe
7. Simple salary/student income, no deductions → Free

SAFETY RULES - you MUST follow these:
- NEVER say "you are guaranteed a refund"
- NEVER say "you definitely qualify for this deduction"
- NEVER say "this is legal advice" or "this is tax advice" or "this is financial advice"
- NEVER say "you must use this product"
- NEVER invent features that are not in the product data
- ALWAYS start answers with "Based on the provided product rules..."
- ALWAYS end every response with this exact disclaimer: "This is general product guidance only and is not tax, legal, or financial advice. Please consult a qualified tax professional."
- If asked for a refund guarantee or tax/legal/financial advice, politely refuse and redirect to product guidance only.

RESPONSE FORMAT:
Respond in JSON only. No markdown. No explanation outside JSON. Use this exact structure:
{
  "answer": "your full answer here",
  "recommendedProduct": "product name or null if not applicable",
  "confidence": "high" or "medium" or "low",
  "reasons": ["reason 1", "reason 2"],
  "disclaimer": "This is general product guidance only and is not tax, legal, or financial advice. Please consult a qualified tax professional."
}
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    });

    const raw = completion.choices[0]?.message?.content || "";

    let parsed;
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        answer: raw,
        recommendedProduct: null,
        confidence: "medium",
        reasons: [],
        disclaimer:
          "This is general product guidance only and is not tax, legal, or financial advice. Please consult a qualified tax professional.",
      };
    }

    res.json(parsed);
  } catch (err) {
    console.error("Groq error:", err.message);
    res.status(500).json({
      error: "Assistant unavailable. Please try again.",
      disclaimer:
        "This is general product guidance only and is not tax, legal, or financial advice.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});