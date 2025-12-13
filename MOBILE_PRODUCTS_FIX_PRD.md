# PRD: Fix Mobile Product Page Network Error on El Nilo Website

**Author:** Ali Osman  
**Date:** 2025-12-13  
**Project:** El Nilo (https://nilo-bice.vercel.app)  
**Priority:** 🔴 HIGH - Critical for mobile users  
**Status:** Ready for Implementation

---

## 1. Problem Statement

### Current Issue
When users access the product page on **mobile devices**, products fail to load with a **"Network Error"** message. The desktop version works correctly, indicating a mobile-specific API connectivity issue.

### Observed Symptoms
- ❌ Product list is empty on mobile devices
- ❌ "Failed to Load Products" error message displayed
- ❌ "Network Error" shown to users
- ❌ API requests fail or timeout on mobile
- ✅ Desktop version works correctly

### Impact
- **User Experience:** Mobile users cannot browse products
- **Business Impact:** Lost sales from mobile traffic (typically 60-70% of e-commerce traffic)
- **Reputation:** Poor mobile experience damages brand credibility

---

## 2. Root Cause Analysis

### Likely Causes
1. **CORS Configuration:** Backend may not allow requests from mobile browsers
2. **API URL Configuration:** Frontend may be using `localhost` or incorrect API URL
3. **Backend Deployment:** Backend may not be deployed or accessible from mobile networks
4. **Environment Variables:** `VITE_API_URL` may not be set correctly in Vercel
5. **Network Security:** Mobile networks may block certain API endpoints

---

## 3. Goals

- ✅ Products display correctly on all mobile devices (iOS & Android)
- ✅ API calls succeed from mobile browsers
- ✅ Network errors are resolved
- ✅ Proper error handling and user feedback
- ✅ Backend CORS allows frontend domain
- ✅ Environment variables configured correctly

---

## 4. Technical Requirements

### 4.1 Frontend Requirements

#### API Configuration
- **File:** `frontend/src/services/api.js`
- **Requirement:** Must use `VITE_API_URL` environment variable
- **Fallback:** Should handle cases where environment variable is not set
- **Error Handling:** Must provide clear error messages

#### Current Implementation Check
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

**Required Fix:**
- Ensure `VITE_API_URL` is set in Vercel environment variables
- Add better error handling for network failures
- Add retry logic for failed requests

### 4.2 Backend Requirements

#### CORS Configuration
- **File:** `backend/server.js`
- **Requirement:** Must allow requests from:
  - `https://nilo-bice.vercel.app` (production)
  - `http://localhost:3000` (development)
  - All mobile browser origins

#### Required CORS Settings
```javascript
const corsOptions = {
  origin: [
    'https://nilo-bice.vercel.app',
    'http://localhost:3000',
    /\.vercel\.app$/,  // Allow all Vercel preview deployments
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

#### MongoDB Connection
- **Requirement:** MongoDB Atlas must allow connections from Vercel serverless functions
- **Network Access:** Must allow `0.0.0.0/0` or specific Vercel IP ranges
- **Environment Variables:** `MONGODB_URI` must be set in backend deployment

### 4.3 Environment Variables

#### Frontend (Vercel)
| Variable | Value | Required |
|----------|-------|----------|
| `VITE_API_URL` | `https://your-backend-url.vercel.app/api` | ✅ Yes |

#### Backend (Vercel or separate hosting)
| Variable | Value | Required |
|----------|-------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ Yes |
| `PORT` | `5000` or auto | Optional |
| `EMAIL_HOST` | SMTP host | Optional |
| `EMAIL_USER` | Email address | Optional |
| `EMAIL_PASS` | Email password | Optional |

---

## 5. Implementation Tasks

### Task 1: Fix Backend CORS Configuration
**File:** `backend/server.js`

**Action:**
1. Install/verify `cors` package: `npm install cors`
2. Update CORS configuration to allow frontend domain
3. Test CORS with mobile browser

**Code Changes:**
```javascript
import cors from 'cors';

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://nilo-bice.vercel.app',
      'http://localhost:3000',
      /\.vercel\.app$/,  // Allow all Vercel preview deployments
    ];
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

### Task 2: Verify Frontend API Configuration
**File:** `frontend/src/services/api.js`

**Action:**
1. Verify API URL uses environment variable
2. Add better error handling
3. Add request timeout configuration

**Code Changes:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('API Request Timeout');
      throw new Error('Request timeout. Please check your connection.');
    }
    if (!error.response) {
      console.error('Network Error:', error.message);
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
);
```

### Task 3: Update Products Page Error Handling
**File:** `frontend/src/pages/Products.jsx`

**Action:**
1. Improve error messages for network errors
2. Add retry functionality
3. Show helpful debugging information in development

**Code Changes:**
```javascript
const loadProducts = async () => {
  try {
    setLoading(true);
    setError(null);
    const products = await getProducts({ category: 'watch', gender: 'men' });
    setWatches(products);
  } catch (err) {
    console.error('Failed to load products:', err);
    
    // Better error messages
    if (err.message.includes('Network') || err.message.includes('timeout')) {
      setError('Unable to connect to server. Please check your internet connection and try again.');
    } else if (err.response?.status === 404) {
      setError('Products endpoint not found. Please contact support.');
    } else {
      setError(err.message || 'Failed to load products. Please try again.');
    }
    
    setWatches([]);
  } finally {
    setLoading(false);
  }
};
```

### Task 4: Set Environment Variables in Vercel

**Action:**
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add `VITE_API_URL` with your backend URL
3. Apply to: Production, Preview, Development
4. Redeploy frontend

**Example:**
```
VITE_API_URL=https://your-backend.vercel.app/api
```

### Task 5: Verify Backend Deployment

**Action:**
1. Ensure backend is deployed and accessible
2. Test backend endpoint: `https://your-backend.vercel.app/api/products`
3. Verify MongoDB connection works in production
4. Check backend logs for errors

### Task 6: Test on Mobile Devices

**Action:**
1. Test on real iOS device (Safari)
2. Test on real Android device (Chrome)
3. Test on mobile browser emulators
4. Verify products load correctly
5. Test all API endpoints (products, cart, checkout)

---

## 6. Testing Checklist

### Pre-Deployment Testing
- [ ] Backend CORS allows frontend domain
- [ ] Backend API endpoints respond correctly
- [ ] MongoDB connection works in production
- [ ] Environment variables are set in Vercel
- [ ] Frontend builds successfully

### Post-Deployment Testing
- [ ] Products page loads on desktop
- [ ] Products page loads on mobile (iOS Safari)
- [ ] Products page loads on mobile (Android Chrome)
- [ ] API calls succeed from mobile browsers
- [ ] No CORS errors in browser console
- [ ] Error messages are user-friendly
- [ ] Network errors are handled gracefully

### Mobile-Specific Tests
- [ ] Test on iPhone (Safari)
- [ ] Test on Android phone (Chrome)
- [ ] Test on tablet devices
- [ ] Test with slow 3G connection
- [ ] Test with no internet (offline handling)
- [ ] Test with airplane mode toggle

---

## 7. Success Criteria

✅ **Primary Success:**
- Products display correctly on all mobile devices
- No "Network Error" messages
- API calls succeed from mobile browsers

✅ **Secondary Success:**
- Error messages are clear and helpful
- Loading states work correctly
- Retry functionality works
- Performance is acceptable (< 2s load time)

✅ **Quality Assurance:**
- No console errors in mobile browsers
- CORS headers are correct
- Backend logs show successful requests
- All routes work on mobile

---

## 8. Rollback Plan

If issues occur after deployment:

1. **Immediate:** Revert CORS changes if breaking desktop
2. **Check:** Verify environment variables are correct
3. **Test:** Use Vercel preview deployments to test before production
4. **Monitor:** Check Vercel logs and backend logs for errors

---

## 9. Additional Notes

### Backend Deployment Options

**Option 1: Deploy Backend to Vercel (Recommended)**
- Use Vercel serverless functions
- Automatic scaling
- Same domain (no CORS issues)

**Option 2: Deploy Backend Separately**
- Deploy to Railway, Render, or Heroku
- Set `VITE_API_URL` to backend URL
- Configure CORS properly

**Option 3: Use API Routes in Vercel**
- Convert backend to Vercel API routes
- Deploy as part of frontend project
- No separate backend deployment needed

### Debugging Tips

1. **Check Browser Console:**
   - Look for CORS errors
   - Check network tab for failed requests
   - Verify API URL is correct

2. **Check Backend Logs:**
   - Verify requests are reaching backend
   - Check for MongoDB connection errors
   - Look for CORS rejection messages

3. **Test API Directly:**
   - Use Postman or curl to test backend
   - Verify endpoints work without frontend
   - Check response headers

---

## 10. Deliverables

Cursor must deliver:

1. ✅ Updated `backend/server.js` with proper CORS configuration
2. ✅ Updated `frontend/src/services/api.js` with better error handling
3. ✅ Updated `frontend/src/pages/Products.jsx` with improved error messages
4. ✅ Documentation of required environment variables
5. ✅ Testing verification on mobile devices
6. ✅ Deployment instructions for Vercel

---

**Ready for Cursor Implementation** 🚀

