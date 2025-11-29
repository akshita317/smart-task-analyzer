from django.test import SimpleTestCase
from datetime import date, timedelta
from .scoring import calculate_task_score, analyze_tasks

class ScoringTests(SimpleTestCase):
    def test_overdue_gets_boost(self):
        task = {
            'title': 'Overdue',
            'due_date': (date.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
            'estimated_hours': 3,
            'importance': 5,
            'dependencies': [],
        }
        score, _ = calculate_task_score(task, [task])
        self.assertGreaterEqual(score, 100)

    def test_quick_win_bonus(self):
        task = {
            'title': 'Quick',
            'due_date': (date.today() + timedelta(days=5)).strftime('%Y-%m-%d'),
            'estimated_hours': 1,
            'importance': 5,
            'dependencies': [],
        }
        score, _ = calculate_task_score(task, [task])
        self.assertGreater(score, 10)

    def test_analyze_sorts_desc(self):
        t1 = {
            'title': 'Less important',
            'due_date': (date.today() + timedelta(days=10)).strftime('%Y-%m-%d'),
            'estimated_hours': 4,
            'importance': 3,
            'dependencies': [],
        }
        t2 = {
            'title': 'More important',
            'due_date': (date.today() + timedelta(days=10)).strftime('%Y-%m-%d'),
            'estimated_hours': 4,
            'importance': 8,
            'dependencies': [],
        }
        result = analyze_tasks([t1, t2])
        self.assertEqual(result[0]['title'], 'More important')
