import { Sparkles, Zap, Target, Clock } from 'lucide-react';
import type { Strategy } from './task';
import { strategyHints } from '@/types/task';

interface StrategySelectProps {
  value: Strategy;
  onChange: (value: Strategy) => void;
}

const strategies = [
  { value: 'smart', label: 'Smart Balance', icon: Sparkles },
  { value: 'fastest', label: 'Fastest Wins', icon: Zap },
  { value: 'impact', label: 'High Impact', icon: Target },
  { value: 'deadline', label: 'Deadline Driven', icon: Clock },
] as const;

export function StrategySelect({ value, onChange }: StrategySelectProps) {
  const CurrentIcon = strategies.find((s) => s.value === value)?.icon || Sparkles;

  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Strategy
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full sm:w-[200px] bg-muted/50 border-border/50">
          <div className="flex items-center gap-2">
            <CurrentIcon className="w-4 h-4 text-primary" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {strategies.map((strategy) => (
            <SelectItem key={strategy.value} value={strategy.value}>
              <div className="flex items-center gap-2">
                <strategy.icon className="w-4 h-4 text-primary" />
                {strategy.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">{strategyHints[value]}</p>
    </div>
  );
}
