# GroningenRentals Deployment Guide

## Option 1: Deploy to Vercel (Recommended for Backend Processes)

Vercel has excellent Next.js support and handles our API routes seamlessly.

### 1. Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up/login with GitHub

### 2. Connect GitHub Repository
- Click "Connect GitHub" in the Vercel dashboard
- Create a new repository on GitHub and push this code:
  ```bash
  # Add GitHub remote (replace with your repo URL)
  git remote add origin https://github.com/yourusername/groningen-rentals.git
  git branch -M main
  git push -u origin main
  ```

### 3. Import Project to Vercel
- In Vercel dashboard: "Add New" → "Project"
- Import your GitHub repository
- Vercel will auto-detect Next.js settings

### 4. Add Environment Variables
In Vercel project settings → Environment Variables, add:

```
NEXTAUTH_URL=https://your-vercel-app-url.vercel.app
NEXTAUTH_SECRET=super-secure-jwt-secret-key-for-production-2025
CSRF_SECRET=csrf-secret-key-for-production
ENCRYPTION_KEY=encryption-key-32-characters-long
RATE_LIMIT_REQUESTS_PER_MINUTE=60
RATE_LIMIT_REQUESTS_PER_HOUR=1000
LOG_LEVEL=info
```

### 5. Deploy
- Click "Deploy" - Vercel automatically builds and deploys
- All API routes (/api/*) will work as serverless functions
- No Edge Runtime conflicts!

## Option 2: Manual Deploy to Vercel

If you don't want GitHub integration:

1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Add environment variables via CLI or dashboard

## Backend Features That Will Work

✅ **Real Estate Scraping** - `/api/scrape-properties`
✅ **User Authentication** - `/api/auth/login`, `/api/auth/me`
✅ **Admin Dashboard** - `/api/admin/stats`, `/api/admin/cache`
✅ **Email Notifications** - `/api/notifications/subscribe`
✅ **Auto-scraping Timer** - Runs every 10 minutes
✅ **JWT Security** - bcryptjs password hashing
✅ **Rate Limiting** - API protection

## Why Vercel vs Netlify?

- **Vercel**: Built for Next.js, seamless API routes, no Edge Runtime conflicts
- **Netlify**: Better for static sites, struggles with Node.js API dependencies

## Post-Deployment Testing

1. Visit your deployed URL
2. Test login functionality
3. Check admin dashboard at `/admin`
4. Verify property scraping works
5. Test notification subscription

## Troubleshooting

If deployment fails:
1. Check build logs in Vercel dashboard
2. Ensure all environment variables are set
3. Verify Node.js version compatibility (18+)
