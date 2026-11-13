"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const upload_routes_1 = __importStar(require("./routes/upload.routes"));
const test_routes_1 = __importDefault(require("./routes/test.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const socialmedia_routes_1 = __importDefault(require("./routes/socialmedia.routes"));
// Define The Main Route
const mainRoutes = (0, express_1.Router)();
mainRoutes.use("/uploads", express_1.default.static(upload_routes_1.uploadDir));
mainRoutes.use("/upload", upload_routes_1.default);
mainRoutes.use("/products", product_routes_1.default);
mainRoutes.use("/tests", test_routes_1.default);
mainRoutes.use("/admins", admin_routes_1.default);
mainRoutes.use("/social", socialmedia_routes_1.default);
mainRoutes.post("/", (req, res) => {
    try {
        res.json(req.body);
    }
    catch (error) {
        res.send(error);
    }
});
exports.default = mainRoutes;
