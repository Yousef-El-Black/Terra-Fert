import { Request, Response } from "express";
import mongoose from "mongoose";
import socialMediaModel from "../models/socialmedia.model";

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
  typeof value === "string" &&
  platforms.includes(value as SocialPlatform);

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
  if (
    body.platform !== undefined &&
    !isSocialPlatform(body.platform)
  ) {
    return "A valid social media platform is required.";
  }
  if (body.active !== undefined && typeof body.active !== "boolean") {
    return "The active field must be a boolean.";
  }
  return null;
};

const handleError = (res: Response, error: unknown, action: string) => {
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: "Invalid social media ID." });
  }
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ error: error.message });
  }

  console.error(`Failed to ${action}:`, error);
  return res.status(500).json({ error: `Failed to ${action}.` });
};

export const getActiveSocialMedia = async (_req: Request, res: Response) => {
  try {
    const items = await socialMediaModel
      .find({ active: true })
      .select("_id name link platform active")
      .sort({ name: 1 });
    return res.status(200).json(
      items.map((item) => ({
        ...item.toObject(),
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
    const items = await socialMediaModel
      .find()
      .select("_id name link platform active createdAt updatedAt")
      .sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (error) {
    return handleError(res, error, "get social media");
  }
};

export const createSocialMedia = async (req: Request, res: Response) => {
  const body = req.body as SocialMediaInput;
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

  try {
    const item = await socialMediaModel.create({
      name: body.name.trim(),
      link: body.link.trim(),
      platform: body.platform,
      active: typeof body.active === "boolean" ? body.active : true,
    });
    return res.status(201).json(item);
  } catch (error) {
    return handleError(res, error, "create social media");
  }
};

export const updateSocialMedia = async (req: Request, res: Response) => {
  const body = req.body as SocialMediaInput;
  const validationError = validateSocialMedia(body, true);
  if (validationError) return res.status(400).json({ error: validationError });

  try {
    const updates: {
      name?: string;
      link?: string;
      platform?: string;
      active?: boolean;
    } = {};
    if (typeof body.name === "string") updates.name = body.name.trim();
    if (typeof body.link === "string") updates.link = body.link.trim();
    if (isSocialPlatform(body.platform)) updates.platform = body.platform;
    if (typeof body.active === "boolean") updates.active = body.active;

    const item = await socialMediaModel.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    );
    if (!item) return res.status(404).json({ error: "Social media not found." });

    return res.status(200).json(item);
  } catch (error) {
    return handleError(res, error, "update social media");
  }
};

export const deleteSocialMedia = async (req: Request, res: Response) => {
  try {
    const item = await socialMediaModel.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Social media not found." });

    return res.status(200).json({ message: "Social media deleted." });
  } catch (error) {
    return handleError(res, error, "delete social media");
  }
};
