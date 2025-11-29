import { Calendar, Clock, Star } from 'lucide-react';
import type { Task } from './task';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (!tasks.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No tasks added yet. Add one above or paste JSON.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
      {tasks.map((task, index) => (
        <div
          key={`${task.title}-${index}`}
          className="glass rounded-lg p-4 border-l-4 border-l-primary hover:bg-secondary/30 transition-colors animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="font-semibold text-foreground mb-2">
            {index + 1}. {task.title}
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {task.due_date}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {task.importance}/10
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {task.estimated_hours}h
            </span>
          </div>
          {task.dependencies.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              Depends on: {task.dependencies.join(', ')}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
