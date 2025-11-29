export interface Task {
  title: string;
  due_date: string;
  estimated_hours: number;
  importance: number;
  dependencies: string[];
}

export interface AnalyzedTask extends Task {
  score: number;
  explanation?: string;
}

export type Strategy = 'smart' | 'fastest' | 'impact' | 'deadline';

export const strategyHints: Record<Strategy, string> = {
  smart: 'Balances urgency, importance, and effort',
  fastest: 'Prioritizes quick wins to build momentum',
  impact: 'Focuses on high-importance tasks first',
  deadline: 'Prioritizes by due date urgency',
};
