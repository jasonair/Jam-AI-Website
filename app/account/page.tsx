import { CreditCard, Users, Settings, TrendingUp } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';

export default function AccountPage() {
  // Mock data - would come from Firebase/Stripe in production
  const currentPlan = {
    name: 'Trial',
    tagline: 'Full power for your first 7 days.',
    creditsUsed: 450,
    creditsTotal: 1000,
    teamSlotsUsed: 2,
    teamSlotsTotal: 3,
    daysRemaining: 5,
  };

  const creditsPercentage = (currentPlan.creditsUsed / currentPlan.creditsTotal) * 100;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Section>
        <Container size="md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Account Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your plan, credits, and preferences
            </p>
          </div>

          <div className="space-y-6">
            {/* Current Plan Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-accent shadow-lg">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{currentPlan.name}</h2>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-full">
                      Current Plan
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {currentPlan.tagline}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    {currentPlan.daysRemaining} days remaining in trial
                  </p>
                </div>
                <Button variant="primary">Upgrade Plan</Button>
              </div>

              {/* Credits Usage */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Credits used this month
                  </span>
                  <span className="text-sm font-semibold">
                    {currentPlan.creditsUsed.toLocaleString()} / {currentPlan.creditsTotal.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-accent h-full rounded-full transition-all duration-500"
                    style={{ width: `${creditsPercentage}%` }}
                  />
                </div>
              </div>

              {/* Team Slots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    AI Team Members
                  </span>
                  <span className="text-sm font-semibold">
                    {currentPlan.teamSlotsUsed} of {currentPlan.teamSlotsTotal} used
                  </span>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: currentPlan.teamSlotsTotal }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-3 rounded-full ${
                        i < currentPlan.teamSlotsUsed
                          ? 'bg-accent'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Billing Management */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-accent transition-colors duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Manage Billing</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Update payment methods and view invoices
                    </p>
                    <Button variant="outline" size="sm">
                      Open Stripe Portal
                    </Button>
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-accent transition-colors duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Usage Stats</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      View detailed analytics and insights
                    </p>
                    <Button variant="outline" size="sm">
                      View Analytics
                    </Button>
                  </div>
                </div>
              </div>

              {/* Team Management */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-accent transition-colors duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">AI Team Members</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Configure your AI team and roles
                    </p>
                    <Button variant="outline" size="sm">
                      Manage Team
                    </Button>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-accent transition-colors duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Settings className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Preferences</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Theme, data settings, and more
                    </p>
                    <Button variant="outline" size="sm">
                      Edit Settings
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Preferences */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Theme Preferences</h3>
              <div className="flex gap-4">
                <button className="flex-1 p-4 border-2 border-accent bg-accent/5 rounded-lg text-center font-medium hover:bg-accent/10 transition-colors duration-200">
                  Light
                </button>
                <button className="flex-1 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-center font-medium hover:border-accent transition-colors duration-200">
                  Dark
                </button>
                <button className="flex-1 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-center font-medium hover:border-accent transition-colors duration-200">
                  System
                </button>
              </div>
            </div>

            {/* Data Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Data & Privacy</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium">Analytics opt-out</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Disable anonymous usage analytics
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-accent rounded focus:ring-accent"
                  />
                </label>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="outline" size="sm">
                    Export My Data
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Back to home */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-accent hover:text-accent-hover font-medium transition-colors duration-200"
            >
              ← Back to Home
            </a>
          </div>
        </Container>
      </Section>
    </main>
  );
}
