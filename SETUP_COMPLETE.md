# Smart Task Analyzer - Setup and Deployment Guide

Project Owner: Akshita Kumari

## Project Status: READY TO RUN

Your Smart Task Analyzer project is now fully configured and ready to use!

---

## Getting Started

### Quick Start (1 minute)

1. **Open a terminal in the project directory** (`e:\task`)

2. **Run the development server:**
   ```bash
   cd backend
   python manage.py runserver
   ```

3. **Open the frontend:**
   - Open `frontend/index.html` in your web browser
   - Or navigate to: http://127.0.0.1:8000/

---

## What's Been Set Up

DJANGO BACKEND
- Database configured and migrated (SQLite)
- Task API endpoints active
- CORS enabled for frontend communication
- 4 sorting strategies implemented

FRONTEND INTERFACE
- HTML/CSS/JavaScript UI (no frameworks)
- Task input form with JSON bulk import
- Real-time priority visualization
- Strategy selector

GIT REPOSITORY
- Local Git initialized
- Initial commit created
- GitHub remote configured
- Code pushed to: https://github.com/akshita317/smart-task-analyzer

---

## Project Structure

```
task/
├── backend/                 # Django project
│   ├── backend/            # Project settings
│   │   ├── settings.py     # Django configuration (FIXED)
│   │   ├── urls.py         # URL routing (FIXED)
│   │   └── wsgi.py
│   ├── task/               # Main app
│   │   ├── models.py       # Task model
│   │   ├── views.py        # API endpoints
│   │   ├── scoring.py      # Prioritization algorithm
│   │   ├── urls.py         # App routes (FIXED)
│   │   └── tests.py        # Unit tests
│   ├── manage.py           # Django CLI (FIXED location)
│   └── db.sqlite3          # Database
├── frontend/               # Web UI
│   ├── index.html          # Main page
│   ├── script.js           # Frontend logic
│   └── styles.css          # Styling
├── requirements.txt        # Python dependencies
├── .gitignore             # Git ignore rules
└── README.md              # Documentation
```

## Running Tests

Test the scoring algorithm:
```bash
cd backend
python manage.py test task
```

---

## API Reference

### POST /api/tasks/analyze/
Analyze and prioritize a list of tasks.

**Request:**
```json
[
  {
    "title": "Fix login bug",
    "due_date": "2025-11-30",
    "estimated_hours": 3,
    "importance": 8,
    "dependencies": []
  }
]
```

**Query Parameters:**
- `strategy`: `smart` (default), `fastest`, `impact`, or `deadline`

**Response:**
```json
[
  {
    "title": "Fix login bug",
    "score": 135,
    "explanation": "Overdue task with high importance...",
    ...other fields
  }
]
```

### GET /api/tasks/suggest/
Get top 3 recommended tasks for today.

---

## Sorting Strategies

1. **Smart Balance** (default) - Weighs all factors equally
2. **Fastest Wins** - Prioritizes quick, easy tasks
3. **High Impact** - Focuses on importance score
4. **Deadline Driven** - Emphasizes due dates

---

## GitHub Repository

URL: https://github.com/akshita317/smart-task-analyzer

Current Status:
- Initial commit: All project files
- Updated README: Better documentation
- Ready for development: Yes

### To Push Future Changes:
```bash
git add .
git commit -m "Your message"
git push
```

---

## Development Commands

| Command | Purpose |
|---------|---------|
| `python manage.py runserver` | Start dev server |
| `python manage.py migrate` | Apply database migrations |
| `python manage.py makemigrations` | Create new migrations |
| `python manage.py test task` | Run tests |
| `python manage.py shell` | Django Python shell |

---

## Next Steps (Optional)

- Add unit tests for edge cases
- Implement circular dependency detection
- Add date intelligence (weekends/holidays)
- Create Eisenhower Matrix view
- Add user authentication if needed

---

## Important Notes

- **Development Only**: The current setup uses Django's development server. For production, use Gunicorn or ASGI.
- **Database**: SQLite is suitable for development. For production, consider PostgreSQL.
- **Frontend**: Open `frontend/index.html` directly in browser OR access via Django server.
- **CORS**: Currently configured to allow local requests only.

---

## You're All Set!

Your Smart Task Analyzer is ready to use. Start the server and open the frontend to begin analyzing your tasks!

For any issues, check the Django console output for error messages.
