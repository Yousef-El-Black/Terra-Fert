import type { RowDataPacket } from "mysql2";

export interface AdminRow extends RowDataPacket {
  _id: string;
  username: string;
  password: string;
  superAdmin: boolean | number;
  createdAt: Date;
  updatedAt: Date;
}

export const adminFields = `
  id AS _id,
  username,
  password,
  super_admin AS superAdmin,
  created_at AS createdAt,
  updated_at AS updatedAt
`;
