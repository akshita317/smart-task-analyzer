import { Sparkles, Zap, Target, Clock } from 'lucide-react';
import type { Strategy } from './task';

interface StrategySelectProps {
  value: Strategy;
  onChange: (value: Strategy) => void;
}

const strategies = [
  { value: 'smart' as const, label: 'Smart Balance', icon: Sparkles },
  { value: 'fastest' as const, label: 'Fastest Wins', icon: Zap },
  { value: 'impact' as const, label: 'High Impact', icon: Target },
  { value: 'deadline' as const, label: 'Deadline Driven', icon: Clock },
];

const strategyHints: Record<Strategy, string> = {
  smart: 'Balance urgency, importance, and effort',
  fastest: 'Focus on quick wins first',
  impact: 'Prioritize high-value tasks',
  deadline: 'Work on urgent deadlines first',
};

export function StrategySelect({ value, onChange }: StrategySelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
        Strategy
      </label>
      <div className="grid grid-cols-2 gap-2">
        {strategies.map((strategy) => (
          <button
            key={strategy.value}
            onClick={() => onChange(strategy.value)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
              value === strategy.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <strategy.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{strategy.label}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-600">{strategyHints[value]}</p>
    </div>
  );
}
