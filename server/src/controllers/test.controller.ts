import { randomUUID } from "node:crypto";
import { Request, Response } from "express";
import { TestRow, testFields } from "../models/test.model";
import { execute, queryRows, SqlValue } from "../utils/connectDB";
import { getRequestBody } from "../utils/requestBody";
import { getRouteId } from "../utils/routeParams";

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const validId = (id: string) =>
  /^[0-9a-f]{24}$/i.test(id) ||
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );

const getTest = async (id: string) => {
  const rows = await queryRows<TestRow>(
    `SELECT ${testFields} FROM tests WHERE id = ? LIMIT 1`,
    [id],
  );
  return rows[0];
};

const serializeTest = (test: TestRow) => ({
  ...test,
  images:
    typeof test.images === "string"
      ? (JSON.parse(test.images) as string[])
      : test.images,
});

export const createTest = async (req: Request, res: Response) => {
  const body = getRequestBody(req.body);
  if (
    !body ||
    typeof body.title !== "string" ||
    !body.title ||
    typeof body.text !== "string" ||
    !body.text ||
    (body.images !== undefined && !isStringArray(body.images)) ||
    (body.productId !== undefined &&
      body.productId !== null &&
      body.productId !== "" &&
      (typeof body.productId !== "string" || !validId(body.productId)))
  ) {
    return res.status(400).json({ error: "Invalid field trial fields." });
  }

  const id = randomUUID();
  const productId =
    typeof body.productId === "string" && body.productId
      ? body.productId
      : null;
  try {
    await execute(
      "INSERT INTO tests (id, images, product_id, title, text) VALUES (?, ?, ?, ?, ?)",
      [
        id,
        JSON.stringify((body.images as string[] | undefined) ?? []),
        productId,
        body.title,
        body.text,
      ],
    );
    const test = await getTest(id);
    return res.status(201).json(test && serializeTest(test));
  } catch (error) {
    console.error("Failed to create field trial:", error);
    return res.status(500).json({ error: "Failed to create field trial." });
  }
};

export const getTests = async (_req: Request, res: Response) => {
  try {
    const tests = await queryRows<TestRow>(`SELECT ${testFields} FROM tests`);
    return res.status(200).json(tests.map(serializeTest));
  } catch (error) {
    console.error("Failed to get field trials:", error);
    return res.status(500).json({ error: "Failed to get field trials." });
  }
};

export const getTestById = async (req: Request, res: Response) => {
  const id = getRouteId(req);
  if (!id || !validId(id)) {
    return res.status(400).json({ error: "Invalid field trial ID." });
  }

  try {
    const test = await getTest(id);
    if (!test) return res.status(404).json({ error: "Test not found." });
    return res.status(200).json(serializeTest(test));
  } catch (error) {
    console.error("Failed to get field trial:", error);
    return res.status(500).json({ error: "Failed to get field trial." });
  }
};

export const updateTestById = async (req: Request, res: Response) => {
  const id = getRouteId(req);
  if (!id || !validId(id)) {
    return res.status(400).json({ error: "Invalid field trial ID." });
  }

  const body = getRequestBody(req.body);
  if (!body) {
    return res.status(400).json({ error: "Invalid field trial fields." });
  }
  const updates: Array<[string, SqlValue]> = [];
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
    if (
      body.productId !== null &&
      body.productId !== "" &&
      (typeof body.productId !== "string" || !validId(body.productId))
    ) {
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
    const existing = await getTest(id);
    if (!existing) return res.status(404).json({ error: "Test not found." });
    if (updates.length > 0) {
      await execute(
        `UPDATE tests SET ${updates.map(([column]) => `${column} = ?`).join(", ")} WHERE id = ?`,
        [
          ...updates.map(([column, value]) =>
            column === "product_id" && value === "" ? null : value,
          ),
          id,
        ],
      );
    }
    const updated = await getTest(id);
    return res.status(200).json(updated && serializeTest(updated));
  } catch (error) {
    console.error("Failed to update field trial:", error);
    return res.status(500).json({ error: "Failed to update field trial." });
  }
};

export const deleteTestById = async (req: Request, res: Response) => {
  const id = getRouteId(req);
  if (!id || !validId(id)) {
    return res.status(400).json({ error: "Invalid field trial ID." });
  }

  try {
    const result = await execute("DELETE FROM tests WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Test not found." });
    }
    return res.status(200).json({ message: "Test deleted successfully." });
  } catch (error) {
    console.error("Failed to delete field trial:", error);
    return res.status(500).json({ error: "Failed to delete field trial." });
  }
};
