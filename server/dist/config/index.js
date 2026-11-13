"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.MYSQL_DATABASE = exports.MYSQL_PASSWORD = exports.MYSQL_USER = exports.MYSQL_PORT = exports.MYSQL_HOST = exports.PORT = void 0;
const node_path_1 = require("node:path");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: (0, node_path_1.resolve)(__dirname, "../../.env") });
const { PORT } = process.env;
exports.PORT = PORT;
const getRequiredVariable = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};
const MYSQL_HOST = getRequiredVariable("MYSQL_HOST");
exports.MYSQL_HOST = MYSQL_HOST;
const MYSQL_USER = getRequiredVariable("MYSQL_USER");
exports.MYSQL_USER = MYSQL_USER;
const MYSQL_DATABASE = getRequiredVariable("MYSQL_DATABASE");
exports.MYSQL_DATABASE = MYSQL_DATABASE;
const MYSQL_PASSWORD = (_a = process.env.MYSQL_PASSWORD) !== null && _a !== void 0 ? _a : "";
exports.MYSQL_PASSWORD = MYSQL_PASSWORD;
const MYSQL_PORT = Number(process.env.MYSQL_PORT || 3306);
exports.MYSQL_PORT = MYSQL_PORT;
if (!Number.isInteger(MYSQL_PORT) || MYSQL_PORT < 1 || MYSQL_PORT > 65535) {
    throw new Error("MYSQL_PORT must be a valid TCP port.");
}
const JWT_SECRET = getRequiredVariable("JWT_SECRET");
exports.JWT_SECRET = JWT_SECRET;
