'use client';

import { useQuery } from '@tanstack/react-query';
import { insightsApi } from '../../app/lib/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Linden_Hill } from 'next/font/google';

export function SpendingChart() {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['spending-chart'],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);

      const response = await insightsApi.getSummary({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });

      return response.dailySpending.map((day) => ({
        date: new Date(`${day.date}T23:59:59Z`).toLocaleDateString('en-US', { weekday: 'short' }),
        amount: day.amount,
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="card">
        <div className="skeleton h-52"></div>
      </div>
    );
  }

  return (
    <div className="card h-auto">
      <h3 className="text-lg font-semibold mb-4">This Week's Spending</h3>
      <ResponsiveContainer width="100%" height="95%">
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line dataKey="amount" stroke="#8884d8" fill="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}