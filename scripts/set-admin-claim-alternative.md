# Alternative: Set Admin Claims via Firebase Console

Since service account key creation is restricted by your organization, here are alternative approaches:

## Option 1: Use Firebase Console Directly (Easiest)

Unfortunately, Firebase Console doesn't have a UI for custom claims. Skip to Option 2 or 3.

## Option 2: Use Firebase Functions (Recommended)

Deploy a Cloud Function that sets admin claims:

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

### Step 2: Create the Function

In `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// HTTP function to set admin claim
exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Only allow if caller is already an admin (or remove this check for first admin)
  if (context.auth?.token?.admin !== true) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can set admin claims'
    );
  }

  const { email } = data;
  
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    return { 
      success: true, 
      message: `Admin claim set for ${email}` 
    };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// For setting the FIRST admin (remove after use!)
exports.setFirstAdmin = functions.https.onRequest(async (req, res) => {
  const email = req.query.email;
  
  if (!email) {
    res.status(400).send('Email required');
    return;
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    res.send(`✅ Admin claim set for ${email}. PLEASE DELETE THIS FUNCTION NOW!`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
```

### Step 3: Deploy
```bash
firebase deploy --only functions
```

### Step 4: Set First Admin
Visit the function URL (shown after deployment):
```
https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/setFirstAdmin?email=your-email@example.com
```

### Step 5: Remove setFirstAdmin Function
After setting your first admin, remove the `setFirstAdmin` function and redeploy for security.

## Option 3: Contact Your Organization Admin

Ask your Google Cloud/Firebase organization administrator to:

1. Grant you the "Service Account Key Admin" role
2. Or create a service account key for you
3. Or temporarily lift the restriction

## Option 4: Use a Different Firebase Project

If this is a development/testing project:

1. Create a new Firebase project without organization restrictions
2. Use that for development
3. Use the restricted project for production only

## Option 5: Use Firestore Security Rules + Manual Setup

1. Create the user in Firebase Console
2. Manually add a document in Firestore:
   - Collection: `admins`
   - Document ID: `{user_uid}`
   - Field: `isAdmin: true`

3. Update your security rules and auth logic to check this collection instead of custom claims

This is less secure but works without Admin SDK.

---

**Recommended**: Use Option 2 (Firebase Functions) - it's the most secure and doesn't require service account keys.
