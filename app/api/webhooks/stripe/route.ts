import { NextRequest, NextResponse } from 'next/server';
import { stripe, getPlanFromPriceId } from '@/lib/stripe';
import { initAdmin } from '@/lib/firebaseAdmin';
import { db } from '@/lib/firebaseAdmin';
import Stripe from 'stripe';
import { SubscriptionCreateData } from '@/lib/types/subscription';
import { REFERRAL_CREDIT_AMOUNT, REFERRER_CREDIT_AMOUNT } from '@/lib/referrals';

// Initialize Firebase Admin
initAdmin();

// Disable body parsing, we need the raw body
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    console.error('No Stripe signature found');
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);

  const userId = session.metadata?.userId || session.client_reference_id;
  const planId = session.metadata?.planId;

  if (!userId) {
    console.error('No userId found in session metadata');
    return;
  }

  // Get the subscription from Stripe
  if (session.subscription && typeof session.subscription === 'string') {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    await createOrUpdateSubscription(subscription, userId, planId);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);

  const userId = subscription.metadata?.userId;
  const planId = subscription.metadata?.planId;

  if (!userId) {
    console.error('No userId found in subscription metadata');
    return;
  }

  await createOrUpdateSubscription(subscription, userId, planId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);

  // Find the subscription in Firestore
  const subscriptionsSnapshot = await db()
    .collection('subscriptions')
    .where('stripeSubscriptionId', '==', subscription.id)
    .limit(1)
    .get();

  if (subscriptionsSnapshot.empty) {
    console.log('Subscription not found in Firestore');
    return;
  }

  const subscriptionDoc = subscriptionsSnapshot.docs[0];
  const userId = subscriptionDoc.data().userId;

  // Update the subscription status
  await subscriptionDoc.ref.update({
    status: 'canceled',
    updatedAt: new Date(),
  });

  // Update user's plan to free
  await db().collection('users').doc(userId).update({
    plan: 'free',
    planId: 'free',
    creditsTotal: 25,
    creditsUsed: 0,
    updatedAt: new Date(),
  });

  console.log(`Subscription ${subscription.id} marked as canceled`);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log('Invoice paid:', invoice.id);

  // Update subscription with new period
  const invoiceData = invoice as any;
  const subscriptionId = typeof invoiceData.subscription === 'string' 
    ? invoiceData.subscription 
    : invoiceData.subscription?.id;

  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata?.userId;
    const planId = subscription.metadata?.planId;

    if (userId) {
      await createOrUpdateSubscription(subscription, userId, planId);
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.error('Invoice payment failed:', invoice.id);

  // Find the subscription and update status
  const invoiceData = invoice as any;
  const subscriptionId = typeof invoiceData.subscription === 'string'
    ? invoiceData.subscription
    : invoiceData.subscription?.id;

  if (subscriptionId) {
    const subscriptionsSnapshot = await db()
      .collection('subscriptions')
      .where('stripeSubscriptionId', '==', subscriptionId)
      .limit(1)
      .get();

    if (!subscriptionsSnapshot.empty) {
      const subscriptionDoc = subscriptionsSnapshot.docs[0];
      await subscriptionDoc.ref.update({
        status: 'past_due',
        updatedAt: new Date(),
      });

      console.log(`Subscription ${subscriptionId} marked as past_due`);
    }
  }
}

