import { Router, type IRouter } from "express";
import {
  MatchScholarshipsBody,
  MatchScholarshipsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const SCHOLARSHIPS = [
  {
    id: "chevening",
    name: "Chevening Scholarships",
    provider: "UK Government",
    country: "UK",
    amount: "Full tuition + £1,100/month",
    coverage: "Full tuition, living allowance, flights",
    eligibility: "2+ years work experience, leadership potential",
    deadline: "November 2025",
    type: "Government",
    matchFactors: { country: "UK", cgpaMin: 6.5, needsBased: false },
    applicationUrl: "https://www.chevening.org",
  },
  {
    id: "daad_india",
    name: "DAAD Scholarship",
    provider: "German Academic Exchange",
    country: "Germany",
    amount: "EUR 861/month + travel",
    coverage: "Monthly stipend, travel allowance, health insurance",
    eligibility: "CGPA 7.5+, relevant academic background",
    deadline: "October 2025",
    type: "Government",
    matchFactors: { country: "Germany", cgpaMin: 7.5, needsBased: false },
    applicationUrl: "https://www.daad.de",
  },
  {
    id: "vanier_canada",
    name: "Vanier Canada Graduate Scholarship",
    provider: "Government of Canada",
    country: "Canada",
    amount: "CAD 50,000/year",
    coverage: "Annual stipend for 3 years",
    eligibility: "Academic excellence, research potential, leadership",
    deadline: "November 2025",
    type: "Government",
    matchFactors: { country: "Canada", cgpaMin: 8.0, needsBased: false },
    applicationUrl: "https://vanier.gc.ca",
  },
  {
    id: "gates_cambridge",
    name: "Gates Cambridge Scholarship",
    provider: "Bill & Melinda Gates Foundation",
    country: "UK",
    amount: "Full cost of study",
    coverage: "Full tuition, maintenance allowance, flights",
    eligibility: "CGPA 8.5+, outstanding academic achievement",
    deadline: "October 2025",
    type: "Merit",
    matchFactors: { country: "UK", cgpaMin: 8.5, needsBased: false },
    applicationUrl: "https://www.gatescambridge.org",
  },
  {
    id: "australia_awards",
    name: "Australia Awards Scholarships",
    provider: "Australian Government (DFAT)",
    country: "Australia",
    amount: "Full tuition + AUD 30,000/year",
    coverage: "Full tuition, living expenses, health insurance",
    eligibility: "Indian citizen, development sector focus",
    deadline: "April 2025",
    type: "Government",
    matchFactors: { country: "Australia", cgpaMin: 6.5, needsBased: true },
    applicationUrl: "https://www.australiaawardsindia.org",
  },
  {
    id: "ireland_govt",
    name: "Government of Ireland IUA Scholarship",
    provider: "Irish Government",
    country: "Ireland",
    amount: "EUR 10,000 + fees",
    coverage: "Tuition contribution and living support",
    eligibility: "Non-EU students, academic merit",
    deadline: "March 2025",
    type: "Government",
    matchFactors: { country: "Ireland", cgpaMin: 7.0, needsBased: false },
    applicationUrl: "https://hea.ie",
  },
  {
    id: "nus_research",
    name: "NUS Research Scholarship",
    provider: "National University of Singapore",
    country: "Singapore",
    amount: "SGD 20,000/year + tuition",
    coverage: "Full tuition waiver + stipend",
    eligibility: "Research program, CGPA 8.0+",
    deadline: "January 2026",
    type: "Merit",
    matchFactors: { country: "Singapore", cgpaMin: 8.0, needsBased: false },
    applicationUrl: "https://nusgs.nus.edu.sg",
  },
  {
    id: "inlaks",
    name: "Inlaks Shivdasani Foundation Scholarship",
    provider: "Inlaks Foundation",
    country: "USA",
    amount: "USD 100,000",
    coverage: "Living costs and partial tuition",
    eligibility: "Indian students, CGPA 7.5+, social impact focus",
    deadline: "April 2025",
    type: "Need-based",
    matchFactors: { country: "USA", cgpaMin: 7.5, needsBased: true },
    applicationUrl: "https://www.inlaksfoundation.org",
  },
];

function calculateMatchScore(scholarship: typeof SCHOLARSHIPS[0], cgpa: number, targetCountry?: string, financialNeed?: boolean): number {
  let score = 50;
  if (targetCountry && scholarship.country === targetCountry) score += 30;
  if (cgpa >= scholarship.matchFactors.cgpaMin) {
    score += Math.min(15, (cgpa - scholarship.matchFactors.cgpaMin) * 10);
  } else {
    score -= (scholarship.matchFactors.cgpaMin - cgpa) * 15;
  }
  if (scholarship.matchFactors.needsBased && financialNeed) score += 10;
  return Math.max(10, Math.min(98, Math.round(score)));
}

router.post("/scholarship/match", async (req, res): Promise<void> => {
  const parsed = MatchScholarshipsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { cgpa, targetCountry, financialNeed } = parsed.data;

  const matched = SCHOLARSHIPS.map((s) => ({
    id: s.id,
    name: s.name,
    provider: s.provider,
    country: s.country,
    amount: s.amount,
    coverage: s.coverage,
    eligibility: s.eligibility,
    deadline: s.deadline,
    type: s.type,
    matchScore: calculateMatchScore(s, cgpa, targetCountry, financialNeed),
    applicationUrl: s.applicationUrl,
  }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .filter((s) => s.matchScore >= 20);

  const topMatches = matched.slice(0, 6);
  const highMatchCount = topMatches.filter((s) => s.matchScore >= 70).length;

  res.json(
    MatchScholarshipsResponse.parse({
      scholarships: topMatches,
      totalValue: `Up to ${targetCountry === "UK" ? "GBP 80,000" : targetCountry === "Germany" ? "EUR 30,000" : "INR 80 Lakh+"} in combined scholarship value`,
      summary: `Found ${topMatches.length} scholarships matching your profile. ${highMatchCount} are high-probability matches (70%+ match score). Apply to all high-match scholarships simultaneously to maximize funding.`,
    })
  );
});

export default router;
