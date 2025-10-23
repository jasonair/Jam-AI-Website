import { NextRequest, NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebaseAdmin';
import { db } from '@/lib/firebaseAdmin';
import { generateReferralCode } from '@/lib/referrals';

// Initialize Firebase Admin
initAdmin();

export async function POST(req: NextRequest) {
  try {
    const { userId, userEmail } = await req.json();

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing userId or userEmail' },
        { status: 400 }
      );
    }

    // Check if user already has a referral code
    const existingReferralsSnapshot = await db()
      .collection('referrals')
      .where('referrerId', '==', userId)
      .limit(1)
      .get();

    if (!existingReferralsSnapshot.empty) {
      const existingReferral = existingReferralsSnapshot.docs[0].data();
      return NextResponse.json({
        referralCode: existingReferral.referralCode,
        exists: true
      });
    }

    // Generate new referral code
    const referralCode = generateReferralCode(userId);

    // Create referral document
    await db().collection('referrals').add({
      referrerId: userId,
      referrerEmail: userEmail,
      referralCode,
      createdAt: new Date().toISOString(),
      totalReferrals: 0,
      successfulReferrals: 0,
      totalCreditsEarned: 0,
    });

    return NextResponse.json({
      referralCode,
      exists: false
    });
  } catch (error: any) {
    console.error('Error generating referral code:', error);
    return NextResponse.json(
      { error: 'Failed to generate referral code' },
      { status: 500 }
    );
  }
}
