# Render Deployment Guide - Backend

## 🚀 Step-by-Step Setup

### Step 1: Connect Repository

1. On the "New Web Service" page, click **"Connect account"** or **"Connect GitHub"**
2. Authorize Render to access your GitHub repository
3. Select your repository: `global204toad/Nilo` (or your repo name)

### Step 2: Configure Service Settings

Fill in these fields:

#### Basic Settings:
- **Name:** `nilo-backend` (or any name you prefer)
- **Region:** Choose closest to your users (e.g., `Oregon (US West)`)
- **Branch:** `main` (or `master`)

#### Build & Deploy:
- **Root Directory:** `backend` ⚠️ **CRITICAL - Set this to `backend`**
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

#### Plan:
- **Free:** $0/month (good for testing)
- **Starter:** $7/month (better performance)
- Choose based on your needs

### Step 3: Add Environment Variables

Click **"+ Add Environment Variable"** and add these:

```
MONGODB_URI = mongodb+srv://aliashrafosman777_db_user:ALIashraf555@cluster0.eie1ain.mongodb.net/nilo?retryWrites=true&w=majority

EMAIL_HOST = smtp.gmail.com

EMAIL_PORT = 587

EMAIL_USER = customerservice.nilo@gmail.com

EMAIL_PASS = your-gmail-app-password
```

⚠️ **IMPORTANT:** 
- **DO NOT** set `PORT` - Render sets this automatically
- Make sure `EMAIL_PASS` is a Gmail App Password (not your regular password)

### Step 4: Advanced Settings (Optional)

Click on **"Advanced"** to expand:

- **Auto-Deploy:** `Yes` (deploys on every push to main branch)
- **Health Check Path:** Leave empty (or set to `/api/hello`)

### Step 5: Deploy

1. Click **"Create Web Service"** button at the bottom
2. Render will start building your service
3. Watch the build logs to ensure it succeeds

---

## ✅ What to Expect

### Build Process:
1. ✅ Clones your repository
2. ✅ Changes to `backend` directory
3. ✅ Runs `npm install`
4. ✅ Starts server with `npm start`
5. ✅ Server binds to Render's assigned port

### Success Indicators:
- ✅ Build logs show "Build successful"
- ✅ Service status shows "Live"
- ✅ You get a URL like: `https://nilo-backend.onrender.com`

---

## 🔍 Verify Deployment

### Test Your Backend:

1. **Health Check:**
   ```
   https://your-service-name.onrender.com/api/hello
   ```
   Should return: `{"message":"Welcome to Nilo API"}`

2. **Products Endpoint:**
   ```
   https://your-service-name.onrender.com/api/products
   ```
   Should return JSON array of products

---

## 🔧 Update Frontend (Vercel)

After backend is deployed:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add/Update:
   ```
   VITE_API_URL = https://your-service-name.onrender.com/api
   ```
3. Redeploy frontend

---

## 🐛 Troubleshooting

### Issue: Build Fails
**Check:**
- Root Directory is set to `backend`
- Build Command is `npm install`
- All dependencies are in `package.json`

### Issue: Service Crashes
**Check:**
- Start Command is `npm start`
- Environment variables are set correctly
- MongoDB URI is correct
- Server logs for errors

### Issue: 404 Errors
**Check:**
- Routes are correct (`/api/products`, etc.)
- Server is running (check logs)
- Health check endpoint works

### Issue: CORS Errors
**Fix:** Already handled in `server.js` - Render domains are allowed

---

## 📝 Important Notes

1. **Free Tier Limitations:**
   - Service spins down after 15 minutes of inactivity
   - First request after spin-down takes ~30 seconds (cold start)
   - Consider upgrading to Starter plan for always-on service

2. **Environment Variables:**
   - Never commit `.env` file to GitHub
   - Always set variables in Render dashboard
   - PORT is automatically set by Render

3. **Logs:**
   - View logs in Render dashboard → Logs tab
   - Useful for debugging issues

---

## ✅ Checklist

- [ ] Repository connected to Render
- [ ] Root Directory set to `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Environment variables added (except PORT)
- [ ] Service deployed successfully
- [ ] Health check endpoint works
- [ ] Products endpoint returns data
- [ ] Frontend `VITE_API_URL` updated
- [ ] Frontend redeployed

---

**After completing these steps, your backend should be live on Render!** 🎉

