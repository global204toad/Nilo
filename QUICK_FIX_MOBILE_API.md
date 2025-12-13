# 🚨 Quick Fix: Mobile Products Not Loading

## Problem
Products page shows "Unable to connect to server" error on mobile because the API URL is not configured in Vercel.

## ✅ Solution (5 Minutes)

### Step 1: Deploy Backend (If Not Already Deployed)

**Option A: Deploy to Railway (Easiest)**
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set **Root Directory** to `backend`
5. Add these environment variables:
   ```
   MONGODB_URI=mongodb+srv://aliashrafosman777_db_user:ALIashraf555@cluster0.eie1ain.mongodb.net/nilo?retryWrites=true&w=majority
   PORT=5000
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=customerservice.nilo@gmail.com
   EMAIL_PASS=your-app-password
   ```
6. Railway will give you a URL like: `https://your-app.railway.app`
7. Copy this URL - you'll need it in Step 2

**Option B: Deploy to Render**
1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Set **Root Directory** to `backend`
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. Add the same environment variables as above
8. Copy the URL (e.g., `https://your-app.onrender.com`)

### Step 2: Set Environment Variable in Vercel

1. Go to https://vercel.com/dashboard
2. Select your **frontend** project (`nilo-bice`)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.railway.app/api` (or your backend URL + `/api`)
   - **Environment:** Select all (Production, Preview, Development)
6. Click **Save**

### Step 3: Redeploy Frontend

1. In Vercel Dashboard, go to **Deployments**
2. Click the **three dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (2-3 minutes)

### Step 4: Test

1. Open `https://nilo-bice.vercel.app/products` on mobile
2. Products should now load! ✅

---

## 🔍 Verify Backend is Working

Before setting the environment variable, test your backend:

1. Open your backend URL in browser: `https://your-backend-url.railway.app/api/products`
2. You should see JSON data with products
3. If you see an error, check backend logs

---

## ⚠️ Common Issues

### Issue: "CORS error" in browser console
**Fix:** Make sure `backend/server.js` has the updated CORS configuration (already done in code)

### Issue: Backend returns 404
**Fix:** Check that routes are correct. Test: `https://your-backend-url/api/products`

### Issue: MongoDB connection error
**Fix:** 
1. Check MongoDB Atlas Network Access allows `0.0.0.0/0` (all IPs)
2. Verify `MONGODB_URI` is correct in backend environment variables

### Issue: Still getting network error after setting VITE_API_URL
**Fix:**
1. Make sure you added `/api` at the end of the URL
2. Redeploy frontend after setting environment variable
3. Clear browser cache and try again

---

## 📝 Quick Checklist

- [ ] Backend is deployed and accessible
- [ ] Backend URL works when tested directly
- [ ] `VITE_API_URL` is set in Vercel (with `/api` at the end)
- [ ] Frontend is redeployed after setting environment variable
- [ ] Tested on mobile device

---

**After completing these steps, the mobile products page should work!** 🎉

