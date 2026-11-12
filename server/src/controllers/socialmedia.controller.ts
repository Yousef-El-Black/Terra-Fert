import { randomUUID } from "node:crypto";
import { Request, Response } from "express";
import {
  SocialMediaRow,
  socialMediaFields,
} from "../models/socialmedia.model";
import { execute, queryRows } from "../utils/connectDB";
import { getRequestBody } from "../utils/requestBody";
import { getRouteId } from "../utils/routeParams";

type SocialMediaInput = {
  name?: unknown;
  link?: unknown;
  platform?: unknown;
  active?: unknown;
};

const platforms = [
  "whatsapp",
  "facebook",
  "instagram",
  "website",
  "email",
  "phone",
  "address",
  "other",
] as const;
type SocialPlatform = (typeof platforms)[number];

const isSocialPlatform = (value: unknown): value is SocialPlatform =>
  typeof value === "string" && platforms.includes(value as SocialPlatform);

const isValidWebLink = (link: string) => {
  try {
    const url = new URL(link);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const isValidWhatsAppNumber = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return /^[+()\d\s.-]+$/.test(value) && digits.length >= 7 && digits.length <= 15;
};

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidChannelValue = (platform: unknown, value: string) => {
  if (platform === "address") return value.trim().length > 0;
  if (platform === "whatsapp" || platform === "phone") {
    return isValidWhatsAppNumber(value);
  }
  if (platform === "email") return isValidEmail(value);
  return isValidWebLink(value);
};

const validateSocialMedia = (
  body: SocialMediaInput,
  partial = false,
): string | null => {
  if (
    (!partial || body.name !== undefined) &&
    (typeof body.name !== "string" || !body.name.trim())
  ) {
    return "A social media name is required.";
  }
  if (
    (!partial || body.link !== undefined) &&
    (typeof body.link !== "string" ||
      !isValidChannelValue(body.platform, body.link.trim()))
  ) {
    return body.platform === "whatsapp" || body.platform === "phone"
      ? "A valid phone number is required."
      : body.platform === "email"
        ? "A valid email address is required."
        : body.platform === "address"
          ? "An address is required."
          : "A valid HTTP or HTTPS link is required.";
  }
  if (body.platform !== undefined && !isSocialPlatform(body.platform)) {
    return "A valid social media platform is required.";
  }
  if (body.active !== undefined && typeof body.active !== "boolean") {
    return "The active field must be a boolean.";
  }
  return null;
};

const validId = (id: string) =>
  /^[0-9a-f]{24}$/i.test(id) ||
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );

const handleError = (res: Response, error: unknown, action: string) => {
  console.error(`Failed to ${action}:`, error);
  return res.status(500).json({ error: `Failed to ${action}.` });
};

export const getActiveSocialMedia = async (_req: Request, res: Response) => {
  try {
    const items = await queryRows<SocialMediaRow>(
      `SELECT ${socialMediaFields} FROM social_media
       WHERE active = TRUE ORDER BY name ASC`,
    );
    return res.status(200).json(
      items.map((item) => ({
        ...item,
        active: Boolean(item.active),
        value: item.link,
        link:
          item.platform === "whatsapp"
            ? `https://wa.me/${item.link.replace(/\D/g, "")}`
            : item.platform === "phone"
              ? `tel:${item.link.replace(/\D/g, "")}`
              : item.platform === "email"
                ? `mailto:${item.link}`
                : item.link,
      })),
    );
  } catch (error) {
    return handleError(res, error, "get social media");
  }
};

export const getAllSocialMedia = async (_req: Request, res: Response) => {
  try {
    const items = await queryRows<SocialMediaRow>(
      `SELECT ${socialMediaFields} FROM social_media
       ORDER BY created_at DESC`,
    );
    return res
      .status(200)
      .json(items.map((item) => ({ ...item, active: Boolean(item.active) })));
  } catch (error) {
    return handleError(res, error, "get social media");
  }
};

export const createSocialMedia = async (req: Request, res: Response) => {
  const body = getRequestBody(req.body);
  if (!body) {
    return res.status(400).json({ error: "Invalid social media fields." });
  }
  const validationError = validateSocialMedia(body);
  if (validationError) return res.status(400).json({ error: validationError });
  if (
    typeof body.name !== "string" ||
    typeof body.link !== "string" ||
    !isSocialPlatform(body.platform)
  ) {
    return res
      .status(400)
      .json({ error: "Name, platform, and link are required." });
  }

  const id = randomUUID();
  try {
    await execute(
      `INSERT INTO social_media (id, name, link, platform, active)
       VALUES (?, ?, ?, ?, ?)`,
      [
        id,
        body.name.trim(),
        body.link.trim(),
        body.platform,
        typeof body.active === "boolean" ? body.active : true,
      ],
    );
    const rows = await queryRows<SocialMediaRow>(
      `SELECT ${socialMediaFields} FROM social_media WHERE id = ? LIMIT 1`,
      [id],
    );
    const item = rows[0];
    return res
      .status(201)
      .json({ ...item, active: Boolean(item.active) });
  } catch (error) {
    return handleError(res, error, "create social media");
  }
};

export const updateSocialMedia = async (req: Request, res: Response) => {
  const id = getRouteId(req);
  if (!id || !validId(id)) {
    return res.status(400).json({ error: "Invalid social media ID." });
  }

  const body = getRequestBody(req.body);
  if (!body) {
    return res.status(400).json({ error: "Invalid social media fields." });
  }
  const validationError = validateSocialMedia(body, true);
  if (validationError) return res.status(400).json({ error: validationError });

  const updates: Array<[string, string | boolean]> = [];
  if (typeof body.name === "string") updates.push(["name", body.name.trim()]);
  if (typeof body.link === "string") updates.push(["link", body.link.trim()]);
  if (isSocialPlatform(body.platform)) {
    updates.push(["platform", body.platform]);
  }
  if (typeof body.active === "boolean") updates.push(["active", body.active]);

  try {
    const existing = await queryRows<SocialMediaRow>(
      `SELECT ${socialMediaFields} FROM social_media WHERE id = ? LIMIT 1`,
      [id],
    );
    if (!existing[0]) {
      return res.status(404).json({ error: "Social media not found." });
    }

    if (updates.length > 0) {
      await execute(
        `UPDATE social_media
         SET ${updates.map(([column]) => `${column} = ?`).join(", ")}
         WHERE id = ?`,
        [...updates.map(([, value]) => value), id],
      );
    }
    const rows = await queryRows<SocialMediaRow>(
      `SELECT ${socialMediaFields} FROM social_media WHERE id = ? LIMIT 1`,
      [id],
    );
    const item = rows[0];
    return res.status(200).json({ ...item, active: Boolean(item.active) });
  } catch (error) {
    return handleError(res, error, "update social media");
  }
};

export const deleteSocialMedia = async (req: Request, res: Response) => {
  const id = getRouteId(req);
  if (!id || !validId(id)) {
    return res.status(400).json({ error: "Invalid social media ID." });
  }

  try {
    const result = await execute("DELETE FROM social_media WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Social media not found." });
    }
    return res.status(200).json({ message: "Social media deleted." });
  } catch (error) {
    return handleError(res, error, "delete social media");
  }
};
