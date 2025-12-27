import express from "express";
import { upload } from "../middlewares/upload.js";
import { uploadFile } from "../controllers/uploadController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/upload/profile-picture:
 *   post:
 *     summary: Upload a profile picture
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpg, jpeg, png)
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 fileUrl:
 *                   type: string
 *       400:
 *         description: No file uploaded
 */
router.post("/profile-picture", protect, upload.single("file"), uploadFile);

export default router;
