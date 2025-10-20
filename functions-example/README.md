# Firebase Functions Setup for Admin Management

Since your organization restricts service account key creation, use Firebase Functions instead.

## Quick Setup (5 minutes)

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 2. Initialize Functions in Your Project
```bash
cd /Users/jasonong/Development/Jam\ AI\ Website
firebase init functions
```

When prompted:
- Select your Firebase project
- Choose JavaScript
- Install dependencies: Yes
- This will create a `functions/` directory

### 3. Copy the Function Code
Copy the contents of `functions-example/index.js` to `functions/index.js`

### 4. Deploy Functions
```bash
firebase deploy --only functions
```

### 5. Set Your First Admin

After deployment, you'll see URLs for your functions. Visit:
```
https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/setFirstAdmin?email=your-email@example.com
```

Replace with your actual email address.

### 6. **IMPORTANT: Delete the Temporary Function**

For security, immediately remove the `setFirstAdmin` function:

1. Edit `functions/index.js`
2. Delete the entire `exports.setFirstAdmin` section
3. Redeploy:
   ```bash
   firebase deploy --only functions
   ```

## Using the Functions

### From Your Admin Dashboard

Add this to your admin dashboard to manage admins via UI:

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

// Set admin claim
const setAdminClaim = httpsCallable(functions, 'setAdminClaim');
await setAdminClaim({ email: 'newadmin@example.com' });

// Remove admin claim
const removeAdminClaim = httpsCallable(functions, 'removeAdminClaim');
await removeAdminClaim({ email: 'user@example.com' });

// List all admins
const listAdmins = httpsCallable(functions, 'listAdmins');
const result = await listAdmins();
console.log(result.data.admins);
```

## Security

- ✅ `setFirstAdmin` - Temporary, delete after first use
- ✅ `setAdminClaim` - Requires caller to be an admin
- ✅ `removeAdminClaim` - Requires caller to be an admin
- ✅ `listAdmins` - Requires caller to be an admin

## Troubleshooting

**Functions not deploying?**
- Ensure you're logged in: `firebase login`
- Check you selected the right project: `firebase use --add`

**Permission errors?**
- Make sure you have Owner or Editor role in Firebase Console

**User not found?**
- Create the user in Firebase Console → Authentication first

## Alternative: Contact Your Admin

If you can't use Firebase Functions, ask your organization admin to:
1. Grant you "Service Account Key Admin" role
2. Or create a service account key for you
3. Or use a separate Firebase project for development
