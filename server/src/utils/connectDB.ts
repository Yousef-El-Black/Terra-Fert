import mysql, {
  type Pool,
  type ResultSetHeader,
  type RowDataPacket,
} from "mysql2/promise";
import {
  MYSQL_DATABASE,
  MYSQL_HOST,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  MYSQL_USER,
} from "../config";

export type SqlValue = string | number | boolean | Date | Buffer | null;

export const db: Pool = mysql.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "Z",
});

export const queryRows = async <T extends RowDataPacket>(
  sql: string,
  values: SqlValue[] = [],
): Promise<T[]> => {
  const [rows] = await db.execute<T[]>(sql, values);
  return rows;
};

export const execute = async (
  sql: string,
  values: SqlValue[] = [],
): Promise<ResultSetHeader> => {
  const [result] = await db.execute<ResultSetHeader>(sql, values);
  return result;
};

const schema = [
  `CREATE TABLE IF NOT EXISTS admins (
    id CHAR(36) NOT NULL PRIMARY KEY,
    username VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    super_admin BOOLEAN NOT NULL,
    initial_super_admin TINYINT NULL DEFAULT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE KEY unique_initial_super_admin (initial_super_admin)
  ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS products (
    id CHAR(36) NOT NULL PRIMARY KEY,
    images JSON NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'متوفر',
    description TEXT NOT NULL,
    unit VARCHAR(100) NOT NULL,
    rating JSON NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
  ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS tests (
    id CHAR(36) NOT NULL PRIMARY KEY,
    images JSON NOT NULL,
    product_id VARCHAR(36) NULL,
    title VARCHAR(255) NOT NULL DEFAULT '',
    text LONGTEXT NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX tests_product_id_idx (product_id)
  ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS social_media (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    link TEXT NOT NULL,
    platform ENUM('whatsapp', 'facebook', 'instagram', 'website', 'email', 'phone', 'address', 'other') NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX social_media_active_name_idx (active, name),
    INDEX social_media_created_at_idx (created_at)
  ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
];

export const connectDB = async (): Promise<void> => {
  try {
    for (const statement of schema) {
      await db.query(statement);
    }
    await db.query("SELECT 1");
    console.log(`Connected to MySQL database "${MYSQL_DATABASE}"`);
  } catch (error) {
    console.error("Failed to connect to MySQL database:", error);
    throw error;
  }
};
