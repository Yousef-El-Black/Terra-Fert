import { randomUUID } from "node:crypto";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { AdminRow, adminFields } from "../models/admin.model";
import { execute, queryRows } from "../utils/connectDB";
import { getRequestBody } from "../utils/requestBody";
import { getRouteId } from "../utils/routeParams";

const usernameMinLength = 6;
const passwordMinLength = 8;
const passwordSaltRounds = 12;

const publicAdmin = (admin: AdminRow) => ({
  _id: admin._id,
  username: admin.username,
  superAdmin: Boolean(admin.superAdmin),
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
});

const isDuplicateEntry = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === "ER_DUP_ENTRY";

const respondWithError = (res: Response, error: unknown, action: string) => {
  if (isDuplicateEntry(error)) {
    return res.status(409).json({ error: "Username is already in use." });
  }
  console.error(`Failed to ${action}:`, error);
  return res.status(500).json({ error: `Failed to ${action}.` });
};

const validId = (id: string) =>
  /^[0-9a-f]{24}$/i.test(id) ||
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );

const getAdmin = async (id: string) => {
  const rows = await queryRows<AdminRow>(
    `SELECT ${adminFields} FROM admins WHERE id = ? LIMIT 1`,
    [id],
  );
  return rows[0];
};

export const loginAdmin = async (req: Request, res: Response) => {
  const body = getRequestBody(req.body);
  if (
    !body ||
    typeof body.username !== "string" ||
    typeof body.password !== "string" ||
    !body.username.trim() ||
    !body.password
  ) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    const admins = await queryRows<AdminRow>(
      `SELECT ${adminFields} FROM admins WHERE username = ? LIMIT 1`,
      [body.username.trim()],
    );
    const admin = admins[0];
    if (!admin || !(await bcrypt.compare(body.password, admin.password))) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = jwt.sign({ sub: admin._id }, JWT_SECRET, { expiresIn: "8h" });
    return res.status(200).json({ token, admin: publicAdmin(admin) });
  } catch (error) {
    return respondWithError(res, error, "log in admin");
  }
};

export const getAdminSetupStatus = async (_req: Request, res: Response) => {
  try {
    const rows = await queryRows<AdminRow & { count: number }>(
      "SELECT COUNT(*) AS count FROM admins",
    );
    return res.status(200).json({ needsSetup: Number(rows[0].count) === 0 });
  } catch (error) {
    return respondWithError(res, error, "check admin setup");
  }
};

export const registerInitialSuperAdmin = async (
  req: Request,
  res: Response,
) => {
  const body = getRequestBody(req.body);
  if (
    !body ||
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

  try {
    const admins = await queryRows<AdminRow>(
      `SELECT ${adminFields} FROM admins LIMIT 1`,
    );
    if (admins.length > 0) {
      return res
        .status(409)
        .json({ error: "Admin setup is already complete." });
    }

    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(
      body.password,
      passwordSaltRounds,
    );
    await execute(
      `INSERT INTO admins
        (id, username, password, super_admin, initial_super_admin)
       VALUES (?, ?, ?, TRUE, 1)`,
      [id, body.username.trim(), hashedPassword],
    );
    const admin = await getAdmin(id);
    if (!admin) throw new Error("Initial admin insert could not be read.");

    const token = jwt.sign({ sub: admin._id }, JWT_SECRET, {
      expiresIn: "8h",
    });
    return res.status(201).json({ token, admin: publicAdmin(admin) });
  } catch (error) {
    if (isDuplicateEntry(error)) {
      return res
        .status(409)
        .json({ error: "Admin setup is already complete." });
    }
    return respondWithError(res, error, "register initial super-admin");
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  const body = getRequestBody(req.body);
  if (
    !body ||
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
    const id = randomUUID();
    await execute(
      `INSERT INTO admins (id, username, password, super_admin)
       VALUES (?, ?, ?, ?)`,
      [
        id,
        body.username.trim(),
        await bcrypt.hash(body.password, passwordSaltRounds),
        body.superAdmin,
      ],
    );
    const admin = await getAdmin(id);
    if (!admin) throw new Error("Admin insert could not be read.");
    return res.status(201).json(publicAdmin(admin));
  } catch (error) {
    return respondWithError(res, error, "create admin");
  }
};

export const getAdmins = async (_req: Request, res: Response) => {
  try {
    const admins = await queryRows<AdminRow>(
      `SELECT ${adminFields} FROM admins`,
    );
    return res.status(200).json(admins.map(publicAdmin));
  } catch (error) {
    return respondWithError(res, error, "get admins");
  }
};

export const getAdminById = async (req: Request, res: Response) => {
  const id = getRouteId(req);
  if (!id || !validId(id)) {
    return res.status(400).json({ error: "Invalid admin ID." });
  }

  try {
    const admin = await getAdmin(id);
    if (!admin) return res.status(404).json({ error: "Admin not found." });
    return res.status(200).json(publicAdmin(admin));
  } catch (error) {
    return respondWithError(res, error, "get admin");
  }
};

export const updateAdminById = async (req: Request, res: Response) => {
  const id = getRouteId(req);
  if (!id || !validId(id)) {
    return res.status(400).json({ error: "Invalid admin ID." });
  }

  const body = getRequestBody(req.body);
  if (!body) return res.status(400).json({ error: "Invalid admin fields." });
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
    const admin = await getAdmin(id);
    if (!admin) return res.status(404).json({ error: "Admin not found." });

    if (Boolean(admin.superAdmin) && body.superAdmin === false) {
      const count = await queryRows<AdminRow & { count: number }>(
        "SELECT COUNT(*) AS count FROM admins WHERE super_admin = TRUE",
      );
      if (Number(count[0].count) <= 1) {
        return res
          .status(409)
          .json({ error: "Cannot demote the last super-admin." });
      }
    }

    const updates: Array<[string, string | boolean]> = [];
    if (typeof body.username === "string") {
      updates.push(["username", body.username.trim()]);
    }
    if (typeof body.password === "string") {
      updates.push([
        "password",
        await bcrypt.hash(body.password, passwordSaltRounds),
      ]);
    }
    if (typeof body.superAdmin === "boolean") {
      updates.push(["super_admin", body.superAdmin]);
    }
    if (updates.length > 0) {
      await execute(
        `UPDATE admins SET ${updates.map(([column]) => `${column} = ?`).join(", ")} WHERE id = ?`,
        [...updates.map(([, value]) => value), id],
      );
    }

    const updatedAdmin = await getAdmin(id);
    if (!updatedAdmin) return res.status(404).json({ error: "Admin not found." });
    return res.status(200).json(publicAdmin(updatedAdmin));
  } catch (error) {
    return respondWithError(res, error, "update admin");
  }
};

export const deleteAdminById = async (req: Request, res: Response) => {
  const id = getRouteId(req);
  if (!id || !validId(id)) {
    return res.status(400).json({ error: "Invalid admin ID." });
  }

  try {
    const admin = await getAdmin(id);
    if (!admin) return res.status(404).json({ error: "Admin not found." });

    if (Boolean(admin.superAdmin)) {
      const count = await queryRows<AdminRow & { count: number }>(
        "SELECT COUNT(*) AS count FROM admins WHERE super_admin = TRUE",
      );
      if (Number(count[0].count) <= 1) {
        return res
          .status(409)
          .json({ error: "Cannot delete the last super-admin." });
      }
    }

    await execute("DELETE FROM admins WHERE id = ?", [id]);
    return res.status(200).json({ message: "Admin deleted successfully." });
  } catch (error) {
    return respondWithError(res, error, "delete admin");
  }
};
