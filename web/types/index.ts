// ============================================
// DATABASE TYPES (Match backend)
// ============================================

export interface Transaction {
    id: string;
    user_id: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    merchant: string | null;
    note: string | null;
    date: string; // ISO date string (YYYY-MM-DD)
    created_at: string;
    updated_at: string;
  }
  
  export interface UserSettings {
    id: string;
    user_id: string;
    monthly_budget: number;
    currency: string;
    created_at: string;
    updated_at: string;
  }
  
  // ============================================
  // API REQUEST/RESPONSE TYPES
  // ============================================
  
  export interface CreateTransactionRequest {
    amount: number;
    type: 'income' | 'expense';
    category: string;
    merchant?: string;
    note?: string;
    date?: string;
  }
  
  export interface ParsedTransaction {
    amount: number;
    type: 'income' | 'expense';
    category: string;
    merchant: string;
    note?: string;
    date?: string;
  }
  
  export interface ParseTransactionResponse {
    parsed: ParsedTransaction;
    originalText: string;
  }
  
  export interface TranscribeVoiceResponse {
    transcription: string;
    parsed: ParsedTransaction;
  }
  
  // ============================================
  // INSIGHT TYPES
  // ============================================
  
  export type InsightType =
    | 'daily'
    | 'pattern'
    | 'win'
    | 'alert'
    | 'budget'
    | 'suggestion';
  
  export interface Insight {
    type: InsightType;
    title: string;
    message: string;
    action?: string;
    data?: any;
  }
  
  export interface InsightsResponse {
    insights: Insight[];
    period: {
      startDate: string;
      endDate: string;
    };
    summary: {
      totalIncome: number;
      totalExpenses: number;
      transactionCount: number;
    };
  }
  
  // ============================================
  // ANALYTICS TYPES
  // ============================================
  
  export interface SpendingByCategory {
    category: string;
    amount: number;
    count: number;
    percentage: number;
  }
  
  export interface DailySpending {
    date: string;
    amount: number;
    transactionCount: number;
    isWeekend: boolean;
  }
  
  export interface SpendingSummary {
    totalIncome: number;
    totalExpenses: number;
    netAmount: number;
    transactionCount: number;
    averageTransaction: number;
    byCategory: SpendingByCategory[];
  }
  
  export interface SpendingSummaryResponse {
    summary: SpendingSummary;
    dailySpending: DailySpending[];
    period: {
      startDate: string;
      endDate: string;
    };
  }
  
  // ============================================
  // AUTH TYPES
  // ============================================
  
  export interface User {
    id: string;
    email: string;
  }
  
  export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  }
  
  // ============================================
  // ERROR TYPES
  // ============================================
  
  export interface APIError {
    error: string;
    message: string;
    statusCode: number;
  }