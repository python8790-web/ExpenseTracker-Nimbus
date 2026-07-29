# Deployment Guide - Expense Tracker

## Overview
This guide will help you deploy the Expense Tracker app to:
- **Frontend**: Vercel
- **Backend**: Railway

## Prerequisites
- GitHub account
- Vercel account (free)
- Railway account (free tier available)

---

## Part 1: Prepare Your Repository

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ExpenseTracker-Nimbus.git
git push -u origin main
```

---

## Part 2: Deploy Backend to Railway

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Authorize Railway to access your GitHub
4. Select the `ExpenseTracker-Nimbus` repository

### Step 3: Configure Backend Service
1. In Railway dashboard, go to your project
2. Add a new service:
   - Click "New"
   - Select "GitHub Repo"
   - Choose the repository

### Step 4: Set Environment Variables
In Railway dashboard, go to Variables:

```
PORT=3000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this
DATABASE_URL=file:./data/dev.db
```

**Important:** Replace `your-super-secret-jwt-key-change-this` with a strong random key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Set Root Directory (Important!)
1. In Railway settings for your service:
2. Set "Root Directory" to `server`
3. Click "Deploy"

### Step 6: Get Backend URL
After deployment, Railway will provide a public URL like:
`https://your-app-name.railway.app`

Copy this URL - you'll need it for the frontend.

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### Step 2: Deploy Project
1. Click "New Project"
2. Import your GitHub repository
3. Select the repository

### Step 3: Configure Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 4: Set Environment Variables
In Vercel deployment settings, add:

```
VITE_API_URL=https://angelic-abundance-production-26da.up.railway.app/api
```

Replace with your actual Railway backend URL from Part 2.

### Step 5: Deploy
Click "Deploy" and wait for it to complete.

---

## Part 4: Verify Deployment

1. Visit your Vercel frontend URL
2. Try creating a new account
3. Verify that expenses and categories are created
4. Check the backend logs in Railway dashboard if any issues occur

---

## Troubleshooting

### Frontend shows "API Error"
- Check that `VITE_API_URL` environment variable is set correctly in Vercel
- Make sure Railway backend is running (check Railway dashboard)
- Check browser console for CORS errors

### Backend returns 404
- Verify the Railway URL is correct
- Check that root directory is set to `server`
- Check build logs in Railway

### Database Issues
- Railway creates a persistent data directory
- Your SQLite database will be stored at `./data/dev.db`
- To migrate existing data, use Prisma migrations

---

## Optional: Use PostgreSQL Instead of SQLite

For production reliability, consider using PostgreSQL:

1. In Railway, add a new service:
   - Click "New"
   - Select "PostgreSQL"
   - Railway will auto-create DATABASE_URL

2. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Run migrations:
```bash
npx prisma migrate deploy
```

---

## Helpful Commands

### Local Testing
```bash
# Terminal 1: Start Backend
cd server
npm install
npx prisma db push
npm run dev

# Terminal 2: Start Frontend
cd client
npm install
npm run dev
```

### View Railway Logs
In Railway dashboard → your service → Logs tab

### Redeploy
- Simply push to GitHub and Railway/Vercel will auto-deploy
- Or manually trigger deployment in respective dashboards

---

## Security Notes

1. **Change JWT_SECRET** - Generate a new one for production
2. **Environment Variables** - Never commit `.env` files
3. **CORS** - Verify allowed origins in backend
4. **HTTPS** - Both Vercel and Railway provide free HTTPS

---

## Support

For issues:
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- Prisma: https://www.prisma.io/docs
