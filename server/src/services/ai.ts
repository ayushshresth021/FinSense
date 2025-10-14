import { openai, MODEL } from '../config/openai';
import { assemblyClient } from '../config/assemblyai';
import {
  ParseTransactionResponse,
  Insight,
  InsightType,
} from '../types';

// ============================================
// CONSTANTS
// ============================================

export const CATEGORIES = [
  'Food & Drink',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Other',
] as const;

// ============================================
// VOICE TRANSCRIPTION
// ============================================

/**
 * Transcribe audio file to text using AssemblyAI
 * @param audioBuffer - Audio file buffer
 * @returns Transcribed text
 */
export const transcribeAudio = async (
  audioBuffer: Buffer
): Promise<string> => {
  try {
    // Upload audio buffer to AssemblyAI
    const uploadResponse = await assemblyClient.files.upload(audioBuffer);

    // Create transcription
    const transcript = await assemblyClient.transcripts.transcribe({
      audio: uploadResponse,
    });

    // Wait for transcription to complete
    if (transcript.status === 'error') {
      throw new Error(transcript.error || 'Transcription failed');
    }

    if (!transcript.text) {
      throw new Error('No transcription text returned');
    }

    return transcript.text;
  } catch (error) {
    console.error('AssemblyAI transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
};

// ============================================
// TRANSACTION PARSING
// ============================================

/**
 * Parse natural language text into structured transaction data
 * @param text - Natural language input (e.g., "I spent 20 bucks on coffee at Starbucks")
 * @returns Parsed transaction data
 */
export const parseTransaction = async (
  text: string
): Promise<ParseTransactionResponse> => {
  try {
    const prompt = `
Parse this transaction text into structured data.
Extract:
- type: "income" or "expense" (default to "expense" if unclear)
- amount: number (required, throw error if missing)
- category: one of ["Food & Drink", "Transportation", "Shopping", "Entertainment", "Bills & Utilities", "Healthcare", "Other"] (default "Other")
- merchant: string (optional)
- note: string (optional)
- date: YYYY-MM-DD (default to today "${new Date().toISOString().split('T')[0]}", but parse relative dates like "yesterday", "3 days ago", "last week")

Text: "${text}"

Respond ONLY with valid JSON in this format:
{ "type": "...", "amount": 0, "category": "...", "merchant": "...", "note": "...", "date": "YYYY-MM-DD" }
If cannot parse amount, respond with { "error": "Could not parse transaction" }
`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a financial assistant. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3, // Lower temperature for more consistent parsing
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);

    // Check if parsing failed
    if (parsed.error) {
      throw new Error(parsed.error);
    }

    // Validate parsed data
    if (
      !parsed.amount ||
      !parsed.type ||
      !parsed.category ||
      parsed.confidence < 0.6
    ) {
      throw new Error(
        'Could not confidently parse transaction. Try being more specific.'
      );
    }

    // Return structured data
    return {
      amount: parsed.amount,
      type: parsed.type,
      category: parsed.category,
      merchant: parsed.merchant || '',
      note: parsed.note || '',
    };
  } catch (error) {
    console.error('Transaction parsing error:', error);
    
    // Return user-friendly error
    if (error instanceof Error) {
      throw new Error(
        error.message || 'Could not parse transaction. Try being more specific like: I spent $20 on coffee at Starbucks'
      );
    }
    
    throw new Error('Failed to parse transaction');
  }
};

// ============================================
// INSIGHTS GENERATION
// ============================================

interface SpendingData {
  totalIncome: number;
  totalExpenses: number;
  transactionCount: number;
  byCategory: Array<{ category: string; amount: number; count: number }>;
  byDay: Array<{ date: string; amount: number; isWeekend: boolean }>;
  monthlyBudget: number;
  daysInPeriod: number;
  daysRemaining: number;
}

/**
 * Generate AI insights based on spending data
 * @param data - Aggregated spending data
 * @returns Array of insight cards
 */
export const generateInsights = async (
  data: SpendingData
): Promise<Insight[]> => {
  try {
    const prompt = `You are a friendly financial advisor. Generate 4-5 personalized insights based on this user's spending data:

DATA:
- Total Income: $${data.totalIncome}
- Total Expenses: $${data.totalExpenses}
- Monthly Budget: $${data.monthlyBudget}
- Transaction Count: ${data.transactionCount}
- Days in Period: ${data.daysInPeriod}
- Days Remaining in Month: ${data.daysRemaining}

Spending by Category:
${data.byCategory.map((c) => `- ${c.category}: $${c.amount} (${c.count} transactions)`).join('\n')}

Daily Spending:
${data.byDay.map((d) => `- ${d.date}: $${d.amount} ${d.isWeekend ? '(Weekend)' : '(Weekday)'}`).join('\n')}

Generate 4-5 insights covering these types:
1. "daily" - Main observation about overall spending
2. "pattern" - Behavioral pattern (e.g., weekend vs weekday, high spending days)
3. "win" - Something positive they're doing well (ALWAYS include this)
4. "alert" - Category that needs attention or is trending up
5. "budget" - Budget status and projection

Rules:
- Be conversational and friendly (use "you", "your")
- Be encouraging, never judgmental or shame-inducing
- Be specific with numbers ("You spent $47 on coffee" not "You spent a lot")
- Keep messages to 2-3 sentences max
- Make actionable suggestions when appropriate
- ALWAYS include at least one positive "win" insight

Return ONLY a JSON object:
{
  "insights": [
    {
      "type": "daily" | "pattern" | "win" | "alert" | "budget",
      "title": "Short title (4-6 words)",
      "message": "Friendly 2-3 sentence message with specific numbers",
      "action": "Optional: Short call-to-action or question"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a friendly financial advisor. Always respond with valid JSON only. Be encouraging and specific.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7, // Higher temperature for more creative insights
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);

    if (!parsed.insights || !Array.isArray(parsed.insights)) {
      throw new Error('Invalid insights format');
    }

    return parsed.insights;
  } catch (error) {
    console.error('Insights generation error:', error);
    
    // Return fallback insights if AI fails
    return generateFallbackInsights(data);
  }
};

/**
 * Generate basic insights without AI (fallback)
 */
const generateFallbackInsights = (data: SpendingData): Insight[] => {
  const insights: Insight[] = [];

  // Budget status insight
  const budgetUsed = (data.totalExpenses / data.monthlyBudget) * 100;
  const daysProgress = ((data.daysInPeriod - data.daysRemaining) / data.daysInPeriod) * 100;

  if (budgetUsed < daysProgress) {
    insights.push({
      type: 'win',
      title: '🎉 You\'re Doing Great!',
      message: `You've used ${budgetUsed.toFixed(0)}% of your budget with ${daysProgress.toFixed(0)}% of the month gone. Keep up the great work!`,
    });
  } else {
    insights.push({
      type: 'budget',
      title: '📊 Budget Check-In',
      message: `You've spent $${data.totalExpenses.toFixed(2)} of your $${data.monthlyBudget} budget with ${data.daysRemaining} days remaining.`,
      action: 'Consider reducing spending in your top categories',
    });
  }

  // Top category insight
  if (data.byCategory.length > 0) {
    const topCategory = data.byCategory[0];
    insights.push({
      type: 'alert',
      title: `💰 Top Spending: ${topCategory.category}`,
      message: `You've spent $${topCategory.amount.toFixed(2)} on ${topCategory.category} this period (${topCategory.count} transactions).`,
    });
  }

  // Weekend vs weekday pattern
  const weekendSpending = data.byDay
    .filter((d) => d.isWeekend)
    .reduce((sum, d) => sum + d.amount, 0);
  const weekdaySpending = data.byDay
    .filter((d) => !d.isWeekend)
    .reduce((sum, d) => sum + d.amount, 0);

  const weekendDays = data.byDay.filter((d) => d.isWeekend).length;
  const weekdayDays = data.byDay.filter((d) => !d.isWeekend).length;

  if (weekendDays > 0 && weekdayDays > 0) {
    const weekendAvg = weekendSpending / weekendDays;
    const weekdayAvg = weekdaySpending / weekdayDays;

    if (weekendAvg > weekdayAvg * 1.5) {
      insights.push({
        type: 'pattern',
        title: '📅 Weekend Spending Pattern',
        message: `You spend ${((weekendAvg / weekdayAvg) * 100 - 100).toFixed(0)}% more on weekends ($${weekendAvg.toFixed(2)}/day) vs weekdays ($${weekdayAvg.toFixed(2)}/day).`,
        action: 'Try setting a weekend budget?',
      });
    }
  }

  return insights;
};