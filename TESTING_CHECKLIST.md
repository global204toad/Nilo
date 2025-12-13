# Complete Testing Checklist - Mobile & Desktop

**Project:** El Nilo Website  
**Date:** 2025-12-13  
**URL:** https://nilo-bice.vercel.app

---

## 🎯 Pre-Testing Requirements

### Environment Variables Check
- [ ] `VITE_API_URL` is set in Vercel (frontend project)
- [ ] Backend is deployed and accessible
- [ ] MongoDB connection is working

---

## 📱 MOBILE TESTING (320px - 430px width)

### 1. Homepage (`/`)

#### Banner Section
- [ ] Banner height is **400px** (not full screen)
- [ ] Banner image displays fully without cropping
- [ ] Dark green background is visible around banner
- [ ] Image maintains aspect ratio (no stretching)
- [ ] Banner is centered properly

#### Announcement Bar
- [ ] Announcement bar is **hidden on mobile** (should not appear)
- [ ] No horizontal scrolling

#### Featured Watches Section
- [ ] Section displays correctly
- [ ] Watch images are visible
- [ ] Text is readable
- [ ] "View All Watches" button is clickable (min 44px height)

#### Limited Edition Collection (Video Section)
- [ ] Video container height is **300px** (not stretched)
- [ ] Video displays with proper aspect ratio
- [ ] Video is centered and not cropped
- [ ] Text content is readable
- [ ] "Explore Collection" button is clickable

#### Navigation
- [ ] Header height is **60px** on mobile
- [ ] Hamburger menu icon is visible (left side)
- [ ] Logo is centered
- [ ] Cart icon is visible (right side)
- [ ] Hamburger menu opens/closes smoothly
- [ ] Mobile menu drawer slides in from left
- [ ] Menu items are clickable (min 55px height)
- [ ] Menu closes when clicking outside or on a link

### 2. Products Page (`/products`)

#### Layout
- [ ] Page loads without errors
- [ ] Products display in **2-column grid** on mobile
- [ ] Product cards have proper spacing (gap: 10px)
- [ ] No horizontal scrolling

#### Product Cards
- [ ] Product images are **1:1 aspect ratio** (square)
- [ ] Images are not stretched or distorted
- [ ] Product names are readable
- [ ] Prices are visible
- [ ] Cards are clickable

#### Error Handling
- [ ] If API fails, shows user-friendly error message
- [ ] "Try Again" button is visible and works
- [ ] Error message is clear and helpful

#### Loading State
- [ ] Loading indicator shows while fetching products
- [ ] Loading state is centered and visible

### 3. Product Detail Page (`/products/:id`)

#### Layout
- [ ] Product image displays correctly
- [ ] Image height is **350px** on mobile
- [ ] Image uses `object-contain` (not cropped)
- [ ] Product information is readable
- [ ] Quantity selector works
- [ ] Add to Cart button is **sticky to bottom** on mobile
- [ ] Button height is **55px**
- [ ] Button is always visible when scrolling

### 4. Navigation & Header

#### Mobile Header
- [ ] Sticky header works (stays at top when scrolling)
- [ ] Header background is black
- [ ] All icons are visible and clickable
- [ ] Cart badge shows correct item count

#### Mobile Menu Drawer
- [ ] Opens smoothly from left
- [ ] Backdrop (dark overlay) appears
- [ ] Drawer width is 75% of screen
- [ ] All menu items are visible:
  - [ ] Shop
  - [ ] About
  - [ ] Contact
  - [ ] Sign In / My Orders / Sign Out
- [ ] Menu closes when clicking backdrop
- [ ] Menu closes when clicking a link
- [ ] Page scrolls to top when navigating

### 5. Cart Page (`/cart`)

#### Layout
- [ ] Cart items display correctly
- [ ] Product images are visible
- [ ] Quantities can be updated
- [ ] Remove buttons work
- [ ] Total price is calculated correctly
- [ ] Checkout button is visible and clickable

### 6. Checkout Page (`/checkout`)

#### Form
- [ ] All form fields are visible
- [ ] Fields are large enough to tap (min 44px height)
- [ ] Form validation works
- [ ] Submit button is clickable

### 7. Contact Page (`/contact`)

#### Content
- [ ] Phone number is visible: **+201096393822**
- [ ] Phone number is clickable (tel: link)
- [ ] Contact form displays correctly
- [ ] Form fields are accessible

### 8. General Mobile Checks

#### Performance
- [ ] Page loads within 3 seconds on 4G
- [ ] Images load progressively (lazy loading)
- [ ] No layout shifts during loading

#### Responsiveness
- [ ] No horizontal scrolling anywhere
- [ ] All text is readable (no overflow)
- [ ] All buttons are tappable (min 44px)
- [ ] Touch targets are properly spaced

