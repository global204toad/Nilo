# 🆓 Complete Free Hosting Setup Guide for NILO

This guide shows you how to host your entire NILO website **100% FREE** with all features working (including emails).

---

## 📋 **Complete Stack (All Free)**

| Service | What It Does | Free Tier Limits |
|---------|-------------|------------------|
| **Vercel** | Frontend hosting | Unlimited |
| **Railway** | Backend hosting | $5 free credit/month |
| **MongoDB Atlas** | Database | 512MB storage |
| **Resend** | Email service | 3,000 emails/month |

**Total Cost: $0/month** ✅

---

## 🎯 **Step-by-Step Setup**

### **1️⃣ Frontend: Vercel (Already Set Up ✅)**

You're already using Vercel - this is perfect! No changes needed.

**Current Setup:**
- URL: `nilo-bice.vercel.app`
- Auto-deploys from GitHub
- Free SSL certificate
- Global CDN

**Environment Variable Needed:**
- `VITE_API_URL` = Your backend URL (we'll set this after backend is deployed)

---

### **2️⃣ Backend: Railway (Better than Render for Free Tier)**

Railway's free tier allows SMTP connections and is more reliable than Render.

#### **Setup Steps:**

1. **Sign up at Railway:**
   - Go to: https://railway.app
   - Sign up with GitHub (free)

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `NILO` repository
   - Select the `backend` folder as root directory

3. **Set Environment Variables:**
   Go to your project → Variables tab, add:

   ```
   MONGODB_URI=your_mongodb_connection_string
   EMAIL_API_KEY=your_resend_api_key (we'll get this next)
   NODE_ENV=production
   PORT=will_be_auto_set
   ```

4. **Deploy:**
   - Railway auto-detects Node.js
   - Auto-deploys on git push
   - Gives you a URL like: `your-app.railway.app`

5. **Get Your Backend URL:**
   - Railway → Settings → Domains
   - Copy the generated URL (e.g., `nilo-backend.railway.app`)

---

### **3️⃣ Database: MongoDB Atlas (Free Forever)**

1. **Sign up:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create free account

2. **Create Cluster:**
   - Choose "Free" tier (M0)
   - Select region closest to you
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Setup Database Access:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `nilo-admin`
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Atlas admin"

4. **Setup Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `nilo`
   - Example: `mongodb+srv://nilo-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/nilo?retryWrites=true&w=majority`

6. **Add to Railway:**
   - Paste this as `MONGODB_URI` in Railway environment variables

---

### **4️⃣ Email: Resend (Free Transactional Email)**

Resend is better than Gmail SMTP for production - it's designed for apps and works on all free hosting.

#### **Setup Steps:**

1. **Sign up:**
   - Go to: https://resend.com
   - Sign up (free tier: 3,000 emails/month)

2. **Create API Key:**
   - Go to "API Keys"
   - Click "Create API Key"
   - Name: "NILO Production"
   - Copy the API key (starts with `re_`)

3. **Add Domain (Optional but Recommended):**
   - Go to "Domains"
   - Add your domain (or use Resend's default)
   - For free tier, you can use their default sending domain

4. **Add to Railway Environment Variables:**
   - `EMAIL_API_KEY` = Your Resend API key (starts with `re_`)
   - `EMAIL_FROM` = `noreply@yourdomain.com` or `onboarding@resend.dev` (Resend default)

---

## 🚀 **Quick Setup Summary**

### **Option A: Railway + Resend (Recommended - Easiest)**

1. **Backend on Railway:**
   - Deploy `backend` folder from GitHub
   - Add environment variables:
     - `MONGODB_URI` (from MongoDB Atlas)
     - `EMAIL_API_KEY` (from Resend)
     - `EMAIL_FROM` = `onboarding@resend.dev`
     - `NODE_ENV` = `production`

2. **Frontend on Vercel:**
   - Already set up ✅
   - Update `VITE_API_URL` = Your Railway backend URL

3. **Database:**
   - MongoDB Atlas (free tier)

4. **Email:**
   - Resend (free tier: 3,000 emails/month)

**Total: $0/month** ✅

---

### **Option B: Keep Render + Use Resend**

If you want to stay on Render:

1. **Keep backend on Render**
2. **Switch to Resend for email** (instead of Gmail SMTP)
3. **Add to Render environment variables:**
   - `EMAIL_API_KEY` = Your Resend API key
   - `EMAIL_FROM` = `onboarding@resend.dev`
   - Remove: `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` (not needed with Resend)

**Why Resend is better:**
- ✅ Works on all free hosting (no SMTP blocking)
- ✅ Faster and more reliable
- ✅ Better deliverability
- ✅ Free tier: 3,000 emails/month
- ✅ Simple API (no SMTP connection issues)

---

## 📝 **Environment Variables Checklist**

### **Railway/Render Backend:**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nilo
EMAIL_API_KEY=re_xxxxxxxxxxxxx (from Resend)
EMAIL_FROM=onboarding@resend.dev
NODE_ENV=production
```

### **Vercel Frontend:**
```
VITE_API_URL=https://your-backend.railway.app
```

---

## 🔧 **Update Code to Support Resend**

I'll update your email service to support Resend API (which works better than SMTP on free hosting).

---

## ✅ **Why This Setup Works**

1. **Vercel:** Best free frontend hosting (unlimited, fast CDN)
2. **Railway:** Better than Render for free tier (allows SMTP, more reliable)
3. **MongoDB Atlas:** Industry standard, free tier is generous
4. **Resend:** Modern email API, works everywhere, better than Gmail SMTP

**All services are:**
- ✅ Free forever (or very generous free tiers)
- ✅ Production-ready
- ✅ No credit card required
- ✅ Auto-scaling
- ✅ Global CDN/edge network

---

## 🎯 **Next Steps**

1. **Choose your backend:** Railway (recommended) or keep Render
2. **Sign up for Resend:** Get free API key
3. **Set up MongoDB Atlas:** Get connection string
4. **Deploy backend:** Add environment variables
5. **Update frontend:** Set `VITE_API_URL` to your backend URL
6. **Test everything:** OTP emails, contact form, etc.

---

## 💡 **Pro Tips**

- **Railway gives $5 free credit/month** - enough for small apps
- **Resend free tier:** 3,000 emails/month is plenty for most apps
- **MongoDB Atlas free tier:** 512MB is enough for thousands of products
- **Vercel:** Unlimited bandwidth and requests on free tier

**This setup can handle thousands of users for free!** 🚀


## 🔧 **Update Backend to Use Resend**

Let me update your email service to use Resend instead of Gmail SMTP:

