import type { RowDataPacket } from "mysql2";

export interface TestRow extends RowDataPacket {
  _id: string;
  images: string[] | string;
  productId: string | null;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export const testFields = `
  id AS _id,
  images,
  product_id AS productId,
  title,
  text,
  created_at AS createdAt,
  updated_at AS updatedAt
`;
