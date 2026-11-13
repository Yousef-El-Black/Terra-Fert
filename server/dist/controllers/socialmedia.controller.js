"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSocialMedia = exports.updateSocialMedia = exports.createSocialMedia = exports.getAllSocialMedia = exports.getActiveSocialMedia = void 0;
const node_crypto_1 = require("node:crypto");
const socialmedia_model_1 = require("../models/socialmedia.model");
const connectDB_1 = require("../utils/connectDB");
const requestBody_1 = require("../utils/requestBody");
const routeParams_1 = require("../utils/routeParams");
const platforms = [
    "whatsapp",
    "facebook",
    "instagram",
    "website",
    "email",
    "phone",
    "address",
    "other",
];
const isSocialPlatform = (value) => typeof value === "string" && platforms.includes(value);
const isValidWebLink = (link) => {
    try {
        const url = new URL(link);
        return url.protocol === "http:" || url.protocol === "https:";
    }
    catch (_a) {
        return false;
    }
};
const isValidWhatsAppNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    return /^[+()\d\s.-]+$/.test(value) && digits.length >= 7 && digits.length <= 15;
};
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isValidChannelValue = (platform, value) => {
    if (platform === "address")
        return value.trim().length > 0;
    if (platform === "whatsapp" || platform === "phone") {
        return isValidWhatsAppNumber(value);
    }
    if (platform === "email")
        return isValidEmail(value);
    return isValidWebLink(value);
};
const validateSocialMedia = (body, partial = false) => {
    if ((!partial || body.name !== undefined) &&
        (typeof body.name !== "string" || !body.name.trim())) {
        return "A social media name is required.";
    }
    if ((!partial || body.link !== undefined) &&
        (typeof body.link !== "string" ||
            !isValidChannelValue(body.platform, body.link.trim()))) {
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
const validId = (id) => /^[0-9a-f]{24}$/i.test(id) ||
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
const handleError = (res, error, action) => {
    console.error(`Failed to ${action}:`, error);
    return res.status(500).json({ error: `Failed to ${action}.` });
};
const getActiveSocialMedia = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield (0, connectDB_1.queryRows)(`SELECT ${socialmedia_model_1.socialMediaFields} FROM social_media
       WHERE active = TRUE ORDER BY name ASC`);
        return res.status(200).json(items.map((item) => (Object.assign(Object.assign({}, item), { active: Boolean(item.active), value: item.link, link: item.platform === "whatsapp"
                ? `https://wa.me/${item.link.replace(/\D/g, "")}`
                : item.platform === "phone"
                    ? `tel:${item.link.replace(/\D/g, "")}`
                    : item.platform === "email"
                        ? `mailto:${item.link}`
                        : item.link }))));
    }
    catch (error) {
        return handleError(res, error, "get social media");
    }
});
exports.getActiveSocialMedia = getActiveSocialMedia;
const getAllSocialMedia = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield (0, connectDB_1.queryRows)(`SELECT ${socialmedia_model_1.socialMediaFields} FROM social_media
       ORDER BY created_at DESC`);
        return res
            .status(200)
            .json(items.map((item) => (Object.assign(Object.assign({}, item), { active: Boolean(item.active) }))));
    }
    catch (error) {
        return handleError(res, error, "get social media");
    }
});
exports.getAllSocialMedia = getAllSocialMedia;
const createSocialMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = (0, requestBody_1.getRequestBody)(req.body);
    if (!body) {
        return res.status(400).json({ error: "Invalid social media fields." });
    }
    const validationError = validateSocialMedia(body);
    if (validationError)
        return res.status(400).json({ error: validationError });
    if (typeof body.name !== "string" ||
        typeof body.link !== "string" ||
        !isSocialPlatform(body.platform)) {
        return res
            .status(400)
            .json({ error: "Name, platform, and link are required." });
    }
    const id = (0, node_crypto_1.randomUUID)();
    try {
        yield (0, connectDB_1.execute)(`INSERT INTO social_media (id, name, link, platform, active)
       VALUES (?, ?, ?, ?, ?)`, [
            id,
            body.name.trim(),
            body.link.trim(),
            body.platform,
            typeof body.active === "boolean" ? body.active : true,
        ]);
        const rows = yield (0, connectDB_1.queryRows)(`SELECT ${socialmedia_model_1.socialMediaFields} FROM social_media WHERE id = ? LIMIT 1`, [id]);
        const item = rows[0];
        return res
            .status(201)
            .json(Object.assign(Object.assign({}, item), { active: Boolean(item.active) }));
    }
    catch (error) {
        return handleError(res, error, "create social media");
    }
});
exports.createSocialMedia = createSocialMedia;
const updateSocialMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, routeParams_1.getRouteId)(req);
    if (!id || !validId(id)) {
        return res.status(400).json({ error: "Invalid social media ID." });
    }
    const body = (0, requestBody_1.getRequestBody)(req.body);
    if (!body) {
        return res.status(400).json({ error: "Invalid social media fields." });
    }
    const validationError = validateSocialMedia(body, true);
    if (validationError)
        return res.status(400).json({ error: validationError });
    const updates = [];
    if (typeof body.name === "string")
        updates.push(["name", body.name.trim()]);
    if (typeof body.link === "string")
        updates.push(["link", body.link.trim()]);
    if (isSocialPlatform(body.platform)) {
        updates.push(["platform", body.platform]);
    }
    if (typeof body.active === "boolean")
        updates.push(["active", body.active]);
    try {
        const existing = yield (0, connectDB_1.queryRows)(`SELECT ${socialmedia_model_1.socialMediaFields} FROM social_media WHERE id = ? LIMIT 1`, [id]);
        if (!existing[0]) {
            return res.status(404).json({ error: "Social media not found." });
        }
        if (updates.length > 0) {
            yield (0, connectDB_1.execute)(`UPDATE social_media
         SET ${updates.map(([column]) => `${column} = ?`).join(", ")}
         WHERE id = ?`, [...updates.map(([, value]) => value), id]);
        }
        const rows = yield (0, connectDB_1.queryRows)(`SELECT ${socialmedia_model_1.socialMediaFields} FROM social_media WHERE id = ? LIMIT 1`, [id]);
        const item = rows[0];
        return res.status(200).json(Object.assign(Object.assign({}, item), { active: Boolean(item.active) }));
    }
    catch (error) {
        return handleError(res, error, "update social media");
    }
});
exports.updateSocialMedia = updateSocialMedia;
const deleteSocialMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, routeParams_1.getRouteId)(req);
    if (!id || !validId(id)) {
        return res.status(400).json({ error: "Invalid social media ID." });
    }
    try {
        const result = yield (0, connectDB_1.execute)("DELETE FROM social_media WHERE id = ?", [
            id,
        ]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Social media not found." });
        }
        return res.status(200).json({ message: "Social media deleted." });
    }
    catch (error) {
        return handleError(res, error, "delete social media");
    }
});
exports.deleteSocialMedia = deleteSocialMedia;
