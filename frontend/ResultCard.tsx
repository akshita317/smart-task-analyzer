import { Calendar, Clock, Star, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { AnalyzedTask } from '@/types/task';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  task: AnalyzedTask;
  index: number;
}

function getPriorityInfo(score: number) {
  if (score >= 120) return { label: 'High', variant: 'destructive' as const, className: 'bg-destructive/20 text-destructive border-destructive/30' };
  if (score >= 70) return { label: 'Medium', variant: 'default' as const, className: 'bg-warning/20 text-warning border-warning/30' };
  return { label: 'Low', variant: 'secondary' as const, className: 'bg-success/20 text-success border-success/30' };
}

export function ResultCard({ task, index }: ResultCardProps) {
  const priority = getPriorityInfo(task.score);

  return (
    <div
      className="glass rounded-xl p-5 hover:bg-secondary/20 transition-all duration-300 hover:scale-[1.02] animate-fade-in group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
            {index + 1}
          </span>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {task.title}
          </h3>
        </div>
        <Badge className={cn('border', priority.className)}>
          {priority.label}
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary/70" />
          <span>{task.due_date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 text-primary/70" />
          <span>{task.estimated_hours}h</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="w-4 h-4 text-primary/70" />
          <span>{task.importance}/10</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="w-4 h-4 text-primary/70" />
          <span>{Math.round(task.score)} pts</span>
        </div>
      </div>

      {task.explanation && (
        <div className="pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground/80">Reasoning:</span> {task.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
