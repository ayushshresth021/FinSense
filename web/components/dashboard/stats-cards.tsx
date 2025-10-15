'use client';

import { useQuery } from '@tanstack/react-query';
import { insightsApi } from '../../app/lib/api';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

export function StatsCards() {
  const { data, isLoading } = useQuery({
    queryKey: ['spending-summary'],
    queryFn: async () => {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split('T')[0];
      const endDate = now.toISOString().split('T')[0];

      return insightsApi.getSummary({ startDate, endDate });
    },
  });

  const totalExpenses = data?.summary.totalExpenses ?? 0;
  const budget = 1000; // TODO: Fetch from user settings
  const remaining = budget - totalExpenses;
  const percentUsed = (totalExpenses / budget) * 100;

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card">
            <div className="skeleton h-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Total Spent */}
      <div className="card">
        <div className="flex items-start justify-between mb-1.5">
          <div>
            <p className="text-xs text-secondary">Spent This Month</p>
            <h3 className="text-2xl font-bold mt-1">
              ${totalExpenses.toFixed(2)}
            </h3>
          </div>
          <div className="w-9 h-9 bg-red-500/10 rounded-md flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-red-400" />
          </div>
        </div>
        <p className="text-[11px] text-secondary">
          {percentUsed.toFixed(0)}% of budget used
        </p>
      </div>

      {/* Budget */}
      <div className="card">
        <div className="flex items-start justify-between mb-1.5">
          <div>
            <p className="text-xs text-secondary">Monthly Budget</p>
            <h3 className="text-2xl font-bold mt-1">${budget.toFixed(2)}</h3>
          </div>
          <div className="w-9 h-9 bg-blue-500/10 rounded-md flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-[rgb(var(--color-bg-tertiary))] rounded-full h-1.5 mt-2">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all"
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Remaining */}
      <div className="card">
        <div className="flex items-start justify-between mb-1.5">
          <div>
            <p className="text-xs text-secondary">Remaining</p>
            <h3 className="text-2xl font-bold mt-1">
              ${remaining.toFixed(2)}
            </h3>
          </div>
          <div className="w-9 h-9 bg-green-500/10 rounded-md flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
        </div>
        <p className="text-[11px] text-secondary">
          {remaining > 0 ? 'On track' : 'Over budget'}
        </p>
      </div>
    </div>
  );
}