Smart Task Analyzer
====================

Author: Akshita Kumari

Overview
--------
A full-stack application that scores and prioritizes tasks using intelligent algorithms. Built with React + TypeScript (frontend) and Django (backend) with professional dark theme UI.

Live Deployment
---------------

- **Frontend**: [https://smart-task-analyzer-ruddy.vercel.app/](https://smart-task-analyzer-ruddy.vercel.app/) (Vercel)
- **Backend API**: [https://smart-task-analyzer-production.up.railway.app/](https://smart-task-analyzer-production.up.railway.app/) (Railway)

Quick Start
-----------

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Setup Steps

**1. Clone the repository**
```bash
git clone https://github.com/akshita317/smart-task-analyzer.git
cd smart-task-analyzer
```

**2. Setup Backend**

Windows:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

macOS/Linux:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Backend will be available at `http://127.0.0.1:8000/`

**3. Setup Frontend** (in new terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:3000/`

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
- POST /api/tasks/suggest/
  - Body: JSON array of tasks
  - Returns: top 3 tasks per smart strategy with explanations

Algorithm (Summary)
-------------------
Composite score = urgency + importance_weight + quick_wins - effort_penalty + dependency_impact - invalid_penalties.
- Urgency: days until due. Overdue → high boost; soon due → medium.
- Importance: weighted multiplier (default 5x) with clamping and defaults.
- Effort: small tasks (<2h) get bonus; very large tasks incur mild penalty.
- Dependencies: tasks blocking more other tasks gain priority; unresolved/circular deps penalized.
- Strategy modifiers: fastest (emphasize small effort), impact (emphasize importance), deadline (emphasize urgency), smart (balanced).

Tech Stack
----------
**Backend:**
- Django 5.2.5
- Python 3.x
- SQLite (dev), PostgreSQL (production)

**Frontend:**
- React 18
- TypeScript 5.3
- Vite 5.4 (build tool)
- Tailwind CSS 3.3
- Lucide React (icons)

Design Decisions
----------------
- React + TypeScript for type-safe frontend
- Vite for fast development and optimized builds
- Dark theme with professional cyan/blue accents
- Responsive layout using Tailwind CSS
- Real-time API integration with fallback to local analysis
- CORS middleware for seamless frontend-backend communication

Deployment
----------
See [QUICK_DEPLOY.md](QUICK_DEPLOY.md) for deployment options:
- Railway (recommended, easiest)
- Render
- Heroku
- Vercel + separate backend

Run Tests
---------
```bash
cd backend
python manage.py test tasks
```

Future Improvements
-------------------
- Circular dependency graph visualization
- Holidays/weekends in urgency calculation
- Eisenhower Matrix view
- Learning system (user feedback to adjust weights)
- Task persistence and user accounts
