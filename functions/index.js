/**
 * Firebase Cloud Function to Set Admin Claims
 * 
 * Deploy this to Firebase Functions to manage admin users without needing
 * a service account key locally.
 * 
 * Setup:
 * 1. npm install -g firebase-tools
 * 2. firebase login
 * 3. firebase init functions (select this directory)
 * 4. firebase deploy --only functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * TEMPORARY FUNCTION - Set First Admin
 * 
 * Use this ONCE to set your first admin user, then DELETE this function.
 * 
 * Usage:
 * https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/setFirstAdmin?email=your@email.com
 * 
 * ⚠️ IMPORTANT: Delete this function after setting your first admin!
 */
exports.setFirstAdmin = functions.https.onRequest(async (req, res) => {
  const email = req.query.email;
  
  if (!email) {
    res.status(400).send('❌ Error: Email parameter required. Usage: ?email=your@email.com');
    return;
  }

  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Set admin claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    // Success response
    res.send(`
      ✅ SUCCESS!
      
      Admin claim has been set for: ${email}
      User ID: ${user.uid}
      
      ⚠️ IMPORTANT NEXT STEPS:
      1. User must sign out and sign back in for changes to take effect
      2. DELETE this function immediately for security:
         - Remove 'exports.setFirstAdmin' from functions/index.js
         - Run: firebase deploy --only functions
      
      You can now use the 'setAdminClaim' function for future admin management.
    `);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      res.status(404).send(`
        ❌ Error: No user found with email: ${email}
        
        Please create the user first:
        1. Go to Firebase Console → Authentication → Users
        2. Click "Add User"
        3. Enter email and password
        4. Try this function again
      `);
    } else {
      res.status(500).send(`❌ Error: ${error.message}`);
    }
  }
});

/**
 * Secure Function - Set Admin Claim
 * 
 * Requires caller to already be an admin.
 * Use this for ongoing admin management after setting your first admin.
 * 
 * Usage from your app:
 * const setAdmin = httpsCallable(functions, 'setAdminClaim');
 * await setAdmin({ email: 'newadmin@example.com' });
 */
exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Verify caller is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  // Verify caller is an admin
  if (context.auth.token.admin !== true) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can set admin claims'
    );
  }

  const { email } = data;

  if (!email) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Email is required'
    );
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    return {
      success: true,
      message: `Admin claim set for ${email}`,
      userId: user.uid
    };
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      throw new functions.https.HttpsError(
        'not-found',
        `No user found with email: ${email}`
      );
    }
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Secure Function - Remove Admin Claim
 * 
 * Requires caller to already be an admin.
 */
exports.removeAdminClaim = functions.https.onCall(async (data, context) => {
  // Verify caller is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  // Verify caller is an admin
  if (context.auth.token.admin !== true) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can remove admin claims'
    );
  }

  const { email } = data;

  if (!email) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Email is required'
    );
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    
    // Remove admin claim
    const currentClaims = user.customClaims || {};
    delete currentClaims.admin;
    
    await admin.auth().setCustomUserClaims(user.uid, currentClaims);
    
    return {
      success: true,
      message: `Admin claim removed for ${email}`,
      userId: user.uid
    };
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      throw new functions.https.HttpsError(
        'not-found',
        `No user found with email: ${email}`
      );
    }
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Secure Function - List All Admins
 * 
 * Requires caller to already be an admin.
 */
exports.listAdmins = functions.https.onCall(async (data, context) => {
  // Verify caller is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  // Verify caller is an admin
  if (context.auth.token.admin !== true) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can list admin users'
    );
  }

  try {
    const listUsersResult = await admin.auth().listUsers();
    const admins = listUsersResult.users
      .filter(user => user.customClaims && user.customClaims.admin === true)
      .map(user => ({
        uid: user.uid,
        email: user.email,
        createdAt: user.metadata.creationTime,
        lastSignIn: user.metadata.lastSignInTime
      }));
    
    return {
      success: true,
      admins,
      count: admins.length
    };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
