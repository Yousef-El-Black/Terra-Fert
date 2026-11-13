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
exports.upload = exports.fileFilter = exports.storage = exports.uploadDir = void 0;
const express_1 = require("express");
const adminAuth_1 = require("../../middleware/adminAuth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp_1 = __importDefault(require("sharp"));
exports.uploadDir = process.env.VERCEL
    ? path.join("/tmp", "terrafert-uploads")
    : path.resolve(__dirname, "../../uploads");
fs.mkdirSync(exports.uploadDir, { recursive: true });
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
exports.storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, exports.uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image files are allowed!"), false);
    }
};
exports.fileFilter = fileFilter;
exports.upload = multer({
    storage: exports.storage,
    fileFilter: exports.fileFilter,
    limits: { fileSize: 25 * 1024 * 1024 },
});
const uploadRoutes = (0, express_1.Router)();
uploadRoutes.post("/", adminAuth_1.requireAdmin, exports.upload.single("image_input"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    let tempPath;
    try {
        if (!file) {
            return res
                .status(400)
                .json({ error: "Please select an image to upload." });
        }
        if (file.size > MAX_IMAGE_SIZE) {
            const metadata = yield (0, sharp_1.default)(file.path).metadata();
            if (!metadata.width || !metadata.height) {
                throw new Error("Unable to read image dimensions.");
            }
            tempPath = `${file.path}.optimized.webp`;
            let quality = 80;
            let scale = 1;
            let optimizedSize = Infinity;
            for (let attempt = 0; attempt < 30; attempt++) {
                const result = yield (0, sharp_1.default)(file.path)
                    .rotate()
                    .resize({
                    width: Math.max(1, Math.round(metadata.width * scale)),
                    height: Math.max(1, Math.round(metadata.height * scale)),
                    fit: "inside",
                    withoutEnlargement: true,
                })
                    .webp({ quality, effort: 5 })
                    .toFile(tempPath);
                optimizedSize = result.size;
                if (optimizedSize <= MAX_IMAGE_SIZE)
                    break;
                if (quality > 40) {
                    quality -= 10;
                }
                else {
                    scale *= 0.8;
                    quality = 80;
                }
            }
            if (optimizedSize > MAX_IMAGE_SIZE) {
                yield fs.promises.unlink(tempPath).catch(() => undefined);
                tempPath = undefined;
                yield fs.promises.unlink(file.path).catch(() => undefined);
                return res
                    .status(413)
                    .json({ error: "Image could not be compressed to 5 MB or less." });
            }
            const optimizedFilename = `${path.parse(file.filename).name}.webp`;
            const optimizedPath = path.join(exports.uploadDir, optimizedFilename);
            yield fs.promises.rename(tempPath, optimizedPath);
            tempPath = undefined;
            yield fs.promises.unlink(file.path);
            file.filename = optimizedFilename;
            file.path = optimizedPath;
            file.size = optimizedSize;
        }
        return res.status(200).json({
            message: "Image uploaded successfully!",
            fileInfo: {
                originalName: file.originalname,
                filename: file.filename,
                path: `/api/uploads/${file.filename}`,
                size: file.size,
            },
        });
    }
    catch (error) {
        if (tempPath) {
            yield fs.promises.unlink(tempPath).catch(() => undefined);
        }
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
        });
    }
}));
exports.default = uploadRoutes;
