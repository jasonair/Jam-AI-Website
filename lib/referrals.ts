/**
 * Referral system utilities
 */

/**
 * Generate a unique referral code for a user
 * Format: 8 character alphanumeric code
 */
export function generateReferralCode(userId: string): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = 8;
  let code = '';
  
  // Use userId as seed for randomization to ensure uniqueness
  const seed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  for (let i = 0; i < codeLength; i++) {
    const index = (seed + i * 7) % characters.length;
    code += characters[index];
  }
  
  // Add a random component to ensure uniqueness
  const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
  return code.substring(0, 5) + randomPart;
}

/**
 * Referral data structure
 */
export interface Referral {
  referrerId: string;
  referrerEmail: string;
  referralCode: string;
  createdAt: string;
  totalReferrals: number;
  successfulReferrals: number;
  totalCreditsEarned: number;
}

/**
 * Referral redemption data structure
 */
export interface ReferralRedemption {
  referralCode: string;
  referrerId: string;
  referredUserId: string;
  referredUserEmail: string;
  redeemedAt: string;
  subscriptionStartedAt?: string;
  creditsAwarded: boolean;
  creditsAwardedAt?: string;
  status: 'pending' | 'completed';
}

/**
 * Constants
 */
export const REFERRAL_CREDIT_AMOUNT = 250;
export const REFERRER_CREDIT_AMOUNT = 250;
