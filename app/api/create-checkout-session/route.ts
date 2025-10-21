import { NextRequest, NextResponse } from 'next/server';
import { stripe, getPriceId } from '@/lib/stripe';
import { auth } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    // Validate Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Stripe is not configured. Please check server configuration.' },
        { status: 500 }
      );
    }

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

    // Parse request body
    const { planId } = await req.json();

    // Validate plan ID and get price ID
    const priceId = getPriceId(planId);
    if (!priceId) {
      console.error(`Invalid plan ID: ${planId}. Valid plans: pro, teams`);
      console.error('Environment variables:', {
        pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ? 'set' : 'MISSING',
        teams: process.env.NEXT_PUBLIC_STRIPE_TEAMS_PRICE_ID ? 'set' : 'MISSING',
      });
      return NextResponse.json(
        { error: `Invalid plan selected: ${planId}. Valid plans are: pro, teams` },
        { status: 400 }
      );
    }

    // Get the base URL for success/cancel redirects
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      client_reference_id: userId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/auth/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        userId,
        planId,
      },
      subscription_data: {
        metadata: {
          userId,
          planId,
        },
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    
    // Provide more specific error messages
    if (error.type === 'StripeAuthenticationError') {
      return NextResponse.json(
        { error: 'Stripe authentication failed. Check your STRIPE_SECRET_KEY.' },
        { status: 500 }
      );
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
