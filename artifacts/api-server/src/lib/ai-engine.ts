export interface CareerInput {
  cgpa: number;
  degree: string;
  branch?: string;
  interests?: string;
  budget?: number;
  targetCountry?: string;
  internships?: number;
  skills?: string[];
}

export interface RoiInput {
  cgpa: number;
  degree: string;
  internships?: number;
  collegeTier?: string;
  field: string;
  skills?: string[];
  country?: string;
  course?: string;
  totalBudget?: number;
  loanAmount?: number;
}

export interface LoanInput {
  totalCost: number;
  expectedSalary: number;
  familyIncome?: string;
  hasCoApplicant?: boolean;
  scholarship?: number;
  riskLevel?: string;
  tenure?: number;
}

const COUNTRY_DATA: Record<string, { avgTuition: string; postStudyWork: string; jobMarket: string; flag: string }> = {
  UK: { avgTuition: "£15–25k/yr", postStudyWork: "2 years", jobMarket: "Strong", flag: "GB" },
  USA: { avgTuition: "$30–55k/yr", postStudyWork: "OPT 3 years", jobMarket: "Very Strong", flag: "US" },
  Canada: { avgTuition: "CAD 20–35k/yr", postStudyWork: "3 years", jobMarket: "Strong", flag: "CA" },
  Germany: { avgTuition: "€0–3k/yr", postStudyWork: "18 months", jobMarket: "Good", flag: "DE" },
  Australia: { avgTuition: "AUD 25–45k/yr", postStudyWork: "2–4 years", jobMarket: "Strong", flag: "AU" },
  Ireland: { avgTuition: "€12–25k/yr", postStudyWork: "2 years", jobMarket: "Good (Tech)", flag: "IE" },
  Singapore: { avgTuition: "SGD 25–45k/yr", postStudyWork: "Limited", jobMarket: "Excellent", flag: "SG" },
  Netherlands: { avgTuition: "€10–20k/yr", postStudyWork: "1 year", jobMarket: "Good", flag: "NL" },
};

export function computePlacementScore(input: RoiInput): number {
  const cgpaScore = Math.min(input.cgpa / 10, 1) * 0.25;
  const internshipScore = Math.min((input.internships ?? 0) / 3, 1) * 0.20;
  const tierScore = input.collegeTier === "Tier 1" ? 0.20 : input.collegeTier === "Tier 2" ? 0.12 : 0.06;
  const fieldDemand = ["Data Science", "AI", "Machine Learning", "Software Engineering", "Computer Science"].includes(input.field) ? 0.20 : 0.10;
  const skillScore = Math.min((input.skills?.length ?? 0) / 5, 1) * 0.10;
  const jobMarket = (input.country && ["USA", "UK", "Canada", "Australia"].includes(input.country)) ? 0.05 : 0.03;
  return Math.round((cgpaScore + internshipScore + tierScore + fieldDemand + skillScore + jobMarket) * 100);
}

