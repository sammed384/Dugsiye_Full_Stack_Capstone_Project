import express from "express";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import User from "../models/user.js";
import Transaction from "../models/transactions.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/overview:
 *   get:
 *     summary: Get admin overview with statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin statistics overview
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                 totalTransactions:
 *                   type: integer
 *                 topSpendingCategories:
 *                   type: array
 *                 recentUsers:
 *                   type: array
 *       403:
 *         description: Access denied - Admin only
 */
router.get("/overview", protect, authorize("admin"), async (req, res, next) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get total transactions count
    const totalTransactions = await Transaction.countDocuments();

    // Get top spending categories (expenses)
    const topSpendingCategories = await Transaction.aggregate([
      { $match: { type: "expense" } },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: { $abs: "$amount" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
    ]);

    // Get recent users (last 5)
    const recentUsers = await User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get income vs expense summary
    const financialSummary = await Transaction.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalUsers,
      totalTransactions,
      topSpendingCategories,
      recentUsers,
      financialSummary,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
