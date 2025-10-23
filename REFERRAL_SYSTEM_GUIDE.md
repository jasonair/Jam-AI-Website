# Referral System Implementation Guide

## Overview

The Jam AI referral program allows users to invite friends and earn 250 bonus credits when their referrals subscribe to a paid plan. Both the referrer and the referred user receive 250 credits.

## Key Features

- **Unique Referral Codes**: Each user gets a unique 8-character referral code
- **Credit Rewards**: 250 credits for both referrer and referred user
- **Conditional Activation**: Credits are only awarded when the referred user subscribes to a paid plan (Pro, Teams, or Enterprise)
- **Tracking**: Full tracking of referrals and redemptions
- **Terms of Service**: Comprehensive terms page modeled after Windsurf's referral terms

## Architecture

### Database Schema

#### Referrals Collection (`referrals`)
```typescript
{
  referrerId: string;          // User ID of the referrer
  referrerEmail: string;        // Email of the referrer
  referralCode: string;         // 8-character unique code
  createdAt: string;            // ISO timestamp
  totalReferrals: number;       // Total number of referrals made
  successfulReferrals: number;  // Number of referrals that subscribed
  totalCreditsEarned: number;   // Total credits earned from referrals
}
```

#### Referral Redemptions Collection (`referral_redemptions`)
```typescript
{
  referralCode: string;         // The referral code used
  referrerId: string;           // User ID of the referrer
  referredUserId: string;       // User ID of the new user
  referredUserEmail: string;    // Email of the new user
  redeemedAt: string;           // ISO timestamp when code was redeemed
  subscriptionStartedAt?: string; // ISO timestamp when user subscribed
  creditsAwarded: boolean;      // Whether credits have been awarded
  creditsAwardedAt?: string;    // ISO timestamp when credits were awarded
  status: 'pending' | 'completed'; // Status of the referral
}
```

### API Endpoints

#### 1. Generate Referral Code
**Endpoint**: `POST /api/referral/generate`

**Request**:
```json
{
  "userId": "string",
  "userEmail": "string"
}
```

**Response**:
```json
{
  "referralCode": "ABC12DEF",
  "exists": false
}
```

#### 2. Validate Referral Code
**Endpoint**: `POST /api/referral/validate`

**Request**:
```json
{
  "referralCode": "ABC12DEF"
}
```

**Response**:
```json
{
  "valid": true,
  "referrerId": "user123",
  "referrerEmail": "referrer@example.com"
}
```

#### 3. Redeem Referral Code
**Endpoint**: `POST /api/referral/redeem`

**Request**:
```json
{
  "referralCode": "ABC12DEF",
  "referredUserId": "newuser456",
  "referredUserEmail": "newuser@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Referral code redeemed. Credits will be awarded when you subscribe to a paid plan."
}
```

## User Flow

### For Referrers

1. User visits their account page (`/account`)
2. The `ReferralProgram` component automatically generates a unique referral code
3. User copies their referral link: `https://yoursite.com/auth/signup?referral_code=ABC12DEF`
4. User shares the link with friends
5. When a friend subscribes to a paid plan, the referrer receives 250 credits

### For Referred Users

1. User clicks on a referral link containing a `referral_code` parameter
2. Signup page validates the referral code and displays a banner
3. User completes signup process
4. Referral code is redeemed and stored with `status: 'pending'`
5. When user subscribes to a paid plan, the Stripe webhook triggers credit award
6. Both users receive 250 credits and redemption status changes to `completed`

## Credit Awarding Logic

The credit awarding is handled by the Stripe webhook in `/app/api/webhooks/stripe/route.ts`:

1. When a subscription is created or updated, the webhook checks if it's a new paid subscription
2. If yes, it calls `handleReferralCredits(userId)`
3. The function queries for pending redemptions for this user
4. If found, it:
   - Awards 250 credits to the referred user
   - Awards 250 credits to the referrer
   - Updates the redemption record as completed
   - Increments the referrer's successful referrals count

### Important Notes

- Credits are only awarded for **new** paid subscriptions (Pro, Teams, or Enterprise)
- Credits are NOT awarded for free plans
- The system prevents duplicate credit awards
- If a user cancels within 30 days, credits may be revoked (as per terms)

