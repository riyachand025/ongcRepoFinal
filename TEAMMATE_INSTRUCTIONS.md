# Instructions for Teammate - Fix Login Issue

## What's Been Fixed in the Code:
- Frontend now uses environment variables to connect to the backend
- CORS is properly configured on the backend
- Backend URL is set to: `https://ongcrepofinal.onrender.com/api`

## What You Need to Do:

### Step 1: Add Environment Variable in Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on the `ongc-repo-final` project
3. Go to **Settings** tab
4. Click on **"Environment Variables"**
5. Add new variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://ongcrepofinal.onrender.com/api`
   - **Environments**: Check "Production" (and "Preview" if needed)
6. Click **"Save"**

### Step 2: Deploy the Changes
**Option A: Push to Git (Recommended)**
```bash
git add .
git commit -m "Fix login issue - connect frontend to Render backend"
git push origin main
```

**Option B: Manual Redeploy**
1. In Vercel dashboard, go to **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment

### Step 3: Test the Login
After deployment, go to https://ongc-repo-final.vercel.app and try logging in with:

**HR Manager:**
- Email: `hr@ongc.co.in`
- Password: `password123`

**Admin:**
- Email: `admin@ongc.co.in`
- Password: `admin123`

## Verification:
- Open browser developer tools (F12)
- Go to Network tab
- Try to login
- You should see API requests going to `https://ongcrepofinal.onrender.com/api/auth/login`
- If they're still going to Vercel domain, the environment variable wasn't set correctly

## Current Status:
✅ Backend is working (tested with curl)
✅ CORS is configured correctly
✅ Frontend code is updated
❌ **Environment variable needs to be set in Vercel** ← THIS IS THE MISSING STEP

After completing both steps above, the login should work perfectly!