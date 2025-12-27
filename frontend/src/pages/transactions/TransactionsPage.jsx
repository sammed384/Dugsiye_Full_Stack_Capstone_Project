import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from "@/lib/api/transactionHooks";
import TransactionTable from "@/components/transaction/TransactionTable";
import TransactionDialog from "@/components/transaction/TransactionDialog";

const TransactionsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [defaultType, setDefaultType] = useState(null);

  // Fetch transactions
  const { data: transactions = [], isLoading, error } = useTransactions();

  // Mutations
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  // Handle URL params for quick actions
  useEffect(() => {
    const action = searchParams.get("action");
    const type = searchParams.get("type");

    if (action === "new") {
      setDefaultType(type || "expense");
      setEditingTransaction(null);
      setDialogOpen(true);
    }
  }, [searchParams]);

  // Handle create/update submit
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

  // Handle edit
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setDefaultType(null);
    setDialogOpen(true);
  };

  // Handle delete
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

  // Handle dialog close
  const handleDialogClose = (open) => {
    setDialogOpen(open);
    if (!open) {
      setEditingTransaction(null);
      setDefaultType(null);
      // Clean URL params
      if (searchParams.get("action")) {
        navigate("/transactions", { replace: true });
      }
    }
  };

  // Handle new transaction button
  const handleNewTransaction = () => {
    setEditingTransaction(null);
    setDefaultType(null);
    setDialogOpen(true);
  };

  // Prepare initial data for form (with default type from URL)
  const getInitialData = () => {
    if (editingTransaction) return editingTransaction;
    if (defaultType) return { type: defaultType };
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Transactions</h1>
              <p className="text-muted-foreground">
                Manage your income and expenses
              </p>
            </div>
          </div>
          <Button onClick={handleNewTransaction} className="gap-2">
            <Plus className="h-4 w-4" />
            New Transaction
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            Error loading data: {error.message}
          </div>
        ) : (
          <>
            {/* Stats summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
              <div className="bg-emerald-500/10 rounded-lg p-4">
                <p className="text-sm text-emerald-600">Income</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {transactions.filter((t) => t.type === "income").length}
                </p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-4">
                <p className="text-sm text-red-500">Expenses</p>
                <p className="text-2xl font-bold text-red-500">
                  {transactions.filter((t) => t.type === "expense").length}
                </p>
              </div>
            </div>

            {/* Transactions Table */}
            <TransactionTable
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          </>
        )}

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
      </main>
    </div>
  );
};

export default TransactionsPage;
