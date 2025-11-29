from __future__ import annotations
from dataclasses import dataclass
from datetime import date, datetime
from typing import List, Dict, Any, Tuple, Optional, Set

@dataclass
class StrategyWeights:
    urgency: float = 1.0
    importance: float = 5.0
    quick_win_bonus: float = 10.0
    large_effort_penalty: float = 0.2  # multiplied by hours over a threshold
    overdue_boost: float = 100.0
    soon_due_boost: float = 50.0
    soon_due_days: int = 3
    quick_win_hours: int = 2
    dependency_bonus: float = 5.0  # per dependent blocked
    invalid_penalty: float = 25.0


DEFAULT_WEIGHTS = StrategyWeights()
FASTEST_WEIGHTS = StrategyWeights(quick_win_bonus=25.0, importance=3.0, urgency=0.8)
IMPACT_WEIGHTS = StrategyWeights(importance=8.0, quick_win_bonus=5.0, urgency=0.7)
DEADLINE_WEIGHTS = StrategyWeights(urgency=1.5, importance=4.0, quick_win_bonus=5.0, soon_due_days=5, soon_due_boost=60.0)


def parse_date(d: Any) -> Optional[date]:
    if d is None:
        return None
    if isinstance(d, date):
        return d
    if isinstance(d, datetime):
        return d.date()
    if isinstance(d, str):
        # try common formats
        for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%m/%d/%Y", "%Y/%m/%d"):
            try:
                return datetime.strptime(d, fmt).date()
            except ValueError:
                continue
    return None


def detect_circular_dependencies(tasks: List[Dict[str, Any]]) -> Set[str]:
    # tasks expected to have unique titles or ids; we use 'title' as key for simplicity
    graph: Dict[str, List[str]] = {}
    for t in tasks:
        key = t.get('title') or str(t.get('id'))
        deps = t.get('dependencies') or []
        graph[key] = []
        for dep in deps:
            graph[key].append(str(dep))

    visited: Set[str] = set()
    stack: Set[str] = set()
    cycles: Set[str] = set()

    def dfs(node: str):
        if node in stack:
            cycles.add(node)
            return
        if node in visited:
            return
        visited.add(node)
        stack.add(node)
        for nei in graph.get(node, []):
            dfs(nei)
        stack.remove(node)

    for n in graph.keys():
        if n not in visited:
            dfs(n)
    return cycles


def calculate_task_score(task_data: Dict[str, Any],
                          all_tasks: Optional[List[Dict[str, Any]]] = None,
                          strategy: str = 'smart') -> Tuple[float, str]:
    """
    Calculates a priority score and returns (score, explanation).
    Higher score = Higher priority.
    """
    weights = {
        'smart': DEFAULT_WEIGHTS,
        'fastest': FASTEST_WEIGHTS,
        'impact': IMPACT_WEIGHTS,
        'deadline': DEADLINE_WEIGHTS,
    }.get(strategy, DEFAULT_WEIGHTS)

    score = 0.0
    notes: List[str] = []

    # Parse and normalize fields with defaults
    title = task_data.get('title') or 'Untitled'
    due = parse_date(task_data.get('due_date'))
    importance = task_data.get('importance', 5)
    try:
        importance = int(importance)
    except Exception:
        importance = 5
    importance = max(1, min(10, importance))

    estimated_hours = task_data.get('estimated_hours', 1)
    try:
        estimated_hours = int(estimated_hours)
    except Exception:
        estimated_hours = 1
    estimated_hours = max(0, estimated_hours)

    dependencies = task_data.get('dependencies') or []
    if not isinstance(dependencies, list):
        dependencies = []

    # Urgency
    today = date.today()
    if not due:
        score -= weights.invalid_penalty
        notes.append('Missing/invalid due_date (-invalid)')
        days_until_due = 9999
    else:
        days_until_due = (due - today).days
        if days_until_due < 0:
            score += weights.overdue_boost
            notes.append('Overdue (+overdue)')
        elif days_until_due <= weights.soon_due_days:
            score += weights.soon_due_boost
            notes.append('Due soon (+soon)')
        # apply urgency gradient (inverse days); avoid div-by-zero
        if days_until_due != 0:
            score += weights.urgency * (1_000 / (abs(days_until_due) + 5))
            notes.append('Urgency gradient')

    # Importance
    imp_contrib = importance * weights.importance
    score += imp_contrib
    notes.append(f'Importance x{weights.importance}')

    # Effort quick wins vs large penalty
    if estimated_hours < weights.quick_win_hours:
        score += weights.quick_win_bonus
        notes.append('Quick win bonus')
    elif estimated_hours > 12:
        penalty = (estimated_hours - 12) * weights.large_effort_penalty
        score -= penalty
        notes.append('Large effort penalty')

    # Dependencies impact (simple heuristic: more dependents -> higher priority)
    dependents_count = 0
    if all_tasks:
        # Count how many tasks list this task as a dependency
        key = task_data.get('title') or str(task_data.get('id'))
        for t in all_tasks:
            deps = t.get('dependencies') or []
            if key in [str(d) for d in deps]:
                dependents_count += 1
        if dependents_count:
            score += dependents_count * weights.dependency_bonus
            notes.append(f'Blocks {dependents_count} task(s)')

    # Circular dependency detection (penalize if part of a cycle)
    if all_tasks:
        cycles = detect_circular_dependencies(all_tasks)
        key = task_data.get('title') or str(task_data.get('id'))
        if key in cycles:
            score -= weights.invalid_penalty
            notes.append('Circular dependency (-invalid)')

    explanation = f"Score={round(score, 2)} | " + "; ".join(notes) if notes else f"Score={round(score, 2)}"
    return score, explanation


def analyze_tasks(tasks: List[Dict[str, Any]], strategy: str = 'smart') -> List[Dict[str, Any]]:
    tasks_copy = [dict(t) for t in tasks]
    for t in tasks_copy:
        s, exp = calculate_task_score(t, tasks_copy, strategy=strategy)
        t['score'] = round(s, 2)
        t['explanation'] = exp
    tasks_copy.sort(key=lambda x: x.get('score', 0), reverse=True)
    return tasks_copy


def top_suggestions(tasks: List[Dict[str, Any]], n: int = 3, strategy: str = 'smart') -> List[Dict[str, Any]]:
    analyzed = analyze_tasks(tasks, strategy=strategy)
    return analyzed[:n]
