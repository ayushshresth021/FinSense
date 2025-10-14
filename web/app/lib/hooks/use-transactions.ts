import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '../api';
import { CreateTransactionRequest, Transaction } from '@/types';

export const useTransactions = (params?: {
  startDate?: string;
  endDate?: string;
  type?: 'income' | 'expense';
  category?: string;
}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions', params],
    queryFn: () => transactionsApi.getAll(params),
    select: (data) =>
      data.transactions
        .slice()
        .sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ),
  });

  const addMutation = useMutation({
    mutationFn: (data: CreateTransactionRequest) => transactionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['spending-chart'] });
      queryClient.invalidateQueries({ queryKey: ['category-chart'] });
      queryClient.invalidateQueries({ queryKey: ['spending-calendar'] });
      queryClient.invalidateQueries({ queryKey: ['spending-summary'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTransactionRequest> }) => transactionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['spending-chart'] });
      queryClient.invalidateQueries({ queryKey: ['category-chart'] });
      queryClient.invalidateQueries({ queryKey: ['spending-calendar'] });
      queryClient.invalidateQueries({ queryKey: ['spending-summary'] });
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['spending-chart'] });
      queryClient.invalidateQueries({ queryKey: ['category-chart'] });
      queryClient.invalidateQueries({ queryKey: ['spending-calendar'] });
      queryClient.invalidateQueries({ queryKey: ['spending-summary'] });
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });

  return {
    transactions: data ?? [],
    isLoading,
    error: error?.message ?? null,
    addTransaction: addMutation.mutateAsync,
    updateTransaction: (id: string, data: Partial<CreateTransactionRequest>) => updateMutation.mutateAsync({ id, data }),
    deleteTransaction: deleteMutation.mutateAsync,
  };
};