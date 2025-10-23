import { NextRequest, NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebaseAdmin';
import { db } from '@/lib/firebaseAdmin';

// Initialize Firebase Admin
initAdmin();

export async function POST(req: NextRequest) {
  try {
    const { referralCode } = await req.json();

    if (!referralCode) {
      return NextResponse.json(
        { error: 'Missing referral code' },
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
        { valid: false, error: 'Invalid referral code' },
        { status: 404 }
      );
    }

    const referralDoc = referralsSnapshot.docs[0];
    const referralData = referralDoc.data();

    return NextResponse.json({
      valid: true,
      referrerId: referralData.referrerId,
      referrerEmail: referralData.referrerEmail,
    });
  } catch (error: any) {
    console.error('Error validating referral code:', error);
    return NextResponse.json(
      { error: 'Failed to validate referral code' },
      { status: 500 }
    );
  }
}
