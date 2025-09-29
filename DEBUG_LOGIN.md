# Debug Login Issue - Step by Step

Since backend and CORS are working perfectly, the issue is likely in the frontend configuration.

## Step 1: Check Browser Developer Tools

1. **Open** https://ongc-repo-final.vercel.app
2. **Press F12** to open developer tools
3. **Go to Network tab**
4. **Try to login** with: `hr@ongc.co.in` / `password123`
5. **Look at the API request**:

### What you should see (CORRECT):
```
Request URL: https://ongcrepofinal.onrender.com/api/auth/login
Status: 200 OK
```

### What you might see (PROBLEM):
```
Request URL: https://ongc-repo-final.vercel.app/api/auth/login
Status: 404 Not Found
```

If the request is going to Vercel domain instead of Render, the environment variable is not set.

## Step 2: Check Console for Environment Variable

In browser console (F12 → Console), type:
```javascript
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || '/api');
```

### Expected output (CORRECT):
```
API Base URL: https://ongcrepofinal.onrender.com/api
```

### Problem output (NEEDS FIX):
```
API Base URL: /api
```

## Step 3: Verify Vercel Environment Variable

1. Go to https://vercel.com/dashboard
2. Click on `ongc-repo-final` project
3. Go to **Settings** → **Environment Variables**
4. You should see:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://ongcrepofinal.onrender.com/api`
   - **Environment**: Production ✓

## Step 4: Force Redeploy

If environment variable is set but still not working:

1. In Vercel dashboard → **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Wait for deployment to complete
4. Test again

## Step 5: Alternative Quick Fix

If environment variables aren't working, temporarily hardcode the API URL:

In `Frontend/src/services/api.ts`, change:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
```

To:
```typescript
const API_BASE_URL = 'https://ongcrepofinal.onrender.com/api';
```

And in `Frontend/src/contexts/AuthContext.tsx`, replace both instances:
```typescript
const API_BASE_URL = 'https://ongcrepofinal.onrender.com/api';
```

Then push changes and redeploy.

## Common Issues:

❌ **Environment variable not set in Vercel dashboard**
❌ **Environment variable set but Vercel not redeployed**  
❌ **Browser cache showing old version**
❌ **Typo in environment variable name or value**

## Test Backend Direct (Should Work):

```bash
curl -X POST -H "Content-Type: application/json" \\
  -d '{"email":"hr@ongc.co.in","password":"password123"}' \\
  https://ongcrepofinal.onrender.com/api/auth/login
```

This should return success with token.