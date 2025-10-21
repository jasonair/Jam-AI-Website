export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  planId: 'trial' | 'free' | 'premium' | 'pro';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionCreateData {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: Subscription['status'];
  planId: Subscription['planId'];
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface UserSubscriptionInfo {
  hasActiveSubscription: boolean;
  planId: 'trial' | 'free' | 'premium' | 'pro';
  status?: Subscription['status'];
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}