## Security

### Firestore Security Rules

```javascript
// Referrals - users can read their own referral data
match /referrals/{referralId} {
  allow read: if request.auth != null && 
                 resource.data.referrerId == request.auth.uid;
  allow create: if request.auth != null && 
                   request.resource.data.referrerId == request.auth.uid;
  allow update: if false; // Only backend can update
  allow delete: if false;
}

// Referral Redemptions - users can read their own redemptions
match /referral_redemptions/{redemptionId} {
  allow read: if request.auth != null && 
                 (resource.data.referrerId == request.auth.uid || 
                  resource.data.referredUserId == request.auth.uid);
  allow create: if request.auth != null && 
                   request.resource.data.referredUserId == request.auth.uid;
  allow update: if false; // Only backend can update
  allow delete: if false;
}
```

### Fraud Prevention

- Users cannot refer themselves
- Each user can only redeem one referral code
- Backend validation prevents duplicate redemptions
- Firestore rules restrict write access to prevent tampering

## Components

### ReferralProgram Component
**Location**: `/components/ReferralProgram.tsx`

A beautiful UI component that displays:
- User's unique referral link
- Copy button with confirmation
- How it works section
- Link to terms of service

### Referral Terms Page
**Location**: `/app/referral-terms/page.tsx`

Comprehensive terms of service page covering:
- Eligibility requirements
- How the program works
- Credit rewards
- Restrictions and prohibited activities
- Fraud and abuse policies
- Privacy and contact information

## Testing

### Manual Testing Steps

1. **Generate Referral Code**:
   - Log in as User A
   - Go to `/account`
   - Copy the referral link

2. **Use Referral Code**:
   - Open incognito/private window
   - Visit the referral link
   - Verify banner appears on signup page
   - Complete signup as User B

3. **Verify Redemption**:
   - Check Firestore `referral_redemptions` collection
   - Should see a pending redemption record

4. **Subscribe to Paid Plan**:
   - As User B, subscribe to Pro/Teams/Enterprise plan
   - Wait for Stripe webhook to process

5. **Verify Credits**:
   - Check both users' credit balances in Firestore
   - Both should have received 250 additional credits
   - Redemption status should be 'completed'

### Database Queries

Check referrals:
```javascript
db.collection('referrals')
  .where('referrerId', '==', 'USER_ID')
  .get()
```

Check redemptions:
```javascript
db.collection('referral_redemptions')
  .where('referredUserId', '==', 'USER_ID')
  .get()
```

## Configuration

### Credit Amounts

To modify credit amounts, update `/lib/referrals.ts`:

```typescript
export const REFERRAL_CREDIT_AMOUNT = 250; // Credits for referred user
export const REFERRER_CREDIT_AMOUNT = 250; // Credits for referrer
```

### Referral Code Format

The referral code generation uses an 8-character alphanumeric format. To modify, update the `generateReferralCode` function in `/lib/referrals.ts`.

## Monitoring

### Key Metrics to Track

- Total referrals generated
- Referral conversion rate (redeemed / total)
- Successful referrals (subscribed / redeemed)
- Total credits awarded
- Most active referrers

### Firestore Queries for Analytics

```javascript
// Get total successful referrals
db.collection('referral_redemptions')
  .where('status', '==', 'completed')
  .get()

// Get top referrers
db.collection('referrals')
  .orderBy('successfulReferrals', 'desc')
  .limit(10)
  .get()
```

## Troubleshooting

### Credits Not Awarded

1. Check webhook logs for errors
2. Verify subscription is not 'free' plan
3. Check if redemption exists in `referral_redemptions`
4. Ensure `creditsAwarded` is false before subscription
5. Verify Stripe webhook is properly configured

### Invalid Referral Code

1. Check if code exists in `referrals` collection
2. Verify code format (8 characters, uppercase)
3. Check Firestore security rules

### User Can't Generate Code

1. Verify user is authenticated
2. Check API endpoint logs
3. Verify Firebase Admin is initialized

## Future Enhancements

Potential improvements:
- Dashboard for referral analytics
- Email notifications for successful referrals
- Tiered rewards based on number of referrals
- Social sharing buttons
- Referral leaderboard
- Referral history and stats in account page
- Admin panel to manage referrals
