# Stripe Fix Instructions

## What Was Wrong

Your pricing page was sending plan IDs `'pro'` and `'teams'`, but your Stripe configuration was expecting `'premium'` and `'pro'`. This mismatch caused the API to return HTML error pages instead of JSON.

## What I Fixed

1. ✅ Updated `lib/stripe.ts` to use correct plan IDs: `'pro'` and `'teams'`
2. ✅ Updated `.env.example` with correct variable names
3. ✅ Updated `STRIPE_QUICKSTART.md` to reflect the actual plans ($15 Pro, $30 Teams)

## What You Need to Do Now

### Step 1: Update Your .env.local File

Open your `.env.local` file and **rename** these variables:

**BEFORE:**
```env
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxx
```

**AFTER:**
```env
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_TEAMS_PRICE_ID=price_xxxxxxxxxxxxx
```

### Step 2: Create Products in Stripe Dashboard

Go to your Stripe Dashboard and create these two products:

**Pro Plan:**
- Price: $15.00/month
- Copy the Price ID (starts with `price_`)
- Paste it as `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` in `.env.local`

**Teams Plan:**
- Price: $30.00/month
- Copy the Price ID (starts with `price_`)
- Paste it as `NEXT_PUBLIC_STRIPE_TEAMS_PRICE_ID` in `.env.local`

### Step 3: Restart Your Dev Server

Stop your current dev server (Ctrl+C) and restart it:

```bash
npm run dev
```

### Step 4: Test Again

1. Go to `http://localhost:3000/pricing`
2. Sign in with your Firebase account
3. Click on **Pro** or **Teams** plan
4. You should now be redirected to Stripe Checkout (no more HTML error!)

## Troubleshooting

If you still get errors:

1. **Check your `.env.local`** - Make sure all Stripe variables are set
2. **Verify Price IDs** - They should start with `price_` not `prod_`
3. **Check the terminal** - Look for any error messages when the dev server starts
4. **Verify Stripe CLI is running** - Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe` in a separate terminal
