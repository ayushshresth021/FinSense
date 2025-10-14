
'use client';

import { useInsights } from '../../../lib/hooks/use-insights';
import { InsightCard } from '../../../../components/insights/insight-card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function InsightsPage() {
  const { insights, isLoading, error } = useInsights();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-2">Your Insights</h1>
        <p className="text-secondary">
          AI-powered insights based on your spending patterns
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card">
              <div className="skeleton h-40"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card p-8 text-center">
          <p className="text-red-400 mb-2">Failed to load insights</p>
          <p className="text-sm text-secondary">{error}</p>
        </div>
      )}

      {/* Insights Grid */}
      {!isLoading && !error && insights.length === 0 && (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💡</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">No insights yet</h3>
          <p className="text-secondary mb-6">
            Add some transactions to get personalized insights about your spending
          </p>
          <Link href="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      )}

      {!isLoading && !error && insights.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {insights.map((insight, index) => (
            <InsightCard key={index} insight={insight} />
          ))}
        </div>
      )}
    </div>
  );
}
