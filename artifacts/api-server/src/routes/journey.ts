import { Router, type IRouter } from "express";
import {
  GenerateTimelineBody,
  GenerateTimelineResponse,
  GetDocumentChecklistBody,
  GetDocumentChecklistResponse,
  GetSopGuideBody,
  GetSopGuideResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const COUNTRY_INTAKES: Record<string, { intakes: string[]; avgApplyWeeks: number }> = {
  UK: { intakes: ["September", "January"], avgApplyWeeks: 26 },
  USA: { intakes: ["September", "January"], avgApplyWeeks: 30 },
  Canada: { intakes: ["September", "January", "May"], avgApplyWeeks: 28 },
  Australia: { intakes: ["February", "July"], avgApplyWeeks: 24 },
  Germany: { intakes: ["April", "October"], avgApplyWeeks: 32 },
  Ireland: { intakes: ["September", "January"], avgApplyWeeks: 22 },
  Singapore: { intakes: ["August", "January"], avgApplyWeeks: 24 },
};

router.post("/journey/timeline", async (req, res): Promise<void> => {
  const parsed = GenerateTimelineBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { targetCountry, targetIntake, hasIelts, hasGre, cgpa } = parsed.data;
  const totalWeeks = COUNTRY_INTAKES[targetCountry]?.avgApplyWeeks ?? 26;

  const phases = [
    {
      phase: "P1",
      title: "Preparation & Tests",
      startWeek: 0,
      endWeek: Math.round(totalWeeks * 0.25),
      tasks: [
        !hasIelts ? "Book and prepare for IELTS/TOEFL" : "IELTS complete — verify scores",
        !hasGre ? "Register and prepare for GRE" : "GRE complete — verify scores",
        "Finalize target universities list",
        "Research program requirements",
      ].filter(Boolean),
      color: "#00d4ff",
      status: hasIelts && hasGre ? "completed" : "in_progress",
    },
    {
      phase: "P2",
      title: "Research & Shortlisting",
      startWeek: Math.round(totalWeeks * 0.25),
      endWeek: Math.round(totalWeeks * 0.45),
      tasks: [
        "Research 10-12 universities",
        "Check admission cutoffs (CGPA " + (cgpa ?? 7.5) + " vs requirements)",
        "Categorize into ambitious / target / safe",
        "Connect with alumni on LinkedIn",
        "Attend virtual university fairs",
      ],
      color: "#7c3aed",
      status: "pending",
    },
    {
      phase: "P3",
      title: "Document Preparation",
      startWeek: Math.round(totalWeeks * 0.45),
      endWeek: Math.round(totalWeeks * 0.65),
      tasks: [
        "Write Statement of Purpose (SOP)",
        "Request 2-3 Letters of Recommendation",
        "Prepare academic transcripts (attested)",
        "Update resume / CV",
        "Gather financial documents",
      ],
      color: "#f59e0b",
      status: "pending",
    },
    {
      phase: "P4",
      title: "Applications",
      startWeek: Math.round(totalWeeks * 0.65),
      endWeek: Math.round(totalWeeks * 0.82),
      tasks: [
        "Submit applications to all universities",
        "Pay application fees",
        "Track application portals",
        "Apply for scholarships simultaneously",
      ],
      color: "#10b981",
      status: "pending",
    },
    {
      phase: "P5",
      title: "Offers & Visa",
      startWeek: Math.round(totalWeeks * 0.82),
      endWeek: totalWeeks,
      tasks: [
        "Evaluate offer letters received",
        "Apply for education loan",
        "Apply for student visa",
        "Book accommodation",
        "Book travel tickets",
      ],
      color: "#ef4444",
      status: "pending",
    },
  ];

  const urgencyScore = totalWeeks < 20 ? "high" : totalWeeks < 28 ? "medium" : "low";

  res.json(
    GenerateTimelineResponse.parse({
      phases,
      totalWeeks,
      intakeDate: targetIntake + " intake",
      urgencyLevel: urgencyScore,
      summary: `Your ${targetCountry} ${targetIntake} intake journey spans ${totalWeeks} weeks. ${urgencyScore === "high" ? "Start immediately — timeline is tight." : urgencyScore === "medium" ? "Good pace — stay consistent." : "You have ample time — plan carefully."}`,
    })
  );
});

const DOCUMENT_CHECKLIST: Record<string, Record<string, { name: string; description: string; isCritical: boolean; tip?: string }[]>> = {
  academic: {
    default: [
      { name: "Bachelor's Degree Certificate", description: "Original + 2 attested copies", isCritical: true, tip: "Get attestation from HRD Ministry" },
      { name: "Official Transcripts", description: "Semester-wise marks sheets", isCritical: true, tip: "Request from university registrar" },
      { name: "12th Grade Marksheet", description: "Class 12 board certificate", isCritical: true },
      { name: "10th Grade Marksheet", description: "Class 10 board certificate", isCritical: false },
    ],
  },
  language: {
    default: [
      { name: "IELTS / TOEFL Scorecard", description: "Official score report (min 2 years validity)", isCritical: true, tip: "Request from test centre online" },
      { name: "GRE / GMAT Scorecard", description: "If required by program", isCritical: false },
    ],
  },
  personal: {
    default: [
      { name: "Valid Passport", description: "Min 18 months validity from intake date", isCritical: true, tip: "Renew at least 6 months before applying" },
      { name: "Statement of Purpose (SOP)", description: "Program-specific essay", isCritical: true },
      { name: "Letters of Recommendation (3)", description: "Academic and professional references", isCritical: true },
      { name: "Resume / CV", description: "Updated academic + professional experience", isCritical: true },
    ],
  },
  financial: {
    default: [
      { name: "Bank Statement (6 months)", description: "Family account showing sufficient funds", isCritical: true, tip: "Maintain INR 40L+ average balance" },
      { name: "Income Tax Returns (2 years)", description: "Father/guardian ITR", isCritical: true },
      { name: "Property Documents", description: "For loan collateral", isCritical: false },
      { name: "Sponsorship Letter", description: "Signed by co-applicant", isCritical: false },
    ],
  },
  visa: {
    UK: [{ name: "CAS (Confirmation of Acceptance for Studies)", description: "From university after unconditional offer", isCritical: true }],
    USA: [{ name: "DS-160 Form", description: "US visa application form", isCritical: true }, { name: "I-20 from University", description: "Student status document", isCritical: true }],
    Canada: [{ name: "Letter of Acceptance", description: "From DLI (Designated Learning Institution)", isCritical: true }],
    Australia: [{ name: "CoE (Confirmation of Enrolment)", description: "From university", isCritical: true }, { name: "Overseas Student Health Cover (OSHC)", description: "Mandatory health insurance", isCritical: true }],
    Germany: [{ name: "APS Certificate", description: "Academic evaluation for India students", isCritical: true }, { name: "Blocked Account Proof (Sperrkonto)", description: "EUR 11,904 annually", isCritical: true }],
    default: [{ name: "Student Visa Application", description: "Country-specific form", isCritical: true }],
  },
};

router.post("/journey/checklist", async (req, res): Promise<void> => {
  const parsed = GetDocumentChecklistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { targetCountry, hasLoanRequirement } = parsed.data;

  const visaDocs = DOCUMENT_CHECKLIST.visa[targetCountry] ?? DOCUMENT_CHECKLIST.visa.default;

  const categories = [
    {
      category: "Academic Documents",
      icon: "GraduationCap",
      items: DOCUMENT_CHECKLIST.academic.default.map((d, i) => ({ id: `acad_${i}`, ...d })),
    },
    {
      category: "Language & Test Scores",
      icon: "FileText",
      items: DOCUMENT_CHECKLIST.language.default.map((d, i) => ({ id: `lang_${i}`, ...d })),
    },
    {
      category: "Personal Documents",
      icon: "User",
      items: DOCUMENT_CHECKLIST.personal.default.map((d, i) => ({ id: `pers_${i}`, ...d })),
    },
    {
      category: "Financial Documents",
      icon: "CreditCard",
      items: DOCUMENT_CHECKLIST.financial.default
        .filter((d) => hasLoanRequirement || !d.name.includes("collateral"))
        .map((d, i) => ({ id: `fin_${i}`, ...d })),
    },
    {
      category: `${targetCountry} Visa Documents`,
      icon: "Globe",
      items: visaDocs.map((d, i) => ({ id: `visa_${i}`, ...d })),
    },
  ];

  const allItems = categories.flatMap((c) => c.items);
  const criticalCount = allItems.filter((i) => i.isCritical).length;

  res.json(GetDocumentChecklistResponse.parse({ categories, totalDocuments: allItems.length, criticalCount }));
});

router.post("/journey/sop-guide", async (req, res): Promise<void> => {
  const parsed = GetSopGuideBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { targetCourse, targetUniversity, cgpa } = parsed.data;

  const structure = [
    {
      section: "S1",
      title: "Opening Hook",
      wordCount: 100,
      guidance: "Start with a compelling moment, problem, or realization that sparked your interest in this field.",
      keyPoints: [
        "Avoid cliches like 'Since childhood I was fascinated by...'",
        "Start with a specific incident or insight",
        "Immediately communicate your passion and clarity",
      ],
    },
    {
      section: "S2",
      title: "Academic Background",
      wordCount: 200,
      guidance: `Describe your academic journey — highlight CGPA ${cgpa ?? ""}  strengths, relevant coursework, projects, and awards.`,
      keyPoints: [
        "Mention top 3-4 relevant courses by name",
        "Highlight your best academic project with outcome",
        "Connect academics to your target course",
      ],
    },
    {
      section: "S3",
      title: "Professional Experience",
      wordCount: 200,
      guidance: "Describe internships, research, or work experience relevant to your target program.",
      keyPoints: [
        "Use STAR format: Situation, Task, Action, Result",
        "Quantify achievements where possible",
        "Connect each experience to skills needed for " + targetCourse,
      ],
    },
    {
      section: "S4",
      title: "Why This Course & University",
      wordCount: 200,
      guidance: `Explain specifically why ${targetCourse} at ${targetUniversity ?? "this university"} — mention faculty, curriculum, labs, rankings.`,
      keyPoints: [
        "Research specific professors or research groups",
        "Mention unique program features not available elsewhere",
        "Show you have done your homework",
      ],
    },
    {
      section: "S5",
      title: "Career Goals",
      wordCount: 150,
      guidance: "Paint a clear picture of your short-term (3-5 year) and long-term (10-year) career vision.",
      keyPoints: [
        "Be specific — name roles, industries, companies",
        "Show how this degree bridges current skills to goals",
        "Mention impact you want to create",
      ],
    },
    {
      section: "S6",
      title: "Closing",
      wordCount: 100,
      guidance: "End confidently — summarize why you are the right fit and express commitment to contributing to the program.",
      keyPoints: [
        "Circle back to your opening theme",
        "Express enthusiasm without desperation",
        "Leave a memorable last sentence",
      ],
    },
  ];

  res.json(
    GetSopGuideResponse.parse({
      structure,
      tips: [
        "Write multiple drafts — at least 4-5 revisions",
        "Have a professor or mentor review your SOP",
        "Tailor each SOP to specific university — avoid generic versions",
        "Use active voice and strong verbs",
        "Avoid jargon unless specific to your field",
      ],
      commonMistakes: [
        "Starting with clichéd phrases about childhood dreams",
        "Listing achievements without connecting them to the program",
        "Using the wrong university name (copy-paste errors)",
        "Exceeding the word limit by more than 10%",
        "Weak or vague career goals",
      ],
      wordCountTarget: 950,
      sampleOpener: `During my third-year internship at a fintech startup, I encountered a dataset of 50,000 loan applications — and realized that the difference between approval and rejection often had nothing to do with the applicant's actual creditworthiness. That moment redirected my academic focus entirely.`,
    })
  );
});

export default router;
