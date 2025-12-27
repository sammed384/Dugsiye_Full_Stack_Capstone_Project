import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["expense", "income"],
      default: "expense",
    },
    category: {
      type: String,
      enum: [
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
      ],
      default: "other",
    },
    date: { type: Date, default: Date.now },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
