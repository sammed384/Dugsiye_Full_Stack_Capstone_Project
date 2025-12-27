import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Dugsiye_NodeJs_Exercises_Uploads",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
  },
});

export const upload = multer({ storage });
