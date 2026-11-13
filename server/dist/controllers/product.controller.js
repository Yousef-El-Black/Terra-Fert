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
exports.updateProductById = exports.deleteProductById = exports.countProducts = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const node_crypto_1 = require("node:crypto");
const product_model_1 = require("../models/product.model");
const connectDB_1 = require("../utils/connectDB");
const requestBody_1 = require("../utils/requestBody");
const routeParams_1 = require("../utils/routeParams");
const availableStatuses = ["متوفر", "غير متوفر"];
const decodeJson = (value) => {
    if (typeof value !== "string")
        return value;
    return JSON.parse(value);
};
const serializeProduct = (product) => (Object.assign(Object.assign({}, product), { images: decodeJson(product.images), rating: decodeJson(product.rating) }));
const isStringArray = (value) => Array.isArray(value) && value.every((item) => typeof item === "string");
const isValidRating = (value) => Array.isArray(value) &&
    value.every((rating) => typeof rating === "object" &&
        rating !== null &&
        typeof rating.name === "string" &&
        typeof rating.comment === "string" &&
        typeof rating.rate === "number" &&
        rating.rate >= 1 &&
        rating.rate <= 5);
const validId = (id) => /^[0-9a-f]{24}$/i.test(id) ||
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
const getProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield (0, connectDB_1.queryRows)(`SELECT ${product_model_1.productFields} FROM products WHERE id = ? LIMIT 1`, [id]);
    return rows[0];
});
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const body = (0, requestBody_1.getRequestBody)(req.body);
    if (!body ||
        typeof body.title !== "string" ||
        !body.title ||
        typeof body.category !== "string" ||
        !body.category ||
        typeof body.unit !== "string" ||
        !body.unit ||
        (body.images !== undefined && !isStringArray(body.images)) ||
        (body.rating !== undefined && !isValidRating(body.rating)) ||
        (body.status !== undefined &&
            (typeof body.status !== "string" ||
                !availableStatuses.includes(body.status)))) {
        return res.status(400).json({ error: "Invalid product fields." });
    }
    const images = (_a = body.images) !== null && _a !== void 0 ? _a : [];
    const rating = (_b = body.rating) !== null && _b !== void 0 ? _b : [];
    const description = typeof body.description === "string" ? body.description : "";
    const status = typeof body.status === "string" ? body.status : availableStatuses[0];
    const id = (0, node_crypto_1.randomUUID)();
    try {
        yield (0, connectDB_1.execute)(`INSERT INTO products
        (id, images, title, category, status, description, unit, rating)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            id,
            JSON.stringify(images),
            body.title,
            body.category,
            status,
            description,
            body.unit,
            JSON.stringify(rating),
        ]);
        const product = yield getProduct(id);
        return res.status(201).json(product && serializeProduct(product));
    }
    catch (error) {
        console.error("Failed to create product:", error);
        return res.status(500).json({ error: "Failed to create product." });
    }
});
exports.createProduct = createProduct;
const getProducts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, connectDB_1.queryRows)(`SELECT ${product_model_1.productFields} FROM products`);
        return res.status(200).json(products.map(serializeProduct));
    }
    catch (error) {
        console.error("Failed to get products:", error);
        return res.status(500).json({ error: "Failed to get products." });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, routeParams_1.getRouteId)(req);
    if (!id || !validId(id)) {
        return res.status(400).json({ error: "Invalid product ID." });
    }
    try {
        const product = yield getProduct(id);
        return res.status(200).json(product ? serializeProduct(product) : null);
    }
    catch (error) {
        console.error("Failed to get product:", error);
        return res.status(500).json({ error: "Failed to get product." });
    }
});
exports.getProductById = getProductById;
const countProducts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield (0, connectDB_1.queryRows)("SELECT COUNT(*) AS count FROM products");
        return res.status(200).json(Number(rows[0].count));
    }
    catch (error) {
        console.error("Failed to count products:", error);
        return res.status(500).json({ error: "Failed to count products." });
    }
});
exports.countProducts = countProducts;
const deleteProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, routeParams_1.getRouteId)(req);
    if (!id || !validId(id)) {
        return res.status(400).json({ error: "Invalid product ID." });
    }
    try {
        const result = yield (0, connectDB_1.execute)("DELETE FROM products WHERE id = ?", [
            id,
        ]);
        return res
            .status(200)
            .json({ acknowledged: true, deletedCount: result.affectedRows });
    }
    catch (error) {
        console.error("Failed to delete product:", error);
        return res.status(500).json({ error: "Failed to delete product." });
    }
});
exports.deleteProductById = deleteProductById;
const updateProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, routeParams_1.getRouteId)(req);
    if (!id || !validId(id)) {
        return res.status(400).json({ error: "Invalid product ID." });
    }
    const body = (0, requestBody_1.getRequestBody)(req.body);
    if (!body)
        return res.status(400).json({ error: "Invalid product fields." });
    const updates = [];
    const addString = (key, column, allowEmpty = true) => {
        if (body[key] === undefined)
            return true;
        if (typeof body[key] !== "string" || (!allowEmpty && !body[key])) {
            return false;
        }
        updates.push([column, body[key]]);
        return true;
    };
    if (!addString("title", "title", false) ||
        !addString("category", "category", false) ||
        !addString("description", "description") ||
        !addString("unit", "unit", false) ||
        (body.status !== undefined &&
            (typeof body.status !== "string" ||
                !availableStatuses.includes(body.status))) ||
        (body.images !== undefined && !isStringArray(body.images)) ||
        (body.rating !== undefined && !isValidRating(body.rating))) {
        return res.status(400).json({ error: "Invalid product fields." });
    }
    if (body.status !== undefined)
        updates.push(["status", body.status]);
    if (body.images !== undefined) {
        updates.push(["images", JSON.stringify(body.images)]);
    }
    if (body.rating !== undefined) {
        updates.push(["rating", JSON.stringify(body.rating)]);
    }
    try {
        const existing = yield getProduct(id);
        if (!existing) {
            return res.status(200).json({
                acknowledged: true,
                modifiedCount: 0,
                matchedCount: 0,
            });
        }
        if (updates.length === 0) {
            return res.status(200).json({
                acknowledged: true,
                modifiedCount: 0,
                matchedCount: 1,
            });
        }
        const result = yield (0, connectDB_1.execute)(`UPDATE products SET ${updates.map(([column]) => `${column} = ?`).join(", ")} WHERE id = ?`, [...updates.map(([, value]) => value), id]);
        return res.status(200).json({
            acknowledged: true,
            modifiedCount: result.changedRows,
            matchedCount: result.affectedRows,
        });
    }
    catch (error) {
        console.error("Failed to update product:", error);
        return res.status(500).json({ error: "Failed to update product." });
    }
});
exports.updateProductById = updateProductById;
