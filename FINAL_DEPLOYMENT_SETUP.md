# 🚀 Final Deployment Setup - Complete Guide

## ✅ Backend Status: DEPLOYED

**Backend URL:** `https://nilo-hxbc.onrender.com`  
**API Base URL:** `https://nilo-hxbc.onrender.com/api`

---

## 📋 Step 1: Configure Frontend (Vercel)

### 1.1 Set Environment Variable in Vercel

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Click on your **frontend project** (`nilo-bice` or your project name)
3. Go to **Settings** tab (top navigation)
4. Click **Environment Variables** (left sidebar)
5. Click **Add New** button

6. Add this variable:
   ```
   Name: VITE_API_URL
   Value: https://nilo-hxbc.onrender.com/api
   ```

7. **IMPORTANT:** Select all environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

8. Click **Save**

### 1.2 Verify Environment Variable

After saving, you should see:
```
VITE_API_URL = https://nilo-hxbc.onrender.com/api
```

---

## 📋 Step 2: Redeploy Frontend

### Option A: Redeploy from Dashboard

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **three dots** (⋯) menu
4. Click **Redeploy**
5. Wait for deployment to complete (2-3 minutes)

### Option B: Push a New Commit

```bash
git add .
git commit -m "Update API URL configuration"
git push origin main
```

Vercel will automatically deploy on push.

---

## 📋 Step 3: Verify Backend is Working

### Test Backend Endpoints:

1. **Health Check:**
   ```
   https://nilo-hxbc.onrender.com/api/hello
   ```
   **Expected:** `{"message":"Welcome to Nilo API"}`

2. **Products Endpoint:**
   ```
   https://nilo-hxbc.onrender.com/api/products
   ```
   **Expected:** JSON array of products

3. **Test in Browser:**
   - Open the URLs above
   - You should see JSON data
   - If you see data, backend is working! ✅

---

## 📋 Step 4: Test Frontend

### 4.1 Test on Desktop

1. Open: `https://nilo-bice.vercel.app`
2. Navigate to **Products** page (`/products`)
3. Products should load without errors ✅

### 4.2 Test on Mobile

1. Open: `https://nilo-bice.vercel.app/products` on mobile device
2. Products should load correctly ✅
3. No "Network Error" messages ✅

### 4.3 Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for:
   - ✅ `🔗 API Base URL: https://nilo-hxbc.onrender.com/api`
   - ✅ No CORS errors
   - ✅ No network errors

---

## 📋 Step 5: Verify API Integration

### Check API Calls:

1. Open browser DevTools → **Network** tab
2. Go to Products page
3. Look for requests to:
   - `https://nilo-hxbc.onrender.com/api/products`
4. Status should be **200 OK** ✅
5. Response should contain product data ✅

---

## 🔧 Current Configuration

### Backend (Render):
- **URL:** `https://nilo-hxbc.onrender.com`
- **API Base:** `https://nilo-hxbc.onrender.com/api`
- **Status:** ✅ Deployed and running
- **Environment Variables:** ✅ Set (MONGODB_URI, EMAIL_*, etc.)

### Frontend (Vercel):
- **URL:** `https://nilo-bice.vercel.app`
- **API URL:** `https://nilo-hxbc.onrender.com/api` (via VITE_API_URL)
- **Status:** ⏳ Needs redeploy after setting VITE_API_URL

---

## ✅ Final Checklist

### Backend (Render):
- [x] Service deployed successfully
- [x] Health check endpoint works (`/api/hello`)
- [x] Products endpoint works (`/api/products`)
- [x] Environment variables set
- [x] CORS configured for frontend domain

### Frontend (Vercel):
- [ ] `VITE_API_URL` environment variable set
- [ ] Frontend redeployed after setting variable
- [ ] Products page loads on desktop
- [ ] Products page loads on mobile
- [ ] No network errors in console
- [ ] API calls succeed

---

## 🐛 Troubleshooting

### Issue: Products still not loading

**Check:**
1. ✅ Is `VITE_API_URL` set in Vercel?
2. ✅ Did you redeploy frontend after setting variable?
3. ✅ Is backend accessible? (Test: `https://nilo-hxbc.onrender.com/api/products`)
4. ✅ Check browser console for errors

**Fix:**
- Make sure `VITE_API_URL` is set correctly
- Redeploy frontend
- Clear browser cache

### Issue: CORS errors

**Check:**
- Backend CORS allows `https://nilo-bice.vercel.app`
- ✅ Already configured in `server.js`

### Issue: 404 errors

**Check:**
- API URL is correct: `https://nilo-hxbc.onrender.com/api`
- Backend routes are correct (`/api/products`, etc.)

### Issue: Backend not responding

**Check:**
- Render service status (should be "Live")
- Render logs for errors
- Environment variables are set correctly

---

## 📝 Quick Reference

### Backend URLs:
```
Health: https://nilo-hxbc.onrender.com/api/hello
Products: https://nilo-hxbc.onrender.com/api/products
Search: https://nilo-hxbc.onrender.com/api/products/search?query=watch
```

### Frontend URLs:
```
Home: https://nilo-bice.vercel.app
Products: https://nilo-bice.vercel.app/products
Cart: https://nilo-bice.vercel.app/cart
```

### Environment Variables:

**Render (Backend):**
- `MONGODB_URI`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `PORT` (auto-set by Render)

**Vercel (Frontend):**
- `VITE_API_URL` = `https://nilo-hxbc.onrender.com/api`

---

## 🎉 Success Indicators

When everything is working:

✅ Backend responds to API calls  
✅ Frontend loads products from backend  
✅ No CORS errors  
✅ No network errors  
✅ Products display on desktop  
✅ Products display on mobile  
✅ All API endpoints work  

---

## 🚀 Next Steps

1. **Set `VITE_API_URL` in Vercel** (if not done)
2. **Redeploy frontend**
3. **Test on desktop and mobile**
4. **Verify all features work:**
   - Product listing
   - Product search
   - Add to cart
   - Checkout
   - User authentication

---

**After completing these steps, your full-stack application will be live and working!** 🎊

