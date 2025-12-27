import React from "react";
import { Button } from "@/components/ui/button";

const DashboardActions = ({ onNewTransaction }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        <Button
          size="lg"
          className="h-20 flex-col gap-2"
          onClick={() => onNewTransaction("income")}
        >
          <span className="text-2xl">➕</span>
          New Income
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-20 flex-col gap-2"
          onClick={() => onNewTransaction("expense")}
        >
          <span className="text-2xl">➖</span>
          New Expense
        </Button>
      </div>
    </div>
  );
};

export default DashboardActions;
