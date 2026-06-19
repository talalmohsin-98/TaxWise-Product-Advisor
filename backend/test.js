const { recommend } = require("./engine/recommendationEngine");

const scenarios = [
  {
    label: "Salary only → Free",
    answers: { filingType: "personal", incomeSources: ["salaryIncome"], deductions: [], helpPreference: "self", hasRevenue: null },
    expected: "free",
  },
  {
    label: "Salary + donations → Deluxe",
    answers: { filingType: "personal", incomeSources: ["salaryIncome"], deductions: ["donations"], helpPreference: "self", hasRevenue: null },
    expected: "deluxe",
  },
  {
    label: "Investment income → Premier",
    answers: { filingType: "personal", incomeSources: ["investmentIncome"], deductions: [], helpPreference: "self", hasRevenue: null },
    expected: "premier",
  },
  {
    label: "Rental income → Premier",
    answers: { filingType: "personal", incomeSources: ["rentalIncome"], deductions: [], helpPreference: "self", hasRevenue: null },
    expected: "premier",
  },
  {
    label: "Freelance income → Self-Employed",
    answers: { filingType: "personal", incomeSources: ["freelanceIncome"], deductions: [], helpPreference: "self", hasRevenue: null },
    expected: "self-employed",
  },
  {
    label: "Home-office expenses → Self-Employed",
    answers: { filingType: "personal", incomeSources: ["salaryIncome"], deductions: ["homeOfficeExpenses"], helpPreference: "self", hasRevenue: null },
    expected: "self-employed",
  },
  {
    label: "Wants expert help → Expert Assist",
    answers: { filingType: "personal", incomeSources: ["salaryIncome"], deductions: [], helpPreference: "expert-assist", hasRevenue: null },
    expected: "expert-assist",
  },
  {
    label: "Wants expert to file → Expert Full Service",
    answers: { filingType: "personal", incomeSources: ["salaryIncome"], deductions: [], helpPreference: "expert-full", hasRevenue: null },
    expected: "expert-full-service",
  },
  {
    label: "Incorporated + revenue → Business Corporate",
    answers: { filingType: "incorporated", incomeSources: [], deductions: [], helpPreference: "self", hasRevenue: true },
    expected: "business-corporate",
  },
  {
    label: "Incorporated + NO revenue → Nil Corporate Return",
    answers: { filingType: "incorporated", incomeSources: [], deductions: [], helpPreference: "self", hasRevenue: false },
    expected: "nil-corporate",
  },
];

let passed = 0;
let failed = 0;

scenarios.forEach((scenario) => {
  const result = recommend(scenario.answers);
  const ok = result.recommendedProductId === scenario.expected;
  if (ok) {
    passed++;
    console.log(`✅ PASS — ${scenario.label}`);
  } else {
    failed++;
    console.log(`❌ FAIL — ${scenario.label}`);
    console.log(`   Expected: ${scenario.expected}`);
    console.log(`   Got:      ${result.recommendedProductId}`);
  }
});

console.log(`\n${passed}/10 passed`);
if (failed === 0) {
  console.log("Engine is correct. Ready to build UI.");
} else {
  console.log("Fix the failing rules before moving forward.");
}