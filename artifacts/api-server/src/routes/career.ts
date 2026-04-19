import { Router, type IRouter } from "express";
import { getCareerRecommendations } from "../lib/ai-engine";
import {
  GetCareerRecommendationsBody,
  GetCareerRecommendationsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/career/recommend", async (req, res): Promise<void> => {
  const parsed = GetCareerRecommendationsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const result = getCareerRecommendations(parsed.data);
  res.json(GetCareerRecommendationsResponse.parse(result));
});

export default router;
