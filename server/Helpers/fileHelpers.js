"use strict";
import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "video/mp4") {
    cb(null, true);
  } else {
    cb(new Error("Only .mp4 video files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
