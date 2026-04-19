import { Router, type IRouter } from "express";
import { getLoanEligibility } from "../lib/ai-engine";
import {
  GetLoanEligibilityBody,
  GetLoanEligibilityResponse,
  GetLoanOffersBody,
  GetLoanOffersResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/loan/eligibility", async (req, res): Promise<void> => {
  const parsed = GetLoanEligibilityBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const result = getLoanEligibility(parsed.data);
  res.json(GetLoanEligibilityResponse.parse(result));
});

router.post("/loan/offers", async (req, res): Promise<void> => {
  const parsed = GetLoanOffersBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { totalCost, expectedSalary, riskLevel, targetCountry, scholarshipAvailable } = parsed.data;
  const netCost = totalCost - (scholarshipAvailable ?? 0);
  const emiRatio = expectedSalary > 0 ? (netCost / (expectedSalary * 12 * 7)) : 0.4;

  const offers = [
    {
      provider: "Avanse Financial Services",
      type: "Education NBFC",
      amount: `Up to INR ${Math.round(netCost * 0.9 / 100000)} Lakh`,
      interestRate: riskLevel === "Low" ? "11.5% p.a." : riskLevel === "Medium" ? "12.5% p.a." : "13.5% p.a.",
      tenure: "Up to 10 years",
      pros: ["No collateral up to 40L", "Fast processing (7 days)", "Covers living expenses"],
      cons: ["Higher interest than banks", "Processing fee 1-2%"],
      suitability: riskLevel !== "High" ? "Recommended" : "Conditional",
    },
    {
      provider: "HDFC Credila",
      type: "Education NBFC",
      amount: `Up to INR ${Math.round(netCost * 0.85 / 100000)} Lakh`,
      interestRate: riskLevel === "Low" ? "10.75% p.a." : "12.25% p.a.",
      tenure: "Up to 12 years",
      pros: ["Pre-admission loan approval", "Covers all expenses", "Strong brand acceptance"],
      cons: ["Collateral may be required above 40L", "Strict eligibility criteria"],
      suitability: riskLevel === "Low" ? "Best Fit" : "Consider",
    },
    {
      provider: "State Bank of India",
      type: "Public Sector Bank",
      amount: `Up to INR ${Math.round(Math.min(netCost * 0.8, 15000000) / 100000)} Lakh`,
      interestRate: "11.15% p.a. (Base + 0.5%)",
      tenure: "Up to 15 years",
      pros: ["Lowest interest rates", "Government-backed security", "Accepted worldwide"],
      cons: ["Collateral mandatory above 7.5L", "Slow processing (4-6 weeks)", "Strict documentation"],
      suitability: emiRatio < 0.35 ? "Best Fit" : "Consider",
    },
    {
      provider: "Prodigy Finance",
      type: "International NBFC",
      amount: `Up to USD ${Math.round(totalCost / 80 / 1000)}K`,
      interestRate: "8-13% p.a. (SOFR based)",
      tenure: "Up to 10 years",
      pros: ["No Indian co-applicant needed", "Disbursed directly to university", "No collateral"],
      cons: ["Higher effective cost with currency risk", "Only for select universities"],
      suitability: (targetCountry === "UK" || targetCountry === "USA" || targetCountry === "Canada") ? "Recommended" : "Not Applicable",
    },
    {
      provider: "MPOWER Financing",
      type: "International NBFC",
      amount: "Up to USD 100,000",
      interestRate: "12-14% p.a. fixed",
      tenure: "Up to 10 years",
      pros: ["No co-signer or collateral required", "Career support included", "Fast approval"],
      cons: ["Higher interest rate", "Limited to US/Canada universities"],
      suitability: (targetCountry === "USA" || targetCountry === "Canada") ? "Consider" : "Not Applicable",
    },
    {
      provider: "Scholarships + Part-Time Work",
      type: "Alternative Funding",
      amount: "Variable",
      interestRate: "0%",
      tenure: "During study",
      pros: ["No repayment required", "Reduces loan burden significantly", "Builds profile"],
      cons: ["Competitive scholarships", "Part-time work limits (20hrs/week)", "Not guaranteed"],
      suitability: "Recommended (Supplement)",
    },
  ];

  const validOffers = offers.filter((o) => o.suitability !== "Not Applicable");
  const bestOption = validOffers.find((o) => o.suitability === "Best Fit")?.provider
    ?? validOffers.find((o) => o.suitability === "Recommended")?.provider
    ?? validOffers[0].provider;

  res.json(
    GetLoanOffersResponse.parse({
      offers: validOffers,
      recommendation: `Based on your profile (risk: ${riskLevel ?? "Medium"}, loan amount ~INR ${Math.round(netCost / 100000)}L), we recommend a combination of ${bestOption} for the primary loan with scholarship applications as supplementary funding.`,
      bestOption,
    })
  );
});

export default router;
