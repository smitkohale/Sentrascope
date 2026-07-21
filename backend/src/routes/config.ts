import { Router, type IRouter } from "express";
import { GetConfigStatusResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/config/status", (_req, res) => {
  const data = GetConfigStatusResponse.parse({
    waqi: !!process.env.WAQI_API_TOKEN,
    nasaFirms: !!process.env.NASA_FIRMS_MAP_KEY,
    openUv: !!process.env.OPENUV_API_KEY,
    indiaOgd: !!process.env.INDIA_OGD_API_KEY,
  });
  res.json(data);
});

export default router;
