"use strict";
import multer from "multer";
import fs from "fs";
import path from "path";

// absolute path for uploads
const uploadPath = path.join(process.cwd(), "uploads");

// make sure uploads directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
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
    cb(new Error("Only .mp4 videos allowed"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;
