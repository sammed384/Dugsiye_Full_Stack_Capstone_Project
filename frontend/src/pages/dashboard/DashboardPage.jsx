import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useMonthlySummary,
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from "@/lib/api/transactionHooks";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import CardStatus from "../../components/dashboard/CardStatus";
import DashboardActions from "../../components/dashboard/DashboardActions";
import MonthlyStatistics from "../../components/dashboard/MonthlyStatistics";
import TransactionTable from "@/components/transaction/TransactionTable";
import TransactionDialog from "@/components/transaction/TransactionDialog";

const DashboardPage = () => {
  // Get current month and year
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentYear = now.getFullYear();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [defaultType, setDefaultType] = useState(null);

  // Fetch data
  const {
    data: summary,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useMonthlySummary(currentMonth, currentYear);

  const {
    data: transactions = [],
    isLoading: isTransactionsLoading,
    error: transactionsError,
  } = useTransactions();

  // Mutations
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Get month name
  const getMonthName = (month) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month - 1];
  };

  // Handlers
  const handleNewTransaction = (type) => {
    setEditingTransaction(null);
    setDefaultType(type);
    setDialogOpen(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setDefaultType(null);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return;
    }
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Transaction deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting transaction");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingTransaction) {
        await updateMutation.mutateAsync({
          id: editingTransaction._id,
          ...formData,
        });
        toast.success("Transaction updated successfully!");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Transaction created successfully!");
      }
      setDialogOpen(false);
      setEditingTransaction(null);
      setDefaultType(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  const handleDialogClose = (open) => {
    setDialogOpen(open);
    if (!open) {
      setEditingTransaction(null);
      setDefaultType(null);
    }
  };

  // Prepare initial data for form
  const getInitialData = () => {
    if (editingTransaction) return editingTransaction;
    if (defaultType) return { type: defaultType };
    return null;
  };

  if (isSummaryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Month indicator */}
        <div>
          <h2 className="text-xl font-semibold">
            📅 {getMonthName(currentMonth)} {currentYear}
          </h2>
          <p className="text-muted-foreground">Your financial summary</p>
        </div>

        {summaryError ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            Error loading summary: {summaryError.message}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <CardStatus summary={summary} formatCurrency={formatCurrency} />

            {/* Category Breakdown & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryBreakdown
                categories={summary?.expense?.categories || []}
                total={Math.abs(summary?.expense?.total || 0)}
              />

              <div className="space-y-4">
                <DashboardActions onNewTransaction={handleNewTransaction} />
                <MonthlyStatistics summary={summary} />
              </div>
            </div>

            {/* Transactions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <Link
                  to="/transactions"
                  className="text-sm text-primary hover:underline"
                >
                  View All
                </Link>
              </div>
              {transactionsError ? (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
                  Error loading transactions: {transactionsError.message}
                </div>
              ) : (
                <TransactionTable
                  transactions={transactions}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isLoading={isTransactionsLoading}
                />
              )}
            </div>
          </>
        )}
      </main>

      {/* Transaction Dialog */}
      <TransactionDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        transaction={getInitialData()}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Loading overlay for delete */}
      {deleteMutation.isPending && (
        <div className="fixed inset-0 bg-background/50 flex items-center justify-center z-50">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
