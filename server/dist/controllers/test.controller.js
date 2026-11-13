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
exports.deleteTestById = exports.updateTestById = exports.getTestById = exports.getTests = exports.createTest = void 0;
const node_crypto_1 = require("node:crypto");
const test_model_1 = require("../models/test.model");
const connectDB_1 = require("../utils/connectDB");
const requestBody_1 = require("../utils/requestBody");
const routeParams_1 = require("../utils/routeParams");
const isStringArray = (value) => Array.isArray(value) && value.every((item) => typeof item === "string");
const validId = (id) => /^[0-9a-f]{24}$/i.test(id) ||
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
const getTest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield (0, connectDB_1.queryRows)(`SELECT ${test_model_1.testFields} FROM tests WHERE id = ? LIMIT 1`, [id]);
    return rows[0];
});
const serializeTest = (test) => (Object.assign(Object.assign({}, test), { images: typeof test.images === "string"
        ? JSON.parse(test.images)
        : test.images }));
const createTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const body = (0, requestBody_1.getRequestBody)(req.body);
    if (!body ||
        typeof body.title !== "string" ||
        !body.title ||
        typeof body.text !== "string" ||
        !body.text ||
        (body.images !== undefined && !isStringArray(body.images)) ||
        (body.productId !== undefined &&
            body.productId !== null &&
            body.productId !== "" &&
            (typeof body.productId !== "string" || !validId(body.productId)))) {
        return res.status(400).json({ error: "Invalid field trial fields." });
    }
    const id = (0, node_crypto_1.randomUUID)();
    const productId = typeof body.productId === "string" && body.productId
        ? body.productId
        : null;
    try {
        yield (0, connectDB_1.execute)("INSERT INTO tests (id, images, product_id, title, text) VALUES (?, ?, ?, ?, ?)", [
            id,
            JSON.stringify((_a = body.images) !== null && _a !== void 0 ? _a : []),
            productId,
            body.title,
            body.text,
        ]);
        const test = yield getTest(id);
        return res.status(201).json(test && serializeTest(test));
    }
    catch (error) {
        console.error("Failed to create field trial:", error);
        return res.status(500).json({ error: "Failed to create field trial." });
    }
});
exports.createTest = createTest;
const getTests = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tests = yield (0, connectDB_1.queryRows)(`SELECT ${test_model_1.testFields} FROM tests`);
        return res.status(200).json(tests.map(serializeTest));
    }
    catch (error) {
        console.error("Failed to get field trials:", error);
        return res.status(500).json({ error: "Failed to get field trials." });
    }
});
exports.getTests = getTests;
const getTestById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, routeParams_1.getRouteId)(req);
    if (!id || !validId(id)) {
        return res.status(400).json({ error: "Invalid field trial ID." });
    }
    try {
        const test = yield getTest(id);
        if (!test)
            return res.status(404).json({ error: "Test not found." });
        return res.status(200).json(serializeTest(test));
    }
    catch (error) {
        console.error("Failed to get field trial:", error);
        return res.status(500).json({ error: "Failed to get field trial." });
    }
});
exports.getTestById = getTestById;
const updateTestById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, routeParams_1.getRouteId)(req);
    if (!id || !validId(id)) {
        return res.status(400).json({ error: "Invalid field trial ID." });
    }
    const body = (0, requestBody_1.getRequestBody)(req.body);
    if (!body) {
        return res.status(400).json({ error: "Invalid field trial fields." });
    }
    const updates = [];
    if (body.title !== undefined) {
        if (typeof body.title !== "string" || !body.title) {
            return res.status(400).json({ error: "Invalid field trial fields." });
        }
        updates.push(["title", body.title]);
    }
    if (body.text !== undefined) {
        if (typeof body.text !== "string" || !body.text) {
            return res.status(400).json({ error: "Invalid field trial fields." });
        }
        updates.push(["text", body.text]);
    }
    if (body.productId !== undefined) {
        if (body.productId !== null &&
            body.productId !== "" &&
            (typeof body.productId !== "string" || !validId(body.productId))) {
            return res.status(400).json({ error: "Invalid field trial fields." });
        }
        updates.push([
            "product_id",
            typeof body.productId === "string" ? body.productId : "",
        ]);
    }
    if (body.images !== undefined) {
        if (!isStringArray(body.images)) {
            return res.status(400).json({ error: "Invalid field trial fields." });
        }
        updates.push(["images", JSON.stringify(body.images)]);
    }
    try {
        const existing = yield getTest(id);
        if (!existing)
            return res.status(404).json({ error: "Test not found." });
        if (updates.length > 0) {
            yield (0, connectDB_1.execute)(`UPDATE tests SET ${updates.map(([column]) => `${column} = ?`).join(", ")} WHERE id = ?`, [
                ...updates.map(([column, value]) => column === "product_id" && value === "" ? null : value),
                id,
            ]);
        }
        const updated = yield getTest(id);
        return res.status(200).json(updated && serializeTest(updated));
    }
    catch (error) {
        console.error("Failed to update field trial:", error);
        return res.status(500).json({ error: "Failed to update field trial." });
    }
});
exports.updateTestById = updateTestById;
const deleteTestById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, routeParams_1.getRouteId)(req);
    if (!id || !validId(id)) {
        return res.status(400).json({ error: "Invalid field trial ID." });
    }
    try {
        const result = yield (0, connectDB_1.execute)("DELETE FROM tests WHERE id = ?", [
            id,
        ]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Test not found." });
        }
        return res.status(200).json({ message: "Test deleted successfully." });
    }
    catch (error) {
        console.error("Failed to delete field trial:", error);
        return res.status(500).json({ error: "Failed to delete field trial." });
    }
});
exports.deleteTestById = deleteTestById;
