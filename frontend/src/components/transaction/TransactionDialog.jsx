import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TransactionForm from "./TransactionForm";

/**
 * Transaction dialog wrapper component
 * @param {boolean} open - Dialog open state
 * @param {Function} onOpenChange - Open state change callback
 * @param {Object} transaction - Transaction data for editing (null for create)
 * @param {Function} onSubmit - Submit callback
 * @param {boolean} isSubmitting - Loading state
 */
const TransactionDialog = ({
  open,
  onOpenChange,
  transaction,
  onSubmit,
  isSubmitting,
}) => {
  const isEditing = !!transaction?._id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "✏️ Edit Transaction" : "➕ New Transaction"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modify the transaction details below."
              : "Fill in the details to create a new transaction."}
          </DialogDescription>
        </DialogHeader>
        <TransactionForm
          initialData={transaction}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
