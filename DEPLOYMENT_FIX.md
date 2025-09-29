# Deployment Fix Instructions

Your login issue is due to the frontend trying to make API calls to itself instead of your Render backend. Here's how to fix it:

## Problem
The frontend is configured to make API calls to `/api` (relative URL), which means it's trying to call APIs on the Vercel domain instead of your Render backend.

## Solution

### Step 1: Update Render Environment Variables (Backend)
In your Render dashboard, update the `CORS_ORIGIN` environment variable to include your Vercel frontend URL:

```
CORS_ORIGIN=https://ongc-repo-final.vercel.app,http://localhost:5173,http://localhost:3000
```

### Step 2: Set Vercel Environment Variables (Frontend)
In your Vercel dashboard, add the following environment variable:

1. Go to your Vercel project settings
2. Go to "Environment Variables"
3. Add a new variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://YOUR_RENDER_APP_NAME.onrender.com/api` (replace with your actual Render URL)
   - **Environment**: Production

### Step 3: Redeploy Both Services
1. **Backend (Render)**: Trigger a new deployment after updating the CORS_ORIGIN
2. **Frontend (Vercel)**: Redeploy after adding the environment variable

### Step 4: Test the Login
After redeployment, try logging in with these credentials:
- **Email**: `hr@ongc.co.in`
- **Password**: `password123`

OR

- **Email**: `admin@ongc.co.in`  
- **Password**: `admin123`

## How to Find Your Render Backend URL

1. Go to your Render dashboard
2. Click on your backend service
3. Look for the URL at the top (something like `https://your-app-name.onrender.com`)
4. Use this URL as the base for `VITE_API_BASE_URL`

## Additional Notes

- The frontend code has been updated to use environment variables
- CORS is configured on the backend to accept requests from your Vercel domain
- Make sure both services are using HTTPS in production

## Troubleshooting

If login still doesn't work:

1. **Check browser developer tools**:
   - Open Network tab
   - Try to login
   - Look for failed API requests (they should go to your Render URL, not Vercel)

2. **Check CORS errors**:
   - Look in the browser console for CORS-related error messages

3. **Verify environment variables**:
   - In Vercel: Make sure `VITE_API_BASE_URL` is set correctly
   - In Render: Make sure `CORS_ORIGIN` includes your Vercel URL

## Current Backend Users
Based on the server code, these are the current test users:

1. **HR Manager**
   - Email: hr@ongc.co.in
   - Password: password123
   - Role: hr_manager

2. **System Administrator**
   - Email: admin@ongc.co.in
   - Password: admin123
   - Role: admin