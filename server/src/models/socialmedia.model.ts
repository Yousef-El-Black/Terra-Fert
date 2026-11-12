import type { RowDataPacket } from "mysql2";

export interface SocialMediaRow extends RowDataPacket {
  _id: string;
  name: string;
  link: string;
  platform: string | null;
  active: boolean | number;
  createdAt: Date;
  updatedAt: Date;
}

export const socialMediaFields = `
  id AS _id,
  name,
  link,
  platform,
  active,
  created_at AS createdAt,
  updated_at AS updatedAt
`;
