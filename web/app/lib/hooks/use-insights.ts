import { useQuery } from '@tanstack/react-query';
import { insightsApi } from '../api';
import { Insight } from '@/types';

export const useInsights = (params?: { startDate?: string; endDate?: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['insights', params],
    queryFn: () => insightsApi.generate(params),
    select: (data) => data.insights,
  });

  return {
    insights: data ?? [],
    isLoading,
    error: error?.message ?? null,
  };
};