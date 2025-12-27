import { useQuery } from "@tanstack/react-query";
import api from "./apiClient";

// Query Keys
export const categoryKeys = {
  all: ["categories"],
  list: () => [...categoryKeys.all, "list"],
};

/**
 * Hook to fetch all available categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: async () => {
      const response = await api.get("/categories");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Categories rarely change, cache for 5 minutes
  });
};