#### Browser Compatibility
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome
- [ ] Works on mobile Firefox (if applicable)

---

## 💻 DESKTOP TESTING (1024px+ width)

### 1. Homepage (`/`)

#### Banner Section
- [ ] Banner is **full screen height** (`h-screen`)
- [ ] Banner image uses `object-cover` (fills container)
- [ ] Dark green background is visible
- [ ] Image displays with proper padding

#### Announcement Bar
- [ ] Announcement bar is **visible** on desktop
- [ ] Text scrolls smoothly (marquee animation)
- [ ] Animation repeats continuously
- [ ] Text is readable

#### Featured Watches Section
- [ ] Products display in **3-column grid**
- [ ] Images are clear and high quality
- [ ] Hover effects work
- [ ] "View All Watches" button works

#### Limited Edition Collection (Video Section)
- [ ] Video container height is **700px**
- [ ] Video displays correctly
- [ ] Video uses `object-contain`
- [ ] Hover effects work
- [ ] Text content is properly formatted

### 2. Products Page (`/products`)

#### Layout
- [ ] Products display in **4-column grid** on desktop
- [ ] Product cards have proper spacing
- [ ] Promotional banners are visible
- [ ] Layout is centered (max-width: 1280px)

#### Product Cards
- [ ] Hover effects work
- [ ] Images are high quality
- [ ] All product information is visible

### 3. Navigation & Header

#### Desktop Header
- [ ] Header height is **70px**
- [ ] **3-column layout** works:
  - [ ] Left: Shop | About | Contact
  - [ ] Center: NILO Logo
  - [ ] Right: Search | User | Cart
- [ ] Search bar width is **240px**
- [ ] Search functionality works
- [ ] User dropdown works
- [ ] Cart icon shows item count

### 4. Product Detail Page (`/products/:id`)

#### Layout
- [ ] 2-column layout (image left, info right)
- [ ] Product image displays correctly
- [ ] All product details are visible
- [ ] Add to Cart button works
- [ ] Quantity selector works

### 5. General Desktop Checks

#### Layout
- [ ] All pages are centered (max-width: 1280px)
- [ ] No horizontal scrolling
- [ ] Consistent spacing throughout
- [ ] Typography is readable

#### Functionality
- [ ] All links work
- [ ] All buttons work
- [ ] Forms submit correctly
- [ ] API calls succeed

---

## 🔌 API & Backend Testing

### API Connectivity
- [ ] Products load from API
- [ ] Search functionality works
- [ ] Cart operations work (add/remove/update)
- [ ] Checkout process works
- [ ] User authentication works (OTP)
- [ ] Contact form submission works

### Error Handling
- [ ] Network errors show user-friendly messages
- [ ] API timeouts are handled gracefully
- [ ] 404 errors are handled
- [ ] 500 errors are handled

### CORS
- [ ] No CORS errors in browser console
- [ ] API requests succeed from frontend domain
- [ ] Backend allows requests from `https://nilo-bice.vercel.app`

---

## 🎨 Visual & UX Testing

### Mobile
- [ ] Colors are consistent
- [ ] Fonts are readable
- [ ] Images are clear
- [ ] Buttons are clearly visible
- [ ] Loading states are clear
- [ ] Error messages are helpful

### Desktop
- [ ] Layout is professional
- [ ] Spacing is consistent
- [ ] Hover effects work smoothly
- [ ] Animations are smooth
- [ ] Images are high quality

---

## 🐛 Common Issues to Check

### Mobile Issues
- [ ] Banner not displaying correctly
- [ ] Video stretching or cropping
- [ ] Horizontal scrolling
- [ ] Text overflow
- [ ] Buttons too small to tap
- [ ] Menu not opening/closing
- [ ] Products not loading

### Desktop Issues
- [ ] Layout not centered
- [ ] Elements overlapping
- [ ] Search bar too wide/narrow
- [ ] Header layout broken
- [ ] Products grid incorrect

### API Issues
- [ ] Network errors
- [ ] CORS errors
- [ ] Timeout errors
- [ ] 404 errors
- [ ] Products not loading

---

## ✅ Final Verification

### Mobile (Test on Real Device)
- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] Test on slow 3G connection
- [ ] Test with airplane mode (offline handling)

### Desktop (Test in Browser)
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Test at different window sizes (1024px, 1280px, 1920px)

---

## 📝 Testing Notes

**Date:** _______________  
**Tester:** _______________  
**Browser/Device:** _______________  
**Issues Found:** _______________

---

## 🚀 Quick Test Commands

### Check API URL in Browser Console
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

### Test API Endpoint
```bash
# Replace with your backend URL
curl https://your-backend-url.vercel.app/api/products
```

### Check CORS Headers
Open browser DevTools → Network tab → Check response headers for:
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`

---

**After completing this checklist, document any issues found and their severity.**

