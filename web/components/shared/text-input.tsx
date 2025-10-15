'use client';

import { useState } from 'react';
import { transactionsApi } from '../../app/lib/api';
import { ParsedTransaction } from '@/types';

interface TextInputProps {
  onParsed: (data: ParsedTransaction) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
}

export function TextInput({
  onParsed,
  isProcessing,
  setIsProcessing,
}: TextInputProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError('Please enter a description');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const response = await transactionsApi.parseText(text);
      onParsed(response.parsed);
      setText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse transaction');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Text Input */}
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type naturally: 'I spent $20 on coffee at Starbucks'"
          className="w-full h-32 px-4 py-3 bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))] rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
          disabled={isProcessing}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Examples */}
      <div className="space-y-2">
        <p className="text-xs text-secondary">Examples:</p>
        <div className="flex flex-wrap gap-2">
          {[
            'Coffee at Starbucks $5',
            'Uber ride home $12',
            'Groceries at Walmart $45',
            'Got paid $500 salary',
          ].map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setText(example)}
              className="text-xs px-3 py-1 bg-[rgb(var(--color-bg-tertiary))] hover:bg-[rgb(var(--color-bg-hover))] rounded-full transition-colors"
              disabled={isProcessing}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing || !text.trim()}
        className="w-full py-3 rounded-md bg-gradient-to-r from-[#003566] to-[#001d3d] text-white hover:from-[#004a8a] hover:to-[#002a5a] transition-all duration-200 shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#003566] disabled:hover:to-[#001d3d]"
      >
        {isProcessing ? 'Processing...' : 'Parse Transaction'}
      </button>
    </form>
  );
}