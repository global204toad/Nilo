# PRD — Fix Vercel Deployment for El Nilo Project

**Project:** El Nilo Website  
**Author:** Ali Osman  
**Date:** 12-13-2025  
**Status:** Ready for Implementation

---

## 1. Overview

The El Nilo frontend is currently experiencing **404: NOT_FOUND** errors when deployed on Vercel. This PRD provides step-by-step instructions to fix the deployment configuration and ensure all routes work correctly.

---

## 2. Current Problem

- ❌ Deploying to Vercel results in **404: NOT_FOUND** errors
- ❌ SPA routes like `/products`, `/cart`, `/checkout` return 404 when accessed directly
- ❌ Root directory is set to `nilo` instead of `frontend`
- ❌ Missing `vercel.json` configuration for SPA routing
- ❌ Build output directory may not be configured correctly

---

## 3. Goals

- ✅ Fix 404 errors on Vercel deployment
- ✅ Ensure all SPA routes work correctly (direct URLs and page refreshes)
- ✅ Configure correct build settings for Vite
- ✅ Set up proper root directory configuration
- ✅ Ensure environment variables are properly configured

---

## 4. Technical Requirements

### 4.1 Project Structure

The project has the following structure:
```
NILO/
├── frontend/          ← Frontend React app (Vite)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── backend/           ← Backend Node.js/Express API
    ├── server.js
    └── ...
```

### 4.2 Vercel Configuration Requirements

**Root Directory:** Must be set to `frontend` (not `nilo`)

**Build Settings:**
- **Framework Preset:** Vite
- **Install Command:** `npm install`
- **Build Command:** `npm run build`
- **Output Directory:** `dist` (Vite's default output)
- **Development Command:** `npm run dev` (optional, for preview)

### 4.3 SPA Routing Configuration

Create `vercel.json` in the `frontend/` directory with SPA rewrites:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures all routes are handled by React Router.

### 4.4 Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_API_URL` | `https://your-backend-url.vercel.app/api` or your backend URL | Production, Preview, Development |

**Note:** If backend is deployed separately, use that URL. If using Vercel serverless functions, use relative paths.

---

## 5. Implementation Steps

### Step 1: Create vercel.json

**File:** `frontend/vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Step 2: Update Vite Config (if needed)

Ensure `vite.config.js` has proper base path:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/',  // Ensure base is set correctly
  build: {
    outDir: 'dist',  // Explicitly set output directory
  },
  // ... rest of config
})
```

### Step 3: Verify package.json Build Script

Ensure `frontend/package.json` has:
```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

### Step 4: Configure Vercel Project Settings

In Vercel Dashboard:

1. **Go to Project Settings → General**
2. **Root Directory:** Change from `nilo` to `frontend`
3. **Build & Development Settings:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Step 5: Set Environment Variables

1. **Go to Project Settings → Environment Variables**
2. Add `VITE_API_URL` with your backend API URL
3. Apply to: Production, Preview, Development

### Step 6: Update API Configuration (if needed)

If backend is on a different domain, update `frontend/src/services/api.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

---

## 6. Testing Checklist

After deployment, verify:

- [ ] Homepage loads: `https://your-app.vercel.app/`
- [ ] Products page loads: `https://your-app.vercel.app/products`
- [ ] Product detail loads: `https://your-app.vercel.app/products/:id`
- [ ] Cart page loads: `https://your-app.vercel.app/cart`
- [ ] Checkout page loads: `https://your-app.vercel.app/checkout`
- [ ] Contact page loads: `https://your-app.vercel.app/contact`
- [ ] About page loads: `https://your-app.vercel.app/about`
- [ ] Login page loads: `https://your-app.vercel.app/login`
- [ ] Direct URL access works (no 404)
- [ ] Page refresh works on all routes
- [ ] API calls work correctly

---

## 7. Common Issues & Solutions

### Issue 1: Still getting 404 errors
**Solution:** 
- Verify `vercel.json` is in `frontend/` directory
- Check Root Directory is set to `frontend` in Vercel settings
- Redeploy after making changes

### Issue 2: Assets not loading (404 on images/CSS)
**Solution:**
- Ensure `public/` folder is in `frontend/` directory
- Check that image paths use `/images/...` (absolute paths)
- Verify build output includes assets

### Issue 3: API calls failing
**Solution:**
- Check `VITE_API_URL` environment variable is set
- Verify backend CORS allows your Vercel domain
- Check browser console for CORS errors

### Issue 4: Build fails
**Solution:**
- Check Node.js version in Vercel (should be 18+)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

---

## 8. Deliverables

Cursor must create/update:

1. ✅ `frontend/vercel.json` - SPA routing configuration
2. ✅ Update Vercel project settings (Root Directory: `frontend`)
3. ✅ Verify build configuration matches requirements
4. ✅ Document environment variables needed
5. ✅ Test all routes after deployment

---

## 9. Additional Notes

- **Backend Deployment:** The backend can be deployed separately or as Vercel serverless functions
- **MongoDB:** Ensure MongoDB Atlas allows connections from Vercel IPs (or use 0.0.0.0/0 for development)
- **Email Service:** Backend email service should work if backend is deployed and environment variables are set

---

## 10. Success Criteria

✅ No 404 errors on any route  
✅ All pages load correctly  
✅ Direct URL access works  
✅ Page refresh works on all routes  
✅ API integration works  
✅ Images and assets load correctly  

---

**Ready for Cursor Implementation**

