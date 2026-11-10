import { Router, IRouter } from "express";
import { requireAdmin } from "../../middleware/adminAuth";
const multer = require("multer");
const path = require("path");
const fs = require("fs");
import sharp from "sharp";

export const uploadDir = path.resolve(__dirname, "../../uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 },
});

const uploadRoutes: IRouter = Router();

uploadRoutes.post(
  "/",
  requireAdmin,
  upload.single("image_input"),
  async (req, res) => {
    const file = (
      req as typeof req & {
        file?: {
          originalname: string;
          filename: string;
          path: string;
          size: number;
        };
      }
    ).file;

    let tempPath: string | undefined;

    try {
      if (!file) {
        return res
          .status(400)
          .json({ error: "Please select an image to upload." });
      }

      if (file.size > MAX_IMAGE_SIZE) {
        const metadata = await sharp(file.path).metadata();

        if (!metadata.width || !metadata.height) {
          throw new Error("Unable to read image dimensions.");
        }

        tempPath = `${file.path}.optimized.webp`;
        let quality = 80;
        let scale = 1;
        let optimizedSize = Infinity;

        for (let attempt = 0; attempt < 30; attempt++) {
          const result = await sharp(file.path)
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
          if (optimizedSize <= MAX_IMAGE_SIZE) break;

          if (quality > 40) {
            quality -= 10;
          } else {
            scale *= 0.8;
            quality = 80;
          }
        }

        if (optimizedSize > MAX_IMAGE_SIZE) {
          await fs.promises.unlink(tempPath).catch(() => undefined);
          tempPath = undefined;
          await fs.promises.unlink(file.path).catch(() => undefined);

          return res
            .status(413)
            .json({ error: "Image could not be compressed to 5 MB or less." });
        }

        const optimizedFilename = `${path.parse(file.filename).name}.webp`;
        const optimizedPath = path.join(uploadDir, optimizedFilename);

        await fs.promises.rename(tempPath, optimizedPath);
        tempPath = undefined;
        await fs.promises.unlink(file.path);

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
    } catch (error) {
      if (tempPath) {
        await fs.promises.unlink(tempPath).catch(() => undefined);
      }

      return res.status(500).json({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
);

export default uploadRoutes;
