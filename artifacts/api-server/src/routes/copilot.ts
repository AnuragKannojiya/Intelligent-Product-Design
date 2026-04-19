import { Router, type IRouter } from "express";
import {
  SendCopilotMessageBody,
  SendCopilotMessageResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

type Intent =
  | "career"
  | "roi"
  | "loan"
  | "journey"
  | "scholarship"
  | "visa"
  | "gamification"
  | "greeting"
  | "general";

function detectIntent(message: string): Intent {
  const lower = message.toLowerCase();
  if (/career|country|university|course|field|which country|best option/i.test(lower)) return "career";
  if (/salary|placement|roi|return|income|job|risk|outcome/i.test(lower)) return "roi";
  if (/loan|emi|eligib|borrow|finance|afford|repay|interest|lender/i.test(lower)) return "loan";
  if (/timeline|document|checklist|sop|statement of purpose|deadline|when to apply/i.test(lower)) return "journey";
  if (/scholarship|grant|fund|free|merit|need-based/i.test(lower)) return "scholarship";
  if (/visa|immigration|permit|stay|work after|pr|permanent/i.test(lower)) return "visa";
  if (/badge|level|xp|points|streak|achievement|leaderboard/i.test(lower)) return "gamification";
  if (/hi|hello|hey|start|help|what can you/i.test(lower)) return "greeting";
  return "general";
}

const INTENT_RESPONSES: Record<Intent, { reply: (ctx?: string) => string; suggestions: string[]; relatedModule: string }> = {
  greeting: {
    reply: () =>
      "Hello! I am GradPath AI Copilot — your intelligent guide for education financing. I can help you with career recommendations, ROI predictions, loan eligibility, application timelines, scholarships, visa guidance, and more. What would you like to explore?",
    suggestions: [
      "Which country is best for me?",
      "What is my loan eligibility?",
      "How do I improve my placement score?",
      "What scholarships can I get?",
    ],
    relatedModule: "dashboard",
  },
  career: {
    reply: (ctx) =>
      `Based on your profile, our Career Navigator engine analyzes 14 parameters including CGPA, internship count, skills, and target field to recommend the best-fit countries and universities. ${ctx ? `Your profile context: ${ctx}. ` : ""}Popular destinations for engineering graduates are Canada, Germany, and the UK — each with different job market strength and cost profiles. Run the Career Navigator for a full AI-powered recommendation.`,
    suggestions: [
      "What CGPA do I need for top universities?",
      "Compare UK vs Canada for CS",
      "How do I improve my admit chances?",
    ],
    relatedModule: "career",
  },
  roi: {
    reply: () =>
      "Our Outcome Intelligence engine predicts placement probability at 3, 6, and 12 months post-graduation based on historical data from 50,000+ students. It calculates your expected salary band, ROI strength, and payback period. A placement score above 75 indicates strong employability. Run the ROI Engine with your target course and country for precise predictions.",
    suggestions: [
      "What is a good placement score?",
      "How is salary prediction calculated?",
      "What factors affect ROI?",
    ],
    relatedModule: "roi",
  },
  loan: {
    reply: () =>
      "Loan eligibility depends on your expected salary, total program cost, co-applicant availability, and risk level. Most NBFCs offer 75-90% of program cost. A loan readiness score above 70 means you qualify comfortably. EMI should ideally be less than 40% of expected first-year salary. Use the Loan Readiness Engine for personalized scenarios.",
    suggestions: [
      "Do I need a co-applicant?",
      "What is a good EMI to salary ratio?",
      "Which banks offer education loans?",
    ],
    relatedModule: "loan",
  },
  journey: {
    reply: () =>
      "Application timelines vary by country. UK September intake typically requires starting 6-8 months in advance. Key milestones: IELTS preparation (2-3 months), university research (1 month), SOP writing (3-4 weeks), applications (2-4 weeks), offer letter to visa (6-8 weeks). Use the Journey Copilot to generate your personalized week-by-week timeline.",
    suggestions: [
      "What documents do I need for UK visa?",
      "How do I write a strong SOP?",
      "When should I apply for September intake?",
    ],
    relatedModule: "journey",
  },
  scholarship: {
    reply: () =>
      "Multiple scholarships are available for Indian students studying abroad — ranging from government-backed (like DAAD for Germany) to university merit scholarships and private foundations. A CGPA above 8.0 significantly increases merit scholarship chances. Some scholarships cover full tuition. Use the Scholarship Matcher to find matching opportunities based on your profile.",
    suggestions: [
      "What scholarships are available for Canada?",
      "How to improve scholarship match score?",
      "Are there scholarships for low-income students?",
    ],
    relatedModule: "scholarships",
  },
  visa: {
    reply: () =>
      "Student visa success rates are generally high (85-95%) for well-prepared applicants. Key requirements: confirmed university admission, proof of funds, clean academic record, strong ties to home country. Processing times range from 3 weeks (Ireland) to 10 weeks (Germany APS). Use the Visa Guide module for step-by-step guidance specific to your target country.",
    suggestions: [
      "What are the visa rejection reasons?",
      "How much bank balance do I need for UK visa?",
      "Can I work during studies?",
    ],
    relatedModule: "visa",
  },
  gamification: {
    reply: () =>
      "Your gamification profile tracks progress across all GradPath AI modules. Complete assessments to earn XP, unlock badges, and climb the leaderboard. Levels range from Explorer to Elite — each level unlocks new insights. A 7-day streak earns bonus XP. Check your Achievements page to see which badges you are close to unlocking.",
    suggestions: [
      "How do I earn more XP?",
      "What badges can I unlock?",
      "How is my rank calculated?",
    ],
    relatedModule: "gamification",
  },
  general: {
    reply: (msg) =>
      `I understand you're asking about "${msg}". GradPath AI specializes in education financing intelligence — I can help with career recommendations, ROI predictions, loan eligibility, application timelines, scholarships, and visa guidance. Could you be more specific about which aspect you'd like to explore?`,
    suggestions: [
      "Tell me about career options",
      "Check my loan eligibility",
      "Find scholarships for me",
      "Guide me through visa process",
    ],
    relatedModule: "dashboard",
  },
};

router.post("/copilot/chat", async (req, res): Promise<void> => {
  const parsed = SendCopilotMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { message, context } = parsed.data;
  const intent = detectIntent(message);
  const handler = INTENT_RESPONSES[intent];

  const reply = handler.reply(context ?? message);

  res.json(
    SendCopilotMessageResponse.parse({
      reply,
      suggestions: handler.suggestions,
      relatedModule: handler.relatedModule,
    })
  );
});

export default router;
