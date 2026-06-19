const products = require("../data/products");

function recommend(answers) {
  const {
    filingType,        // "personal" | "self-employed" | "incorporated"
    incomeSources,     // array e.g. ["salaryIncome", "investmentIncome"]
    deductions,        // array e.g. ["medicalExpenses", "donations"]
    helpPreference,    // "self" | "expert-assist" | "expert-full"
    hasRevenue,        // true | false | null (only for incorporated)
  } = answers;

  const has = (item) =>
    (incomeSources && incomeSources.includes(item)) ||
    (deductions && deductions.includes(item));

  // ── RULE 1: Incorporated Company (overrides everything) ──────────────────
  if (filingType === "incorporated") {
    if (hasRevenue === false) {
      return buildResult("nil-corporate", [
        "You selected an incorporated company.",
        "The company had no revenue.",
        "Nil Corporate Return is for incorporated companies with no revenue.",
      ], answers);
    }
    return buildResult("business-corporate", [
      "You selected an incorporated company with revenue.",
      "Business Corporate handles corporate tax returns.",
    ], answers);
  }

  // ── RULE 2: Expert Full Service ──────────────────────────────────────────
  if (helpPreference === "expert-full") {
    return buildResult("expert-full-service", [
      "You want an expert to file your return for you.",
      "Expert Full Service covers all personal tax situations.",
    ], answers);
  }

  // ── RULE 3: Expert Assist ────────────────────────────────────────────────
  if (helpPreference === "expert-assist") {
    return buildResult("expert-assist", [
      "You want expert help while filing.",
      "Expert Assist provides expert chat, video call, and review.",
    ], answers);
  }

  // ── RULE 4: Self-Employed ────────────────────────────────────────────────
  if (
    filingType === "self-employed" ||
    has("freelanceIncome") ||
    has("gigWorkIncome") ||
    has("businessExpenses") ||
    has("homeOfficeExpenses") ||
    has("vehicleExpenses")
  ) {
    return buildResult("self-employed", [
      "You have self-employment or freelance-related income or expenses.",
      "Self-Employed supports freelance income, gig work, and business expenses.",
    ], answers);
  }

  // ── RULE 5: Premier ──────────────────────────────────────────────────────
  if (
    has("investmentIncome") ||
    has("capitalGains") ||
    has("rentalIncome") ||
    has("foreignIncome")
  ) {
    return buildResult("premier", [
      "You have investment, rental, capital gains, or foreign income.",
      "Premier supports all these income types.",
    ], answers);
  }

  // ── RULE 6: Deluxe ───────────────────────────────────────────────────────
  if (
    has("medicalExpenses") ||
    has("donations") ||
    has("employmentExpenses")
  ) {
    return buildResult("deluxe", [
      "You have deductions such as medical expenses, donations, or employment expenses.",
      "Deluxe supports these common deductions.",
    ], answers);
  }

  // ── RULE 7: Free (fallback) ──────────────────────────────────────────────
  return buildResult("free", [
    "You have a simple personal tax situation.",
    "Free covers salary and student income with no special deductions.",
  ], answers);
}

function buildResult(productId, reasons, answers) {
  const product = products.find((p) => p.id === productId);

  const matchedInputs = [];
  if (answers.incomeSources) matchedInputs.push(...answers.incomeSources);
  if (answers.deductions) matchedInputs.push(...answers.deductions);
  if (answers.filingType) matchedInputs.push(answers.filingType);
  if (answers.helpPreference) matchedInputs.push(answers.helpPreference);

  return {
    recommendedProductId: product.id,
    recommendedProductName: product.name,
    price: product.price,
    currency: product.currency,
    confidence: "high",
    reasons,
    matchedInputs,
    disclaimer:
      "This recommendation provides general product guidance only and is not tax, legal, or financial advice.",
  };
}

module.exports = { recommend };