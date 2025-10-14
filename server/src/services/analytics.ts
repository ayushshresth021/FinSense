import { Transaction, SpendingByCategory, SpendingSummary } from '../types';

/**
 * Calculate spending by category
 */
export const calculateSpendingByCategory = (
  transactions: Transaction[]
): SpendingByCategory[] => {
  // Only include expenses
  const expenses = transactions.filter((t) => t.type === 'expense');

  const totalExpenses = expenses.reduce((sum, t) => sum + Number(t.amount), 0);

  // Group by category
  const byCategory = expenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = { amount: 0, count: 0 };
    }
    acc[category].amount += Number(transaction.amount);
    acc[category].count += 1;
    return acc;
  }, {} as Record<string, { amount: number; count: number }>);

  // Convert to array and calculate percentages
  const result: SpendingByCategory[] = (Object.entries(byCategory) as [string, { amount: number; count: number }][]).map(
    ([category, data]) => ({
      category,
      amount: data.amount,
      count: data.count,
      percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
    })
  );

  // Sort by amount descending
  return result.sort((a, b) => b.amount - a.amount);
};

/**
 * Calculate daily spending totals
 */
export const calculateDailySpending = (
  transactions: Transaction[]
): Array<{ date: string; amount: number; transactionCount: number; isWeekend: boolean }> => {
  // Only include expenses
  const expenses = transactions.filter((t) => t.type === 'expense');

  // Group by date
  const byDate = expenses.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = { amount: 0, count: 0 };
    }
    acc[date].amount += Number(transaction.amount);
    acc[date].count += 1;
    return acc;
  }, {} as Record<string, { amount: number; count: number }>);

  // Convert to array
  const result = (Object.entries(byDate) as [string, { amount: number; count: number }][]).map(([date, data]) => {
    const dayOfWeek = new Date(date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6

    return {
      date,
      amount: data.amount,
      transactionCount: data.count,
      isWeekend,
    };
  });

  // Sort by date ascending
  return result.sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Calculate spending summary
 */
export const calculateSpendingSummary = (
  transactions: Transaction[]
): SpendingSummary => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const byCategory = calculateSpendingByCategory(transactions);

  return {
    totalIncome: income,
    totalExpenses: expenses,
    netAmount: income - expenses,
    transactionCount: transactions.length,
    averageTransaction:
      transactions.length > 0
        ? (income + expenses) / transactions.length
        : 0,
    byCategory,
  };
};

/**
 * Get high spending days (top 3)
 */
export const getHighSpendingDays = (
  transactions: Transaction[]
): Array<{ date: string; amount: number }> => {
  const daily = calculateDailySpending(transactions);
  
  return daily
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3)
    .map(({ date, amount }) => ({ date, amount }));
};

/**
 * Calculate if user is on track with budget
 */
export const calculateBudgetStatus = (
  totalExpenses: number,
  monthlyBudget: number,
  daysInMonth: number,
  currentDay: number
): {
  percentUsed: number;
  percentOfMonthGone: number;
  onTrack: boolean;
  projectedTotal: number;
} => {
  const percentUsed = (totalExpenses / monthlyBudget) * 100;
  const percentOfMonthGone = (currentDay / daysInMonth) * 100;
  const onTrack = percentUsed <= percentOfMonthGone;
  
  // Project total spending for the month
  const dailyAverage = totalExpenses / currentDay;
  const projectedTotal = dailyAverage * daysInMonth;

  return {
    percentUsed,
    percentOfMonthGone,
    onTrack,
    projectedTotal,
  };
};

