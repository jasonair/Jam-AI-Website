import { NextRequest, NextResponse } from 'next/server';
import { stripe, getPlanFromPriceId } from '@/lib/stripe';

/**
 * Simplified sync endpoint that doesn't require Firebase Admin
 * Uses client-side authentication
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userEmail, userId } = body;

    if (!userEmail || !userId) {
      return NextResponse.json(
        { error: 'Missing userEmail or userId' },
        { status: 400 }
      );
    }

    console.log(`Syncing subscription for user: ${userEmail}`);

    // Find customer in Stripe by email
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json(
        { 
          message: 'No Stripe customer found. You may not have a paid subscription yet.',
          plan: 'free',
          credits: 25
        },
        { status: 200 }
      );
    }

    const customer = customers.data[0];
    
    // Get active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({
        message: 'No active subscription found.',
        plan: 'free',
        credits: 25,
        updateNeeded: {
          plan: 'free',
          planId: 'free',
          creditsTotal: 25,
          creditsUsed: 0,
        }
      });
    }

    // Get the subscription and plan details
    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0]?.price.id;
    const planId = getPlanFromPriceId(priceId);

    // Get credit allocation for the plan
    const planCredits: Record<string, number> = {
      'free': 25,
      'pro': 500,
      'teams': 500,
      'enterprise': 1000,
    };

    const creditsTotal = planCredits[planId] || 25;

    console.log(`✅ Found subscription for ${userId}: ${planId} with ${creditsTotal} credits`);

    return NextResponse.json({
      message: 'Subscription found successfully',
      plan: planId,
      credits: creditsTotal,
      subscriptionStatus: subscription.status,
      updateNeeded: {
        plan: planId,
        planId: planId,
        creditsTotal: creditsTotal,
        creditsUsed: 0,
        stripeCustomerId: customer.id,
      }
    });

  } catch (error: any) {
    console.error('Error syncing subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
