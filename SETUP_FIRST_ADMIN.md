# Setting Up Your First Admin (Firestore Method)

Since your organization blocks Firebase Admin SDK, we're using **Firestore** to manage admins instead.

## Quick Setup (2 minutes)

### Step 1: Get Your User UID

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **jamai-dev**
3. Click **Authentication** → **Users**
4. Find your email in the list
5. **Copy the User UID** (looks like: `abc123def456...`)

### Step 2: Add Admin Record in Firestore

1. In Firebase Console, go to **Firestore Database**
2. Click **+ Start collection** (or add to existing)
   - Collection ID: **`admins`**
   - Click **Next**
3. Add your first document:
   - **Document ID**: Paste your User UID from Step 1
   - Click **Add field**:
     - Field: `isAdmin`
     - Type: `boolean`
     - Value: `true`
   - Click **Add field** again:
     - Field: `email`
     - Type: `string`  
     - Value: Your email address
   - Click **Add field** again:
     - Field: `grantedAt`
     - Type: `string`
     - Value: Today's date (e.g., "2025-10-20")
4. Click **Save**

### Step 3: Test Admin Access

1. Start your dev server (if not running):
   ```bash
   npm run dev
   ```

2. Navigate to:
   ```
   http://localhost:3000/admin/login
   ```

3. Sign in with your email and password

4. You should be redirected to the dashboard!

## Adding More Admins Later

Repeat Step 2 for any new admin user - just use their User UID as the document ID.

## Security Rules (Important!)

Update your Firestore security rules to protect the `admins` collection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only admins can read/write the admins collection
    match /admins/{userId} {
      allow read: if request.auth != null && 
                     exists(/databases/$(database)/documents/admins/$(request.auth.uid));
      allow write: if request.auth != null && 
                      exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
```

## How It Works

- ✅ No service account keys needed
- ✅ No Cloud Functions needed
- ✅ No organization policies blocking
- ✅ Simple Firestore document check
- ✅ Works immediately after setup

---

**Status**: Firestore-based admin system active  
**Your Project**: jamai-dev  
**Method**: Manual Firestore documents
