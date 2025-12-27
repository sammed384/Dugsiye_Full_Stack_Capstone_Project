import express from "express";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validateZod.js";
import { transactionValidationSchema } from "../schemas/transactionSchema.js";
import {
  createTransaction,
  deleteTransaction,
  getMyTransactions,
  getMonthlySummary,
  updateTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions for the logged-in user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   type:
 *                     type: string
 *                     enum: [income, expense]
 *                   category:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 */
router.get("/", getMyTransactions);

/**
 * @swagger
 * /api/transactions/monthly-summary:
 *   get:
 *     summary: Get monthly summary of income and expenses by category
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month number (1-12). Defaults to current month.
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year. Defaults to current year.
 *     responses:
 *       200:
 *         description: Monthly summary with totals per category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 month:
 *                   type: integer
 *                 year:
 *                   type: integer
 *                 income:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     categories:
 *                       type: array
 *                 expense:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     categories:
 *                       type: array
 *                 balance:
 *                   type: number
 */
router.get("/monthly-summary", getMonthlySummary);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - amount
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Groceries"
 *               amount:
 *                 type: number
 *                 example: -50
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: "expense"
 *               category:
 *                 type: string
 *                 enum: [food, transportation, health, education, entertainment, other]
 *                 example: "food"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-27"
 *     responses:
 *       201:
 *         description: Transaction created
 */
router.post("/", validate(transactionValidationSchema), createTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Transaction ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Transaction updated
 *       404:
 *         description: Transaction not found
 */
router.put("/:id", validate(transactionValidationSchema), updateTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Delete a transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Transaction ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction deleted
 *       404:
 *         description: Transaction not found
 */
router.delete("/:id", deleteTransaction);

export default router;
