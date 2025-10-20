# Quick Start Guide - Jam AI Authentication

## 🚀 Get Started in 3 Steps

### Step 1: Add Firebase Credentials

Create `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Where to find these:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click ⚙️ (Settings) → Project settings
4. Scroll to "Your apps" → Web app
5. Copy the config values

### Step 2: Enable Authentication in Firebase

1. Go to Firebase Console → Authentication
2. Click "Get Started"
3. Enable **Email/Password**
4. Enable **Google** sign-in
5. For Google: Add your domain to authorized domains

### Step 3: Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

## ✅ Test Your Setup

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Visit:** `http://localhost:3000`

3. **Test the flow:**
   - Click "Start Free Trial" in the hero section
   - Sign up with a test email
   - You should be redirected to the account page
   - View your profile, credits, and usage stats

## 📱 Available Pages

- **`/`** - Homepage with auth-aware CTAs
- **`/auth/signup`** - User registration
- **`/auth/signin`** - User login
- **`/auth/success`** - Post-login redirect (handles Mac app deep linking)
- **`/account`** - User dashboard (protected route)
- **`/pricing`** - Pricing plans

## 🔑 Key Features

✅ Email/Password & Google OAuth authentication  
✅ User profile with avatar  
✅ Credits tracking system  
✅ Usage statistics (nodes, messages, notes, etc.)  
✅ Plan management (Trial, Free, Premium, Pro)  
✅ Deep linking for Mac app (`jamai://auth`)  
✅ Protected routes  
✅ Persistent sessions  

## 🎨 Authentication State in Components

All components automatically respond to authentication state:

**Hero Section:**
- Not logged in: "Start Free Trial" + "View Pricing"
- Logged in: "Go to Account" + "Learn More"

**Header:**
- Not logged in: "Sign In" + "Start Free Trial"
- Logged in: "Account" + "Dashboard"

**CTA Section:**
- Not logged in: "Start Free Trial"
- Logged in: "Go to Account"

## 🔗 Mac App Integration

After sign up/sign in, users are redirected to `/auth/success` which:
1. Gets the user's Firebase ID token
2. Attempts to open Mac app: `jamai://auth?token={token}&uid={uid}`
3. Falls back to account page if app isn't installed

**Mac App Setup:**
- Register the `jamai://` URL scheme in your Mac app
- Handle incoming URLs to extract token and uid
- Use token to authenticate with Firebase in the Mac app

## 📊 User Data Structure

New users get a Firestore document at `users/{uid}`:

```json
{
  "uid": "user-id",
  "email": "user@example.com",
  "displayName": "John Doe",
  "plan": "trial",
  "creditsTotal": 1000,
  "creditsUsed": 0,
  "teamMembers": 0,
  "teamMembersLimit": 3,
  "trialEndDate": "2025-10-27T00:00:00.000Z",
  "createdAt": "2025-10-20T00:00:00.000Z",
  "usage": {
    "nodesCreated": 0,
    "aiMessages": 0,
    "notesCreated": 0,
    "childNodes": 0,
    "expandActions": 0
  }
}
```

## 🛠️ Usage Tracking API

Track user activity from your Mac app or web app:

```typescript
import { updateUserUsage, deductCredits } from '@/lib/userUsage';

// Track actions
await updateUserUsage(userId, {
  nodesCreated: 1,
  aiMessages: 5,
  creditsUsed: 10
});

// Deduct credits
await deductCredits(userId, 10);
```

## 🎯 Plans & Credits

| Plan     | Credits/Month | AI Team Members | Price   |
|----------|---------------|-----------------|---------|
| Trial    | 1,000         | 3               | Free    |
| Free     | 500           | 2               | $0      |
| Premium  | 5,000         | 5               | $29/mo  |
| Pro      | 20,000        | 10              | $99/mo  |

## 🚨 Troubleshooting

**"Firebase: Error (auth/configuration-not-found)"**
→ Add Firebase credentials to `.env.local`

**"Cannot read properties of undefined (reading 'user')"**
→ Make sure AuthProvider is wrapping your app in `app/layout.tsx`

**"Firebase rules error"**
→ Deploy Firestore rules: `firebase deploy --only firestore:rules`

**Google sign-in fails**
→ Add your domain to authorized domains in Firebase Console

## 📚 Documentation

- **`AUTHENTICATION_SETUP.md`** - Complete technical documentation
- **`firestore.rules`** - Database security rules
- **`lib/contexts/AuthContext.tsx`** - Authentication context
- **`lib/userUsage.ts`** - Usage tracking utilities
- **`lib/deepLink.ts`** - Mac app integration

## 🎉 You're Ready!

Your authentication system is fully functional. Users can:
- Sign up from the website
- Log in with email or Google
- View their account dashboard
- Track their usage and credits
- Seamlessly transition to your Mac app

**Next step:** Integrate Stripe for paid plans (see `AUTHENTICATION_SETUP.md` for details)
