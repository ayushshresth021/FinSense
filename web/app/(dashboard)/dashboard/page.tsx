'use client';

import { StatsCards } from '../../../components/dashboard/stats-cards';
import { SpendingChart } from '../../../components/dashboard/spending-chart';
import { CategoryChart } from '../../../components/dashboard/category-chart';
import { TransactionList } from '../../../components/dashboard/transaction-list';
import { SpendingCalendar } from '../../../components/dashboard/spending-calendar';
import Link from 'next/link';
import { Lightbulb } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8 lg:space-y-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-secondary">
            Welcome back! Here's your financial overview.
          </p>
        </div>
        <Link
          href="/dashboard/insights"
          className="btn btn-secondary flex items-center gap-2"
        >
          <Lightbulb className="w-4 h-4" />
          View Insights
        </Link>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-[60%_39%] gap-4 mt-8">
        <SpendingChart />
        <CategoryChart />
      </div>

      {/* Transactions & Calendar Row */}
      <div className="grid grid-cols-1 md:grid-cols-[60%_39%] gap-4 mt-8">
        <SpendingCalendar />
        <TransactionList />
      </div>
    </div>
  );
}
