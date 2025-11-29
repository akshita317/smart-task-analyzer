Smart Task Analyzer
====================

Overview
--------
A mini-application that scores and prioritizes tasks using a configurable algorithm. Backend is Django (SQLite), frontend is vanilla HTML/CSS/JS.

Quick Start
-----------
1. Create venv and install deps
   - Windows (cmd):
     - python -m venv venv
     - venv\Scripts\activate
     - pip install -r requirements.txt
   - macOS/Linux (bash):
     - python3 -m venv venv
     - source venv/bin/activate
     - pip install -r requirements.txt
2. Run server
   - cd backend
   - python manage.py migrate
   - python manage.py runserver
3. Open frontend
   - Open frontend/index.html in your browser, or serve statically via any server. It calls http://127.0.0.1:8000/api/tasks/...

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
