import videoFiles from "../models/videoFiles.js";

export const uploadVideo = async (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "Upload a valid video file." });
  }

  try {
    const file = new videoFiles({
      videoTitle: req.body.title,
      fileName: req.file.originalname,
      filePath: req.file.path,           // Cloudinary URL
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      videoChanel: req.body.chanel,
      Uploder: req.body.Uploder,
    });

    await file.save();
    res.status(200).json({ message: "Video uploaded successfully", video: file });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllvideos = async (req, res) => {
  try {
    const files = await videoFiles.find();
    res.status(200).send(files);
  } catch (error) {
    res.status(404).send(error.message);
  }
};
