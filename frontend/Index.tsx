import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskForm } from '@/components/TaskForm';
import { JsonInput } from '@/components/JsonInput';
import { TaskList } from '@/components/TaskList';
import { ResultCard } from '@/components/ResultCard';
import { StrategySelect } from '@/components/StrategySelect';
import { Brain, Sparkles, ListTodo, BarChart3, Loader2 } from 'lucide-react';
import type { Task, AnalyzedTask, Strategy } from '@/types/task';
import { useToast } from '@/hooks/use-toast';
import { analyzeTasks, getSuggestions } from './api';

// Fallback mock analysis function (if backend is unavailable)
function analyzeTasksLocally(tasks: Task[], strategy: Strategy): AnalyzedTask[] {
  return tasks.map((task) => {
    const daysUntilDue = Math.max(1, Math.ceil((new Date(task.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    let score = 0;

    switch (strategy) {
      case 'fastest':
        score = (10 - Math.min(task.estimated_hours, 10)) * 10 + task.importance * 5;
        break;
      case 'impact':
        score = task.importance * 15 + (30 / daysUntilDue);
        break;
      case 'deadline':
        score = (30 / daysUntilDue) * 10 + task.importance * 3;
        break;
      default: // smart
        score = task.importance * 10 + (30 / daysUntilDue) * 5 + (10 - Math.min(task.estimated_hours, 10)) * 3;
    }

    const explanations: Record<Strategy, string> = {
      smart: `Balanced score based on ${task.importance}/10 importance, ${daysUntilDue} days until deadline, and ${task.estimated_hours}h effort.`,
      fastest: `Quick win opportunity with only ${task.estimated_hours}h estimated time.`,
      impact: `High-impact task rated ${task.importance}/10 in importance.`,
      deadline: `Due in ${daysUntilDue} days - urgency prioritized.`,
    };

    return {
      ...task,
      score,
      explanation: explanations[strategy],
    };
  }).sort((a, b) => b.score - a.score);
}

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [results, setResults] = useState<AnalyzedTask[]>([]);
  const [strategy, setStrategy] = useState<Strategy>('smart');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();

  const handleAddTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
    toast({
      title: 'Task added',
      description: `"${task.title}" has been added to your list.`,
    });
  };

  const handleLoadTasks = (loadedTasks: Task[]) => {
    setTasks(loadedTasks);
    toast({
      title: 'Tasks loaded',
      description: `${loadedTasks.length} tasks loaded from JSON.`,
    });
  };

  const handleClearTasks = () => {
    setTasks([]);
    setResults([]);
    toast({
      title: 'Tasks cleared',
      description: 'All tasks have been removed.',
    });
  };

  const handleAnalyze = async () => {
    if (!tasks.length) {
      toast({
        title: 'No tasks',
        description: 'Add some tasks first before analyzing.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Try to use backend API
      const analyzed = await analyzeTasks(tasks, strategy);
      setResults(analyzed);
      toast({
        title: 'Analysis complete',
        description: `${analyzed.length} tasks have been prioritized.`,
      });
    } catch (error) {
      console.warn('Backend API failed, using local analysis:', error);
      // Fallback to local analysis
      const analyzed = analyzeTasksLocally(tasks, strategy);
      setResults(analyzed);
      toast({
        title: 'Analysis complete (offline mode)',
        description: `${analyzed.length} tasks have been prioritized.`,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSuggest = async () => {
    if (!tasks.length) {
      toast({
        title: 'No tasks',
        description: 'Add some tasks first before getting suggestions.',
        variant: 'destructive',
      });
      return;
    }

    setIsSuggesting(true);
    try {
      // Try to use backend API
      const suggestions = await getSuggestions(tasks, strategy);
      setResults(suggestions.slice(0, 3));
      toast({
        title: 'Top 3 suggestions ready',
        description: 'Here are your most important tasks to focus on.',
      });
    } catch (error) {
      console.warn('Backend API failed, using local suggestions:', error);
      // Fallback to local analysis
      const analyzed = analyzeTasksLocally(tasks, strategy).slice(0, 3);
      setResults(analyzed);
      toast({
        title: 'Top 3 suggestions ready (offline mode)',
        description: 'Here are your most important tasks to focus on.',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background glow effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="glass rounded-2xl p-6 sm:p-8 mb-8 animate-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20 glow">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gradient">
                  Smart Task Analyzer
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Intelligent task prioritization with AI-powered strategies
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <StrategySelect value={strategy} onChange={setStrategy} />
              <div className="flex gap-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !tasks.length}
                  className="min-w-[120px]"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <BarChart3 className="w-4 h-4" />
                  )}
                  {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                </Button>
                <Button
                  onClick={handleSuggest}
                  disabled={isSuggesting || !tasks.length}
                  variant="outline"
                  className="min-w-[140px]"
                >
                  {isSuggesting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {isSuggesting ? 'Thinking...' : 'Suggest Top 3'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <section className="glass rounded-2xl p-6 animate-in-delay-1">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <ListTodo className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Input Tasks</h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''}
              </span>
            </div>

            <Tabs defaultValue="form" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
                <TabsTrigger value="form">Add Manually</TabsTrigger>
                <TabsTrigger value="json">Paste JSON</TabsTrigger>
              </TabsList>

              <TabsContent value="form" className="mt-0">
                <TaskForm onAddTask={handleAddTask} />
              </TabsContent>

              <TabsContent value="json" className="mt-0">
                <JsonInput
                  onLoadTasks={handleLoadTasks}
                  onClearTasks={handleClearTasks}
                  hasTasksLoaded={tasks.length > 0}
                />
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-border/50">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Tasks Loaded
              </h3>
              <TaskList tasks={tasks} />
            </div>
          </section>

          {/* Right Panel - Results */}
          <section className="glass rounded-2xl p-6 animate-in-delay-2">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Results</h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {results.length > 0 ? `${results.length} result${results.length !== 1 ? 's' : ''}` : '-'}
              </span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {results.length > 0 ? (
                results.map((task, index) => (
                  <ResultCard key={`${task.title}-${index}`} task={task} index={index} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="p-4 rounded-full bg-muted/50 mb-4">
                    <Sparkles className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    No results yet. Add tasks and click Analyze to see prioritized results.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
