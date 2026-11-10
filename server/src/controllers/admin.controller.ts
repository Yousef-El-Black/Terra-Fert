import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { JWT_SECRET } from "../config";
import adminModel from "../models/admin.model";

const usernameMinLength = 6;
const passwordMinLength = 8;
const passwordSaltRounds = 12;

const publicAdmin = (admin: {
  _id: unknown;
  username: string;
  superAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}) => ({
  _id: admin._id,
  username: admin.username,
  superAdmin: admin.superAdmin,
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
});

const respondWithError = (res: Response, error: unknown, action: string) => {
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ error: error.message });
  }
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: "Invalid admin ID." });
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    return res.status(409).json({ error: "Username is already in use." });
  }

  console.error(`Failed to ${action}:`, error);
  return res.status(500).json({ error: `Failed to ${action}.` });
};

export const loginAdmin = async (req: Request, res: Response) => {
  const body = req.body as { username?: unknown; password?: unknown };
  if (
    typeof body.username !== "string" ||
    typeof body.password !== "string" ||
    !body.username.trim() ||
    !body.password
  ) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not configured.");
    return res.status(500).json({ error: "Authentication is not configured." });
  }

  try {
    const admin = await adminModel
      .findOne({ username: body.username.trim() })
      .select("+password");
    if (!admin || !(await bcrypt.compare(body.password, admin.password))) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = jwt.sign({ sub: admin.id }, JWT_SECRET, { expiresIn: "8h" });
    return res.status(200).json({ token, admin: publicAdmin(admin) });
  } catch (error) {
    return respondWithError(res, error, "log in admin");
  }
};

export const getAdminSetupStatus = async (_req: Request, res: Response) => {
  try {
    const hasAdmins = await adminModel.exists({});
    return res.status(200).json({ needsSetup: !hasAdmins });
  } catch (error) {
    return respondWithError(res, error, "check admin setup");
  }
};

export const registerInitialSuperAdmin = async (
  req: Request,
  res: Response,
) => {
  const body = req.body as { username?: unknown; password?: unknown };
  if (
    typeof body.username !== "string" ||
    body.username.trim().length < usernameMinLength ||
    typeof body.password !== "string" ||
    body.password.length < passwordMinLength
  ) {
    return res.status(400).json({
      error:
        "Username must be at least 6 characters and password at least 8 characters.",
    });
  }

  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not configured.");
    return res.status(500).json({ error: "Authentication is not configured." });
  }

  try {
    if (await adminModel.exists({})) {
      return res
        .status(409)
        .json({ error: "Admin setup is already complete." });
    }

    const admin = await adminModel.create({
      username: body.username.trim(),
      password: await bcrypt.hash(body.password, passwordSaltRounds),
      superAdmin: true,
      initialSuperAdmin: true,
    });
    const token = jwt.sign({ sub: admin.id }, JWT_SECRET, {
      expiresIn: "8h",
    });
    return res.status(201).json({ token, admin: publicAdmin(admin) });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return res
        .status(409)
        .json({ error: "Admin setup is already complete." });
    }
    return respondWithError(res, error, "register initial super-admin");
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  const body = req.body as {
    username?: unknown;
    password?: unknown;
    superAdmin?: unknown;
  };
  if (
    typeof body.username !== "string" ||
    body.username.trim().length < usernameMinLength ||
    typeof body.password !== "string" ||
    body.password.length < passwordMinLength ||
    typeof body.superAdmin !== "boolean"
  ) {
    return res.status(400).json({
      error:
        "Username (at least 6 characters), password (at least 8 characters), and superAdmin are required.",
    });
  }

  try {
    const admin = await adminModel.create({
      username: body.username.trim(),
      password: await bcrypt.hash(body.password, passwordSaltRounds),
      superAdmin: body.superAdmin,
    });
    return res.status(201).json(publicAdmin(admin));
  } catch (error) {
    return respondWithError(res, error, "create admin");
  }
};

export const getAdmins = async (_req: Request, res: Response) => {
  try {
    const admins = await adminModel
      .find()
      .select("_id username superAdmin createdAt updatedAt");
    return res.status(200).json(admins.map(publicAdmin));
  } catch (error) {
    return respondWithError(res, error, "get admins");
  }
};

export const getAdminById = async (req: Request, res: Response) => {
  try {
    const admin = await adminModel.findById(req.params.id);
    if (!admin) return res.status(404).json({ error: "Admin not found." });

    return res.status(200).json(publicAdmin(admin));
  } catch (error) {
    return respondWithError(res, error, "get admin");
  }
};

export const updateAdminById = async (req: Request, res: Response) => {
  const body = req.body as {
    username?: unknown;
    password?: unknown;
    superAdmin?: unknown;
  };
  if (
    (body.username !== undefined &&
      (typeof body.username !== "string" ||
        body.username.trim().length < usernameMinLength)) ||
    (body.password !== undefined &&
      (typeof body.password !== "string" ||
        body.password.length < passwordMinLength)) ||
    (body.superAdmin !== undefined && typeof body.superAdmin !== "boolean")
  ) {
    return res.status(400).json({ error: "Invalid admin fields." });
  }

  try {
    const admin = await adminModel.findById(req.params.id);
    if (!admin) return res.status(404).json({ error: "Admin not found." });

    if (admin.superAdmin && body.superAdmin === false) {
      const superAdminCount = await adminModel.countDocuments({
        superAdmin: true,
      });
      if (superAdminCount <= 1) {
        return res
          .status(409)
          .json({ error: "Cannot demote the last super-admin." });
      }
    }

    if (typeof body.username === "string") {
      admin.username = body.username.trim();
    }
    if (typeof body.password === "string") {
      admin.password = await bcrypt.hash(body.password, passwordSaltRounds);
    }
    if (typeof body.superAdmin === "boolean") {
      admin.superAdmin = body.superAdmin;
    }

    await admin.save();
    return res.status(200).json(publicAdmin(admin));
  } catch (error) {
    return respondWithError(res, error, "update admin");
  }
};

export const deleteAdminById = async (req: Request, res: Response) => {
  try {
    const admin = await adminModel.findById(req.params.id);
    if (!admin) return res.status(404).json({ error: "Admin not found." });

    if (admin.superAdmin) {
      const superAdminCount = await adminModel.countDocuments({
        superAdmin: true,
      });
      if (superAdminCount <= 1) {
        return res
          .status(409)
          .json({ error: "Cannot delete the last super-admin." });
      }
    }

    await admin.deleteOne();
    return res.status(200).json({ message: "Admin deleted successfully." });
  } catch (error) {
    return respondWithError(res, error, "delete admin");
  }
};
