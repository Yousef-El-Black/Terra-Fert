import { randomUUID } from "node:crypto";
import { Request, Response } from "express";
import {
  ProductRating,
  ProductRow,
  productFields,
} from "../models/product.model";
import { execute, queryRows } from "../utils/connectDB";
import { getRequestBody } from "../utils/requestBody";
import { getRouteId } from "../utils/routeParams";

const availableStatuses = ["متوفر", "غير متوفر"];

const decodeJson = <T>(value: T | string): T => {
  if (typeof value !== "string") return value;
  return JSON.parse(value) as T;
};

const serializeProduct = (product: ProductRow) => ({
  ...product,
  images: decodeJson<string[]>(product.images),
  rating: decodeJson<ProductRating[]>(product.rating),
});

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isValidRating = (value: unknown): value is Array<{
  name: string;
  comment: string;
  rate: number;
}> =>
  Array.isArray(value) &&
  value.every(
    (rating) =>
      typeof rating === "object" &&
      rating !== null &&
      typeof rating.name === "string" &&
      typeof rating.comment === "string" &&
      typeof rating.rate === "number" &&
      rating.rate >= 1 &&
      rating.rate <= 5,
  );

const validId = (id: string) =>
  /^[0-9a-f]{24}$/i.test(id) ||
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );

const getProduct = async (id: string) => {
  const rows = await queryRows<ProductRow>(
    `SELECT ${productFields} FROM products WHERE id = ? LIMIT 1`,
    [id],
  );
  return rows[0];
};

export const createProduct = async (req: Request, res: Response) => {
  const body = getRequestBody(req.body);
  if (
    !body ||
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
        !availableStatuses.includes(body.status)))
  ) {
    return res.status(400).json({ error: "Invalid product fields." });
  }

  const images = (body.images as string[] | undefined) ?? [];
  const rating = (body.rating as Array<{
    name: string;
    comment: string;
    rate: number;
  }> | undefined) ?? [];
  const description =
    typeof body.description === "string" ? body.description : "";
  const status =
    typeof body.status === "string" ? body.status : availableStatuses[0];
  const id = randomUUID();

  try {
    await execute(
      `INSERT INTO products
        (id, images, title, category, status, description, unit, rating)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        JSON.stringify(images),
        body.title,
        body.category,
        status,
        description,
        body.unit,
        JSON.stringify(rating),
      ],
    );
    const product = await getProduct(id);
    return res.status(201).json(product && serializeProduct(product));
  } catch (error) {
    console.error("Failed to create product:", error);
    return res.status(500).json({ error: "Failed to create product." });
  }
};

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await queryRows<ProductRow>(
      `SELECT ${productFields} FROM products`,
    );
    return res.status(200).json(products.map(serializeProduct));
  } catch (error) {
    console.error("Failed to get products:", error);
    return res.status(500).json({ error: "Failed to get products." });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const id = getRouteId(req);
  if (!id || !validId(id)) {
    return res.status(400).json({ error: "Invalid product ID." });
  }

  try {
    const product = await getProduct(id);
    return res.status(200).json(product ? serializeProduct(product) : null);
  } catch (error) {
    console.error("Failed to get product:", error);
    return res.status(500).json({ error: "Failed to get product." });
  }
};

export const countProducts = async (_req: Request, res: Response) => {
  try {
    const rows = await queryRows<{ count: number } & ProductRow>(
      "SELECT COUNT(*) AS count FROM products",
    );
    return res.status(200).json(Number(rows[0].count));
  } catch (error) {
    console.error("Failed to count products:", error);
    return res.status(500).json({ error: "Failed to count products." });
  }
};

export const deleteProductById = async (req: Request, res: Response) => {
  const id = getRouteId(req);
  if (!id || !validId(id)) {
    return res.status(400).json({ error: "Invalid product ID." });
  }

  try {
    const result = await execute("DELETE FROM products WHERE id = ?", [
      id,
    ]);
    return res
      .status(200)
      .json({ acknowledged: true, deletedCount: result.affectedRows });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return res.status(500).json({ error: "Failed to delete product." });
  }
};

export const updateProductById = async (req: Request, res: Response) => {
  const id = getRouteId(req);
  if (!id || !validId(id)) {
    return res.status(400).json({ error: "Invalid product ID." });
  }

  const body = getRequestBody(req.body);
  if (!body) return res.status(400).json({ error: "Invalid product fields." });
  const updates: Array<[string, string]> = [];
  const addString = (key: string, column: string, allowEmpty = true) => {
    if (body[key] === undefined) return true;
    if (typeof body[key] !== "string" || (!allowEmpty && !body[key])) {
      return false;
    }
    updates.push([column, body[key] as string]);
    return true;
  };

  if (
    !addString("title", "title", false) ||
    !addString("category", "category", false) ||
    !addString("description", "description") ||
    !addString("unit", "unit", false) ||
    (body.status !== undefined &&
      (typeof body.status !== "string" ||
        !availableStatuses.includes(body.status))) ||
    (body.images !== undefined && !isStringArray(body.images)) ||
    (body.rating !== undefined && !isValidRating(body.rating))
  ) {
    return res.status(400).json({ error: "Invalid product fields." });
  }
  if (body.status !== undefined) updates.push(["status", body.status as string]);
  if (body.images !== undefined) {
    updates.push(["images", JSON.stringify(body.images)]);
  }
  if (body.rating !== undefined) {
    updates.push(["rating", JSON.stringify(body.rating)]);
  }

  try {
    const existing = await getProduct(id);
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

    const result = await execute(
      `UPDATE products SET ${updates.map(([column]) => `${column} = ?`).join(", ")} WHERE id = ?`,
      [...updates.map(([, value]) => value), id],
    );
    return res.status(200).json({
      acknowledged: true,
      modifiedCount: result.changedRows,
      matchedCount: result.affectedRows,
    });
  } catch (error) {
    console.error("Failed to update product:", error);
    return res.status(500).json({ error: "Failed to update product." });
  }
};
