'use client';

import Header from '@/components/ui/Header';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';

export default function ReferralTermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Section>
          <Container size="md">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
              <h1 className="text-3xl font-bold mb-6">Terms of Service: Referrals</h1>
              
              <div className="space-y-6 text-gray-600 dark:text-gray-400">
                <section>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    Jam AI Referral Program
                  </h2>
                  <p className="mb-4">
                    Welcome to the Jam AI Referral Program. By participating in this program, you agree to the following terms and conditions.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    1. Eligibility
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>The referral program is available to all registered Jam AI users with an active account.</li>
                    <li>Users must be at least 18 years of age to participate.</li>
                    <li>Jam AI employees and their immediate family members are not eligible to participate.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    2. How the Program Works
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Each user receives a unique referral link upon account creation.</li>
                    <li>Users can share their referral link with friends, family, or colleagues.</li>
                    <li>When a new user signs up using your referral link and subscribes to a paid plan (Pro, Teams, or Enterprise), both you and the referred user will receive 250 bonus credits.</li>
                    <li>Credits are awarded only when the referred user completes their first paid subscription payment.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    3. Credit Rewards
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Referrer receives: 250 credits per successful referral</li>
                    <li>Referred user receives: 250 credits upon subscribing to a paid plan</li>
                    <li>Credits do not expire and can be used for any Jam AI features and services.</li>
                    <li>Credits are non-transferable and have no cash value.</li>
                    <li>There is no limit to the number of referrals you can make.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    4. Restrictions and Prohibited Activities
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Users cannot refer themselves or create multiple accounts to earn credits.</li>
                    <li>Referral links cannot be used in spam, unsolicited emails, or in a way that violates any laws or regulations.</li>
                    <li>Using automated systems, bots, or any fraudulent means to generate referrals is strictly prohibited.</li>
                    <li>Referral links cannot be posted on coupon or deal websites without prior written consent from Jam AI.</li>
                    <li>Users must not misrepresent Jam AI or the referral program in any way.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    5. Credit Processing
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Credits are typically awarded within 24-48 hours after a referred user's first paid subscription payment is processed.</li>
                    <li>Jam AI reserves the right to review and verify referrals before awarding credits.</li>
                    <li>If a referred user cancels or refunds their subscription within 30 days, the credits may be revoked.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    6. Program Changes and Termination
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Jam AI reserves the right to modify, suspend, or terminate the referral program at any time without prior notice.</li>
                    <li>Changes to credit amounts, eligibility requirements, or program terms may be made at Jam AI's discretion.</li>
                    <li>Existing earned credits will remain valid even if the program is terminated.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    7. Fraud and Abuse
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Jam AI reserves the right to investigate suspicious activity and disqualify users who violate these terms.</li>
                    <li>Accounts found to be engaging in fraudulent activity will be suspended or terminated.</li>
                    <li>Any credits earned through fraudulent means will be revoked.</li>
                    <li>Jam AI may pursue legal action against users who engage in fraudulent activities.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    8. Liability and Disclaimers
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Jam AI is not responsible for any technical issues that may prevent credits from being awarded.</li>
                    <li>The referral program is provided "as is" without any warranties or guarantees.</li>
                    <li>Jam AI is not liable for any damages or losses resulting from participation in the referral program.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    9. Privacy
                  </h3>
                  <p>
                    Participation in the referral program is subject to our Privacy Policy. We collect and use information about referrers and referred users in accordance with our privacy practices.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    10. Contact
                  </h3>
                  <p>
                    If you have questions about the referral program or these terms, please contact us at support@jamai.com.
                  </p>
                </section>

                <section className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    <strong>Last Updated:</strong> October 23, 2025
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    By participating in the Jam AI Referral Program, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                  </p>
                </section>
              </div>

              <div className="mt-8 text-center">
                <a
                  href="/account"
                  className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                >
                  ← Back to Account
                </a>
              </div>
            </div>
          </Container>
        </Section>
      </main>
    </>
  );
}
