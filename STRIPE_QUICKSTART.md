# Stripe Quick Start Guide (5 Minutes)

Since you've never used Stripe before, here's a simple step-by-step guide to get payments working on your site.

## Step 1: Get Your API Keys (2 minutes)

1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Log into your Stripe account
3. You'll see **"Test mode"** toggle in the top right - make sure it's ON (orange)
4. Click **Developers** → **API keys** in the left menu
5. Copy these two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (click "Reveal test key", starts with `sk_test_`)

## Step 2: Create Your Products (3 minutes)

### Create Pro Plan ($15/month)
1. Click **Products** in the left menu
2. Click **+ Add product**
3. Fill in:
   - Name: `Pro Plan`
   - Description: `500 credits/month, 12 AI team members`
   - Pricing → Price: `15.00` USD
   - Billing period: `Monthly`
4. Click **Save product**
5. ⚠️ **IMPORTANT**: Copy the **Price ID** (starts with `price_`) - you'll need this!

### Create Teams Plan ($30/month)
1. Click **+ Add product** again
2. Fill in:
   - Name: `Teams Plan`
   - Description: `500 credits/user/month, unlimited AI team members`
   - Pricing → Price: `30.00` USD
   - Billing period: `Monthly`
3. Click **Save product**
4. ⚠️ **IMPORTANT**: Copy the **Price ID** (starts with `price_`)

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Your existing Firebase variables...
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# Stripe Keys (from Step 1)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx

# Price IDs (from Step 2)
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_TEAMS_PRICE_ID=price_xxxxxxxxxxxxx

# Webhook secret (we'll add this in Step 5)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

## Step 4: Enable Customer Portal (1 minute)

The Customer Portal lets users manage their subscriptions.

1. In Stripe Dashboard, go to **Settings** (bottom left)
2. Click **Billing** → **Customer portal**
3. Click **Activate test link**
4. Under settings, enable:
   - ✅ Cancel subscriptions
   - ✅ Update payment methods
5. Click **Save**

## Step 5: Set Up Webhooks for Local Testing

Webhooks let Stripe notify your app about payment events.

### Install Stripe CLI
**macOS:**
```bash
brew install stripe/stripe-brew/stripe
```

**Windows:** Download from [Stripe CLI releases](https://github.com/stripe/stripe-cli/releases)

### Set Up Webhook Forwarding
1. Open a terminal and run:
```bash
stripe login
```

2. In a **separate terminal window** (keep this running):
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

3. The command will output a webhook secret (starts with `whsec_`)
4. Copy it and add to your `.env.local` file as `STRIPE_WEBHOOK_SECRET`

## Step 6: Test Your Integration

1. **Start your dev server:**
```bash
npm run dev
```

2. **Keep the Stripe CLI running** in another terminal (from Step 5)

3. **Test a payment:**
   - Go to `http://localhost:3000/pricing`
   - Sign in with your Firebase account
   - Click a paid plan (Pro or Teams)
   - Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)

4. **Verify it worked:**
   - Check Stripe Dashboard → Payments
   - Check your Firestore database → `subscriptions` collection
   - Go to `/account` page and you should see subscription management

## Troubleshooting

### "Webhook signature verification failed"
- Make sure Stripe CLI is running with `stripe listen`
- Restart your dev server after adding the webhook secret

### "No price ID found"
- Double-check your Price IDs in `.env.local`
- Make sure they start with `price_` not `prod_`

### Payment succeeded but not showing in app
- Check the Stripe CLI terminal for webhook events
- Look for errors in your Next.js terminal
- Verify Firestore rules allow writes

## Going to Production

When you're ready to accept real payments:

1. **Switch to Live Mode** in Stripe Dashboard (toggle in top right)
2. **Get live API keys** from Developers → API keys
3. **Create live products** (repeat Step 2 in live mode)
4. **Set up production webhook:**
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select all subscription events
   - Copy the webhook secret
5. **Update production environment variables** in your hosting platform (Vercel, etc.)

---

## Quick Reference: Test Cards

- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **3D Secure**: 4000 0027 6000 3184

## Need Help?

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- Check `STRIPE_SETUP_GUIDE.md` for detailed information

That's it! You're now accepting payments with Stripe. 🎉