async function createOrUpdateSubscription(
  subscription: Stripe.Subscription,
  userId: string,
  planId?: string
) {
  const priceId = subscription.items.data[0]?.price.id;
  const determinedPlanId = planId || getPlanFromPriceId(priceId);

  const subscriptionData: SubscriptionCreateData = {
    userId,
    stripeCustomerId: subscription.customer as string,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId,
    status: subscription.status as any,
    planId: determinedPlanId as any,
    currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
  };

  // Check if subscription already exists
  const existingSubscriptionsSnapshot = await db()
    .collection('subscriptions')
    .where('stripeSubscriptionId', '==', subscription.id)
    .limit(1)
    .get();

  if (!existingSubscriptionsSnapshot.empty) {
    // Update existing subscription
    const existingDoc = existingSubscriptionsSnapshot.docs[0];
    await existingDoc.ref.update({
      ...subscriptionData,
      updatedAt: new Date(),
    });
    console.log(`Updated subscription ${subscription.id}`);
  } else {
    // Create new subscription
    await db().collection('subscriptions').add({
      ...subscriptionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`Created new subscription ${subscription.id}`);
  }

  // Get credit allocation for the plan
  const planCredits: Record<string, number> = {
    'free': 25,
    'pro': 500,
    'teams': 1500,
    'enterprise': 5000,
  };

  const creditsTotal = planCredits[determinedPlanId] || 25;

  // Update user's plan and reset credits for the new billing period
  await db().collection('users').doc(userId).set(
    {
      plan: determinedPlanId, // Use 'plan' to match UserProfile interface
      planId: determinedPlanId, // Keep for backward compatibility
      creditsTotal: creditsTotal,
      creditsUsed: 0, // Reset credits used for new billing period
      stripeCustomerId: subscription.customer,
      updatedAt: new Date(),
    },
    { merge: true }
  );

  console.log(`Updated user ${userId} to plan ${determinedPlanId} with ${creditsTotal} credits`);

  // Check if this is a new paid subscription and handle referral credits
  // Only process referral credits for new subscriptions (when existingSubscriptionsSnapshot is empty)
  const isNewSubscription = existingSubscriptionsSnapshot.empty;
  if (determinedPlanId !== 'free' && isNewSubscription) {
    await handleReferralCredits(userId);
  }
}

/**
 * Handle referral credits when a referred user subscribes to a paid plan
 */
async function handleReferralCredits(userId: string) {
  try {
    // Check if this user was referred
    const redemptionsSnapshot = await db()
      .collection('referral_redemptions')
      .where('referredUserId', '==', userId)
      .where('creditsAwarded', '==', false)
      .limit(1)
      .get();

    if (redemptionsSnapshot.empty) {
      console.log('No pending referral redemptions found for user:', userId);
      return;
    }

    const redemptionDoc = redemptionsSnapshot.docs[0];
    const redemptionData = redemptionDoc.data();
    const referrerId = redemptionData.referrerId;

    console.log(`Processing referral credits for user ${userId} (referred by ${referrerId})`);

    // Get current user data to calculate new credit total
    const referredUserDoc = await db().collection('users').doc(userId).get();
    const referredUserData = referredUserDoc.data();
    
    // Award credits to the referred user (250 credits)
    const referredUserNewCredits = (referredUserData?.credits || referredUserData?.creditsTotal || 0) + REFERRAL_CREDIT_AMOUNT;
    await db().collection('users').doc(userId).update({
      credits: referredUserNewCredits,
      updatedAt: new Date(),
    });
    console.log(`Awarded ${REFERRAL_CREDIT_AMOUNT} credits to referred user ${userId}`);

    // Get referrer data
    const referrerDoc = await db().collection('users').doc(referrerId).get();
    const referrerData = referrerDoc.data();
    
    // Award credits to the referrer (250 credits)
    const referrerNewCredits = (referrerData?.credits || referrerData?.creditsTotal || 0) + REFERRER_CREDIT_AMOUNT;
    await db().collection('users').doc(referrerId).update({
      credits: referrerNewCredits,
      updatedAt: new Date(),
    });
    console.log(`Awarded ${REFERRER_CREDIT_AMOUNT} credits to referrer ${referrerId}`);

    // Update redemption record
    await redemptionDoc.ref.update({
      creditsAwarded: true,
      creditsAwardedAt: new Date().toISOString(),
      subscriptionStartedAt: new Date().toISOString(),
      status: 'completed',
    });

    // Update referral stats
    const referralsSnapshot = await db()
      .collection('referrals')
      .where('referrerId', '==', referrerId)
      .limit(1)
      .get();

    if (!referralsSnapshot.empty) {
      const referralDoc = referralsSnapshot.docs[0];
      const referralData = referralDoc.data();
      await referralDoc.ref.update({
        successfulReferrals: (referralData.successfulReferrals || 0) + 1,
        totalCreditsEarned: (referralData.totalCreditsEarned || 0) + REFERRER_CREDIT_AMOUNT,
      });
    }

    console.log('Referral credits processed successfully');
  } catch (error) {
    console.error('Error handling referral credits:', error);
    // Don't throw error to prevent webhook from failing
  }
}
