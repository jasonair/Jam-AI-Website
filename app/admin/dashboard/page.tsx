'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  Users, 
  Activity, 
  TrendingUp, 
  Zap,
  LogOut,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import {
  getTokenUsageSummary,
  getMostUsedTeamMembers,
  getPlanDistribution,
  getDailyTrends,
  getCostByTeamMember,
  getActiveUsersCount,
  getTotalUsersCount,
  getAccountActivitySummary,
  TokenUsageSummary,
  TeamMemberUsage,
  PlanDistribution,
  DailyTrend,
  RoleCost,
  AccountActivitySummary
} from '@/lib/analytics';
import StatCard from '@/components/admin/StatCard';
import LineChart from '@/components/admin/LineChart';
import BarChart from '@/components/admin/BarChart';
import PieChart from '@/components/admin/PieChart';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { format } from 'date-fns';

export default function AdminDashboardPage() {
  const { isAdmin, loading, signOut, user } = useAdminAuth();
  const router = useRouter();
  
  const [dateRange, setDateRange] = useState(30);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  
  // Analytics state
  const [tokenUsage, setTokenUsage] = useState<TokenUsageSummary | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberUsage[]>([]);
  const [planDist, setPlanDist] = useState<PlanDistribution | null>(null);
  const [dailyTrends, setDailyTrends] = useState<DailyTrend[]>([]);
  const [roleCosts, setRoleCosts] = useState<RoleCost[]>([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [accountActivity, setAccountActivity] = useState<AccountActivitySummary | null>(null);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, loading, router]);

  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const [
        tokenData,
        teamData,
        planData,
        trendsData,
        roleCostsData,
        activeUsersData,
        totalUsersData,
        accountActivityData
      ] = await Promise.all([
        getTokenUsageSummary(dateRange),
        getMostUsedTeamMembers(10),
        getPlanDistribution(),
        getDailyTrends(dateRange),
        getCostByTeamMember(dateRange),
        getActiveUsersCount(dateRange),
        getTotalUsersCount(),
        getAccountActivitySummary(dateRange)
      ]);

      setTokenUsage(tokenData);
      setTeamMembers(teamData);
      setPlanDist(planData);
      setDailyTrends(trendsData);
      setRoleCosts(roleCostsData);
      setActiveUsers(activeUsersData);
      setTotalUsers(totalUsersData);
      setAccountActivity(accountActivityData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, dateRange]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const planChartData = planDist
    ? [
        { name: 'Free', value: planDist.planCounts.free },
        { name: 'Pro', value: planDist.planCounts.pro },
        { name: 'Teams', value: planDist.planCounts.teams },
        { name: 'Enterprise', value: planDist.planCounts.enterprise },
        { name: 'Trial', value: planDist.trialUsers },
      ].filter(p => p.value > 0)
    : [];


  const accountActivityChartData = accountActivity ? [
    { name: 'Nodes Created', value: accountActivity.nodesCreated },
    { name: 'AI Messages', value: accountActivity.aiMessages },
    { name: 'Child Nodes', value: accountActivity.childNodes },
    { name: 'Expand Actions', value: accountActivity.expandActions },
    { name: 'AI Team Members', value: accountActivity.aiTeamMembersUsed },
  ] : [];

  const topTeamMembersData = teamMembers.slice(0, 10).map(tm => ({
    name: tm.name.length > 20 ? tm.name.substring(0, 20) + '...' : tm.name,
    count: tm.count
  }));

  const topRoleCostsData = roleCosts.slice(0, 10).map(rc => ({
    roleId: rc.roleId.length > 15 ? rc.roleId.substring(0, 15) + '...' : rc.roleId,
    cost: parseFloat(rc.cost.toFixed(4))
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Container>
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Analytics Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Signed in as {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setDateRange(7)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    dateRange === 7
                      ? 'bg-white dark:bg-gray-800 shadow-sm'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setDateRange(30)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    dateRange === 30
                      ? 'bg-white dark:bg-gray-800 shadow-sm'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  30 Days
                </button>
                <button
                  onClick={() => setDateRange(90)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    dateRange === 90
                      ? 'bg-white dark:bg-gray-800 shadow-sm'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  90 Days
                </button>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {analyticsLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div>
              <h2 className="text-xl font-bold mb-4">Key Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Cost"
                  value={`$${tokenUsage?.totalCost.toFixed(2) || '0.00'}`}
                  icon={DollarSign}
                  iconColor="text-green-600"
                  subtitle={`Last ${dateRange} days`}
                />
                <StatCard
                  title="Total Users"
                  value={totalUsers.toLocaleString()}
                  icon={Users}
                  iconColor="text-blue-600"
                  subtitle={`${activeUsers} active in ${dateRange} days`}
                />
                <StatCard
                  title="Total Generations"
                  value={tokenUsage?.totalGenerations.toLocaleString() || '0'}
                  icon={Zap}
                  iconColor="text-purple-600"
                  subtitle={`Avg $${tokenUsage?.avgCostPerGeneration.toFixed(4) || '0.0000'} per gen`}
                />
                <StatCard
                  title="Total Tokens"
                  value={(tokenUsage?.totalTokens || 0).toLocaleString()}
                  icon={Activity}
                  iconColor="text-orange-600"
                  subtitle={`${((tokenUsage?.totalTokens || 0) / 1000000).toFixed(2)}M tokens`}
                />
              </div>
            </div>

            {/* Revenue Metrics */}
            {planDist && (
              <div>
                <h2 className="text-xl font-bold mb-4">Revenue & Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <StatCard
                    title="Estimated MRR"
                    value={`$${planDist.estimatedRevenue.toFixed(2)}`}
                    icon={TrendingUp}
                    iconColor="text-green-600"
                    subtitle="Monthly recurring revenue"
                  />
                  <StatCard
                    title="Paid Users"
                    value={planDist.totalPaidUsers}
                    icon={Users}
                    iconColor="text-accent"
                    subtitle={`${((planDist.totalPaidUsers / planDist.totalUsers) * 100).toFixed(1)}% conversion`}
                  />
                  <StatCard
                    title="Trial Users"
                    value={planDist.trialUsers}
                    icon={Users}
                    iconColor="text-yellow-600"
                    subtitle="On 14-day trial"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard
                    title="Free Users"
                    value={planDist.planCounts.free}
                    icon={Users}
                    iconColor="text-gray-500"
                    subtitle="Free Plan"
                  />
                  <StatCard
                    title="Pro Users"
                    value={planDist.planCounts.pro}
                    icon={Users}
                    iconColor="text-purple-600"
                    subtitle="$29.99/month"
                  />
                  <StatCard
                    title="Teams Users"
                    value={planDist.planCounts.teams}
                    icon={Users}
                    iconColor="text-red-600"
                    subtitle="$30.00/month"
                  />
                  <StatCard
                    title="Enterprise Users"
                    value={planDist.planCounts.enterprise}
                    icon={Users}
                    iconColor="text-yellow-600"
                    subtitle="$199.99/month"
                  />
                </div>
              </div>
            )}

            {/* Account Activity */}
            {accountActivity && (
              <div>
                <h2 className="text-xl font-bold mb-4">Account Activity</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <StatCard
                    title="Nodes Created"
                    value={accountActivity.nodesCreated.toLocaleString()}
                    icon={Zap}
                    iconColor="text-blue-600"
                    subtitle="Lifetime"
                  />
                  <StatCard
                    title="AI Messages"
                    value={accountActivity.aiMessages.toLocaleString()}
                    icon={Zap}
                    iconColor="text-purple-600"
                    subtitle={`Last ${dateRange} days`}
                  />
                  <StatCard
                    title="Child Nodes"
                    value={accountActivity.childNodes.toLocaleString()}
                    icon={Zap}
                    iconColor="text-green-600"
                    subtitle="Lifetime"
                  />
                  <StatCard
                    title="Expand Actions"
                    value={accountActivity.expandActions.toLocaleString()}
                    icon={Zap}
                    iconColor="text-orange-600"
                    subtitle={`Last ${dateRange} days`}
                  />
                  <StatCard
                    title="AI Team Members Used"
                    value={accountActivity.aiTeamMembersUsed.toLocaleString()}
                    icon={Users}
                    iconColor="text-accent"
                    subtitle="Lifetime"
                  />
                </div>
              </div>
            )}

            {/* Daily Trends */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-bold">Daily Trends</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Daily totals for key metrics over the selected period.</p>
              <LineChart
                data={dailyTrends}
                xKey="date"
                lines={[
                  { key: 'activeUsers', color: '#3b82f6', name: 'Active Users' },
                  { key: 'totalCost', color: '#8b5cf6', name: 'Cost ($)' },
                  { key: 'totalGenerations', color: '#10b981', name: 'Generations' },
                  { key: 'newSignups', color: '#f59e0b', name: 'New Signups' }
                ]}
                height={300}
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Plan Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <PieChartIcon className="w-5 h-5 text-accent" />
                  <h2 className="text-xl font-bold">Plan Distribution</h2>
                </div>
                <PieChart
                  data={planChartData}
                  colors={['#f59e0b', '#6b7280', '#3b82f6', '#8b5cf6', '#ef4444', '#f97316']}
                  height={300}
                />
              </div>

              {/* Account Activity Breakdown */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-5 h-5 text-accent" />
                  <h2 className="text-xl font-bold">Account Activity</h2>
                </div>
                <BarChart
                  data={accountActivityChartData}
                  xKey="name"
                  bars={[
                    { key: 'value', color: '#8b5cf6', name: 'Count' }
                  ]}
                  height={300}
                />
              </div>
            </div>

            {/* Top Team Members */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-bold">Most Used Team Members</h2>
              </div>
              <BarChart
                data={topTeamMembersData}
                xKey="name"
                bars={[
                  { key: 'count', color: '#8b5cf6', name: 'Usage Count' }
                ]}
                height={350}
              />
            </div>

            {/* Cost by Team Member */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-bold">Cost by Team Member Role</h2>
              </div>
              <BarChart
                data={topRoleCostsData}
                xKey="roleId"
                bars={[
                  { key: 'cost', color: '#10b981', name: 'Cost ($)' }
                ]}
                height={350}
              />
            </div>

            {/* Team Members Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4">Team Member Details</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold">Role Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Category</th>
                      <th className="text-right py-3 px-4 font-semibold">Usage Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((tm) => (
                      <tr 
                        key={tm.roleId} 
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="py-3 px-4">{tm.name}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded">
                            {tm.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">{tm.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-8 text-center pb-8">
          <a
            href="/"
            className="text-accent hover:text-accent-hover font-medium transition-colors duration-200"
          >
            ← Back to Home
          </a>
        </div>
      </Container>
    </div>
  );
}
