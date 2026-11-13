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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSuperAdmin = exports.requireAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const admin_model_1 = require("../models/admin.model");
const connectDB_1 = require("../utils/connectDB");
const authenticateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!config_1.JWT_SECRET) {
        console.error("JWT_SECRET is not configured.");
        res.status(500).json({ error: "Authentication is not configured." });
        return null;
    }
    const authorization = req.get("authorization");
    const token = (authorization === null || authorization === void 0 ? void 0 : authorization.startsWith("Bearer "))
        ? authorization.slice("Bearer ".length)
        : "";
    if (!token) {
        res.status(401).json({ error: "Authentication is required." });
        return null;
    }
    let subject;
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        if (typeof payload === "string" ||
            typeof payload.sub !== "string") {
            res.status(401).json({ error: "Invalid authentication token." });
            return null;
        }
        subject = payload.sub;
    }
    catch (_a) {
        res.status(401).json({ error: "Invalid or expired token." });
        return null;
    }
    try {
        const admins = yield (0, connectDB_1.queryRows)(`SELECT ${admin_model_1.adminFields} FROM admins WHERE id = ? LIMIT 1`, [subject]);
        const admin = admins[0];
        if (!admin) {
            res.status(401).json({ error: "Admin account no longer exists." });
            return null;
        }
        return admin;
    }
    catch (error) {
        console.error("Failed to authenticate admin:", error);
        res.status(500).json({ error: "Failed to authenticate admin." });
        return null;
    }
});
const requireAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield authenticateAdmin(req, res);
    if (!admin)
        return;
    res.locals.admin = {
        _id: admin._id,
        username: admin.username,
        superAdmin: Boolean(admin.superAdmin),
    };
    return next();
});
exports.requireAdmin = requireAdmin;
const requireSuperAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield authenticateAdmin(req, res);
    if (!admin)
        return;
    if (!Boolean(admin.superAdmin)) {
        return res.status(403).json({ error: "Super-admin access is required." });
    }
    return next();
});
exports.requireSuperAdmin = requireSuperAdmin;
