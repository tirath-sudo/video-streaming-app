"use strict";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "my_videos", 
    resource_type: "video", 
    allowed_formats: ["mp4", "mov", "avi", "mkv"],
    public_id: (req, file) =>
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname,
  },
});

const upload = multer({ storage: storage });

export default upload;
