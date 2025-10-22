import { NextRequest, NextResponse } from 'next/server';
import { stripe, getPlanFromPriceId } from '@/lib/stripe';
import { auth, db } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    // Get the authorization token from the request
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the Firebase token
    let decodedToken;
    try {
      decodedToken = await auth().verifyIdToken(token);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;
    const userEmail = decodedToken.email;

    console.log(`Syncing subscription for user: ${userEmail}`);

    // Find customer in Stripe by email
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json(
        { error: 'No Stripe customer found', plan: 'free' },
        { status: 404 }
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
      // No active subscription - set to free plan
      await db().collection('users').doc(userId).update({
        plan: 'free',
        planId: 'free',
        creditsTotal: 25,
        creditsUsed: 0,
        updatedAt: new Date(),
      });

      return NextResponse.json({
        message: 'No active subscription found. Set to Free plan.',
        plan: 'free',
        credits: 25,
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
      'teams': 1500,
      'enterprise': 5000,
    };

    const creditsTotal = planCredits[planId] || 25;

    // Update user's Firestore profile
    await db().collection('users').doc(userId).update({
      plan: planId,
      planId: planId,
      creditsTotal: creditsTotal,
      creditsUsed: 0,
      stripeCustomerId: customer.id,
      updatedAt: new Date(),
    });

    console.log(`✅ Synced user ${userId} to plan ${planId} with ${creditsTotal} credits`);

    return NextResponse.json({
      message: 'Subscription synced successfully',
      plan: planId,
      credits: creditsTotal,
      subscriptionStatus: subscription.status,
    });

  } catch (error: any) {
    console.error('Error syncing subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
