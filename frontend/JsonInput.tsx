import { useState } from 'react';
import { Button } from './button';
import { Textarea } from './textarea';
import { FileJson, Trash2 } from 'lucide-react';
import type { Task } from './task';

interface JsonInputProps {
  onLoadTasks: (tasks: Task[]) => void;
  onClearTasks: () => void;
  hasTasksLoaded: boolean;
}

const exampleJson = `[
  {
    "title": "Fix login bug",
    "due_date": "2025-11-30",
    "estimated_hours": 3,
    "importance": 8,
    "dependencies": []
  }
]`;

export function JsonInput({ onLoadTasks, onClearTasks, hasTasksLoaded }: JsonInputProps) {
  const [jsonValue, setJsonValue] = useState('');

  const handleLoad = () => {
    try {
      const raw = jsonValue.trim();
      if (!raw) {
        alert('Paste a JSON array first.');
        return;
      }
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) throw new Error('Expected JSON array');
      onLoadTasks(arr);
      setJsonValue('');
    } catch (e: any) {
      alert('Invalid JSON: ' + e.message);
    }
  };

  const handleClear = () => {
    if (!hasTasksLoaded) {
      alert('No tasks to clear');
      return;
    }
    if (confirm('Are you sure you want to clear all tasks?')) {
      onClearTasks();
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={jsonValue}
        onChange={(e) => setJsonValue(e.target.value)}
        placeholder={exampleJson}
        rows={10}
        className="bg-muted/50 border-border/50 focus:border-primary font-mono text-sm resize-none"
      />
      <div className="flex gap-3">
        <Button onClick={handleLoad} className="flex-1">
          <FileJson className="w-4 h-4" />
          Load JSON
        </Button>
        <Button onClick={handleClear} variant="outline" className="flex-1">
          <Trash2 className="w-4 h-4" />
          Clear All
        </Button>
      </div>
    </div>
  );
}
