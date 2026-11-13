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
exports.connectDB = exports.execute = exports.queryRows = exports.db = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const config_1 = require("../config");
exports.db = promise_1.default.createPool({
    host: config_1.MYSQL_HOST,
    port: config_1.MYSQL_PORT,
    user: config_1.MYSQL_USER,
    password: config_1.MYSQL_PASSWORD,
    database: config_1.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: "Z",
});
const queryRows = (sql_1, ...args_1) => __awaiter(void 0, [sql_1, ...args_1], void 0, function* (sql, values = []) {
    const [rows] = yield exports.db.execute(sql, values);
    return rows;
});
exports.queryRows = queryRows;
const execute = (sql_1, ...args_1) => __awaiter(void 0, [sql_1, ...args_1], void 0, function* (sql, values = []) {
    const [result] = yield exports.db.execute(sql, values);
    return result;
});
exports.execute = execute;
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
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const statement of schema) {
            yield exports.db.query(statement);
        }
        yield exports.db.query("SELECT 1");
        console.log(`Connected to MySQL database "${config_1.MYSQL_DATABASE}"`);
    }
    catch (error) {
        console.error("Failed to connect to MySQL database:", error);
        throw error;
    }
});
exports.connectDB = connectDB;
