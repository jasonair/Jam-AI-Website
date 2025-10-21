#!/usr/bin/env node

/**
 * Stripe Configuration Checker
 * Run this to verify your Stripe setup is correct
 */

console.log('🔍 Checking Stripe Configuration...\n');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

let hasErrors = false;

// Check required environment variables
const requiredVars = {
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  'STRIPE_SECRET_KEY': process.env.STRIPE_SECRET_KEY,
  'NEXT_PUBLIC_STRIPE_PRO_PRICE_ID': process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  'NEXT_PUBLIC_STRIPE_TEAMS_PRICE_ID': process.env.NEXT_PUBLIC_STRIPE_TEAMS_PRICE_ID,
  'STRIPE_WEBHOOK_SECRET': process.env.STRIPE_WEBHOOK_SECRET,
};

console.log('📋 Required Environment Variables:\n');

for (const [key, value] of Object.entries(requiredVars)) {
  if (!value || value.includes('xxxxxxxxxxxxx') || value === '') {
    console.log(`❌ ${key}: NOT SET or using placeholder`);
    hasErrors = true;
  } else {
    // Check if it starts with the correct prefix
    let expectedPrefix = '';
    if (key.includes('PUBLISHABLE_KEY')) expectedPrefix = 'pk_test_';
    if (key.includes('SECRET_KEY')) expectedPrefix = 'sk_test_';
    if (key.includes('PRICE_ID')) expectedPrefix = 'price_';
    if (key.includes('WEBHOOK_SECRET')) expectedPrefix = 'whsec_';

    if (expectedPrefix && !value.startsWith(expectedPrefix)) {
      console.log(`⚠️  ${key}: Set but doesn't start with '${expectedPrefix}'`);
      hasErrors = true;
    } else {
      const maskedValue = value.substring(0, 15) + '...';
      console.log(`✅ ${key}: ${maskedValue}`);
    }
  }
}

console.log('\n📦 Package Dependencies:\n');

try {
  const stripe = require('stripe');
  console.log(`✅ stripe package installed (v${stripe.Stripe.PACKAGE_VERSION})`);
} catch (e) {
  console.log('❌ stripe package not installed');
  hasErrors = true;
}

try {
  require('@stripe/stripe-js');
  console.log('✅ @stripe/stripe-js package installed');
} catch (e) {
  console.log('❌ @stripe/stripe-js package not installed');
  hasErrors = true;
}

try {
  const admin = require('firebase-admin');
  console.log('✅ firebase-admin package installed');
} catch (e) {
  console.log('❌ firebase-admin package not installed');
  hasErrors = true;
}

console.log('\n🔧 Next Steps:\n');

if (hasErrors) {
  console.log('❌ Configuration issues found! Please fix the errors above.\n');
  console.log('Quick fixes:');
  console.log('1. Make sure .env.local exists in your project root');
  console.log('2. Add all required Stripe keys from Stripe Dashboard');
  console.log('3. Create products in Stripe and copy the Price IDs');
  console.log('4. Run: stripe listen --forward-to localhost:3000/api/webhooks/stripe');
  console.log('5. Copy the webhook secret to STRIPE_WEBHOOK_SECRET');
  console.log('\nSee STRIPE_FIX_INSTRUCTIONS.md for detailed steps.\n');
  process.exit(1);
} else {
  console.log('✅ All checks passed! Your Stripe configuration looks good.\n');
  console.log('If you\'re still having issues:');
  console.log('1. Restart your dev server: npm run dev');
  console.log('2. Make sure Stripe CLI is running: stripe listen --forward-to localhost:3000/api/webhooks/stripe');
  console.log('3. Check the terminal for any error messages\n');
  process.exit(0);
}
