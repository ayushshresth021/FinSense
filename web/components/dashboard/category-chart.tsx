'use client';

import { useQuery } from '@tanstack/react-query';
import { insightsApi } from '../../app/lib/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sankey } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function CategoryChart() {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['category-chart'],
    queryFn: async () => {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endDate = now.toISOString().split('T')[0];

      const response = await insightsApi.getSummary({ startDate, endDate });

      return response.summary.byCategory.map((cat) => ({
        name: cat.category,
        value: cat.amount,
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
    <div className="card h-80">
      <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

     
            </ResponsiveContainer>
    </div>
  );
}