# Firebase Storage Setup Instructions

This guide will help you upload the Jam AI DMG file to Firebase Storage and deploy the storage rules.

## Prerequisites

- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project: `jamai-dev`
- Storage bucket: `gs://jamai-dev.firebasestorage.app`
- DMG file ready for upload (approximately 60MB)

## Step 1: Deploy Storage Rules

First, deploy the storage security rules that allow public read access to the downloads folder:

```bash
# Make sure you're in the project root directory
cd "/Users/jasonong/Development/Jam AI Website"

# Login to Firebase (if not already logged in)
firebase login

# Deploy storage rules
firebase deploy --only storage
```

You should see output confirming the rules were deployed successfully.

## Step 2: Upload the DMG File

### Option A: Using Firebase Console (Recommended for first-time setup)

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `jamai-dev`
3. Click on **Storage** in the left sidebar
4. Click on the **Files** tab
5. Create a folder called `downloads` if it doesn't exist
6. Click on the `downloads` folder
7. Click **Upload file**
8. Select your `JamAI.dmg` file
9. Wait for the upload to complete

The file should now be accessible at:
`gs://jamai-dev.firebasestorage.app/downloads/JamAI.dmg`

### Option B: Using Firebase CLI

```bash
# Install gsutil if not already installed (part of Google Cloud SDK)
# For macOS:
# brew install --cask google-cloud-sdk

# Authenticate with Google Cloud
gcloud auth login

# Set your project
gcloud config set project jamai-dev

# Upload the DMG file
gsutil cp /path/to/your/JamAI.dmg gs://jamai-dev.firebasestorage.app/downloads/JamAI.dmg

# Verify the upload
gsutil ls gs://jamai-dev.firebasestorage.app/downloads/
```

### Option C: Using Node.js Script

Create a temporary upload script:

```bash
# Create upload script
cat > upload-dmg.js << 'EOF'
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
admin.initializeApp({
  storageBucket: 'jamai-dev.firebasestorage.app'
});

const bucket = admin.storage().bucket();

async function uploadDMG() {
  const filePath = process.argv[2] || './JamAI.dmg';
  const destination = 'downloads/JamAI.dmg';

  try {
    console.log(`Uploading ${filePath} to ${destination}...`);
    await bucket.upload(filePath, {
      destination: destination,
      metadata: {
        contentType: 'application/x-apple-diskimage',
        cacheControl: 'public, max-age=3600',
      }
    });
    console.log('✅ Upload successful!');
    console.log(`File available at: gs://jamai-dev.firebasestorage.app/${destination}`);
  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

uploadDMG();
EOF

# Run the script
node upload-dmg.js /path/to/your/JamAI.dmg

# Clean up
rm upload-dmg.js
```

## Step 3: Verify the Setup

### Test in Browser Console

1. Open your website in a browser
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Run this test:

```javascript
// Test download URL retrieval
import { storage } from './lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';

const dmgRef = ref(storage, 'downloads/JamAI.dmg');
getDownloadURL(dmgRef)
  .then(url => console.log('✅ Download URL:', url))
  .catch(error => console.error('❌ Error:', error));
```

### Test the Download Button

1. Navigate to your landing page
2. Scroll to the CTA section
3. Click the "Download for macOS" button
4. The DMG file should start downloading

5. Go to your account page at `/account`
6. Find the "Download Jam AI" section
7. Click the "Download" button
8. The DMG file should start downloading

## Storage Rules Explanation

The deployed `storage.rules` file contains:

```
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to the downloads folder
    match /downloads/{allPaths=**} {
      allow read: if true;  // Anyone can download
      allow write: if false; // Only admins can upload via Firebase Console
    }
    
    // Deny all other access by default
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

This configuration:
- ✅ Allows **public read access** to files in the `downloads/` folder
- ❌ Prevents **public uploads** (only admins can upload via console)
- ❌ Denies access to all other storage locations

## Updating the DMG File

When you need to update the DMG file:

1. Upload the new version using any of the methods above
2. The file will be automatically cached by Firebase CDN
3. Users will see the new version within 1 hour (due to cache)
4. To force immediate update, rename the file (e.g., `JamAI-v1.1.dmg`) and update `lib/downloadApp.ts`

## Troubleshooting

### Error: "Failed to get download URL"

**Cause:** Storage rules not deployed or file doesn't exist

**Solution:**
1. Verify storage rules are deployed: `firebase deploy --only storage`
2. Check file exists in Firebase Console
3. Verify file path is exactly `downloads/JamAI.dmg`

### Error: "Permission denied"

**Cause:** Storage rules don't allow public read access

**Solution:**
1. Check `storage.rules` file is correct
2. Redeploy rules: `firebase deploy --only storage`
3. Wait 1-2 minutes for rules to propagate

### Download button shows "Preparing..." forever

**Cause:** Network issue or Firebase not initialized

**Solution:**
1. Check browser console for errors
2. Verify Firebase config in `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=jamai-dev.firebasestorage.app`
3. Clear browser cache and reload

### File uploaded but download fails

**Cause:** File path mismatch

**Solution:**
1. Verify file is at: `downloads/JamAI.dmg` (case-sensitive)
2. Check `lib/downloadApp.ts` references the correct path
3. Test URL in browser:
   ```
   https://firebasestorage.googleapis.com/v0/b/jamai-dev.firebasestorage.app/o/downloads%2FJamAI.dmg?alt=media
   ```

## Security Considerations

- ✅ File is publicly readable (intended for distribution)
- ✅ No one can upload or modify files without admin access
- ✅ CDN caching reduces bandwidth costs
- ✅ HTTPS encryption for all downloads
- ⚠️ Consider adding file size limits in future
- ⚠️ Monitor bandwidth usage in Firebase Console

## Cost Estimation

Firebase Storage pricing (as of 2024):
- Storage: $0.026/GB per month → ~$0.002/month for 60MB
- Downloads: $0.12/GB → $0.0072 per download
- First 1GB/day downloads are free → ~17 free downloads per day

For a small app, costs should be minimal (<$5/month even with hundreds of downloads).

## Environment Variables

Ensure your `.env.local` file has:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=jamai-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=jamai-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=jamai-dev.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Next Steps

1. ✅ Deploy storage rules
2. ✅ Upload DMG file
3. ✅ Test downloads on landing page
4. ✅ Test downloads on account page
5. 📊 Monitor usage in Firebase Console
6. 🔄 Set up CI/CD for automatic DMG updates (optional)

## Support

If you encounter any issues:
1. Check Firebase Console → Storage for file presence
2. Review browser console for JavaScript errors
3. Test storage rules in Firebase Console Rules Playground
4. Verify environment variables are set correctly

---

**Implementation Complete!** 🎉

Your users can now download the Jam AI app from both:
- Landing page CTA section (all visitors)
- Account page (authenticated users)
