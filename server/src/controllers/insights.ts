import { Request, Response } from 'express';
import * as aiService from '../services/ai';
import * as analyticsService from '../services/analytics';
import { Transaction } from '../types';

// ============================================
// GENERATE INSIGHTS
// ============================================

/**
 * GET /api/insights
 * Query params: startDate?, endDate?
 * Generates AI-powered insights based on user's transactions
 */
export const generateInsights = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { startDate, endDate } = req.query;

    // Default to current month if no dates provided
    const now = new Date();
    const defaultStartDate =
      (startDate as string) ||
      new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split('T')[0];
    const defaultEndDate =
      (endDate as string) || now.toISOString().split('T')[0];

    // Fetch transactions for the period
    const sb = req.supabase!;
    const { data: transactions, error: transactionsError } = await sb
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', defaultStartDate)
      .lte('date', defaultEndDate)
      .order('date', { ascending: true });

    if (transactionsError) {
      return res.status(500).json({
        error: 'Database Error',
        message: transactionsError.message,
      });
    }

    // Fetch user settings (for budget)
    const { data: settings, error: settingsError } = await sb
      .from('user_settings')
      .select('monthly_budget')
      .eq('user_id', userId)
      .single();

    if (settingsError) {
      return res.status(500).json({
        error: 'Database Error',
        message: settingsError.message,
      });
    }

    // If no transactions, return empty insights
    if (!transactions || transactions.length === 0) {
      return res.json({
        insights: [
          {
            type: 'daily',
            title: '🌟 Start Your Journey',
            message:
              'You haven\'t added any transactions yet. Start tracking your spending to get personalized insights!',
            action: 'Add your first transaction',
          },
        ],
        period: {
          startDate: defaultStartDate,
          endDate: defaultEndDate,
        },
      });
    }

    // Calculate analytics
    const summary = analyticsService.calculateSpendingSummary(transactions);
    const dailySpending = analyticsService.calculateDailySpending(transactions);
    const byCategory = analyticsService.calculateSpendingByCategory(transactions);

    // Calculate days
    const startDateObj = new Date(defaultStartDate);
    const endDateObj = new Date(defaultEndDate);
    const daysInPeriod = Math.ceil(
      (endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
    
    const today = new Date();
    const daysRemaining = Math.ceil(
      (new Date(today.getFullYear(), today.getMonth() + 1, 0).getTime() - today.getTime()) / 
      (1000 * 60 * 60 * 24)
    );

    // Prepare data for AI
    const insightData = {
      totalIncome: summary.totalIncome,
      totalExpenses: summary.totalExpenses,
      transactionCount: summary.transactionCount,
      byCategory: byCategory,
      byDay: dailySpending,
      monthlyBudget: settings?.monthly_budget || 1000,
      daysInPeriod,
      daysRemaining,
    };

    // Generate insights with AI
    const insights = await aiService.generateInsights(insightData);

    res.json({
      insights,
      period: {
        startDate: defaultStartDate,
        endDate: defaultEndDate,
      },
      summary: {
        totalIncome: summary.totalIncome,
        totalExpenses: summary.totalExpenses,
        transactionCount: summary.transactionCount,
      },
    });
  } catch (error) {
    console.error('Generate insights error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to generate insights',
    });
  }
};

// ============================================
// GET SPENDING SUMMARY
// ============================================

/**
 * GET /api/insights/summary
 * Query params: startDate?, endDate?, groupBy?
 * Returns spending analytics without AI insights
 */
export const getSpendingSummary = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { startDate, endDate } = req.query;

    // Default to current month if no dates provided
    const now = new Date();
    const defaultStartDate =
      (startDate as string) ||
      new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split('T')[0];
    const defaultEndDate =
      (endDate as string) || now.toISOString().split('T')[0];

    // Fetch transactions for the period
    const sb = req.supabase!;
    const { data: transactions, error } = await sb
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', defaultStartDate)
      .lte('date', defaultEndDate)
      .order('date', { ascending: true });

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    if (!transactions || transactions.length === 0) {
      return res.json({
        summary: {
          totalIncome: 0,
          totalExpenses: 0,
          netAmount: 0,
          transactionCount: 0,
          averageTransaction: 0,
          byCategory: [],
        },
        dailySpending: [],
        period: {
          startDate: defaultStartDate,
          endDate: defaultEndDate,
        },
      });
    }

    // Calculate analytics
    const summary = analyticsService.calculateSpendingSummary(transactions);
    const dailySpending = analyticsService.calculateDailySpending(transactions);

    res.json({
      summary,
      dailySpending,
      period: {
        startDate: defaultStartDate,
        endDate: defaultEndDate,
      },
    });
  } catch (error) {
    console.error('Get spending summary error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch spending summary',
    });
  }
};