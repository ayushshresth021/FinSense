'use client';

import { useState } from 'react';
import { X, Mic, Type } from 'lucide-react';
import { VoiceInput } from './voice-input';
import { TextInput } from './text-input';
import { TransactionPreview } from './transaction-preview';
import { ParsedTransaction } from '@/types';
import { useTransactions } from '../../app/lib/hooks/use-transactions';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
  const [activeTab, setActiveTab] = useState<'voice' | 'text'>('voice');
  const [parsedData, setParsedData] = useState<ParsedTransaction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addTransaction } = useTransactions();

  if (!isOpen) return null;

  const handleParsed = (data: ParsedTransaction) => {
    setParsedData(data);
    setIsProcessing(false);
  };

  const handleSave = async (editedData: ParsedTransaction) => {
    if (!editedData) return;

    try {
      // // Example backdate - remove or customize
      // const threeDaysAgo = new Date();
      // threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      // const formattedDate = threeDaysAgo.toISOString().split('T')[0];

      await addTransaction({
        amount: editedData.amount,
        type: editedData.type,
        category: editedData.category,
        merchant: editedData.merchant,
        note: editedData.note,
        date: editedData.date,  // Use the edited date from preview
      });
      handleClose();
    } catch (error) {
      console.error('Failed to save transaction:', error);
      alert('Failed to save transaction. Please try again.');
    }
  };

  const handleClose = () => {
    setParsedData(null);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Add Expense</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[rgb(var(--color-bg-tertiary))] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'voice'
                ? 'bg-gradient-to-r from-[#003566] to-[#001d3d] text-white shadow-sm'
                : 'bg-[rgb(var(--color-bg-tertiary))] text-secondary hover:text-primary hover:bg-[rgb(var(--color-bg-hover))]'
            }`}
          >
            <Mic className="w-4 h-4" />
            Voice
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'text'
                ? 'bg-gradient-to-r from-[#003566] to-[#001d3d] text-white shadow-sm'
                : 'bg-[rgb(var(--color-bg-tertiary))] text-secondary hover:text-primary hover:bg-[rgb(var(--color-bg-hover))]'
            }`}
          >
            <Type className="w-4 h-4" />
            Text
          </button>
        </div>

        {/* Input Section */}
        {!parsedData ? (
          <div>
            {activeTab === 'voice' ? (
              <VoiceInput
                onParsed={handleParsed}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            ) : (
              <TextInput
                onParsed={handleParsed}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            )}
          </div>
        ) : (
          <TransactionPreview
            data={parsedData}
            onEdit={() => setParsedData(null)}
            onSave={(editedData) => handleSave(editedData)}
          />
        )}
      </div>
    </div>
  );
}