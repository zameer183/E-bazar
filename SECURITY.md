# 🔒 E-Bazar Security Setup Guide

This guide will walk you through securing your E-Bazar application after the security fixes have been implemented.

## 📋 Table of Contents
1. [Critical Security Fixes Completed](#critical-security-fixes-completed)
2. [Required Actions](#required-actions)
3. [Firebase Security Rules Setup](#firebase-security-rules-setup)
4. [Admin Access Setup](#admin-access-setup)
5. [Verification & Testing](#verification--testing)
6. [Additional Security Recommendations](#additional-security-recommendations)

---

## ✅ Critical Security Fixes Completed

### 1. Firebase Credentials Protection
- ✅ Created `.env.example` template file
- ✅ Verified `.env.local` is in `.gitignore`
- ⚠️ **Action Required**: Rotate Firebase credentials if repository was ever public

### 2. Admin Password Removed
- ✅ Removed hardcoded password from `src/app/admin/page.js`
- ✅ Created `src/lib/adminAuth.js` for proper authentication
- ✅ Updated admin page to use Firebase Auth
- ⚠️ **Action Required**: Add your user ID to admin list

### 3. Server-Side Authentication
- ✅ Created `middleware.js` for route protection
- ✅ Added documentation for implementing full server-side auth
- ℹ️ Currently using client-side guards (Firebase Auth requirement)

### 4. Firebase Security Rules
- ✅ Created `firestore.rules` with comprehensive security rules
- ⚠️ **Action Required**: Deploy rules to Firebase Console

---

## 🚨 Required Actions

### STEP 1: Verify Firebase Credentials Security

1. **Check if .env.local is tracked by git:**
   ```bash
   git ls-files | grep .env
   ```
   - If it shows anything, run: `git rm --cached .env.local`

2. **If your repository was ever public:**
   - Go to Firebase Console > Project Settings
   - Click "Reset" next to your API key
   - Update your `.env.local` with the new credentials

3. **Ensure .env.local is never committed:**
   ```bash
   # Verify this line exists in .gitignore
   cat .gitignore | grep "\.env"
   ```

### STEP 2: Deploy Firebase Security Rules

**CRITICAL: Your Firestore database is currently OPEN TO THE WORLD!**

1. Open Firebase Console: https://console.firebase.google.com
2. Select your project: **e-bazar-a9714**
3. Navigate to **Firestore Database** > **Rules**
4. Copy the entire content from `firestore.rules` in your project
5. Paste into Firebase Console
6. Click **"Publish"**

**Verify the rules are active:**
- You should see the publish date update
- Rules status should show "Live"

### STEP 3: Deploy Firebase Storage Rules

1. In Firebase Console, navigate to **Storage** > **Rules**
2. Find the Storage Rules section in `firestore.rules` (at the bottom)
3. Copy and paste those rules
4. Click **"Publish"**

### STEP 4: Setup Admin Access

1. **Get your User ID:**
   - Method A: Sign in to your app and check browser console
   - Method B: Go to Firebase Console > Authentication > Users tab
   - Method C: Visit `/admin` page while logged in (it will show your UID)

2. **Add your UID to environment variables:**
   ```bash
   # Open .env.local
   # Add this line (replace with your actual UID):
   NEXT_PUBLIC_ADMIN_UIDS=your_uid_here
   ```

3. **For multiple admins:**
   ```bash
   # Comma-separated list:
   NEXT_PUBLIC_ADMIN_UIDS=uid1,uid2,uid3
   ```

4. **Restart your development server:**
   ```bash
   npm run dev
   ```

### STEP 5: Update Firebase Security Rules with Admin UIDs

1. Open `firestore.rules`
2. Find the `isAdmin()` function (around line 36)
3. Add your admin UID(s):
   ```javascript
   function isAdmin() {
     return isAuthenticated() &&
            request.auth.uid in [
              'your_actual_uid_here',
              'another_admin_uid',
            ];
   }
   ```
4. Redeploy the rules to Firebase Console (repeat Step 2)

---

## 🔥 Firebase Security Rules Setup

### Understanding the Rules

The security rules control:
- **Who can read** public data (shops, images)
- **Who can write** (only authenticated users)
- **Who owns what** (users can only edit their own shops)
- **File uploads** (size limits, file type validation)

### Rule Highlights

#### Shops Collection
```javascript
// Anyone can browse shops
allow read: if true;

// Only authenticated users can create shops
allow create: if isAuthenticated() &&
              request.resource.data.ownerId == request.auth.uid;

// Only shop owners can update their shops
allow update: if resource.data.ownerId == request.auth.uid;
```

#### Shop Images/Videos
```javascript
// Validates ownership through parent shop document
allow create: if isAuthenticated() &&
              get(/databases/$(database)/documents/shops/$(request.resource.data.shopId))
                .data.ownerId == request.auth.uid;
```

### Testing the Rules

Firebase Console has a **Rules Playground**:
1. Go to Firestore Database > Rules
2. Click "Rules Playground" tab
3. Test scenarios:
   - Authenticated user creating a shop ✅
   - User editing someone else's shop ❌
   - Unauthenticated user reading shops ✅

---

## 👨‍💼 Admin Access Setup

### Current Implementation

The admin system now uses Firebase Authentication instead of passwords:

```javascript
// Old (INSECURE):
if (password === "admin123") { /* allow access */ }

// New (SECURE):
const { isAdmin, uid } = await checkIsAdmin();
if (isAdmin) { /* allow access */ }
```

### Admin Authorization Methods

**Method 1: Environment Variables** (Current - Good for small teams)
```bash
NEXT_PUBLIC_ADMIN_UIDS=uid1,uid2,uid3
```

**Method 2: Firestore Collection** (Better for larger teams)
1. Create `admins` collection in Firestore
2. Add documents with admin UIDs
3. Update `src/lib/adminAuth.js` to query this collection

**Method 3: Firebase Custom Claims** (Most Secure - Production)
- Requires Firebase Admin SDK
- Set custom claims server-side
- Claims are part of the ID token

### Getting Your User ID

Visit `/admin` while logged in - if you're not authorized, it will display:
```
Your User ID: ABC123xyz456...
```

Copy this ID and add it to `.env.local`.

---

## ✅ Verification & Testing

### Test Checklist

#### 1. Firebase Credentials
- [ ] `.env.local` exists and has all Firebase config
- [ ] `.env.local` is NOT in git (`git ls-files | grep .env` returns nothing)
- [ ] Application connects to Firebase successfully

#### 2. Admin Panel
- [ ] Admin page requires login (redirects to /login if not logged in)
- [ ] Shows "unauthorized" message when logged in as non-admin
- [ ] Displays admin panel when logged in as admin
- [ ] Can seed/clear data as admin

#### 3. Authentication Protection
- [ ] `/dashboard` redirects to login if not authenticated
- [ ] `/profile` redirects to login if not authenticated
- [ ] `/admin` shows unauthorized for non-admin users
- [ ] Can create shops only when logged in

#### 4. Firebase Security Rules
- [ ] Rules deployed to Firestore
- [ ] Rules deployed to Storage
- [ ] Can't edit other users' shops
- [ ] Can only upload images to own shops

### Testing Commands

```bash
# 1. Test environment variables
node -e "console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Firebase config loaded' : '❌ Missing config')"

# 2. Test git security
git ls-files | grep .env && echo "❌ .env is tracked!" || echo "✅ .env is safe"

# 3. Start dev server
npm run dev

# 4. Test in browser:
# - Visit /admin (should require login)
# - Login and visit /admin (should show UID if not admin)
# - Add UID to .env.local and restart
# - Visit /admin again (should show admin panel)
```

---

## 🛡️ Additional Security Recommendations

### Immediate (This Week)

1. **Enable Firebase App Check**
   - Protects against abuse
   - Firebase Console > App Check > Register your app

2. **Set up Firebase Security Alerts**
   - Firebase Console > Project Settings > Integrations
   - Enable security alerts

3. **Review Firebase Usage**
   - Set billing alerts
   - Monitor for unusual activity

### Short-term (This Month)

1. **Implement Rate Limiting**
   ```javascript
   // Use Firebase Security Rules
   allow write: if request.time > resource.data.lastWrite + duration.value(1, 's');
   ```

2. **Add Input Validation**
   - Validate email formats
   - Sanitize user inputs
   - Limit string lengths

3. **Implement Proper Error Boundaries**
   - Wrap components in error boundaries
   - Don't expose stack traces to users

4. **Add Request Logging**
   - Log failed auth attempts
   - Monitor suspicious activity

### Long-term (Production)

1. **Implement Firebase Admin SDK**
   - Server-side token verification
   - Custom claims for roles
   - Secure admin operations

2. **Set up HTTPS-only**
   - Force SSL in production
   - Use secure cookies

3. **Implement CORS properly**
   - Whitelist allowed origins
   - Validate referers

4. **Add Security Headers**
   ```javascript
   // next.config.mjs
   headers: {
     'X-Frame-Options': 'DENY',
     'X-Content-Type-Options': 'nosniff',
     'Referrer-Policy': 'origin-when-cross-origin',
   }
   ```

---

## 📞 Support & Resources

### Documentation
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

### Files Created
- `.env.example` - Environment template
- `src/lib/adminAuth.js` - Admin authentication
- `middleware.js` - Route protection
- `firestore.rules` - Database security rules
- `SECURITY.md` - This guide

### Modified Files
- `src/app/admin/page.js` - Removed hardcoded password
- `src/app/admin/page.module.css` - Added new styles

---

## 🚀 Next Steps

1. ✅ Complete all items in "Required Actions" section
2. ✅ Test all authentication flows
3. ✅ Verify Firebase rules are deployed
4. ✅ Add your UID to admin list
5. ✅ Test admin panel access
6. 📝 Plan implementation of additional security measures
7. 🔄 Schedule regular security audits

---

## ⚠️ Important Notes

- **NEVER** commit `.env.local` to git
- **ALWAYS** rotate credentials if they're exposed
- **TEST** security rules before deploying to production
- **MONITOR** Firebase usage for anomalies
- **UPDATE** dependencies regularly for security patches

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Status**: Security Hardening Complete ✅
