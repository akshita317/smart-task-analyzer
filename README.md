Smart Task Analyzer
====================

Author: Akshita Kumari

Overview
--------
A mini-application that scores and prioritizes tasks using a configurable algorithm. Backend is Django (SQLite), frontend is vanilla HTML/CSS/JS.

Quick Start
-----------

### Prerequisites
- Python 3.8+
- Git

### Setup Steps

**1. Clone the repository**
```bash
git clone https://github.com/akshita317/smart-task-analyzer.git
cd smart-task-analyzer
```

**2. Create and activate virtual environment**

Windows:
```bash
python -m venv venv
venv\Scripts\activate
```

macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

**3. Install dependencies**
```bash
pip install -r requirements.txt
```

**4. Run migrations**
```bash
cd backend
python manage.py migrate
```

**5. Start the development server**
```bash
python manage.py runserver
```
The server will be available at `http://127.0.0.1:8000/`

**6. Open the frontend**
Open `frontend/index.html` in your browser. The interface will communicate with the Django backend at `http://127.0.0.1:8000/api/tasks/`

### Example Usage
1. Add tasks using the form on the left side, or paste a JSON array
2. Select a sorting strategy (Smart Balance, Fastest Wins, High Impact, or Deadline Driven)
3. Click "Analyze" to see prioritized tasks with scores and explanations
4. Click "Suggest Top 3" to get the top 3 tasks to focus on today

API Endpoints
-------------
- POST /api/tasks/analyze/
  - Body: JSON array of tasks
  - Optional query param: strategy=fastest|impact|deadline|smart (default smart)
  - Returns: sorted tasks with `score` and `explanation`
- GET /api/tasks/suggest/
  - Returns top 3 tasks per smart strategy with explanations

Algorithm (Summary)
-------------------
Composite score = urgency + importance_weight + quick_wins - effort_penalty + dependency_impact - invalid_penalties.
- Urgency: days until due. Overdue → high boost; soon due → medium.
- Importance: weighted multiplier (default 5x) with clamping and defaults.
- Effort: small tasks (<2h) get bonus; very large tasks incur mild penalty.
- Dependencies: tasks blocking more other tasks gain priority; unresolved/circular deps penalized.
- Strategy modifiers: fastest (emphasize small effort), impact (emphasize importance), deadline (emphasize urgency), smart (balanced).

Design Decisions
----------------
- JSON input allows bulk analysis without persisting; Django model supports persistence if extended later.
- Robust parsing for dates and defaults to handle missing/invalid fields.
- Deterministic scoring with explanation strings for transparency.
- Simple strategies via weight presets; future work can expose user-configurable weights.

Run Tests
---------
- cd backend
- python manage.py test tasks

Future Improvements
-------------------
- Circular dependency graph visualization
- Holidays/weekends in urgency
- Eisenhower Matrix view
- Learning system (user feedback to adjust weights)
