'use client';

import { useState } from 'react';
import { ParsedTransaction } from '@/types';
import { Edit2, Check } from 'lucide-react';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

interface TransactionPreviewProps {
  data: ParsedTransaction;
  onEdit: () => void;
  onSave: (data: ParsedTransaction) => void;
}

const CATEGORIES = [
  'Food & Drink',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Other',
];

export function TransactionPreview({
  data,
  onEdit,
  onSave,
}: TransactionPreviewProps) {
  const [editedData, setEditedData] = useState(data);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(editedData);
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Edit Transaction</h3>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input
            type="number"
            step="0.01"
            value={editedData.amount}
            onChange={(e) =>
              setEditedData({ ...editedData, amount: parseFloat(e.target.value) })
            }
            className="w-full px-4 py-3 bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))] rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEditedData({ ...editedData, type: 'expense' })}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                editedData.type === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'bg-[rgb(var(--color-bg-tertiary))] text-secondary'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setEditedData({ ...editedData, type: 'income' })}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                editedData.type === 'income'
                  ? 'bg-green-500 text-white'
                  : 'bg-[rgb(var(--color-bg-tertiary))] text-secondary'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={editedData.category}
            onChange={(e) =>
              setEditedData({ ...editedData, category: e.target.value })
            }
            className="w-full px-4 py-3 bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))] rounded-lg focus:outline-none focus:border-blue-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Merchant */}
        <div>
          <label className="block text-sm font-medium mb-2">Merchant (Optional)</label>
          <input
            type="text"
            value={editedData.merchant}
            onChange={(e) =>
              setEditedData({ ...editedData, merchant: e.target.value })
            }
            className="w-full px-4 py-3 bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))] rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="e.g., Starbucks"
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium mb-2">Note (Optional)</label>
          <input
            type="text"
            value={editedData.note || ''}
            onChange={(e) =>
              setEditedData({ ...editedData, note: e.target.value })
            }
            className="w-full px-4 py-3 bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))] rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="e.g., morning coffee"
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={editedData.date || new Date().toISOString().split('T')[0]}
            onChange={(e) => setEditedData({ ...editedData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 btn btn-secondary py-3"
          >
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 btn btn-primary py-3">
            Save Transaction
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Transaction Preview</h3>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
      </div>

      {/* Preview Card */}
      <div className="bg-[rgb(var(--color-bg-tertiary))] rounded-lg p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-secondary">Amount</p>
            <p className="text-2xl font-bold">${editedData.amount.toFixed(2)}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              editedData.type === 'income'
                ? 'bg-green-500/10 text-green-400'
                : 'bg-red-500/10 text-red-400'
            }`}
          >
            {editedData.type === 'income' ? '↑ Income' : '↓ Expense'}
          </span>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-sm text-secondary">Category</p>
            <p className="font-medium">{editedData.category}</p>
          </div>

          <div>
            <p className="text-sm text-secondary">Date</p>
            <p className="font-medium">
              {format(toZonedTime(new Date(`${editedData.date || new Date().toISOString().split('T')[0]}T23:59:59Z`), Intl.DateTimeFormat().resolvedOptions().timeZone), 'MMM d, yyyy')}
            </p>
          </div>

          {editedData.merchant && (
            <div>
              <p className="text-sm text-secondary">Merchant</p>
              <p className="font-medium">{editedData.merchant}</p>
            </div>
          )}

          {editedData.note && (
            <div>
              <p className="text-sm text-secondary">Note</p>
              <p className="text-secondary">{editedData.note}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button onClick={onEdit} className="flex-1 btn btn-secondary py-3">
          Start Over
        </button>
        <button onClick={handleSave} className="flex-1 btn btn-primary py-3">
          <Check className="w-4 h-4 mr-2" />
          Save Transaction
        </button>
      </div>
    </div>
  );
}