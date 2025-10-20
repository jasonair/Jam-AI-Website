# Admin Dashboard Quick Start

Get your admin analytics dashboard up and running in 5 minutes.

## Step 1: Configure Firebase (2 minutes)

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Firebase credentials to `.env.local`:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

   Get these from: Firebase Console → Project Settings → General → Your apps

## Step 2: Create Firestore Indexes (1 minute)

The dashboard will prompt you to create indexes when you first use it. Click the links in the error messages to auto-create them in Firebase Console.

Alternatively, create them manually:
- See `ADMIN_SETUP.md` for the complete list of required indexes

## Step 3: Set Up Your First Admin User (2 minutes)

### Option A: Using the Script (Recommended)

1. Download your Firebase service account key:
   - Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `scripts/serviceAccountKey.json`

2. Install Firebase Admin SDK:
   ```bash
   npm install firebase-admin
   ```

3. Set admin claim:
   ```bash
   node scripts/set-admin-claim.js set your-email@example.com
   ```

### Option B: Manual Setup

If you don't have a user yet:
1. Go to Firebase Console → Authentication → Users
2. Click "Add User"
3. Enter email and password
4. Use the script above to set admin claim

## Step 4: Access the Dashboard

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to:
   ```
   http://localhost:3001/admin/login
   ```

3. Sign in with your admin credentials

4. You'll be redirected to the dashboard at:
   ```
   http://localhost:3001/admin/dashboard
   ```

## What You'll See

### Key Metrics
- Total cost across all AI generations
- Total users (with active user count)
- Total generations and average cost
- Total tokens processed

### Visualizations
- **Daily Trends**: Cost, generations, and active users over time
- **Plan Distribution**: User breakdown by subscription tier
- **Generation Types**: Chat, expand, auto-title, auto-description
- **Team Member Usage**: Most frequently used AI team members
- **Cost Analysis**: Cost breakdown by team member role

### Time Ranges
Switch between 7, 30, or 90-day views using the buttons in the header.

## Troubleshooting

### "Access denied. Admin privileges required."
→ Make sure you ran the set-admin-claim script and signed out/in again

### "Failed to load analytics"
→ Check your Firebase configuration in `.env.local`

### Charts showing no data
→ Ensure analytics tracking is working in your main app (see Analytics Implementation Guide)

### Missing indexes error
→ Click the link in the error message to create the index in Firebase Console

## Next Steps

- Read `ADMIN_SETUP.md` for detailed configuration
- Set up Firestore security rules (see `ADMIN_SETUP.md`)
- Configure data retention policies
- Add more admin users as needed

## Security Reminder

- Never commit `.env.local` or `serviceAccountKey.json`
- Use strong passwords for admin accounts
- Enable 2FA on admin Firebase accounts
- Regularly audit admin access using `node scripts/set-admin-claim.js list`
