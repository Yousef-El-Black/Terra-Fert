import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import adminModel from "../models/admin.model";

const authenticateAdmin = async (req: Request, res: Response) => {
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not configured.");
    res.status(500).json({ error: "Authentication is not configured." });
    return null;
  }

  const authorization = req.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  if (!token) {
    res.status(401).json({ error: "Authentication is required." });
    return null;
  }

  let subject: string;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string"
    ) {
      res.status(401).json({ error: "Invalid authentication token." });
      return null;
    }
    subject = payload.sub;
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
    return null;
  }

  try {
    const admin = await adminModel
      .findById(subject)
      .select("_id username superAdmin");
    if (!admin) {
      res.status(401).json({ error: "Admin account no longer exists." });
      return null;
    }
    return admin;
  } catch (error) {
    console.error("Failed to authenticate admin:", error);
    res.status(500).json({ error: "Failed to authenticate admin." });
    return null;
  }
};

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const admin = await authenticateAdmin(req, res);
  if (!admin) return;

  res.locals.admin = {
    _id: admin.id,
    username: admin.username,
    superAdmin: admin.superAdmin,
  };
  return next();
};

export const requireSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const admin = await authenticateAdmin(req, res);
  if (!admin) return;
  if (!admin.superAdmin) {
    return res.status(403).json({ error: "Super-admin access is required." });
  }

  return next();
};
