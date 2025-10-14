// ============================================
// DATABASE TYPES
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
    date?: string; // Optional, defaults to today
  }
  
  export interface UpdateTransactionRequest {
    amount?: number;
    type?: 'income' | 'expense';
    category?: string;
    merchant?: string;
    note?: string;
    date?: string;
  }
  
  export interface ParseTransactionRequest {
    text: string;
  }
  
  export interface ParseTransactionResponse {
    amount: number;
    type: 'income' | 'expense';
    category: string;
    merchant: string;
    note?: string;
  }
  
  export interface TranscribeAudioRequest {
    audioUrl: string; // URL to audio file or base64
  }
  
  export interface TranscribeAudioResponse {
    text: string;
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
    data?: any; // Optional chart data or additional context
  }
  
  export interface GenerateInsightsRequest {
    startDate?: string;
    endDate?: string;
  }
  
  export interface GenerateInsightsResponse {
    insights: Insight[];
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
  }
  
  export interface SpendingSummary {
    totalIncome: number;
    totalExpenses: number;
    netAmount: number;
    transactionCount: number;
    averageTransaction: number;
    byCategory: SpendingByCategory[];
  }
  
  // ============================================
  // AUTH TYPES
  // ============================================
  
  export interface AuthUser {
    id: string;
    email: string;
  }
  
  // ============================================
  // ERROR TYPES
  // ============================================
  
  export interface APIError {
    error: string;
    message: string;
    statusCode: number;
  }