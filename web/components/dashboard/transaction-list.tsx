'use client';

import { useTransactions } from '../../app/lib/hooks/use-transactions';
import { Coffee, Car, ShoppingBag, Film, Home, Heart, MoreHorizontal } from 'lucide-react';
import { Transaction } from '@/types';
import { format, isToday, isYesterday } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import type { SVGProps } from 'react';

const categoryIcons: Record<string, React.ComponentType<SVGProps<SVGSVGElement>>> = {
  'Food & Drink': Coffee,
  'Transportation': Car,
  'Shopping': ShoppingBag,
  'Entertainment': Film,
  'Bills & Utilities': Home,
  'Healthcare': Heart,
  'Other': MoreHorizontal,
};

export function TransactionList() {
  const { transactions, isLoading } = useTransactions();

  // Sort by creation time to surface latest entries regardless of transaction date
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Show only last 10 transactions
  const recentTransactions = sortedTransactions.slice(0, 10);

  if (isLoading) {
    return (
      <div className="card">
        <div className="skeleton h-96"></div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>

      {recentTransactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-secondary">No transactions yet</p>
          <p className="text-sm text-muted mt-1">
            Add your first expense to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </div>
  );
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const Icon = categoryIcons[transaction.category] || MoreHorizontal;
  const isIncome = transaction.type === 'income';

  // Format date
  const transactionDateUTC = new Date(`${transaction.date}T23:59:59Z`); // Assume stored as UTC end of day
  const localTransactionDate = toZonedTime(transactionDateUTC, Intl.DateTimeFormat().resolvedOptions().timeZone);

  const isTransactionToday = isToday(localTransactionDate);
  const isTransactionYesterday = isYesterday(localTransactionDate);

  let dateText = format(localTransactionDate, 'MMM d yyyy');
  if (isTransactionToday) dateText = 'Today';
  if (isTransactionYesterday) dateText = 'Yesterday';

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[rgb(var(--color-bg-tertiary))] transition-colors">
      {/* Icon */}
      <div className="w-10 h-10 bg-[rgb(var(--color-bg-tertiary))] rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
          {transaction.merchant || transaction.category}
        </p>
        <p className="text-xs text-secondary">{dateText}</p>
      </div>

      {/* Amount */}
      <div className="text-right">
        <p
          className={`font-semibold ${
            isIncome ? 'text-green-400' : 'text-primary'
          }`}
        >
          {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
        </p>
      </div>
    </div>
  );
}