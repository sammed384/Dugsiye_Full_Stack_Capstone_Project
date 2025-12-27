import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./apiClient";

// Query Keys
export const transactionKeys = {
  all: ["transactions"],
  list: () => [...transactionKeys.all, "list"],
  monthlySummary: (month, year) => [
    ...transactionKeys.all,
    "monthly-summary",
    month,
    year,
  ],
};

/**
 * Hook to fetch all transactions for the current user
 */
export const useTransactions = () => {
  return useQuery({
    queryKey: transactionKeys.list(),
    queryFn: async () => {
      const response = await api.get("/transactions");
      return response.data;
    },
  });
};

/**
 * Hook to fetch monthly summary
 * @param {number} month - Month (1-12)
 * @param {number} year - Year
 */
export const useMonthlySummary = (month, year) => {
  return useQuery({
    queryKey: transactionKeys.monthlySummary(month, year),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (month) params.append("month", month);
      if (year) params.append("year", year);
      const response = await api.get(`/transactions/monthly-summary?${params}`);
      return response.data;
    },
  });
};

/**
 * Hook to create a new transaction
 */
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction) => {
      const response = await api.post("/transactions", transaction);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch transactions list
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
};

/**
 * Hook to update a transaction
 */
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...transaction }) => {
      const response = await api.put(`/transactions/${id}`, transaction);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
};

/**
 * Hook to delete a transaction
 */
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
};
