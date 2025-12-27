import express from "express";

const router = express.Router();

// Predefined categories for the finance tracker
const CATEGORIES = [
  {
    id: "food",
    name: "Food",
    icon: "🍔",
    description: "Groceries, restaurants, takeout",
  },
  {
    id: "transportation",
    name: "Transportation",
    icon: "🚗",
    description: "Gas, public transit, Uber/Lyft",
  },
  {
    id: "health",
    name: "Health",
    icon: "🏥",
    description: "Medical bills, pharmacy, gym",
  },
  {
    id: "education",
    name: "Education",
    icon: "📚",
    description: "Courses, books, tuition",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "🎬",
    description: "Movies, games, streaming",
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: "🛍️",
    description: "Clothing, electronics, household",
  },
  {
    id: "utilities",
    name: "Utilities",
    icon: "💡",
    description: "Electricity, water, internet",
  },
  {
    id: "housing",
    name: "Housing",
    icon: "🏠",
    description: "Rent, mortgage, maintenance",
  },
  {
    id: "salary",
    name: "Salary",
    icon: "💵",
    description: "Monthly income from work",
  },
  {
    id: "freelance",
    name: "Freelance",
    icon: "💻",
    description: "Side gig income",
  },
  {
    id: "investment",
    name: "Investment",
    icon: "📈",
    description: "Stocks, dividends, interest",
  },
  {
    id: "other",
    name: "Other",
    icon: "📦",
    description: "Miscellaneous transactions",
  },
];

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get list of predefined transaction categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of available categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "food"
 *                   name:
 *                     type: string
 *                     example: "Food"
 *                   icon:
 *                     type: string
 *                     example: "🍔"
 *                   description:
 *                     type: string
 *                     example: "Groceries, restaurants, takeout"
 */
router.get("/", (req, res) => {
  res.json(CATEGORIES);
});

export default router;
