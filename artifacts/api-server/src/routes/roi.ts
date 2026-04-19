import { Router, type IRouter } from "express";
import { getRoiPrediction } from "../lib/ai-engine";
import {
  GetRoiPredictionBody,
  GetRoiPredictionResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/roi/predict", async (req, res): Promise<void> => {
  const parsed = GetRoiPredictionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const result = getRoiPrediction(parsed.data);
  res.json(GetRoiPredictionResponse.parse(result));
});

export default router;
