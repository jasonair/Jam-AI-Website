import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

/**
 * Simplified portal session endpoint that doesn't require Firebase Admin
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userEmail } = body;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Missing userEmail' },
        { status: 400 }
      );
    }

    console.log(`Creating portal session for: ${userEmail}`);

    // Find customer in Stripe by email
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json(
        { error: 'No Stripe customer found. You may not have a paid subscription yet.' },
        { status: 404 }
      );
    }

    const customer = customers.data[0];
    
    // Get the return URL
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const returnUrl = `${origin}/account`;

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: returnUrl,
    });

    console.log(`✅ Created portal session for customer: ${customer.id}`);

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
