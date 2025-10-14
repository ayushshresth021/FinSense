import axios, { AxiosInstance, AxiosError } from 'axios';
import { getAccessToken } from './supabase';
import {
  Transaction,
  CreateTransactionRequest,
  ParseTransactionResponse,
  TranscribeVoiceResponse,
  InsightsResponse,
  SpendingSummaryResponse,
} from '@/types';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to all requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error: string; message: string }>) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // Return error with message
    const errorMessage =
      error.response?.data?.message || error.message || 'An error occurred';

    return Promise.reject(new Error(errorMessage));
  }
);

// ============================================
// TRANSACTION API
// ============================================

export const transactionsApi = {
  /**
   * Get all transactions
   */
  getAll: async (params?: {
    startDate?: string;
    endDate?: string;
    type?: 'income' | 'expense';
    category?: string;
  }): Promise<{ transactions: Transaction[]; count: number }> => {
    const response = await apiClient.get('/transactions', { params });
    return response.data;
  },

  /**
   * Get single transaction
   */
  getById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data;
  },

  /**
   * Create transaction
   */
  create: async (data: CreateTransactionRequest): Promise<Transaction> => {
    const response = await apiClient.post('/transactions', data);
    return response.data;
  },

  /**
   * Parse natural language text
   */
  parseText: async (text: string): Promise<ParseTransactionResponse> => {
    const response = await apiClient.post('/transactions/parse', { text });
    return response.data;
  },

  /**
   * Transcribe voice and parse
   */
  transcribeVoice: async (audioBlob: Blob): Promise<TranscribeVoiceResponse> => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const response = await apiClient.post('/transactions/voice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Update transaction
   */
  update: async (
    id: string,
    data: Partial<CreateTransactionRequest>
  ): Promise<Transaction> => {
    const response = await apiClient.put(`/transactions/${id}`, data);
    return response.data;
  },

  /**
   * Delete transaction
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },
};

// ============================================
// INSIGHTS API
// ============================================

export const insightsApi = {
  /**
   * Generate insights
   */
  generate: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<InsightsResponse> => {
    const response = await apiClient.get('/insights', { params });
    return response.data;
  },

  /**
   * Get spending summary
   */
  getSummary: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<SpendingSummaryResponse> => {
    const response = await apiClient.get('/insights/summary', { params });
    return response.data;
  },
};

export default apiClient;