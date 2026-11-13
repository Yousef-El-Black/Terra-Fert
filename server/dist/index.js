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
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const api_1 = __importDefault(require("./api"));
const cors_1 = __importDefault(require("cors"));
const connectDB_1 = require("./utils/connectDB");
// Define App
const app = (0, express_1.default)();
// Using CORS
app.use((0, cors_1.default)());
// Define Port
const port = config_1.PORT || 3000;
// Parse JSON to Read Data from FrontEnd
app.use(express_1.default.json());
// API Routes
app.use("/api", api_1.default);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connectDB_1.connectDB)();
    app.listen(port, () => {
        console.log("App is Listening on Port : " + port);
    });
});
void start().catch((error) => {
    console.error("Failed to start server:", error);
    process.exitCode = 1;
});
