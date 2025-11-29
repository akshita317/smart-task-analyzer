# Deployment Guide - Smart Task Analyzer

## Architecture

- **Frontend**: React + TypeScript (Vercel recommended)
- **Backend**: Django REST API (Heroku, Railway, or similar)
- **Database**: SQLite (development) → PostgreSQL (production)

## Frontend Deployment on Vercel

### Step 1: Prepare Frontend

1. **Install dependencies** (if not already done):
```bash
cd frontend
npm install
```

2. **Create `.env.production` file** in `frontend/` directory:
```env
VITE_API_URL=https://your-backend-url.com
```

Replace `your-backend-url.com` with your actual backend URL.

### Step 2: Deploy to Vercel

1. **Connect repository to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository (GitHub, GitLab, Bitbucket)
   - Select the project

2. **Configure build settings**:
   - **Root Directory**: `frontend/`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Add Environment Variables** in Vercel dashboard:
   - Go to Settings → Environment Variables
   - Add: `VITE_API_URL` = your backend URL

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your frontend

## Backend Deployment on Heroku

### Step 1: Prepare Backend

1. **Install Heroku CLI**:
```bash
# Windows (using npm)
npm install -g heroku

# Or use Heroku installer from heroku.com/downloads
```

2. **Create `requirements.txt`** (if not exists):
```bash
cd backend
pip freeze > requirements.txt
```

Add/ensure these packages:
```
Django==5.2.5
gunicorn==21.2.0
python-dotenv==1.0.0
```

3. **Create `Procfile`** in project root:
```
web: gunicorn backend.wsgi
```

4. **Create `.env` file** (don't commit!):
```
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-heroku-app.herokuapp.com
DATABASE_URL=postgres://your-db-url
```

5. **Update `settings.py`** for production:
```python
import os
from dotenv import load_dotenv

load_dotenv()

DEBUG = os.getenv('DEBUG', 'False') == 'True'
SECRET_KEY = os.getenv('SECRET_KEY')
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')

# Database - use Heroku PostgreSQL
import dj_database_url
DATABASES = {
    'default': dj_database_url.config(default='sqlite:///db.sqlite3')
}
```

### Step 2: Deploy to Heroku

1. **Login to Heroku**:
```bash
heroku login
```

2. **Create Heroku app**:
```bash
heroku create your-app-name
```

3. **Add environment variables**:
```bash
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS=your-app-name.herokuapp.com
```

4. **Deploy**:
```bash
git push heroku main
```

5. **Run migrations**:
```bash
heroku run python manage.py migrate
```

## Alternative: Render (Easier than Heroku)

1. Go to [render.com](https://render.com)
2. Click "New Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend/`
   - **Build Command**: `pip install -r requirements.txt && python manage.py migrate`
   - **Start Command**: `gunicorn backend.wsgi`
5. Add environment variables in dashboard
6. Deploy

## Connect Frontend to Backend

Once both are deployed:

1. **Update Vercel environment variable**:
   - Go to Vercel dashboard → your project
   - Settings → Environment Variables
   - Set `VITE_API_URL` to your backend URL
   - Redeploy

2. **Update CORS settings in Django**:
   - Edit `backend/settings.py`
   - Add your Vercel frontend URL to `CORS_ALLOWED_ORIGINS`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       'https://your-frontend.vercel.app',
       # ... other URLs
   ]
   ```

3. **Test connection**:
   - Open your Vercel app in browser
   - Open DevTools Console
   - Try adding a task and clicking "Analyze"
   - Check for API errors

## Troubleshooting

### CORS errors
- Verify `VITE_API_URL` is set correctly in Vercel
- Check `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Ensure Django is running without `DEBUG=True` in production

### 404 on API endpoints
- Verify backend is deployed and running
- Check Django URL configuration in `backend/urls.py`
- Ensure migrations have been run

### API URL not working
- Frontend tries `http://localhost:8000` by default
- Set `VITE_API_URL` environment variable
- Check browser console for actual API calls

## Environment Variables Summary

### Frontend (.env.production or Vercel dashboard)
```
VITE_API_URL=https://your-backend-url.com
```

### Backend (Heroku/Render dashboard)
```
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-app.herokuapp.com
DATABASE_URL=postgres://user:pass@host/db
```

## Security Notes

- Never commit `.env` files
- Rotate SECRET_KEY in production
- Set `DEBUG=False` in production
- Use HTTPS only (`https://` URLs)
- Keep dependencies updated

## Monitoring & Logs

### Vercel
- Logs → Deployments → Click deployment → Logs

### Heroku
```bash
heroku logs -t
```

### Render
- Dashboard → your service → Logs tab

---

For more help, check:
- [Vercel Docs](https://vercel.com/docs)
- [Django Deployment](https://docs.djangoproject.com/en/5.2/howto/deployment/)
- [Heroku Django](https://devcenter.heroku.com/articles/deploying-python)