export function getCareerRecommendations(input: CareerInput) {
  const budget = input.budget ?? 2000000;
  const cgpa = input.cgpa;

  const countries = [
    { country: "UK", fitScore: Math.min(85 + (cgpa - 7) * 3, 98), reason: "1-year Masters, strong tech ecosystem, PSW visa available" },
    { country: "USA", fitScore: Math.min(78 + (cgpa - 7) * 4, 96), reason: "Global career launchpad, top universities, diverse opportunities" },
    { country: "Canada", fitScore: Math.min(80 + (cgpa - 7) * 2, 94), reason: "Immigration-friendly, growing tech sector, quality of life" },
    { country: "Germany", fitScore: budget < 1500000 ? 88 : 70, reason: "Near-zero tuition at public universities, excellent engineering ecosystem" },
    { country: "Australia", fitScore: Math.min(75 + (cgpa - 7) * 2, 90), reason: "Strong STEM demand, 2–4 year post-study work visa" },
    { country: "Ireland", fitScore: 72, reason: "EU hub for tech giants, English-speaking, PSW visa" },
  ].map((c) => ({
    ...c,
    fitScore: Math.max(50, Math.min(99, c.fitScore)),
    ...(COUNTRY_DATA[c.country] ?? {}),
  })).sort((a, b) => b.fitScore - a.fitScore);

  const courseMap: Record<string, string[]> = {
    "Computer Science": ["MS Computer Science", "MS Software Engineering", "MS Data Science"],
    "Information Technology": ["MS Information Systems", "MS Data Science", "MS Business Analytics"],
    "Electronics": ["MS Electrical Engineering", "MS Embedded Systems", "MS AI & Robotics"],
    "Mechanical": ["MS Mechanical Engineering", "MS Robotics", "MBA (Manufacturing)"],
    "default": ["MS Data Science", "MS AI & Machine Learning", "MS Business Analytics"],
  };
  const branch = input.branch ?? "default";
  const courseList = courseMap[branch] ?? courseMap["default"];

  const courses = courseList.map((name, i) => ({
    name,
    field: name.split(" ").slice(1).join(" "),
    duration: "12–18 months",
    avgSalary: i === 0 ? "₹12–18 LPA" : i === 1 ? "₹10–15 LPA" : "₹9–14 LPA",
    demandLevel: i === 0 ? "Very High" : i === 1 ? "High" : "Medium-High",
    reason: `Strong fit with your ${branch} background and current market demand`,
  }));

  const universities = [
    { name: "University of Edinburgh", country: "UK", tier: "Ambitious", admitProbability: cgpa >= 8.5 ? 0.45 : 0.30, tuitionRange: "£20–25k", employabilityRank: 15, reason: "Russell Group, top CS program" },
    { name: "University of Melbourne", country: "Australia", tier: "Target", admitProbability: cgpa >= 7.5 ? 0.65 : 0.50, tuitionRange: "AUD 35–40k", employabilityRank: 8, reason: "Top Go8, strong industry linkage" },
    { name: "TU Munich", country: "Germany", tier: "Target", admitProbability: cgpa >= 8.0 ? 0.55 : 0.40, tuitionRange: "€0–3k", employabilityRank: 12, reason: "World-class engineering, affordable" },
    { name: "University of Waterloo", country: "Canada", tier: "Target", admitProbability: cgpa >= 8.0 ? 0.60 : 0.45, tuitionRange: "CAD 25–30k", employabilityRank: 20, reason: "Top co-op program, tech partnerships" },
    { name: "University of Galway", country: "Ireland", tier: "Safe", admitProbability: cgpa >= 7.0 ? 0.80 : 0.70, tuitionRange: "€12–16k", employabilityRank: 45, reason: "EU base, PSW, English-speaking" },
    { name: "Vrije Universiteit Amsterdam", country: "Netherlands", tier: "Safe", admitProbability: 0.78, tuitionRange: "€12–15k", employabilityRank: 50, reason: "English-taught, affordable, EU hub" },
  ];

  const riskLevel = input.internships && input.internships > 1 ? "Low" : cgpa >= 8.0 ? "Low-Medium" : "Medium";
  const aiExplanation = `Based on your profile — ${cgpa} CGPA in ${input.degree} (${branch}) — your academic foundation is ${cgpa >= 8.0 ? "strong" : "solid"}. ${input.internships ? `Your ${input.internships} internship(s) demonstrate practical exposure. ` : "Limited internship experience is a focus area. "}UK offers the fastest path with a 1-year Masters and immediate PSW visa. Germany is excellent if budget is the primary constraint. Your risk level is ${riskLevel} — ${riskLevel === "Low" ? "you are well-positioned for top programs." : "focused preparation on internships and certifications will strengthen your profile."}`;

  const careerPath = [
    courses[0]?.name ?? "MS Data Science",
    "Graduate Analyst / Engineer",
    "Senior Engineer / Data Scientist",
    "Tech Lead / Manager",
    "Director / Principal Engineer",
  ];

  return { countries, courses, universities, careerPath, aiExplanation };
}

export function getRoiPrediction(input: RoiInput) {
  const score = computePlacementScore(input);
  const placement3Month = Math.min(score * 0.85, 95);
  const placement6Month = Math.min(score * 0.95, 98);
  const placement12Month = Math.min(score * 0.99, 99);

  const riskLevel = score >= 70 ? "Low" : score >= 50 ? "Medium" : "High";

  const salaryMultipliers: Record<string, number> = {
    "Data Science": 1.3,
    "AI": 1.4,
    "Machine Learning": 1.4,
    "Software Engineering": 1.25,
    "Computer Science": 1.2,
    "MBA": 1.3,
    default: 1.0,
  };
  const multiplier = salaryMultipliers[input.field] ?? salaryMultipliers.default;
  const baseSalaryMin = 700000;
  const salaryBandMin = Math.round(baseSalaryMin * multiplier * (input.cgpa / 7.5));
  const salaryBandMax = Math.round(salaryBandMin * 1.5);
  const salaryMedian = Math.round((salaryBandMin + salaryBandMax) / 2);

  const budget = input.totalBudget ?? 2500000;
  const countryMultiplier = input.country === "USA" ? 1.3 : input.country === "UK" ? 0.85 : 1.0;
  const tuition = Math.round(budget * 0.6 * countryMultiplier);
  const living = Math.round(budget * 0.3 * countryMultiplier);
  const visa = 50000;
  const travel = 80000;
  const misc = Math.round(budget * 0.1);
  const total = tuition + living + visa + travel + misc;

  const loan = input.loanAmount ?? Math.round(total * 0.7);
  const paybackYears = Math.round((loan / (salaryMedian * 0.3)) * 10) / 10;
  const roiStrength = paybackYears <= 3 ? "Strong" : paybackYears <= 5 ? "Moderate" : "Weak";

  const aiExplanation = `Your placement score is ${score}/100, indicating ${riskLevel.toLowerCase()} placement risk. With ${input.internships ?? 0} internship(s) and a ${input.cgpa} CGPA in ${input.field}, you have a ${Math.round(placement3Month)}% probability of securing placement within 3 months of graduation. Your expected salary band (₹${Math.round(salaryBandMin / 100000)}–${Math.round(salaryBandMax / 100000)} LPA) supports a loan repayment timeline of approximately ${paybackYears} years. ${riskLevel === "High" ? "Consider adding certifications and practical projects to improve your risk profile." : riskLevel === "Medium" ? "One or two additional certifications could shift you to the Low risk band." : "Your profile is strong — proceed with confidence."}`;

  return {
    placementScore: score,
    placement3Month: Math.round(placement3Month),
    placement6Month: Math.round(placement6Month),
    placement12Month: Math.round(placement12Month),
    riskLevel,
    salaryBandMin,
    salaryBandMax,
    salaryMedian,
    totalCost: { tuition, living, visa, travel, misc, total },
    roiStrength,
    paybackYears,
    aiExplanation,
  };
}

