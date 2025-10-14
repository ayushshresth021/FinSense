'use client';

import { StatsCards } from './stats-cards';
import { SpendingChart } from './spending-chart';
import { CategoryChart } from './category-chart';
import { TransactionList } from './transaction-list';
import { SpendingCalendar } from './spending-calendar';
import Link from 'next/link';
import { Lightbulb } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl">
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
      <div className="grid lg:grid-cols-2 gap-6">
        <SpendingChart />
        <CategoryChart />
      </div>

      {/* Calendar & Transactions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpendingCalendar />
        </div>
        <div>
          <TransactionList />
        </div>
      </div>
    </div>
  );
}