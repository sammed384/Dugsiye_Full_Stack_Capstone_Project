import React from "react";
import StatCard from "./StatCard";

const CardStatus = ({ summary, formatCurrency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Income"
        value={formatCurrency(summary?.income?.total)}
        icon="💰"
        className="border-l-4 border-l-emerald-500"
      />
      <StatCard
        title="Expenses"
        value={formatCurrency(Math.abs(summary?.expense?.total || 0))}
        icon="💸"
        className="border-l-4 border-l-red-500"
      />
      <StatCard
        title="My Balance"
        value={formatCurrency(summary?.balance)}
        icon={summary?.balance >= 0 ? "📈" : "📉"}
        className={`border-l-4 ${
          summary?.balance >= 0 ? "border-l-blue-500" : "border-l-orange-500"
        }`}
      />
    </div>
  );
};

export default CardStatus;
