# Stripe Integration Setup Guide

## Overview
This guide will walk you through setting up Stripe payments for your Jam AI application. We'll cover everything from initial Stripe configuration to testing payments.

---

## Step 1: Stripe Dashboard Setup

### 1.1 Access Your Stripe Dashboard
1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Log in with your Stripe account

### 1.2 Get Your API Keys
1. Click on **Developers** in the top navigation
2. Click on **API keys** in the left sidebar
3. You'll see two keys:
   - **Publishable key** (starts with `pk_test_` for test mode)
   - **Secret key** (starts with `sk_test_` for test mode, click "Reveal test key")
4. Copy both keys - you'll need them for your `.env.local` file

### 1.3 Create Your Products and Prices
You need to create products in Stripe that match your pricing plans.

#### Create Premium Plan ($29/month)
1. Go to **Products** in the left sidebar
2. Click **+ Add product**
3. Fill in the details:
   - **Name**: Premium Plan
   - **Description**: 5,000 credits/month, 12 AI team members
   - **Pricing**: 
     - Select "Standard pricing"
     - Price: $29.00
     - Billing period: Monthly
     - Click **Add pricing**
4. Click **Save product**
5. **IMPORTANT**: Copy the Price ID (starts with `price_xxxxx`) - you'll need this

#### Create Pro Plan ($99/month)
1. Click **+ Add product** again
2. Fill in:
   - **Name**: Pro Plan
   - **Description**: 20,000 credits/month, unlimited AI team members
   - **Pricing**:
     - Price: $99.00
     - Billing period: Monthly
3. Click **Save product**
4. **IMPORTANT**: Copy the Price ID

### 1.4 Enable Customer Portal
The Customer Portal allows users to manage their subscriptions, update payment methods, and view invoices.

1. Go to **Settings** (bottom left)
2. Click on **Billing** → **Customer portal**
3. Click **Activate test link** (or **Activate live link** for production)
4. Configure settings:
   - **Products and prices**: Enable all products
   - **Invoice history**: Enable
   - **Update payment methods**: Enable
   - **Cancel subscriptions**: Enable (with options for immediate or at period end)
5. Click **Save**

---

## Step 2: Configure Webhooks

Webhooks allow Stripe to notify your application about payment events.

### 2.1 Install Stripe CLI (for local testing)
**On macOS:**
```bash
brew install stripe/stripe-brew/stripe
```

**On Windows:**
Download from [https://github.com/stripe/stripe-cli/releases](https://github.com/stripe/stripe-cli/releases)

**On Linux:**
```bash
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.0/stripe_1.19.0_linux_x86_64.tar.gz
tar -xvf stripe_1.19.0_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

### 2.2 Login to Stripe CLI
```bash
stripe login
```
This will open a browser window to authorize the CLI.

### 2.3 Forward Webhooks to Local Development
In a separate terminal window, run:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This command will output a webhook signing secret (starts with `whsec_`). Copy this for your `.env.local` file.

### 2.4 Configure Production Webhooks
For production deployment:

1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Click **+ Add endpoint**
3. Set endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)

---

## Step 3: Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Stripe Price IDs (from Step 1.3)
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxx

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
```

**Important Notes:**
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Never commit your `.env.local` file to version control
- For production, set these in your hosting platform (Vercel, Netlify, etc.)

---

## Step 4: Firestore Database Setup

We need to store subscription data in Firestore.

### 4.1 Update Firestore Rules
Add these rules to your `firestore.rules` file:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Subscriptions are linked to users
    match /subscriptions/{subscriptionId} {
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
      // Updates only via webhooks (server-side)
    }
  }
}
```

Deploy the rules:
```bash
firebase deploy --only firestore:rules
```

---

## Step 5: Testing Your Integration

### 5.1 Start Your Development Server
```bash
npm run dev
```

### 5.2 Start Stripe Webhook Forwarding
In a separate terminal:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### 5.3 Test Card Numbers
Stripe provides test card numbers for different scenarios:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Declined Payment:**
- Card: `4000 0000 0000 0002`

**Requires Authentication (3D Secure):**
- Card: `4000 0027 6000 3184`

### 5.4 Test the Flow
1. Go to `http://localhost:3000/pricing`
2. Click on a paid plan (Premium or Pro)
3. Complete the checkout process
4. Verify the subscription appears in:
   - Stripe Dashboard → Customers
   - Your Firestore database → `subscriptions` collection
5. Test the Customer Portal at `/account`

---

## Step 6: Production Deployment

### 6.1 Switch to Live Mode
1. In Stripe Dashboard, toggle from **Test mode** to **Live mode** (top right)
2. Get your live API keys (will start with `pk_live_` and `sk_live_`)
3. Create live webhook endpoint with your production URL
4. Get live Price IDs for your products

### 6.2 Update Production Environment Variables
In your hosting platform (e.g., Vercel):
1. Go to your project settings
2. Add environment variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (live key)
   - `STRIPE_SECRET_KEY` (live key)
   - `STRIPE_WEBHOOK_SECRET` (live webhook secret)
   - `NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID` (live price ID)
   - `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` (live price ID)

### 6.3 Verify Webhook Endpoint
1. After deploying, test the webhook endpoint
2. In Stripe Dashboard, go to your webhook endpoint
3. Click **Send test webhook** to verify it's working

---

## Step 7: Monitor and Maintain

### 7.1 Monitor Payments
- Stripe Dashboard → Payments
- Check for failed payments and disputes

### 7.2 Handle Failed Payments
- Set up email notifications in Stripe
- Stripe will automatically retry failed payments
- Consider implementing grace periods

### 7.3 Tax Handling
- Go to Settings → Tax in Stripe Dashboard
- Enable Stripe Tax for automatic tax calculation (optional)

---

## Troubleshooting

### Webhook Not Receiving Events
1. Check webhook endpoint is publicly accessible
2. Verify webhook secret matches your `.env.local`
3. Check webhook logs in Stripe Dashboard
4. Ensure Stripe CLI is running for local testing

### Checkout Session Not Creating
1. Verify API keys are correct
2. Check browser console for errors
3. Ensure user is authenticated
4. Verify Price IDs are correct

### Subscription Not Appearing in Firestore
1. Check webhook is receiving events
2. Verify Firestore rules allow writes
3. Check server logs for errors
4. Test webhook manually in Stripe Dashboard

---

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)

---

## Security Best Practices

1. **Never expose secret keys** - Keep `STRIPE_SECRET_KEY` server-side only
2. **Verify webhook signatures** - Always verify webhook events are from Stripe
3. **Use HTTPS in production** - Stripe requires HTTPS for webhooks
4. **Implement rate limiting** - Protect your API routes from abuse
5. **Handle errors gracefully** - Always provide user feedback for failed payments

---

## Next Steps

After completing this setup:
1. Test the entire payment flow in test mode
2. Customize the checkout success/cancel pages
3. Set up email notifications for customers
4. Add analytics tracking for purchases
5. Consider implementing usage-based billing for credits

Good luck with your Stripe integration! 🚀
