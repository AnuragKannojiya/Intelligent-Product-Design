import { Router, type IRouter } from "express";
import { getLoanEligibility } from "../lib/ai-engine";
import {
  GetLoanEligibilityBody,
  GetLoanEligibilityResponse,
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

export default router;
