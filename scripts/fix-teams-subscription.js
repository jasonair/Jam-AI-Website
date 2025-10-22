#!/usr/bin/env node

/**
 * Fix Teams Subscription Credits
 * This script manually updates a user's profile to match their Teams subscription
 * with the correct 1500 credits allocation
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  admin.initializeApp({
    projectId: projectId,
  });
}

const db = admin.firestore();

async function fixTeamsSubscription() {
  // Get user email from command line or use default
  const userEmail = process.argv[2] || 'jasononguk@gmail.com';
  
  console.log(`🔧 Fixing Teams subscription for: ${userEmail}\n`);
  
  try {
    // Find user by email
    const usersSnapshot = await db.collection('users')
      .where('email', '==', userEmail)
      .limit(1)
      .get();
    
    if (usersSnapshot.empty) {
      console.error(`❌ User not found: ${userEmail}`);
      process.exit(1);
    }
    
    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();
    
    console.log('Current user data:');
    console.log(`  Plan: ${userData.plan || userData.planId}`);
    console.log(`  Credits: ${userData.creditsUsed || 0} / ${userData.creditsTotal}`);
    console.log('');
    
    // Update to Teams plan with correct credits (1500)
    await userDoc.ref.update({
      plan: 'teams',
      planId: 'teams',
      creditsTotal: 1500,
      creditsUsed: 0,
      updatedAt: new Date(),
    });
    
    console.log('✅ Updated user profile:');
    console.log(`  Plan: teams`);
    console.log(`  Credits: 0 / 1500`);
    console.log('');
    console.log('✨ Done! Refresh your account page to see the changes.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Run the fix
fixTeamsSubscription();
