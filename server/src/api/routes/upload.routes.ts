import { Router, IRouter } from "express";
const multer = require("multer");
const path = require("path");
const fs = require("fs");

export const uploadDir = path.resolve(__dirname, "../../uploads");
fs.mkdirSync(uploadDir, { recursive: true });

// 1. Configure Multer Storage
export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename using the current timestamp + original name
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// 2. Filter files to ensure only images are allowed
export const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

const uploadRoutes: IRouter = Router();

uploadRoutes.post("/", upload.single("image_input"), (req, res) => {
  const file = (
    req as typeof req & {
      file?: { originalname: string; filename: string; size: number };
    }
  ).file;

  try {
    if (!file) {
      return res
        .status(400)
        .json({ error: "Please select an image to upload." });
    }

    // File successfully uploaded
    res.status(200).json({
      message: "Image uploaded successfully!",
      fileInfo: {
        originalName: file.originalname,
        filename: file.filename,
        path: `/api/uploads/${file.filename}`,
        size: file.size,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

export default uploadRoutes;
