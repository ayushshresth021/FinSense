import { Request, Response } from 'express';
import { z } from 'zod';
import * as aiService from '../services/ai';
import {
  CreateTransactionRequest,
  UpdateTransactionRequest,
  Transaction,
} from '../types';

// Extend Request type for multer file uploads
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// ============================================
// VALIDATION SCHEMAS
// ============================================

const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  merchant: z.string().optional(),
  note: z.string().optional(),
  date: z.string().optional(), // ISO date string
});

const updateTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive').optional(),
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().min(1, 'Category is required').optional(),
  merchant: z.string().optional(),
  note: z.string().optional(),
  date: z.string().optional(),
});

const parseTextSchema = z.object({
  text: z.string().min(1, 'Text is required'),
});

// ============================================
// GET ALL TRANSACTIONS
// ============================================

/**
 * GET /api/transactions
 * Query params: startDate, endDate, type, category
 */
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { startDate, endDate, type, category } = req.query;

    // Build query
    const sb = req.supabase!;
    let query = sb
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (startDate) {
      query = query.gte('date', startDate as string);
    }
    if (endDate) {
      query = query.lte('date', endDate as string);
    }
    if (type) {
      query = query.eq('type', type as string);
    }
    if (category) {
      query = query.eq('category', category as string);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    res.json({
      transactions: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch transactions',
    });
  }
};

// ============================================
// GET SINGLE TRANSACTION
// ============================================

/**
 * GET /api/transactions/:id
 */
export const getTransaction = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const sb = req.supabase!;
    const { data, error } = await sb
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Transaction not found',
      });
    }

    res.json(data);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch transaction',
    });
  }
};

// ============================================
// CREATE TRANSACTION
// ============================================

/**
 * POST /api/transactions
 * Body: { amount, type, category, merchant?, note?, date? }
 */
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    // Validate request body
    const validatedData = createTransactionSchema.parse(req.body);

    // Create transaction
    const sb = req.supabase!;
    const { data, error } = await sb
      .from('transactions')
      .insert({
        user_id: userId,
        amount: validatedData.amount,
        type: validatedData.type,
        category: validatedData.category,
        merchant: validatedData.merchant || null,
        note: validatedData.note || null,
        date: validatedData.date || new Date().toUTCString().split('T')[0],
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    res.status(201).json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: error.issues,
      });
    }

    console.error('Create transaction error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create transaction',
    });
  }
};

// ============================================
// PARSE TRANSACTION TEXT
// ============================================

/**
 * POST /api/transactions/parse
 * Body: { text: "I spent $20 on coffee at Starbucks" }
 * Returns: Parsed transaction data (not saved yet)
 */
export const parseTransactionText = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { text } = parseTextSchema.parse(req.body);

    // Parse with AI
    const parsed = await aiService.parseTransaction(text);

    res.json({
      parsed,
      originalText: text,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Text is required',
        details: error.issues,
      });
    }

    if (error instanceof Error) {
      return res.status(400).json({
        error: 'Parse Error',
        message: error.message,
        suggestion: 'Try saying something like: I spent $20 on coffee at Starbucks',
      });
    }

    console.error('Parse transaction error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to parse transaction',
    });
  }
};

// ============================================
// TRANSCRIBE AND PARSE VOICE
// ============================================

/**
 * POST /api/transactions/voice
 * Content-Type: multipart/form-data
 * Body: audio file (blob)
 * Returns: Transcribed text + parsed transaction data
 */
export const transcribeAndParse = async (req: MulterRequest, res: Response) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Audio file is required',
      });
    }

    // Get audio buffer from uploaded file
    const audioBuffer = req.file.buffer;

    // Step 1: Transcribe audio to text
    const transcribedText = await aiService.transcribeAudio(audioBuffer);

    // Step 2: Parse transcribed text to transaction
    const parsed = await aiService.parseTransaction(transcribedText);

    res.json({
      transcription: transcribedText,
      parsed,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        error: 'Processing Error',
        message: error.message,
        suggestion: 'Try speaking more clearly or use text input instead',
      });
    }

    console.error('Transcribe and parse error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process voice input',
    });
  }
};

// ============================================
// UPDATE TRANSACTION
// ============================================

/**
 * PUT /api/transactions/:id
 * Body: { amount?, type?, category?, merchant?, note?, date? }
 */
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    // Validate request body
    const validatedData = updateTransactionSchema.parse(req.body);

    // Check if transaction exists and belongs to user
    const sb = req.supabase!;
    const { data: existing } = await sb
      .from('transactions')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!existing) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Transaction not found',
      });
    }

    // Update transaction
    const { data, error } = await sb
      .from('transactions')
      .update(validatedData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    res.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: error.issues,
      });
    }

    console.error('Update transaction error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update transaction',
    });
  }
};

// ============================================
// DELETE TRANSACTION
// ============================================

/**
 * DELETE /api/transactions/:id
 */
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    // Delete transaction (will fail if doesn't exist or doesn't belong to user)
    const sb = req.supabase!;
    const { error } = await sb
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({
        error: 'Database Error',
        message: error.message,
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete transaction',
    });
  }
};