import Stripe from 'stripe';
import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js';

// Initialize Stripe on the server
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover' as any,
  typescript: true,
});

// Initialize Stripe on the client
let stripePromise: Promise<StripeJS | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
};

// Price IDs from environment variables
export const STRIPE_PRICES = {
  pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  teams: process.env.NEXT_PUBLIC_STRIPE_TEAMS_PRICE_ID,
} as const;

// Map plan IDs to Stripe Price IDs
export function getPriceId(planId: string): string | undefined {
  switch (planId) {
    case 'pro':
      return STRIPE_PRICES.pro;
    case 'teams':
      return STRIPE_PRICES.teams;
    default:
      return undefined;
  }
}

// Get plan details from price ID
export function getPlanFromPriceId(priceId: string): string {
  if (priceId === STRIPE_PRICES.pro) return 'pro';
  if (priceId === STRIPE_PRICES.teams) return 'teams';
  return 'free';
}

// Subscription status mapping
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid';

export function isActiveSubscription(status: SubscriptionStatus): boolean {
  return status === 'active' || status === 'trialing';
}