export function getLoanEligibility(input: LoanInput) {
  const salaryMultiplier = input.riskLevel === "Low" ? 10 : input.riskLevel === "Medium" ? 8 : 6;
  const baseEligible = input.expectedSalary * salaryMultiplier;
  const coApplicantBonus = input.hasCoApplicant ? 1.3 : 1.0;
  const incomeBonus = input.familyIncome === "10L+" ? 1.2 : input.familyIncome === "5–10L" ? 1.1 : 1.0;

  const eligibleMax = Math.round(Math.min(baseEligible * coApplicantBonus * incomeBonus, input.totalCost));
  const eligibleMin = Math.round(eligibleMax * 0.7);

  const scholarship = input.scholarship ?? 0;
  const loanNeeded = Math.max(input.totalCost - scholarship, 0);
  const loanReadinessScore = Math.min(
    Math.round(
      (input.cgpa ? 0 : 0) +
      (eligibleMax >= loanNeeded ? 30 : 15) +
      (input.hasCoApplicant ? 20 : 0) +
      (input.familyIncome === "10L+" ? 20 : input.familyIncome === "5–10L" ? 12 : 5) +
      (input.riskLevel === "Low" ? 30 : input.riskLevel === "Medium" ? 20 : 10)
    ),
    100,
  );

  const readinessLevel = loanReadinessScore >= 70 ? "Strong" : loanReadinessScore >= 50 ? "Moderate" : "Needs Improvement";
  const needsCoApplicant = !input.hasCoApplicant && loanReadinessScore < 60;

  const tenures = [7, 10, 15];
  const interestRate = 0.105;
  const emiScenarios = tenures.map((tenure) => {
    const principal = eligibleMax * 0.85;
    const monthlyRate = interestRate / 12;
    const months = tenure * 12;
    const emi = Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));
    const totalPaid = emi * months;
    const totalInterest = Math.round(totalPaid - principal);
    const monthlyAffordability = input.expectedSalary / 12;
    const stressLevel = emi > monthlyAffordability * 0.5 ? "High" : emi > monthlyAffordability * 0.35 ? "Moderate" : "Low";
    return { tenure, emi, totalInterest, stressLevel };
  });

  const affordabilityScore = loanReadinessScore >= 70 ? "Comfortable" : loanReadinessScore >= 50 ? "Manageable" : "Stretched";
  const recommendation = needsCoApplicant
    ? "Adding a co-applicant will significantly improve your loan eligibility and terms."
    : loanReadinessScore >= 70
    ? "Your profile is well-suited for education financing. Proceed with a pre-application."
    : "Consider a scholarship-first strategy or a lower-cost country to reduce loan dependency.";

  const aiExplanation = `Your loan readiness score is ${loanReadinessScore}/100 (${readinessLevel}). Based on your expected salary of ₹${Math.round(input.expectedSalary / 100000)} LPA and ${input.riskLevel ?? "Medium"} placement risk, you are eligible for ₹${Math.round(eligibleMin / 100000)}–${Math.round(eligibleMax / 100000)} lakhs. ${needsCoApplicant ? "A co-applicant income will strengthen your application significantly. " : ""}The 10-year tenure option offers the best balance between EMI affordability and total interest paid.`;

  return {
    eligibleMin,
    eligibleMax,
    loanReadinessScore,
    readinessLevel,
    needsCoApplicant,
    recommendedTenure: 10,
    emiScenarios,
    affordabilityScore,
    recommendation,
    aiExplanation,
  };
}
