import { NextRequest, NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebaseAdmin';
import { db } from '@/lib/firebaseAdmin';

// Initialize Firebase Admin
initAdmin();

export async function POST(req: NextRequest) {
  try {
    const { referralCode, referredUserId, referredUserEmail } = await req.json();

    if (!referralCode || !referredUserId || !referredUserEmail) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Find referral by code
    const referralsSnapshot = await db()
      .collection('referrals')
      .where('referralCode', '==', referralCode.toUpperCase())
      .limit(1)
      .get();

    if (referralsSnapshot.empty) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      );
    }

    const referralDoc = referralsSnapshot.docs[0];
    const referralData = referralDoc.data();

    // Check if user is trying to use their own referral code
    if (referralData.referrerId === referredUserId) {
      return NextResponse.json(
        { error: 'Cannot use your own referral code' },
        { status: 400 }
      );
    }

    // Check if user has already redeemed a referral
    const existingRedemptionSnapshot = await db()
      .collection('referral_redemptions')
      .where('referredUserId', '==', referredUserId)
      .limit(1)
      .get();

    if (!existingRedemptionSnapshot.empty) {
      return NextResponse.json(
        { error: 'You have already used a referral code' },
        { status: 400 }
      );
    }

    // Create redemption record
    await db().collection('referral_redemptions').add({
      referralCode: referralCode.toUpperCase(),
      referrerId: referralData.referrerId,
      referredUserId,
      referredUserEmail,
      redeemedAt: new Date().toISOString(),
      creditsAwarded: false,
      status: 'pending',
    });

    // Update referral stats
    await referralDoc.ref.update({
      totalReferrals: (referralData.totalReferrals || 0) + 1,
    });

    return NextResponse.json({
      success: true,
      message: 'Referral code redeemed. Credits will be awarded when you subscribe to a paid plan.',
    });
  } catch (error: any) {
    console.error('Error redeeming referral code:', error);
    return NextResponse.json(
      { error: 'Failed to redeem referral code' },
      { status: 500 }
    );
  }
}
