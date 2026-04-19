import { Router, type IRouter } from "express";
import { db, assessmentsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import {
  GetDashboardSummaryResponse,
  GetRecentAssessmentsResponse,
  GetCountryDistributionResponse,
  GetRiskBreakdownResponse,
  GetDashboardNudgesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (req, res): Promise<void> => {
  const assessments = await db.select().from(assessmentsTable);

  const totalAssessments = assessments.length;
  const avgPlacementScore = totalAssessments > 0
    ? Math.round(assessments.reduce((acc, a) => acc + a.placementScore, 0) / totalAssessments * 10) / 10
    : 0;
  const avgLoanReadiness = totalAssessments > 0
    ? Math.round(assessments.reduce((acc, a) => acc + a.loanReadiness, 0) / totalAssessments * 10) / 10
    : 0;

  const countryCounts: Record<string, number> = {};
  for (const a of assessments) {
    if (a.targetCountry) {
      countryCounts[a.targetCountry] = (countryCounts[a.targetCountry] ?? 0) + 1;
    }
  }
  const topDestination = Object.entries(countryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "UK";

  const low = assessments.filter((a) => a.riskLevel === "Low").length;
  const medium = assessments.filter((a) => a.riskLevel === "Medium").length;
  const high = assessments.filter((a) => a.riskLevel === "High").length;
  const total = Math.max(totalAssessments, 1);

  const result = {
    totalAssessments,
    avgPlacementScore,
    avgLoanReadiness,
    topDestination,
    lowRiskPercent: Math.round((low / total) * 100),
    mediumRiskPercent: Math.round((medium / total) * 100),
    highRiskPercent: Math.round((high / total) * 100),
    totalLoanVolumeCr: Math.round(totalAssessments * 18.5 * 10) / 10,
  };

  res.json(GetDashboardSummaryResponse.parse(result));
});

router.get("/dashboard/recent-assessments", async (req, res): Promise<void> => {
  const assessments = await db
    .select()
    .from(assessmentsTable)
    .orderBy(desc(assessmentsTable.createdAt))
    .limit(10);

  const mapped = assessments.map((a) => ({
    id: a.id,
    studentName: a.studentName,
    degree: a.degree,
    targetCountry: a.targetCountry,
    placementScore: a.placementScore,
    riskLevel: a.riskLevel,
    loanReadiness: a.loanReadiness,
    createdAt: a.createdAt?.toISOString() ?? new Date().toISOString(),
  }));

  res.json(GetRecentAssessmentsResponse.parse(mapped));
});

router.get("/dashboard/country-distribution", async (req, res): Promise<void> => {
  const assessments = await db.select().from(assessmentsTable);
  const countryCounts: Record<string, number> = {};

  for (const a of assessments) {
    const country = a.targetCountry ?? "Other";
    countryCounts[country] = (countryCounts[country] ?? 0) + 1;
  }

  const total = Math.max(Object.values(countryCounts).reduce((s, c) => s + c, 0), 1);
  const result = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([country, count]) => ({
      country,
      count,
      percentage: Math.round((count / total) * 100 * 10) / 10,
    }));

  res.json(GetCountryDistributionResponse.parse(result));
});

router.get("/dashboard/risk-breakdown", async (req, res): Promise<void> => {
  const assessments = await db.select().from(assessmentsTable);
  const riskCounts: Record<string, number> = { Low: 0, Medium: 0, High: 0 };

  for (const a of assessments) {
    if (riskCounts[a.riskLevel] !== undefined) {
      riskCounts[a.riskLevel]++;
    }
  }

  const total = Math.max(assessments.length, 1);
  const result = Object.entries(riskCounts).map(([level, count]) => ({
    level,
    count,
    percentage: Math.round((count / total) * 100 * 10) / 10,
  }));

  res.json(GetRiskBreakdownResponse.parse(result));
});

router.get("/dashboard/nudges", async (_req, res): Promise<void> => {
  const nudges = [
    {
      id: "n1",
      type: "action",
      title: "Complete Your Loan Assessment",
      message: "You haven't run the Loan Readiness engine yet. Know your eligibility before applying.",
      priority: "high",
      action: "/loan",
      actionLabel: "Check Eligibility",
    },
    {
      id: "n2",
      type: "reminder",
      title: "UK September Deadline Approaching",
      message: "Top UK universities close applications in January. Start your SOP now.",
      priority: "high",
      action: "/journey",
      actionLabel: "Plan Timeline",
    },
    {
      id: "n3",
      type: "opportunity",
      title: "3 Scholarships Match Your Profile",
      message: "You qualify for Chevening, DAAD, and Inlaks scholarships. Apply before deadlines.",
      priority: "medium",
      action: "/scholarships",
      actionLabel: "View Scholarships",
    },
    {
      id: "n4",
      type: "tip",
      title: "Improve Your Placement Score",
      message: "Adding 2 more technical skills to your profile can boost your placement score by 8 points.",
      priority: "low",
      action: "/career",
      actionLabel: "Update Profile",
    },
    {
      id: "n5",
      type: "achievement",
      title: "Earn the Journey Planner Badge",
      message: "Generate your application timeline to unlock the Journey Planner achievement badge.",
      priority: "low",
      action: "/gamification",
      actionLabel: "View Achievements",
    },
  ];

  res.json(GetDashboardNudgesResponse.parse(nudges));
});

export default router;
