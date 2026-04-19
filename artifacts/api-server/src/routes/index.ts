import { Router, type IRouter } from "express";
import healthRouter from "./health";
import profileRouter from "./profile";
import careerRouter from "./career";
import roiRouter from "./roi";
import loanRouter from "./loan";
import dashboardRouter from "./dashboard";
import journeyRouter from "./journey";
import copilotRouter from "./copilot";
import gamificationRouter from "./gamification";
import scholarshipRouter from "./scholarship";
import visaRouter from "./visa";

const router: IRouter = Router();

router.use(healthRouter);
router.use(profileRouter);
router.use(careerRouter);
router.use(roiRouter);
router.use(loanRouter);
router.use(dashboardRouter);
router.use(journeyRouter);
router.use(copilotRouter);
router.use(gamificationRouter);
router.use(scholarshipRouter);
router.use(visaRouter);

export default router;
