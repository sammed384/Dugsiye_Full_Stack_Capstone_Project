import { z } from "zod";

export const transactionValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number({ required_error: "Amount is required" }),
  type: z.enum(["expense", "income"]).optional(),
  category: z
    .enum([
      "food",
      "transportation",
      "health",
      "education",
      "entertainment",
      "shopping",
      "utilities",
      "housing",
      "salary",
      "freelance",
      "investment",
      "other",
    ])
    .optional(),
  date: z.string().optional(),
});
