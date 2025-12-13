# Railway Deployment Fix

## Problem
Railway deployment fails with "Error creating build plan with Railpack"

## ✅ Solution Applied

### Files Created/Updated:

1. **`backend/railway.json`** - Railway configuration
2. **`backend/nixpacks.toml`** - Nixpacks build configuration  
3. **`backend/package.json`** - Added build script and Node.js engine requirements
4. **`backend/server.js`** - Updated to bind to `0.0.0.0` for Railway

## 🚀 Next Steps

### 1. Commit and Push Changes
```bash
git add .
git commit -m "Fix Railway deployment configuration"
git push origin main
```

### 2. Verify Railway Settings

In Railway Dashboard:
1. Go to your project → **Settings**
2. Check **Root Directory** is set to `backend`
3. Verify **Start Command** is: `npm start`
4. Verify **Build Command** is: `npm install` (or leave empty)

### 3. Check Environment Variables

Make sure these are set in Railway:
- `MONGODB_URI` - Your MongoDB connection string
- `PORT` - Railway will set this automatically (don't set manually)
- `EMAIL_HOST` - `smtp.gmail.com`
- `EMAIL_PORT` - `587`
- `EMAIL_USER` - `customerservice.nilo@gmail.com`
- `EMAIL_PASS` - Your Gmail app password

### 4. Redeploy

After pushing changes:
1. Railway will automatically detect the new commit
2. It will trigger a new deployment
3. Watch the logs to ensure it builds successfully

## 🔍 Troubleshooting

### If build still fails:

1. **Check Railway Logs:**
   - Go to your deployment → "View logs"
   - Look for specific error messages

2. **Verify Root Directory:**
   - Settings → Root Directory should be `backend`
   - Not `nilo` or empty

3. **Check Node.js Version:**
   - Railway should auto-detect Node.js 18+
   - If not, you can specify in `nixpacks.toml`

4. **Verify package.json:**
   - Make sure `start` script exists
   - Make sure all dependencies are listed

### Common Issues:

**Issue:** "Cannot find module"
- **Fix:** Make sure all dependencies are in `package.json`

**Issue:** "Port already in use"
- **Fix:** Railway sets PORT automatically, don't hardcode it

**Issue:** "MongoDB connection failed"
- **Fix:** Check `MONGODB_URI` is set correctly in Railway environment variables

## ✅ Success Indicators

When deployment succeeds, you should see:
- ✅ All build steps complete
- ✅ Server starts successfully
- ✅ Logs show "Server running on port XXXX"
- ✅ Service shows as "Active" or "Running"

## 📝 After Successful Deployment

1. **Get your Railway URL:**
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Or you can set a custom domain

2. **Test the API:**
   - Visit: `https://your-app.railway.app/api/products`
   - Should return JSON with products

3. **Update Vercel Environment Variable:**
   - Go to Vercel → Settings → Environment Variables
   - Set `VITE_API_URL` = `https://your-app.railway.app/api`
   - Redeploy frontend

---

**After these steps, your backend should deploy successfully on Railway!** 🎉

