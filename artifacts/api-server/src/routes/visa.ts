import { Router, type IRouter } from "express";
import {
  GetVisaGuideBody,
  GetVisaGuideResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

type CountryKey = "UK" | "USA" | "Canada" | "Australia" | "Germany" | "Ireland" | "Singapore";

const VISA_GUIDES: Record<CountryKey, object> = {
  UK: {
    country: "UK",
    visaType: "Student Visa (Tier 4)",
    processingTime: "3-5 weeks",
    fee: "£490 (approx. INR 53,000)",
    successRate: 91,
    postStudyWork: "2 years Graduate Route (3 years for PhD)",
    steps: [
      { step: 1, title: "Receive Unconditional Offer", description: "Get unconditional offer letter from UK university", timeframe: "After application", critical: true },
      { step: 2, title: "Receive CAS Number", description: "University sends Confirmation of Acceptance for Studies (CAS)", timeframe: "4-6 weeks before course start", critical: true },
      { step: 3, title: "Prepare Financial Evidence", description: "Show sufficient funds: tuition + GBP 1,334/month for London or GBP 1,023/month elsewhere", timeframe: "At least 28 days maintained", critical: true },
      { step: 4, title: "Book Biometrics Appointment", description: "Book via UKVI website at nearest Visa Application Centre", timeframe: "3 months before course start", critical: true },
      { step: 5, title: "Submit Online Application", description: "Complete the Student Visa application at gov.uk/student-visa", timeframe: "6 months before course start", critical: true },
      { step: 6, title: "Attend VAC & Submit Biometrics", description: "Visit VAC, submit passport and biometrics", timeframe: "On appointment date", critical: true },
      { step: 7, title: "Decision & Vignette", description: "Receive decision; collect vignette sticker in passport", timeframe: "3-5 weeks after biometrics", critical: false },
    ],
    requiredDocuments: [
      "Valid passport (18+ months validity)",
      "CAS number from university",
      "Bank statements (28+ days, sufficient funds)",
      "IELTS/TOEFL scores (min 6.0 overall)",
      "Tuberculosis test results (India mandatory)",
      "Academic transcripts and certificates",
      "Proof of accommodation in UK",
      "ATAS certificate (if applicable for certain courses)",
    ],
    tips: [
      "Apply as early as 6 months before course start — earlier is better",
      "Maintain the required bank balance for exactly 28 consecutive days before application",
      "TB test at approved clinic is mandatory for Indian applicants",
      "Do not book flight tickets until visa is approved",
      "Use a VFS Global centre — they are authorised UKVI partners",
    ],
  },
  USA: {
    country: "USA",
    visaType: "F-1 Student Visa",
    processingTime: "2-8 weeks (interview required)",
    fee: "USD 185 (SEVIS) + USD 160 (Visa fee) = approx. INR 28,000",
    successRate: 87,
    postStudyWork: "12 months OPT + 24 months STEM extension (36 months total)",
    steps: [
      { step: 1, title: "Receive I-20 from University", description: "University sends Form I-20 (Certificate of Eligibility)", timeframe: "After admission confirmation", critical: true },
      { step: 2, title: "Pay SEVIS Fee", description: "Pay I-901 SEVIS fee online at fmjfee.com", timeframe: "Before DS-160 submission", critical: true },
      { step: 3, title: "Complete DS-160 Form", description: "Fill non-immigrant visa application at ceac.state.gov", timeframe: "3 months before start", critical: true },
      { step: 4, title: "Schedule Visa Interview", description: "Book interview at nearest US Consulate/Embassy in India", timeframe: "As early as possible", critical: true },
      { step: 5, title: "Prepare for Interview", description: "Practice answering questions about course, university, funding, post-study plans", timeframe: "2-4 weeks before interview", critical: true },
      { step: 6, title: "Attend Consular Interview", description: "Bring all documents; interview is typically 2-5 minutes", timeframe: "On scheduled date", critical: true },
      { step: 7, title: "Passport Return", description: "Visa stamped in passport, returned via courier", timeframe: "3-5 business days after approval", critical: false },
    ],
    requiredDocuments: [
      "Valid passport",
      "Form I-20 from university",
      "DS-160 confirmation page",
      "SEVIS fee payment receipt",
      "Bank statements (showing full program funding)",
      "Sponsor letter and financial documents",
      "Enrollment letter from university",
      "Ties to home country evidence",
    ],
    tips: [
      "Book interview appointment early — slots fill up months in advance in India",
      "Be concise and confident in the interview — consular officers have limited time",
      "Show strong intent to return to India after studies",
      "STEM students: apply for OPT 90 days before graduation",
      "Maintain F-1 status by registering full-time every semester",
    ],
  },
  Canada: {
    country: "Canada",
    visaType: "Study Permit",
    processingTime: "4-12 weeks",
    fee: "CAD 150 (approx. INR 9,000)",
    successRate: 88,
    postStudyWork: "PGWP up to 3 years depending on program length",
    steps: [
      { step: 1, title: "Receive Letter of Acceptance", description: "Get acceptance from Designated Learning Institution (DLI)", timeframe: "After admission", critical: true },
      { step: 2, title: "Check PAL/PAL Requirements", description: "Some provinces require Provincial Attestation Letter (PAL)", timeframe: "Before applying", critical: true },
      { step: 3, title: "Gather Financial Proof", description: "Show tuition for first year + CAD 10,000 living expenses", timeframe: "Before application", critical: true },
      { step: 4, title: "Apply Online via IRCC", description: "Submit study permit application on ircc.canada.ca", timeframe: "At least 3-4 months before start", critical: true },
      { step: 5, title: "Biometrics Collection", description: "Book and attend biometrics at VAC", timeframe: "Within 30 days of request", critical: true },
      { step: 6, title: "Medical Exam", description: "If requested, complete medical exam with approved physician", timeframe: "Within deadline given", critical: false },
      { step: 7, title: "Receive Port of Entry Letter", description: "Approval letter; actual permit stamped at Canadian border", timeframe: "1-3 weeks after approval", critical: false },
    ],
    requiredDocuments: [
      "Valid passport",
      "Letter of Acceptance from DLI",
      "Provincial Attestation Letter (PAL) if required",
      "Proof of funds (bank statements, GICs)",
      "Biometrics",
      "Digital photograph",
      "Study plan (why Canada, why this program)",
      "Ties to home country evidence",
    ],
    tips: [
      "Open a GIC (Guaranteed Investment Certificate) with a Canadian bank for stronger financial proof",
      "Apply as soon as you receive your acceptance letter",
      "PAL is now mandatory for most provinces — check your province's requirement",
      "PGWP allows you to work anywhere in Canada after graduation",
      "Apply for SIN (Social Insurance Number) immediately upon arrival",
    ],
  },
  Australia: {
    country: "Australia",
    visaType: "Student Visa (Subclass 500)",
    processingTime: "3-6 weeks",
    fee: "AUD 710 (approx. INR 38,000)",
    successRate: 93,
    postStudyWork: "2-4 years Temporary Graduate Visa (subclass 485)",
    steps: [
      { step: 1, title: "Receive CoE from University", description: "Confirmation of Enrolment issued after accepting offer and paying deposit", timeframe: "After deposit payment", critical: true },
      { step: 2, title: "Purchase OSHC", description: "Buy Overseas Student Health Cover (mandatory insurance)", timeframe: "Before visa application", critical: true },
      { step: 3, title: "Gather Financial Evidence", description: "Show AUD 21,041/year for living + full tuition", timeframe: "Before application", critical: true },
      { step: 4, title: "Apply via ImmiAccount", description: "Submit online via Australia's ImmiAccount portal", timeframe: "2-3 months before intake", critical: true },
      { step: 5, title: "Health Examination", description: "Complete offshore health examination at approved clinic", timeframe: "After application, if requested", critical: false },
      { step: 6, title: "Grant Notification", description: "Visa grant letter sent via email; no stamp needed in passport", timeframe: "3-6 weeks after submission", critical: false },
    ],
    requiredDocuments: [
      "Valid passport",
      "CoE from registered CRICOS provider",
      "OSHC policy document",
      "Financial capacity evidence",
      "English proficiency scores",
      "Statement of Purpose",
      "Academic transcripts",
      "Health insurance evidence",
    ],
    tips: [
      "Australia uses an electronic visa — no stamp needed, just the grant letter",
      "Students can work 48 hours per fortnight during semester (48 hours, not 40)",
      "OSHC must cover the entire duration of your CoE",
      "Apply for the 485 visa 3 months before your course ends",
      "Regional universities may offer additional post-study work rights",
    ],
  },
  Germany: {
    country: "Germany",
    visaType: "National Visa (Type D) for Student",
    processingTime: "6-12 weeks",
    fee: "EUR 75 (approx. INR 7,000)",
    successRate: 85,
    postStudyWork: "18 months job seeker visa after graduation",
    steps: [
      { step: 1, title: "Complete APS Certificate", description: "Academic evaluation certificate mandatory for Indian students (APS Deutschland India)", timeframe: "3-4 months before application", critical: true },
      { step: 2, title: "Open Blocked Account (Sperrkonto)", description: "Deposit EUR 11,904 (2025 rate) in a German blocked account", timeframe: "2-3 months before application", critical: true },
      { step: 3, title: "Receive University Admission", description: "Conditional or unconditional admission letter from German university", timeframe: "After admission", critical: true },
      { step: 4, title: "Book VFS Appointment", description: "Book visa appointment at German Embassy via VFS Global India", timeframe: "3+ months before start", critical: true },
      { step: 5, title: "Attend Embassy Interview", description: "Attend appointment with all original documents", timeframe: "On appointment date", critical: true },
      { step: 6, title: "Receive Visa", description: "Visa issued as sticker in passport", timeframe: "4-8 weeks after interview", critical: false },
    ],
    requiredDocuments: [
      "APS Certificate (mandatory for Indian students)",
      "Blocked account proof (Sperrkonto) showing EUR 11,904",
      "University admission letter",
      "Health insurance proof",
      "German language certificate or English proficiency scores",
      "Motivation letter",
      "CV / Resume",
      "Academic transcripts (officially translated to German)",
    ],
    tips: [
      "Start the APS process immediately — it takes 4-6 weeks and is mandatory",
      "Popular blocked account providers: Deutsche Bank, Fintiba, Coracle",
      "Many German universities teach in English — check program language",
      "Germany has no tuition fees at public universities (just semester fees ~EUR 300)",
      "Learn basic German before arriving — it helps significantly with daily life",
    ],
  },
  Ireland: {
    country: "Ireland",
    visaType: "Student Visa (D Study)",
    processingTime: "3-4 weeks",
    fee: "EUR 60 (single entry) or EUR 100 (multiple entry)",
    successRate: 94,
    postStudyWork: "2 years Third Level Graduate Programme (SPSDD)",
    steps: [
      { step: 1, title: "Receive Offer Letter", description: "Unconditional offer from Irish institution", timeframe: "After admission", critical: true },
      { step: 2, title: "Pay Tuition Deposit", description: "Pay first year tuition deposit to confirm enrollment", timeframe: "Before visa application", critical: true },
      { step: 3, title: "Arrange Private Health Insurance", description: "Get Irish-based health insurance cover", timeframe: "Before application", critical: true },
      { step: 4, title: "Apply Online via AVATS", description: "Submit visa application at inis.gov.ie", timeframe: "2 months before start", critical: true },
      { step: 5, title: "Submit Biometrics at VFS", description: "Visit VFS Global India centre with all documents", timeframe: "Within 2 weeks of online application", critical: true },
      { step: 6, title: "Collect Visa", description: "Passport returned with visa sticker", timeframe: "3-4 weeks after biometrics", critical: false },
    ],
    requiredDocuments: [
      "Valid passport",
      "Offer letter from Irish institution",
      "Tuition payment receipt",
      "Private health insurance",
      "Bank statements (6 months, sufficient funds)",
      "English language scores",
      "Academic transcripts",
      "Passport photographs",
    ],
    tips: [
      "Ireland has one of the fastest and most student-friendly visa processes",
      "English-speaking country with growing tech sector — high job placement",
      "SPSDD allows you to work full-time for 2 years after graduation",
      "Dublin is a hub for Google, Meta, LinkedIn, and many top tech companies",
      "Apply for PPS number immediately upon arrival for banking and employment",
    ],
  },
  Singapore: {
    country: "Singapore",
    visaType: "Student's Pass (STP)",
    processingTime: "4-8 weeks",
    fee: "SGD 30 (application) + SGD 60 (issuance)",
    successRate: 92,
    postStudyWork: "Long-Term Visit Pass or Employment Pass (competitive)",
    steps: [
      { step: 1, title: "Receive Offer from ICA-registered school", description: "Admission from NUS, NTU, SMU, or SIM", timeframe: "After admission", critical: true },
      { step: 2, title: "Submit SOLAR Application", description: "University submits Student's Pass application on your behalf via SOLAR system", timeframe: "University handles timing", critical: true },
      { step: 3, title: "Receive In-Principle Approval (IPA)", description: "ICA sends IPA letter — valid for 60 days", timeframe: "4-8 weeks", critical: true },
      { step: 4, title: "Travel to Singapore", description: "Arrive before IPA expiry; present IPA at immigration", timeframe: "Before IPA expiry", critical: true },
      { step: 5, title: "Collect Student's Pass", description: "Visit ICA building to collect STP after arrival", timeframe: "Within 2 weeks of arrival", critical: true },
    ],
    requiredDocuments: [
      "Valid passport",
      "IPA letter",
      "Offer/admission letter",
      "Academic transcripts",
      "Photographs",
      "Medical examination results (if requested)",
    ],
    tips: [
      "Singapore universities handle most of the Student Pass application process",
      "NUS and NTU are among the top 15 universities globally",
      "Cost of living is high — budget SGD 1,500-2,500/month",
      "Strong scholarships available from MOE (Ministry of Education)",
      "Excellent gateway to Southeast Asian job market",
    ],
  },
};

router.post("/visa/guide", async (req, res): Promise<void> => {
  const parsed = GetVisaGuideBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { country } = parsed.data;
  const validCountries: CountryKey[] = ["UK", "USA", "Canada", "Australia", "Germany", "Ireland", "Singapore"];
  const key = validCountries.includes(country as CountryKey) ? (country as CountryKey) : "UK";
  const guide = VISA_GUIDES[key];

  res.json(GetVisaGuideResponse.parse(guide));
});

export default router;
