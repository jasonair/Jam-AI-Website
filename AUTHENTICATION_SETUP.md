# Authentication & Account Management Setup Guide

This guide explains the complete authentication and account management system that has been implemented for your Jam AI website.

## 🎯 What's Been Implemented

### 1. **User Authentication System**
- ✅ Email/Password signup and signin
- ✅ Google OAuth authentication
- ✅ Firebase Authentication integration
- ✅ Persistent authentication state across the app
- ✅ Protected routes (account page requires authentication)

### 2. **Account Management**
- ✅ User profile display with avatar
- ✅ Credits tracking system (usage vs. total)
- ✅ Plan management (Trial, Free, Premium, Pro)
- ✅ Usage statistics tracking:
  - Nodes Created
  - AI Messages
  - Notes Created
  - Child Nodes
  - Expand Actions
  - AI Team Members

### 3. **Deep Linking for Mac App**
- ✅ Custom URL scheme support (`jamai://auth`)
- ✅ Automatic redirect to Mac app after authentication
- ✅ Token passing for seamless Mac app login
- ✅ Fallback to web account page if app not installed

### 4. **Pricing & Plans**
- ✅ Dedicated pricing page
- ✅ Four plan tiers with different credit limits
- ✅ Plan selection from landing page or account page
- ✅ Visual plan comparison

## 📁 File Structure

```
app/
├── auth/
│   ├── signin/page.tsx          # Sign in page
│   ├── signup/page.tsx          # Sign up page
│   └── success/page.tsx         # Post-auth success page (Mac app redirect)
├── account/page.tsx             # User account dashboard
├── pricing/page.tsx             # Pricing plans page
└── layout.tsx                   # Root layout with AuthProvider

components/
├── ui/
│   └── Header.tsx               # Navigation header with auth state
└── sections/
    ├── Hero.tsx                 # Updated with auth-aware CTAs
    └── CTA.tsx                  # Updated with auth-aware CTAs

lib/
├── contexts/
│   └── AuthContext.tsx          # Authentication context and hooks
├── firebase.ts                  # Firebase configuration
├── deepLink.ts                  # Mac app deep linking utilities
└── userUsage.ts                 # Usage tracking functions
```

## 🔧 Setup Instructions

### Step 1: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe Configuration (for future integration)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

### Step 2: Firebase Configuration

1. **Enable Authentication Methods** in Firebase Console:
   - Go to Authentication → Sign-in method
   - Enable Email/Password
   - Enable Google

2. **Firestore Rules** (already configured in `firestore.rules`):
   - Users can read/write their own data
   - Usage tracking is allowed for authenticated users
   - Admin access for admin-only operations

3. **Deploy Firestore Rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Step 3: Install Dependencies

All required dependencies are already in `package.json`. If you need to install them:

```bash
npm install
```

### Step 4: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the website.

## 🔐 Authentication Flow

### New User Sign Up
1. User visits `/auth/signup`
2. Fills in name, email, and password
3. Creates Firebase account
4. User profile created in Firestore with:
   - Default Trial plan (1000 credits, 7 days)
   - Zero usage statistics
   - Profile information
5. Redirects to `/auth/success`
6. If on macOS, attempts to open Mac app with auth token
7. User can access `/account` to manage their profile

### Existing User Sign In
1. User visits `/auth/signin`
2. Enters credentials
3. Firebase authenticates
4. Redirects to `/auth/success`
5. Mac app opens if available
6. User accesses account dashboard

### Google OAuth
1. User clicks "Sign in with Google"
2. Google OAuth popup
3. If new user, profile is created automatically
4. Same redirect flow as email/password

## 📊 User Data Structure

Each user document in Firestore (`users/{uid}`) contains:

```typescript
{
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  plan: 'trial' | 'free' | 'premium' | 'pro';
  creditsTotal: number;      // Total credits for current plan
  creditsUsed: number;       // Credits used this period
  teamMembers: number;       // Current AI team members
  teamMembersLimit: number;  // Max team members for plan
  trialEndDate?: string;     // ISO date when trial ends
  createdAt: string;         // Account creation date
  usage: {
    nodesCreated: number;
    aiMessages: number;
    notesCreated: number;
    childNodes: number;
    expandActions: number;
  };
}
```

## 🔗 Mac App Integration

### Deep Link Format
```
jamai://auth?token={idToken}&uid={userId}
```

### How It Works
1. After successful authentication on the web
2. User redirected to `/auth/success`
3. Page generates Firebase ID token
4. Attempts to open Mac app with custom URL scheme
5. Mac app receives token and UID
6. Mac app uses token to authenticate user
7. Automatic sign-in without re-entering credentials

