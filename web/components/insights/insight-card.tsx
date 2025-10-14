'use client';

import { Insight } from '@/types';
import { TrendingUp, TrendingDown, Lightbulb, AlertCircle, Target, Trophy } from 'lucide-react';

interface InsightCardProps {
  insight: Insight;
}

const INSIGHT_CONFIG = {
  daily: {
    icon: Lightbulb,
    gradient: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  pattern: {
    icon: TrendingUp,
    gradient: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  win: {
    icon: Trophy,
    gradient: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
  },
  alert: {
    icon: AlertCircle,
    gradient: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
  },
  budget: {
    icon: Target,
    gradient: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
  },
  suggestion: {
    icon: TrendingDown,
    gradient: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
  },
};

export function InsightCard({ insight }: InsightCardProps) {
  const config = INSIGHT_CONFIG[insight.type];
  const Icon = config.icon;

  return (
    <div
      className={`
        card border-2 ${config.borderColor} ${config.bgColor}
        hover:scale-[1.02] transition-transform cursor-default
      `}
    >
      {/* Icon */}
      <div
        className={`
          w-12 h-12 rounded-lg flex items-center justify-center mb-4
          bg-gradient-to-br ${config.gradient}
        `}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold mb-2">{insight.title}</h3>

      {/* Message */}
      <p className="text-secondary leading-relaxed mb-4">{insight.message}</p>

      {/* Action */}
      {insight.action && (
        <div className="pt-4 border-t border-[rgb(var(--color-border-primary))]">
          <p className="text-sm text-blue-400 font-medium">{insight.action}</p>
        </div>
      )}
    </div>
  );
}