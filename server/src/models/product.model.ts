import type { RowDataPacket } from "mysql2";

export interface ProductRating {
  name: string;
  comment: string;
  rate: number;
}

export interface ProductRow extends RowDataPacket {
  _id: string;
  images: string[] | string;
  title: string;
  category: string;
  status: string;
  description: string;
  unit: string;
  rating: ProductRating[] | string;
  createdAt: Date;
  updatedAt: Date;
}

export const productFields = `
  id AS _id,
  images,
  title,
  category,
  status,
  description,
  unit,
  rating,
  created_at AS createdAt,
  updated_at AS updatedAt
`;
