# Quick Deploy to Vercel - Smart Task Analyzer

## Quick Start (5 minutes)

### Prerequisites
- GitHub account (repository already connected)
- Vercel account (free at vercel.com)
- Backend deployed somewhere (Heroku, Railway, Render, etc.)

---

## Step 1: Deploy Backend (Choose One)

### Option A: Heroku (Easiest)

```bash
# Install Heroku CLI, then:
cd backend
heroku login
heroku create your-app-name

# Deploy
git push heroku main

# Setup database
heroku run python manage.py migrate

# Get your backend URL: https://your-app-name.herokuapp.com
```

### Option B: Railway.app (Recommended - Free)

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Connect GitHub
4. Select your repository
5. Select `backend` folder
6. Add PostgreSQL (optional, but recommended)
7. Deploy automatically
8. Get your backend URL from dashboard

### Option C: Render (Also Great)

1. Go to [render.com](https://render.com)
2. New Web Service
3. Connect GitHub
4. Select repository
5. Settings:
   - Root: `backend/`
   - Build: `pip install -r requirements.txt && python manage.py migrate`
   - Start: `gunicorn backend.wsgi`
6. Deploy

---

## Step 2: Deploy Frontend to Vercel

### Method 1: Via Vercel Website (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Paste your GitHub URL: `https://github.com/akshita317/smart-task-analyzer`
4. Click "Import"
5. **Important Settings**:
   - Root Directory: `frontend/`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Environment Variables"
7. Add variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.com` (from Step 1)
8. Click "Deploy"

**Done!** Your frontend is live.

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Follow prompts
# When asked for API URL, enter your backend URL
```

---

## Step 3: Update Backend CORS Settings

Edit `backend/backend/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'https://your-frontend.vercel.app',  # Your Vercel URL
    'http://localhost:3000',  # For local testing
]
```

Push to GitHub and redeploy (automatic).

---

## Verify Everything Works

1. Open your Vercel URL: `https://your-app-name.vercel.app`
2. Add a task
3. Click "Analyze" or "Suggest Top 3"
4. Check browser console (F12) for any errors
5. If it works → Success! 🎉

---

## If You Get Errors

### "Failed to fetch"
- Check CORS in Django settings
- Verify `VITE_API_URL` is correct in Vercel
- Check backend is running

### "API returned 404"
- Verify backend URL is correct
- Check Django URLs configuration
- Run migrations: `heroku run python manage.py migrate`

### "Backend unreachable"
- Is backend deployed?
- Try visiting backend URL directly
- Check backend logs

---

## Environment Variables

### Vercel Dashboard
- Settings → Environment Variables
- Add: `VITE_API_URL=https://your-backend.herokuapp.com`

### Django Backend (via Heroku/Render)
```
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-backend.herokuapp.com
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

---

## Useful Commands

```bash
# Check Heroku logs
heroku logs -t

# Run migrations
heroku run python manage.py migrate

# Redeploy (git push auto-redeploys)
git push heroku main

# Check Vercel deployment
# Go to vercel.com dashboard → your project → Deployments
```

---

## Full URLs After Deployment

- **Frontend**: `https://your-app-name.vercel.app`
- **Backend API**: `https://your-app-name.herokuapp.com/api/tasks/analyze/`

---

## Support

See full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

Questions? Check:
- [Vercel Docs](https://vercel.com/docs)
- [Django Docs](https://docs.djangoproject.com)
- [Heroku Docs](https://devcenter.heroku.com)
