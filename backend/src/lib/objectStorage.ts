import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Readable } from "stream";

const UPLOADS_DIR = process.env.LOCAL_UPLOADS_DIR || path.join(process.cwd(), "uploads");

function ensureUploadsDir(): void {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export interface LocalFile {
  id: string;
  filePath: string;
  contentType: string;
  size: number;
  isPublic: boolean;
}

export class ObjectStorageService {
  async getObjectEntityUploadURL(): Promise<string> {
    ensureUploadsDir();
    const objectId = randomUUID();
    return `/api/storage/uploads/${objectId}`;
  }

  normalizeObjectEntityPath(rawPath: string): string {
    if (rawPath.startsWith("/api/storage/uploads/")) {
      return `/objects/${rawPath.replace("/api/storage/uploads/", "")}`;
    }
    return rawPath;
  }

  async getObjectEntityFile(objectPath: string): Promise<LocalFile> {
    if (!objectPath.startsWith("/objects/")) throw new ObjectNotFoundError();
    const id = objectPath.replace("/objects/", "");
    const filePath = path.join(UPLOADS_DIR, id);
    if (!fs.existsSync(filePath)) throw new ObjectNotFoundError();
    const stat = fs.statSync(filePath);
    return { id, filePath, contentType: "application/octet-stream", size: stat.size, isPublic: false };
  }

  async searchPublicObject(filePath: string): Promise<LocalFile | null> {
    const fullPath = path.join(UPLOADS_DIR, "public", filePath);
    if (!fs.existsSync(fullPath)) return null;
    const stat = fs.statSync(fullPath);
    return { id: filePath, filePath: fullPath, contentType: "application/octet-stream", size: stat.size, isPublic: true };
  }

  async downloadObject(file: LocalFile, _cacheTtlSec: number = 3600): Promise<Response> {
    const buffer = fs.readFileSync(file.filePath);
    return new Response(buffer, {
      headers: {
        "Content-Type": file.contentType,
        "Cache-Control": `${file.isPublic ? "public" : "private"}, max-age=${_cacheTtlSec}`,
        "Content-Length": String(file.size),
      },
    });
  }

  async canAccessObjectEntity({ objectFile }: { userId?: string; objectFile: LocalFile; requestedPermission?: string }): Promise<boolean> {
    return objectFile.isPublic;
  }

  async trySetObjectEntityAclPolicy(rawPath: string, _aclPolicy: unknown): Promise<string> {
    return this.normalizeObjectEntityPath(rawPath);
  }
}
