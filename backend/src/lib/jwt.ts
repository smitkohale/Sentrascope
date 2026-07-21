import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sentrascope-dev-secret-change-in-prod";
const JWT_EXPIRES = "7d";

export interface JwtPayload {
  userId: number;
  email: string;
  name: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
