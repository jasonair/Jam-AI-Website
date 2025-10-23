const { onRequest } = require('firebase-functions/v2/https');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const admin = require('firebase-admin');

admin.initializeApp();

const firestore = admin.firestore();

/**
 * TEMPORARY FUNCTION - Set First Admin
 */
exports.setFirstAdmin = onRequest(async (req, res) => {
  const email = req.query.email;
  
  if (!email) {
    res.status(400).send('❌ Error: Email parameter required. Usage: ?email=your@email.com');
    return;
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    res.send(`
      ✅ SUCCESS!
      Admin claim has been set for: ${email}
      User ID: ${user.uid}
      
      ⚠️ IMPORTANT NEXT STEPS:
      1. User must sign out and sign back in for changes to take effect
      2. DELETE this function immediately for security.
    `);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      res.status(404).send(`❌ Error: No user found with email: ${email}`);
    } else {
      res.status(500).send(`❌ Error: ${error.message}`);
    }
  }
});

/**
 * Secure Function - Set Admin Claim
 */
exports.setAdminClaim = onCall(async ({ data, auth }) => {
  if (!auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }
  if (auth.token.admin !== true) {
    throw new HttpsError('permission-denied', 'Only admins can set admin claims');
  }

  const { email } = data;
  if (!email) {
    throw new HttpsError('invalid-argument', 'Email is required');
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    return { success: true, message: `Admin claim set for ${email}`, userId: user.uid };
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      throw new HttpsError('not-found', `No user found with email: ${email}`);
    }
    throw new HttpsError('internal', error.message);
  }
});

/**
 * Secure Function - Remove Admin Claim
 */
exports.removeAdminClaim = onCall(async ({ data, auth }) => {
  if (!auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }
  if (auth.token.admin !== true) {
    throw new HttpsError('permission-denied', 'Only admins can remove admin claims');
  }

  const { email } = data;
  if (!email) {
    throw new HttpsError('invalid-argument', 'Email is required');
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    const currentClaims = user.customClaims || {};
    delete currentClaims.admin;
    await admin.auth().setCustomUserClaims(user.uid, currentClaims);
    return { success: true, message: `Admin claim removed for ${email}`, userId: user.uid };
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      throw new HttpsError('not-found', `No user found with email: ${email}`);
    }
    throw new HttpsError('internal', error.message);
  }
});

/**
 * Secure Function - List All Admins
 */
exports.listAdmins = onCall(async ({ auth }) => {
  if (!auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }
  if (auth.token.admin !== true) {
    throw new HttpsError('permission-denied', 'Only admins can list admin users');
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
    return { success: true, admins, count: admins.length };
  } catch (error) {
    throw new HttpsError('internal', error.message);
  }
});

/**
 * Check Beta Status Function
 */
exports.checkBetaStatus = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'Method Not Allowed' });
  }

  if (!req.body || !req.body.data || !req.body.data.email) {
    return res.status(400).send({ error: { message: 'Email is required.' } });
  }
  const { email } = req.body.data;

  const betaSignupsRef = firestore.collection('beta_signups');

  try {
    const q = betaSignupsRef.where('email', '==', email);
    const snapshot = await q.get();

    if (snapshot.empty) {
      await betaSignupsRef.add({
        email,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return res.status(200).send({ data: { status: 'pending' } });
    } else {
      const doc = snapshot.docs[0];
      return res.status(200).send({ data: { status: doc.data().status } });
    }
  } catch (error) {
    console.error('Error in checkBetaStatus:', error);
    return res.status(500).send({ error: { message: 'An error occurred.' } });
  }
});

/**
 * Scheduled Function - Aggregate Total Projects Created
 */
exports.aggregateTotalProjects = onSchedule('every 24 hours', async (event) => {
  try {
    const usersSnapshot = await firestore.collection('users').get();
    
    let totalProjects = 0;
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.metadata && userData.metadata.totalProjectsCreated) {
        totalProjects += userData.metadata.totalProjectsCreated;
      }
    });

    await firestore.collection('analytics').doc('global_stats').set({
      totalProjectsCreated: totalProjects,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`✅ Successfully aggregated total projects: ${totalProjects}`);
    return null;
  } catch (error) {
    console.error('❌ Error aggregating total projects:', error);
    throw new HttpsError('internal', 'Failed to aggregate project data.');
  }
});

