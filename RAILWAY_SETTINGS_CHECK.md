# Railway Settings Check - Critical Steps

## ⚠️ IMPORTANT: Check Railway Settings First!

The "Error creating build plan with Railpack" error usually means Railway can't find your `package.json` file. This is almost always because the **Root Directory** is not set correctly.

## 🔧 Step-by-Step Fix

### Step 1: Check Root Directory in Railway

1. Go to Railway Dashboard
2. Click on your **"Nilo"** service
3. Go to **Settings** tab
4. Scroll down to **"Root Directory"**
5. **CRITICAL:** Set it to: `backend`
   - Not `nilo`
   - Not empty
   - Must be exactly: `backend`
6. Click **Save**

### Step 2: Verify Service Settings

In the same Settings page, check:

- **Start Command:** Should be `npm start` (or leave empty - Railway will auto-detect)
- **Build Command:** Leave empty (Railway will auto-detect `npm install`)

### Step 3: Check Environment Variables

Go to **Variables** tab and verify these are set:

```
MONGODB_URI=mongodb+srv://aliashrafosman777_db_user:ALIashraf555@cluster0.eie1ain.mongodb.net/nilo?retryWrites=true&w=majority
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=customerservice.nilo@gmail.com
EMAIL_PASS=your-app-password
```

**DO NOT SET PORT** - Railway sets this automatically.

### Step 4: Trigger New Deployment

After changing Root Directory:

1. Go to **Deployments** tab
2. Click the **three dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic deployment

## 🔍 How to Verify Root Directory is Correct

After setting Root Directory to `backend`, Railway should be able to:
- Find `backend/package.json`
- Find `backend/server.js`
- Run `npm install` in the `backend` directory
- Run `npm start` to start the server

## ❌ Common Mistakes

1. **Root Directory is empty or set to `nilo`**
   - Railway looks for `package.json` in the root
   - It won't find it because it's in `backend/package.json`
   - **Fix:** Set Root Directory to `backend`

2. **Root Directory has trailing slash**
   - Should be `backend` not `backend/`
   - **Fix:** Remove trailing slash

3. **Case sensitivity**
   - Should be `backend` not `Backend` or `BACKEND`
   - **Fix:** Use lowercase `backend`

## ✅ Success Indicators

When Root Directory is correct, you should see in the build logs:
- ✅ "Detected Node.js project"
- ✅ "Running npm install"
- ✅ "Build completed successfully"
- ✅ "Starting server with: npm start"

## 🚨 If Still Failing

If it still fails after setting Root Directory correctly:

1. **Check the build logs:**
   - Click on the failed deployment
   - Click "View logs"
   - Look for specific error messages

2. **Verify file structure:**
   - Make sure `backend/package.json` exists
   - Make sure `backend/server.js` exists
   - Make sure `backend/node_modules` is NOT committed (should be in .gitignore)

3. **Try manual deployment:**
   - In Railway, go to Settings
   - Under "Deploy", try "Deploy from GitHub" again
   - Make sure the branch is `main` or `master`

---

**The Root Directory setting is the #1 cause of this error. Make sure it's set to `backend`!** 🎯

