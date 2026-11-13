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
exports.deleteAdminById = exports.updateAdminById = exports.getAdminById = exports.getAdmins = exports.createAdmin = exports.registerInitialSuperAdmin = exports.getAdminSetupStatus = exports.loginAdmin = void 0;
const node_crypto_1 = require("node:crypto");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const admin_model_1 = require("../models/admin.model");
const connectDB_1 = require("../utils/connectDB");
const requestBody_1 = require("../utils/requestBody");
const routeParams_1 = require("../utils/routeParams");
const usernameMinLength = 6;
const passwordMinLength = 8;
const passwordSaltRounds = 12;
const publicAdmin = (admin) => ({
    _id: admin._id,
    username: admin.username,
    superAdmin: Boolean(admin.superAdmin),
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
});
const isDuplicateEntry = (error) => typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ER_DUP_ENTRY";
const respondWithError = (res, error, action) => {
    if (isDuplicateEntry(error)) {
        return res.status(409).json({ error: "Username is already in use." });
    }
    console.error(`Failed to ${action}:`, error);
    return res.status(500).json({ error: `Failed to ${action}.` });
};
const validId = (id) => /^[0-9a-f]{24}$/i.test(id) ||
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
const getAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield (0, connectDB_1.queryRows)(`SELECT ${admin_model_1.adminFields} FROM admins WHERE id = ? LIMIT 1`, [id]);
    return rows[0];
});
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = (0, requestBody_1.getRequestBody)(req.body);
    if (!body ||
        typeof body.username !== "string" ||
        typeof body.password !== "string" ||
        !body.username.trim() ||
        !body.password) {
        return res
            .status(400)
            .json({ error: "Username and password are required." });
    }
    try {
        const admins = yield (0, connectDB_1.queryRows)(`SELECT ${admin_model_1.adminFields} FROM admins WHERE username = ? LIMIT 1`, [body.username.trim()]);
        const admin = admins[0];
        if (!admin || !(yield bcrypt_1.default.compare(body.password, admin.password))) {
            return res.status(401).json({ error: "Invalid username or password." });
        }
        const token = jsonwebtoken_1.default.sign({ sub: admin._id }, config_1.JWT_SECRET, { expiresIn: "8h" });
        return res.status(200).json({ token, admin: publicAdmin(admin) });
    }
    catch (error) {
        return respondWithError(res, error, "log in admin");
    }
});
exports.loginAdmin = loginAdmin;
const getAdminSetupStatus = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield (0, connectDB_1.queryRows)("SELECT COUNT(*) AS count FROM admins");
        return res.status(200).json({ needsSetup: Number(rows[0].count) === 0 });
    }
    catch (error) {
        return respondWithError(res, error, "check admin setup");
    }
});
exports.getAdminSetupStatus = getAdminSetupStatus;
const registerInitialSuperAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = (0, requestBody_1.getRequestBody)(req.body);
    if (!body ||
        typeof body.username !== "string" ||
        body.username.trim().length < usernameMinLength ||
        typeof body.password !== "string" ||
        body.password.length < passwordMinLength) {
        return res.status(400).json({
            error: "Username must be at least 6 characters and password at least 8 characters.",
        });
    }
    try {
        const admins = yield (0, connectDB_1.queryRows)(`SELECT ${admin_model_1.adminFields} FROM admins LIMIT 1`);
        if (admins.length > 0) {
            return res
                .status(409)
                .json({ error: "Admin setup is already complete." });
        }
        const id = (0, node_crypto_1.randomUUID)();
        const hashedPassword = yield bcrypt_1.default.hash(body.password, passwordSaltRounds);
        yield (0, connectDB_1.execute)(`INSERT INTO admins
        (id, username, password, super_admin, initial_super_admin)
       VALUES (?, ?, ?, TRUE, 1)`, [id, body.username.trim(), hashedPassword]);
        const admin = yield getAdmin(id);
        if (!admin)
            throw new Error("Initial admin insert could not be read.");
        const token = jsonwebtoken_1.default.sign({ sub: admin._id }, config_1.JWT_SECRET, {
            expiresIn: "8h",
        });
        return res.status(201).json({ token, admin: publicAdmin(admin) });
    }
    catch (error) {
        if (isDuplicateEntry(error)) {
            return res
                .status(409)
                .json({ error: "Admin setup is already complete." });
        }
        return respondWithError(res, error, "register initial super-admin");
    }
});
exports.registerInitialSuperAdmin = registerInitialSuperAdmin;
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = (0, requestBody_1.getRequestBody)(req.body);
    if (!body ||
        typeof body.username !== "string" ||
        body.username.trim().length < usernameMinLength ||
        typeof body.password !== "string" ||
        body.password.length < passwordMinLength ||
        typeof body.superAdmin !== "boolean") {
        return res.status(400).json({
            error: "Username (at least 6 characters), password (at least 8 characters), and superAdmin are required.",
        });
    }
    try {
        const id = (0, node_crypto_1.randomUUID)();
        yield (0, connectDB_1.execute)(`INSERT INTO admins (id, username, password, super_admin)
       VALUES (?, ?, ?, ?)`, [
            id,
            body.username.trim(),
            yield bcrypt_1.default.hash(body.password, passwordSaltRounds),
            body.superAdmin,
        ]);
        const admin = yield getAdmin(id);
        if (!admin)
            throw new Error("Admin insert could not be read.");
        return res.status(201).json(publicAdmin(admin));
    }
    catch (error) {
        return respondWithError(res, error, "create admin");
    }
});
exports.createAdmin = createAdmin;
const getAdmins = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield (0, connectDB_1.queryRows)(`SELECT ${admin_model_1.adminFields} FROM admins`);
        return res.status(200).json(admins.map(publicAdmin));
    }
    catch (error) {
        return respondWithError(res, error, "get admins");
    }
});
exports.getAdmins = getAdmins;
const getAdminById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, routeParams_1.getRouteId)(req);
    if (!id || !validId(id)) {
        return res.status(400).json({ error: "Invalid admin ID." });
    }
    try {
        const admin = yield getAdmin(id);
        if (!admin)
            return res.status(404).json({ error: "Admin not found." });
        return res.status(200).json(publicAdmin(admin));
    }
    catch (error) {
        return respondWithError(res, error, "get admin");
    }
});
exports.getAdminById = getAdminById;
const updateAdminById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, routeParams_1.getRouteId)(req);
    if (!id || !validId(id)) {
        return res.status(400).json({ error: "Invalid admin ID." });
    }
    const body = (0, requestBody_1.getRequestBody)(req.body);
    if (!body)
        return res.status(400).json({ error: "Invalid admin fields." });
    if ((body.username !== undefined &&
        (typeof body.username !== "string" ||
            body.username.trim().length < usernameMinLength)) ||
        (body.password !== undefined &&
            (typeof body.password !== "string" ||
                body.password.length < passwordMinLength)) ||
        (body.superAdmin !== undefined && typeof body.superAdmin !== "boolean")) {
        return res.status(400).json({ error: "Invalid admin fields." });
    }
    try {
        const admin = yield getAdmin(id);
        if (!admin)
            return res.status(404).json({ error: "Admin not found." });
        if (Boolean(admin.superAdmin) && body.superAdmin === false) {
            const count = yield (0, connectDB_1.queryRows)("SELECT COUNT(*) AS count FROM admins WHERE super_admin = TRUE");
            if (Number(count[0].count) <= 1) {
                return res
                    .status(409)
                    .json({ error: "Cannot demote the last super-admin." });
            }
        }
        const updates = [];
        if (typeof body.username === "string") {
            updates.push(["username", body.username.trim()]);
        }
        if (typeof body.password === "string") {
            updates.push([
                "password",
                yield bcrypt_1.default.hash(body.password, passwordSaltRounds),
            ]);
        }
        if (typeof body.superAdmin === "boolean") {
            updates.push(["super_admin", body.superAdmin]);
        }
        if (updates.length > 0) {
            yield (0, connectDB_1.execute)(`UPDATE admins SET ${updates.map(([column]) => `${column} = ?`).join(", ")} WHERE id = ?`, [...updates.map(([, value]) => value), id]);
        }
        const updatedAdmin = yield getAdmin(id);
        if (!updatedAdmin)
            return res.status(404).json({ error: "Admin not found." });
        return res.status(200).json(publicAdmin(updatedAdmin));
    }
    catch (error) {
        return respondWithError(res, error, "update admin");
    }
});
exports.updateAdminById = updateAdminById;
const deleteAdminById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, routeParams_1.getRouteId)(req);
    if (!id || !validId(id)) {
        return res.status(400).json({ error: "Invalid admin ID." });
    }
    try {
        const admin = yield getAdmin(id);
        if (!admin)
            return res.status(404).json({ error: "Admin not found." });
        if (Boolean(admin.superAdmin)) {
            const count = yield (0, connectDB_1.queryRows)("SELECT COUNT(*) AS count FROM admins WHERE super_admin = TRUE");
            if (Number(count[0].count) <= 1) {
                return res
                    .status(409)
                    .json({ error: "Cannot delete the last super-admin." });
            }
        }
        yield (0, connectDB_1.execute)("DELETE FROM admins WHERE id = ?", [id]);
        return res.status(200).json({ message: "Admin deleted successfully." });
    }
    catch (error) {
        return respondWithError(res, error, "delete admin");
    }
});
exports.deleteAdminById = deleteAdminById;
