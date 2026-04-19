import { Router, type IRouter } from "express";
import healthRouter from "./health";
import profileRouter from "./profile";
import careerRouter from "./career";
import roiRouter from "./roi";
import loanRouter from "./loan";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(profileRouter);
router.use(careerRouter);
router.use(roiRouter);
router.use(loanRouter);
router.use(dashboardRouter);

export default router;
