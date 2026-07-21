import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signToken } from "../lib/jwt.js";
import { sendVerificationEmail, sendPasswordResetEmail, getAppUrl } from "../lib/email.js";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

router.post("/signup", async (req, res) => {
  const { email, name, password } = req.body as { email?: string; name?: string; password?: string };

  if (!email || !name || !password) {
    res.status(400).json({ error: "bad_request", message: "Name, email, and password are required." });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "bad_request", message: "Password must be at least 6 characters." });
    return;
  }

  try {
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "conflict", message: "An account with this email already exists." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const [user] = await db.insert(usersTable).values({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      verifyToken,
      verifyTokenExpiry,
    }).returning();

    try {
      await sendVerificationEmail(user.email, user.name, verifyToken);
      logger.info({ email: user.email }, "signup: verification email dispatched");
    } catch (emailErr) {
      const verifyUrl = `${getAppUrl()}/verify?token=${verifyToken}`;
      logger.error({ err: emailErr, email: user.email, verifyUrl }, "signup: email send failed — link below");
    }

    res.status(201).json({ message: "Account created. Please check your email to verify your identity." });
  } catch (err) {
    logger.error({ err }, "signup: failed");
    res.status(500).json({ error: "internal", message: "Signup failed. Please try again." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "bad_request", message: "Email and password are required." });
    return;
  }

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
    if (!user) {
      res.status(401).json({ error: "invalid_credentials", message: "Invalid email or password." });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "invalid_credentials", message: "Invalid email or password." });
      return;
    }

    logger.info({ email: user.email, userId: user.id }, "login: success");
    const token = signToken({ userId: user.id, email: user.email, name: user.name });
    res.json({ message: "Success", token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    logger.error({ err }, "login: failed");
    res.status(500).json({ error: "internal", message: "Login failed. Please try again." });
  }
});

router.get("/verify", async (req, res) => {
  const { token } = req.query as { token?: string };

  if (!token) {
    res.status(400).json({ error: "bad_request", message: "Token is required." });
    return;
  }

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.verifyToken, token)).limit(1);
    if (!user) {
      res.status(400).json({ error: "invalid_token", message: "This verification link is invalid." });
      return;
    }

    if (user.emailVerified) {
      const jwtToken = signToken({ userId: user.id, email: user.email, name: user.name });
      res.json({ message: "already_verified", verified: true, token: jwtToken, user: { id: user.id, name: user.name, email: user.email } });
      return;
    }

    if (user.verifyTokenExpiry && user.verifyTokenExpiry < new Date()) {
      res.status(400).json({ error: "token_expired", message: "This verification link has expired. Please request a new one." });
      return;
    }

    await db.update(usersTable).set({
      emailVerified: true,
      verifyToken: null,
      verifyTokenExpiry: null,
    }).where(eq(usersTable.id, user.id));

    logger.info({ userId: user.id, email: user.email }, "verify: email verified");
    const jwtToken = signToken({ userId: user.id, email: user.email, name: user.name });
    res.json({ message: "verified", verified: true, token: jwtToken, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    logger.error({ err }, "verify: failed");
    res.status(500).json({ error: "internal", message: "Verification failed. Please try again." });
  }
});

router.post("/resend-verify", async (req, res) => {
  const { email } = req.body as { email?: string };

  if (!email) {
    res.status(400).json({ error: "bad_request", message: "Email is required." });
    return;
  }

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
    if (!user || user.emailVerified) {
      res.json({ message: "If this email is registered and unverified, a new link has been sent." });
      return;
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.update(usersTable).set({ verifyToken, verifyTokenExpiry }).where(eq(usersTable.id, user.id));

    try {
      await sendVerificationEmail(user.email, user.name, verifyToken);
      logger.info({ email: user.email }, "resend-verify: email dispatched");
    } catch (emailErr) {
      const verifyUrl = `${getAppUrl()}/verify?token=${verifyToken}`;
      logger.error({ err: emailErr, email: user.email, verifyUrl }, "resend-verify: email send failed — link below");
    }

    res.json({ message: "A new verification link has been dispatched." });
  } catch (err) {
    logger.error({ err }, "resend-verify: failed");
    res.status(500).json({ error: "internal", message: "Failed to resend. Please try again." });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body as { email?: string };

  if (!email) {
    res.status(400).json({ error: "bad_request", message: "Email is required." });
    return;
  }

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

      await db.update(usersTable).set({ resetToken, resetTokenExpiry }).where(eq(usersTable.id, user.id));

      const resetUrl = `${getAppUrl()}/reset-password?token=${resetToken}`;

      // In dev, always print the link so you can test without email delivery
      if (process.env.NODE_ENV !== "production") {
        logger.info({ email: user.email, resetUrl }, "forgot-password: DEV reset link (use if email not delivered)");
      }

      try {
        await sendPasswordResetEmail(user.email, user.name, resetToken);
        logger.info({ email: user.email }, "forgot-password: reset email dispatched");
      } catch (emailErr) {
        logger.error({ err: emailErr, email: user.email, resetUrl }, "forgot-password: email send failed — link below");
      }
    } else {
      logger.warn({ email }, "forgot-password: email not found (suppressed for security)");
    }

    res.json({ message: "If this email is registered, a password reset link has been sent." });
  } catch (err) {
    logger.error({ err }, "forgot-password: failed");
    res.status(500).json({ error: "internal", message: "Failed to send reset link. Please try again." });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body as { token?: string; password?: string };

  if (!token || !password) {
    res.status(400).json({ error: "bad_request", message: "Token and password are required." });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "bad_request", message: "Password must be at least 6 characters." });
    return;
  }

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.resetToken, token)).limit(1);

    if (!user) {
      logger.warn({ token: token.slice(0, 8) + "…" }, "reset-password: invalid or already-used token");
      res.status(400).json({ error: "invalid_token", message: "This reset link is invalid or has already been used." });
      return;
    }

    if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
      logger.warn({ userId: user.id, email: user.email }, "reset-password: token expired");
      res.status(400).json({ error: "token_expired", message: "This reset link has expired. Please request a new one." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await db.update(usersTable).set({
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
    }).where(eq(usersTable.id, user.id));

    logger.info({ userId: user.id, email: user.email }, "reset-password: password updated successfully");
    res.json({ message: "Password updated successfully. You can now log in with your new password." });
  } catch (err) {
    logger.error({ err }, "reset-password: failed");
    res.status(500).json({ error: "internal", message: "Reset failed. Please try again." });
  }
});

export default router;
