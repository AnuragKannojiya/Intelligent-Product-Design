import { Router, type IRouter } from "express";
import {
  GetGamificationProfileResponse,
  GetLeaderboardResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const ALL_BADGES = [
  { id: "profile_complete", name: "Profile Pioneer", description: "Complete your student profile", icon: "User", rarity: "Common", isEarned: true, earnedAt: "2025-03-01" },
  { id: "first_assessment", name: "First Assessment", description: "Run your first AI assessment", icon: "Brain", rarity: "Common", isEarned: true, earnedAt: "2025-03-02" },
  { id: "career_navigator", name: "Career Navigator", description: "Complete Career Navigator analysis", icon: "Compass", rarity: "Common", isEarned: true, earnedAt: "2025-03-05" },
  { id: "roi_analyst", name: "ROI Analyst", description: "Run Outcome Intelligence engine", icon: "TrendingUp", rarity: "Rare", isEarned: true, earnedAt: "2025-03-08" },
  { id: "loan_ready", name: "Loan Ready", description: "Score 70+ on Loan Readiness", icon: "CreditCard", rarity: "Rare", isEarned: false },
  { id: "journey_planner", name: "Journey Planner", description: "Generate your application timeline", icon: "Map", rarity: "Rare", isEarned: false },
  { id: "scholar_hunter", name: "Scholar Hunter", description: "Find 5+ scholarship matches", icon: "Award", rarity: "Epic", isEarned: false },
  { id: "visa_ready", name: "Visa Ready", description: "Complete visa guidance for target country", icon: "Globe", rarity: "Epic", isEarned: false },
  { id: "sop_writer", name: "SOP Craftsman", description: "Use the SOP Guide module", icon: "FileText", rarity: "Rare", isEarned: false },
  { id: "streak_7", name: "Consistent Achiever", description: "Maintain 7-day login streak", icon: "Flame", rarity: "Epic", isEarned: false },
  { id: "streak_30", name: "Dedication Master", description: "Maintain 30-day streak", icon: "Zap", rarity: "Legendary", isEarned: false },
  { id: "all_modules", name: "Platform Master", description: "Complete all 10 modules", icon: "Trophy", rarity: "Legendary", isEarned: false },
  { id: "top_10", name: "Elite Performer", description: "Reach top 10 on leaderboard", icon: "Star", rarity: "Legendary", isEarned: false },
];

router.get("/gamification/profile", async (_req, res): Promise<void> => {
  const earnedCount = ALL_BADGES.filter((b) => b.isEarned).length;
  const completedModules = ["Profile", "Career Navigator", "ROI Engine"];

  res.json(
    GetGamificationProfileResponse.parse({
      level: 4,
      levelTitle: "Career Explorer",
      xp: 1240,
      xpToNextLevel: 1500,
      streakDays: 3,
      badges: ALL_BADGES,
      completedModules,
      progressPercent: Math.round((earnedCount / ALL_BADGES.length) * 100),
      rank: 47,
    })
  );
});

router.get("/gamification/leaderboard", async (_req, res): Promise<void> => {
  const leaderboard = [
    { rank: 1, name: "Arjun Mehta", xp: 4850, level: 9, badges: 11, targetCountry: "UK" },
    { rank: 2, name: "Priya Sharma", xp: 4620, level: 8, badges: 10, targetCountry: "Canada" },
    { rank: 3, name: "Rohit Kumar", xp: 4390, level: 8, badges: 9, targetCountry: "USA" },
    { rank: 4, name: "Sneha Patel", xp: 4110, level: 7, badges: 9, targetCountry: "Germany" },
    { rank: 5, name: "Vikram Singh", xp: 3980, level: 7, badges: 8, targetCountry: "Australia" },
    { rank: 6, name: "Ananya Reddy", xp: 3760, level: 7, badges: 8, targetCountry: "UK" },
    { rank: 7, name: "Karan Joshi", xp: 3540, level: 6, badges: 7, targetCountry: "Canada" },
    { rank: 8, name: "Divya Nair", xp: 3280, level: 6, badges: 7, targetCountry: "Ireland" },
    { rank: 9, name: "Amit Bansal", xp: 3150, level: 6, badges: 6, targetCountry: "Singapore" },
    { rank: 10, name: "Pooja Iyer", xp: 2940, level: 5, badges: 6, targetCountry: "USA" },
  ];

  res.json(GetLeaderboardResponse.parse(leaderboard));
});

export default router;
