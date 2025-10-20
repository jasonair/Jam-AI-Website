const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Path to service account key
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

// Check if service account key exists
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: Could not find serviceAccountKey.json');
  console.error('\nPlease follow these steps:');
  console.error('1. Go to Firebase Console → Project Settings → Service Accounts');
  console.error('2. Click "Generate New Private Key"');
  console.error('3. Save the file as "serviceAccountKey.json" in the scripts directory');
  console.error(`   Expected path: ${serviceAccountPath}`);
  process.exit(1);
}

// Initialize Firebase Admin
try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✅ Firebase Admin initialized successfully\n');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error.message);
  process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];
const email = args[1];

async function setAdminClaim(userEmail) {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(userEmail);
    
    // Set custom claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    console.log(`✅ Successfully set admin claim for: ${userEmail}`);
    console.log(`   User ID: ${user.uid}`);
    console.log('\n⚠️  Important: User must sign out and sign back in for changes to take effect.');
    
    // Verify the claim was set
    const updatedUser = await admin.auth().getUser(user.uid);
    console.log('\n✓ Verified custom claims:', updatedUser.customClaims);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ Error: No user found with email: ${userEmail}`);
      console.error('\nPlease create the user first:');
      console.error('1. Go to Firebase Console → Authentication → Users');
      console.error('2. Click "Add User"');
      console.error('3. Enter email and password');
      console.error('4. Run this script again');
    } else {
      console.error('❌ Error setting admin claim:', error.message);
    }
    process.exit(1);
  }
}

async function removeAdminClaim(userEmail) {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(userEmail);
    
    // Remove admin claim by setting it to null
    const currentClaims = user.customClaims || {};
    delete currentClaims.admin;
    
    await admin.auth().setCustomUserClaims(user.uid, currentClaims);
    
    console.log(`✅ Successfully removed admin claim for: ${userEmail}`);
    console.log(`   User ID: ${user.uid}`);
    console.log('\n⚠️  Important: User must sign out and sign back in for changes to take effect.');
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ Error: No user found with email: ${userEmail}`);
    } else {
      console.error('❌ Error removing admin claim:', error.message);
    }
    process.exit(1);
  }
}

async function listAdmins() {
  try {
    console.log('📋 Listing all admin users...\n');
    
    const listUsersResult = await admin.auth().listUsers();
    const admins = listUsersResult.users.filter(user => 
      user.customClaims && user.customClaims.admin === true
    );
    
    if (admins.length === 0) {
      console.log('No admin users found.');
      return;
    }
    
    console.log(`Found ${admins.length} admin user(s):\n`);
    admins.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email || 'No email'}`);
      console.log(`   User ID: ${user.uid}`);
      console.log(`   Created: ${new Date(user.metadata.creationTime).toLocaleDateString()}`);
      console.log(`   Last Sign In: ${user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'Never'}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error listing admins:', error.message);
    process.exit(1);
  }
}

// Main execution
async function main() {
  if (!command) {
    console.log('Usage:');
    console.log('  node scripts/set-admin-claim.js set <email>     - Set admin claim');
    console.log('  node scripts/set-admin-claim.js remove <email>  - Remove admin claim');
    console.log('  node scripts/set-admin-claim.js list            - List all admins');
    console.log('\nExamples:');
    console.log('  node scripts/set-admin-claim.js set admin@example.com');
    console.log('  node scripts/set-admin-claim.js remove user@example.com');
    console.log('  node scripts/set-admin-claim.js list');
    process.exit(0);
  }

  switch (command) {
    case 'set':
      if (!email) {
        console.error('❌ Error: Email address required');
        console.log('Usage: node scripts/set-admin-claim.js set <email>');
        process.exit(1);
      }
      await setAdminClaim(email);
      break;
    
    case 'remove':
      if (!email) {
        console.error('❌ Error: Email address required');
        console.log('Usage: node scripts/set-admin-claim.js remove <email>');
        process.exit(1);
      }
      await removeAdminClaim(email);
      break;
    
    case 'list':
      await listAdmins();
      break;
    
    default:
      console.error(`❌ Error: Unknown command "${command}"`);
      console.log('\nValid commands: set, remove, list');
      process.exit(1);
  }
  
  process.exit(0);
}

main();
