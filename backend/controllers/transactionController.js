import Transaction from "../models/transactions.js";

export const createTransaction = async (req, res, next) => {
  try {
    const newTransaction = await Transaction.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(newTransaction);
  } catch (err) {
    next(err);
  }
};

export const getMyTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ createdBy: req.user._id });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

export const getMonthlySummary = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    const summary = await Transaction.aggregate([
      {
        $match: {
          createdBy: req.user._id,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { type: "$type", category: "$category" },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.type",
          categories: {
            $push: {
              category: "$_id.category",
              total: "$total",
              count: "$count",
            },
          },
          totalAmount: { $sum: "$total" },
        },
      },
    ]);

    console.log("DEBUG: Aggregation Result:", JSON.stringify(summary, null, 2));

    const result = {
      month: targetMonth + 1,
      year: targetYear,
      income: { total: 0, categories: [] },
      expense: { total: 0, categories: [] },
    };

    summary.forEach((item) => {
      const type = item._id ? item._id.toLowerCase() : "";
      if (type === "income") {
        result.income.total = item.totalAmount;
        result.income.categories = item.categories;
      } else if (type === "expense") {
        result.expense.total = item.totalAmount;
        result.expense.categories = item.categories;
      }
    });

    result.balance = result.income.total - Math.abs(result.expense.total);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!updatedTransaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.json(updatedTransaction);
  } catch (err) {
    next(err);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!deletedTransaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    next(err);
  }
};
