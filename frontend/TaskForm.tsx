import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import type { Task } from '@/types/task';

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('1');
  const [importance, setImportance] = useState('5');
  const [dependencies, setDependencies] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    const parsedImportance = parseInt(importance, 10);
    const parsedHours = parseInt(estimatedHours, 10);

    if (parsedImportance < 1 || parsedImportance > 10) {
      alert('Importance must be between 1 and 10');
      return;
    }

    onAddTask({
      title: title.trim(),
      due_date: dueDate,
      estimated_hours: parsedHours,
      importance: parsedImportance,
      dependencies: dependencies
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    });

    setTitle('');
    setDueDate('');
    setEstimatedHours('1');
    setImportance('5');
    setDependencies('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-muted-foreground">
          Task Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Fix login bug"
          required
          className="bg-muted/50 border-border/50 focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="due_date" className="text-sm font-medium text-muted-foreground">
          Due Date
        </Label>
        <Input
          id="due_date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className="bg-muted/50 border-border/50 focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estimated_hours" className="text-sm font-medium text-muted-foreground">
            Estimated Hours
          </Label>
          <Input
            id="estimated_hours"
            type="number"
            min="0"
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(e.target.value)}
            required
            className="bg-muted/50 border-border/50 focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="importance" className="text-sm font-medium text-muted-foreground">
            Importance (1-10)
          </Label>
          <Input
            id="importance"
            type="number"
            min="1"
            max="10"
            value={importance}
            onChange={(e) => setImportance(e.target.value)}
            required
            className="bg-muted/50 border-border/50 focus:border-primary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dependencies" className="text-sm font-medium text-muted-foreground">
          Dependencies (comma-separated)
        </Label>
        <Input
          id="dependencies"
          value={dependencies}
          onChange={(e) => setDependencies(e.target.value)}
          placeholder="Other task titles"
          className="bg-muted/50 border-border/50 focus:border-primary"
        />
      </div>

      <Button type="submit" className="w-full">
        <Plus className="w-4 h-4" />
        Add Task
      </Button>
    </form>
  );
}
