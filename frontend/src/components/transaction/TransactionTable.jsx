import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

/**
 * Transaction table component
 * @param {Array} transactions - List of transactions
 * @param {Function} onEdit - Edit callback
 * @param {Function} onDelete - Delete callback
 * @param {boolean} isLoading - Loading state
 */
const TransactionTable = ({
  transactions = [],
  onEdit,
  onDelete,
  isLoading,
}) => {
  // Category icons mapping
  const categoryIcons = {
    food: "🍔",
    transportation: "🚗",
    health: "🏥",
    education: "📚",
    entertainment: "🎬",
    shopping: "🛍️",
    utilities: "💡",
    housing: "🏠",
    salary: "💵",
    freelance: "💻",
    investment: "📈",
    other: "📦",
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        Loading transactions...
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <p className="text-lg mb-2">📭 No transactions</p>
        <p className="text-sm">Create your first transaction to get started</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction._id} className="hover:bg-muted/30">
              <TableCell className="font-medium text-muted-foreground">
                {formatDate(transaction.date)}
              </TableCell>
              <TableCell className="font-medium">{transaction.title}</TableCell>
              <TableCell>
                <span className="flex items-center gap-2">
                  <span>{categoryIcons[transaction.category] || "📦"}</span>
                  <span className="capitalize">{transaction.category}</span>
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    transaction.type === "income" ? "default" : "destructive"
                  }
                  className={
                    transaction.type === "income"
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : ""
                  }
                >
                  {transaction.type === "income" ? "Income" : "Expense"}
                </Badge>
              </TableCell>
              <TableCell
                className={`text-right font-semibold ${
                  transaction.type === "income"
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(Math.abs(transaction.amount))}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(transaction)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(transaction._id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
