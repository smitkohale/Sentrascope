import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import configRouter from "./config";
import airQualityRouter from "./air-quality";
import thermalRouter from "./thermal";
import uvRouter from "./uv";
import indiaOgdRouter from "./india-ogd";
import alertsRouter from "./alerts";
import reportRouter from "./report";
import urbanizationRouter from "./urbanization";
import logsRouter from "./logs";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(configRouter);
router.use(airQualityRouter);
router.use(thermalRouter);
router.use(uvRouter);
router.use(indiaOgdRouter);
router.use(alertsRouter);
router.use(reportRouter);
router.use(urbanizationRouter);
router.use(logsRouter);

export default router;
