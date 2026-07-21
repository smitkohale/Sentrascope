import { Router, type IRouter, type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";
import { z } from "zod";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

const UPLOADS_DIR = process.env.LOCAL_UPLOADS_DIR || path.join(process.cwd(), "uploads");

const RequestUploadUrlBody = z.object({
  name: z.string().min(1).max(255),
  size: z.number().int().positive(),
  contentType: z.string().min(1),
});

router.post("/storage/uploads/request-url", async (req: Request, res: Response) => {
  const parsed = RequestUploadUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing or invalid required fields" });
    return;
  }
  try {
    const { name, size, contentType } = parsed.data;
    const objectId = randomUUID();
    const uploadPath = `/api/storage/uploads/${objectId}`;
    const objectPath = `/objects/${objectId}`;
    res.json({ uploadURL: uploadPath, objectPath, metadata: { name, size, contentType } });
  } catch (error) {
    req.log.error({ err: error }, "Error generating upload URL");
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

router.put("/storage/uploads/:objectId", async (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    const objectId = req.params.objectId;
    if (!objectId || typeof objectId !== "string" || objectId.includes("..")) { res.status(400).json({ error: "Invalid object ID" }); return; }
    const filePath = path.join(UPLOADS_DIR, objectId);
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      fs.writeFileSync(filePath, Buffer.concat(chunks));
      res.status(200).json({ objectPath: `/objects/${objectId}` });
    });
  } catch (error) {
    req.log.error({ err: error }, "Error uploading file");
    res.status(500).json({ error: "Upload failed" });
  }
});

router.get("/storage/public-objects/*filePath", async (req: Request, res: Response) => {
  try {
    const raw = req.params.filePath;
    const filePath = Array.isArray(raw) ? raw.join("/") : raw;
    const file = await objectStorageService.searchPublicObject(filePath);
    if (!file) { res.status(404).json({ error: "File not found" }); return; }
    res.setHeader("Content-Type", file.contentType);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.sendFile(file.filePath);
  } catch (error) {
    req.log.error({ err: error }, "Error serving public object");
    res.status(500).json({ error: "Failed to serve public object" });
  }
});

router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const objectPath = `/objects/${wildcardPath}`;
    const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
    res.setHeader("Content-Type", objectFile.contentType);
    res.setHeader("Cache-Control", "private, max-age=3600");
    res.sendFile(objectFile.filePath);
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "Object not found" });
      return;
    }
    req.log.error({ err: error }, "Error serving object");
    res.status(500).json({ error: "Failed to serve object" });
  }
});

export default router;
