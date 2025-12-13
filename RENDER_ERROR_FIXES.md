# Render Deployment Error Fixes

## Common Errors and Solutions

### Error 1: "Repository not found" or "Cannot connect to repository"

**Solution:**
1. Make sure you've authorized Render to access your GitHub account
2. Click "Connect account" or "Connect GitHub" if you see that option
3. Grant Render access to your repositories
4. Try selecting the repository again

---

### Error 2: "Invalid root directory" or "Directory not found"

**Solution:**
1. Make sure **Root Directory** is set to exactly: `backend`
   - Not `backend/`
   - Not `./backend`
   - Just: `backend`
2. Verify your repository has a `backend` folder with `package.json` inside

---

### Error 3: "Build command failed" or "npm install failed"

**Solution:**
1. Check that **Build Command** is: `npm install`
2. Make sure `backend/package.json` exists and has all dependencies listed
3. Try clearing the build cache (if option available)

---

### Error 4: "Start command not found" or "Cannot start service"

**Solution:**
1. Make sure **Start Command** is: `npm start`
2. Verify `backend/package.json` has a `start` script:
   ```json
   "scripts": {
     "start": "node server.js"
   }
   ```

---

### Error 5: "Environment variable error" or "Invalid variable name"

**Solution:**
1. Make sure variable names don't have spaces
2. Use underscores: `MONGODB_URI` not `MONGODB URI`
3. Don't use quotes in the value field
4. Make sure you're not setting `PORT` (Render sets it automatically)

---

### Error 6: "Service name already exists"

**Solution:**
1. Change the service name to something unique
2. Try: `nilo-backend-api` or `nilo-backend-service`

---

### Error 7: "Invalid region" or "Region not available"

**Solution:**
1. Choose a different region (e.g., `Oregon (US West)`)
2. Free tier might have limited regions

---

## Quick Checklist

Before clicking "Create Web Service", verify:

- [ ] Repository is connected and selected
- [ ] **Root Directory:** `backend` (exactly, no trailing slash)
- [ ] **Build Command:** `npm install`
- [ ] **Start Command:** `npm start`
- [ ] **Environment:** `Node`
- [ ] Environment variables added (except PORT)
- [ ] Service name is unique

---

## Step-by-Step Fix

1. **Check the error message** - What does it say exactly?

2. **Verify Root Directory:**
   - Should be: `backend`
   - Not: `backend/` or `./backend` or empty

3. **Check Commands:**
   - Build: `npm install`
   - Start: `npm start`

4. **Verify Environment Variables:**
   - Names: `MONGODB_URI`, `EMAIL_HOST`, etc. (no spaces)
   - Values: No quotes needed
   - Don't set `PORT`

5. **Try Again:**
   - Fix the issue
   - Click "Create Web Service" again

---

## Still Having Issues?

**Share the exact error message** and I can provide a specific fix!

Common things to check:
- Screenshot of the error
- What field is highlighted in red?
- What does the error message say exactly?

