import React from "react";

const MonthlyStatistics = ({ summary }) => {
  return (
    <div className="mt-6 p-4 bg-muted rounded-lg">
      <h4 className="font-medium mb-2">Monthly Statistics</h4>
      <div className="space-y-1 text-sm text-muted-foreground">
        <p>
          📊 Income transactions: {summary?.income?.categories?.length || 0}{" "}
          categories
        </p>
        <p>
          📊 Expense transactions: {summary?.expense?.categories?.length || 0}{" "}
          categories
        </p>
      </div>
    </div>
  );
};

export default MonthlyStatistics;