### Mac App URL Scheme Setup
Your Mac app needs to register the `jamai://` URL scheme in its `Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>jamai</string>
    </array>
    <key>CFBundleURLName</key>
    <string>com.jamai.app</string>
  </dict>
</array>
```

### Mac App Auth Handler
Your Mac app should handle the URL like this (Swift example):

```swift
func application(_ application: NSApplication, open urls: [URL]) {
    guard let url = urls.first,
          url.scheme == "jamai",
          url.host == "auth" else { return }
    
    let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
    let token = components?.queryItems?.first(where: { $0.name == "token" })?.value
    let uid = components?.queryItems?.first(where: { $0.name == "uid" })?.value
    
    // Use token to authenticate with Firebase
    Auth.auth().signIn(withCustomToken: token) { authResult, error in
        // Handle authentication
    }
}
```

## 📈 Usage Tracking

Use the functions in `lib/userUsage.ts` to track user activity:

```typescript
import { updateUserUsage, deductCredits } from '@/lib/userUsage';

// Track user actions
await updateUserUsage(userId, {
  nodesCreated: 1,
  aiMessages: 5,
  creditsUsed: 10
});

// Check and deduct credits before operations
const hasCredits = await hasEnoughCredits(userId, 10);
if (hasCredits) {
  await deductCredits(userId, 10);
  // Perform operation
}
```

## 💳 Stripe Integration (Next Step)

When you're ready to integrate Stripe:

1. **Add Stripe Products** for each plan (Free, Premium, Pro)
2. **Create Checkout Sessions** when user clicks "Select" on a plan
3. **Handle Webhooks** to update user plan in Firestore
4. **Add Billing Portal** for users to manage subscriptions

Key files to update:
- Create `app/api/checkout/route.ts` for checkout sessions
- Create `app/api/webhooks/stripe/route.ts` for webhook handling
- Update account page plan selection to trigger checkout
- Add subscription status to user profile

## 🎨 UI Components

### Header Component
Shows different navigation based on auth state:
- **Not logged in**: Sign In + Start Free Trial buttons
- **Logged in**: Account + Dashboard buttons

### Hero Section
CTAs change based on auth state:
- **Not logged in**: Start Free Trial + View Pricing
- **Logged in**: Go to Account + Learn More

### Account Page
Displays:
- User profile with avatar
- Credits usage with progress bar
- Current plan with upgrade options
- Usage statistics
- Sign out button

## 🧪 Testing

### Test User Flow
1. Visit homepage → Click "Start Free Trial"
2. Sign up with test email
3. Verify redirect to success page
4. Check account page shows correct info
5. Sign out
6. Sign in again
7. Verify persistent session

### Test Plan Features
- Trial: 1000 credits, 3 team members, 7 days
- Free: 500 credits, 2 team members
- Premium: 5000 credits, 5 team members
- Pro: 20,000 credits, 10 team members

## 🚀 Deployment

Before deploying:

1. ✅ Add production Firebase credentials to hosting provider
2. ✅ Set up Firebase hosting or deploy to Vercel
3. ✅ Configure OAuth redirect URLs in Firebase Console
4. ✅ Test authentication in production environment
5. ✅ Set up Firestore indexes if needed
6. ✅ Enable security rules in production

## 📝 Notes

- **Security**: All Firebase security rules are already configured
- **Privacy**: User passwords are handled by Firebase (never stored in your database)
- **Scalability**: Firestore can handle millions of users
- **Credits Reset**: You'll need to create a Cloud Function to reset credits monthly
- **Trial Expiration**: Add a Cloud Function to downgrade users after trial expires

## 🔄 Next Steps

1. **Test the complete flow** on localhost
2. **Add your Firebase credentials** to `.env.local`
3. **Deploy Firestore rules**: `firebase deploy --only firestore:rules`
4. **Test authentication** with real accounts
5. **Integrate with Mac app** using the deep linking system
6. **Add Stripe** when ready for payments
7. **Set up Cloud Functions** for:
   - Monthly credit resets
   - Trial expiration handling
   - Usage analytics aggregation

## 🆘 Support

If you encounter issues:
- Check Firebase Console for authentication errors
- Verify environment variables are set correctly
- Check browser console for JavaScript errors
- Ensure Firestore rules are deployed
- Test with Firebase Emulator Suite for local development

---

**Your authentication system is now ready!** Users can sign up, sign in, manage their accounts, and seamlessly transition to your Mac app. 🎉
