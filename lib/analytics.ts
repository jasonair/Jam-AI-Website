import { 
  collection, 
  query, 
  where, 
  getDocs, 
  Timestamp,
  orderBy,
  limit as firestoreLimit
} from 'firebase/firestore';
import { db } from './firebase';

export interface TokenUsageSummary {
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
  totalCost: number;
  totalGenerations: number;
  avgCostPerGeneration: number;
}

export interface TeamMemberUsage {
  roleId: string;
  name: string;
  category: string;
  count: number;
}

export interface PlanDistribution {
  planCounts: {
    trial: number;
    free: number;
    pro: number;
    teams: number;
    enterprise: number;
  };
  trialUsers: number;
  totalUsers: number;
  totalPaidUsers: number;
  totalCreditsUsed: number;
  estimatedRevenue: number;
}

export interface UserActivityMetrics {
  totalTokens: number;
  totalCost: number;
  totalGenerations: number;
  totalNodes: number;
  uniqueTeamMembersCount: number;
  avgCostPerDay: number;
  avgGenerationsPerDay: number;
}

export interface RoleCost {
  roleId: string;
  cost: number;
  generations: number;
  tokens: number;
}

export interface DailyTrend {
  date: string;
  totalTokens: number;
  totalCost: number;
  totalGenerations: number;
  activeUsers: number;
  newSignups: number;
}


export interface AccountActivitySummary {
  nodesCreated: number;
  aiMessages: number;
  childNodes: number;
  expandActions: number;
  aiTeamMembersUsed: number;
}

export async function getTokenUsageSummary(days: number = 30): Promise<TokenUsageSummary> {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  const q = query(
    collection(db, 'analytics_token_usage'),
    where('timestamp', '>=', Timestamp.fromDate(startDate))
  );
  
  const snapshot = await getDocs(q);
  
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalCost = 0;
  let totalGenerations = 0;
  
  snapshot.forEach(doc => {
    const data = doc.data();
    totalInputTokens += data.inputTokens || 0;
    totalOutputTokens += data.outputTokens || 0;
    totalCost += data.estimatedCostUSD || 0;
    totalGenerations++;
  });
  
  return {
    totalInputTokens,
    totalOutputTokens,
    totalTokens: totalInputTokens + totalOutputTokens,
    totalCost,
    totalGenerations,
    avgCostPerGeneration: totalGenerations > 0 ? totalCost / totalGenerations : 0
  };
}

export async function getMostUsedTeamMembers(limit: number = 10): Promise<TeamMemberUsage[]> {
  const q = query(
    collection(db, 'analytics_team_member_usage'),
    where('actionType', '==', 'used')
  );
  
  const snapshot = await getDocs(q);
  
  const roleCounts = new Map<string, TeamMemberUsage>();
  
  snapshot.forEach(doc => {
    const data = doc.data();
    const roleId = data.roleId;
    const current = roleCounts.get(roleId) || { 
      roleId,
      name: data.roleName, 
      category: data.roleCategory,
      count: 0 
    };
    current.count++;
    roleCounts.set(roleId, current);
  });
  
  return Array.from(roleCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function getPlanDistribution(): Promise<PlanDistribution> {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  
  const planCounts = {
    trial: 0,
    free: 0,
    pro: 0,
    teams: 0,
    enterprise: 0
  };
  let trialUsers = 0;
  
  let totalCreditsUsed = 0;
  
  snapshot.forEach(doc => {
    const data = doc.data();
    const plan = (data.plan || 'free').toLowerCase();
    if (data.trialEndDate && new Date(data.trialEndDate) > new Date()) {
      trialUsers++;
    } else {
      if (plan in planCounts) {
        planCounts[plan as keyof typeof planCounts]++;
      }
    }
    totalCreditsUsed += data.creditsUsedThisMonth || 0;
  });
  
  planCounts.trial = trialUsers;
  return {
    planCounts,
    totalUsers: snapshot.size,
    trialUsers,
    totalPaidUsers: planCounts.pro + planCounts.teams + planCounts.enterprise,
    totalCreditsUsed,
    estimatedRevenue: (planCounts.pro * 29.99) + (planCounts.teams * 30.00) + (planCounts.enterprise * 199.99) // Assuming enterprise price
  };
}

export async function getUserActivityMetrics(
  userId: string, 
  days: number = 30
): Promise<UserActivityMetrics> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const dateString = startDate.toISOString().split('T')[0];
  
  const q = query(
    collection(db, 'analytics_daily'),
    where('userId', '==', userId),
    where('date', '>=', dateString)
  );
  
  const snapshot = await getDocs(q);
  
  let totalTokens = 0;
  let totalCost = 0;
  let totalGenerations = 0;
  let totalNodes = 0;
  const uniqueTeamMembers = new Set<string>();
  
  snapshot.forEach(doc => {
    const data = doc.data();
    totalTokens += data.totalTokens || 0;
    totalCost += data.totalCostUSD || 0;
    totalGenerations += data.totalGenerations || 0;
    totalNodes += data.totalNodesCreated || 0;
    (data.uniqueTeamMembersUsed || []).forEach((role: string) => uniqueTeamMembers.add(role));
  });
  
  return {
    totalTokens,
    totalCost,
    totalGenerations,
    totalNodes,
    uniqueTeamMembersCount: uniqueTeamMembers.size,
    avgCostPerDay: days > 0 ? totalCost / days : 0,
    avgGenerationsPerDay: days > 0 ? totalGenerations / days : 0
  };
}

export async function getCostByTeamMember(days: number = 30): Promise<RoleCost[]> {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  const q = query(
    collection(db, 'analytics_token_usage'),
    where('timestamp', '>=', Timestamp.fromDate(startDate))
  );
  
  const snapshot = await getDocs(q);
  
  const roleCosts = new Map<string, RoleCost>();
  
  snapshot.forEach(doc => {
    const data = doc.data();
    const roleId = data.teamMemberRoleId;
    
    if (!roleId) return;
    
    const current = roleCosts.get(roleId) || {
      roleId,
      cost: 0,
      generations: 0,
      tokens: 0
    };
    
    current.cost += data.estimatedCostUSD || 0;
    current.generations++;
    current.tokens += (data.inputTokens || 0) + (data.outputTokens || 0);
    
    roleCosts.set(roleId, current);
  });
  
  return Array.from(roleCosts.values())
    .sort((a, b) => b.cost - a.cost);
}

export async function getDailyTrends(days: number = 30): Promise<DailyTrend[]> {
  const dailyData: DailyTrend[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const q = query(
      collection(db, 'analytics_daily'),
      where('date', '==', dateString)
    );
    
    const snapshot = await getDocs(q);
    
    const dayTotal: DailyTrend = {
      date: dateString,
      totalTokens: 0,
      totalCost: 0,
      totalGenerations: 0,
      activeUsers: snapshot.size,
      newSignups: 0
    };
    
    snapshot.forEach(doc => {
      const data = doc.data();
      dayTotal.totalTokens += data.totalTokens || 0;
      dayTotal.totalCost += data.totalCostUSD || 0;
      dayTotal.totalGenerations += data.totalGenerations || 0;
    });
    
    dailyData.push(dayTotal);
  }

  // Get new signups
  const usersRef = collection(db, 'users');
  const usersSnapshot = await getDocs(usersRef);
  usersSnapshot.forEach(doc => {
    const data = doc.data();
    if (!data.createdAt) return;

    let createdAtDate: Date;

    if (typeof data.createdAt === 'string') {
      createdAtDate = new Date(data.createdAt);
    } else if (data.createdAt && typeof data.createdAt.toDate === 'function') {
      // Firestore Timestamp object
      createdAtDate = data.createdAt.toDate();
    } else if (data.createdAt && typeof data.createdAt._seconds === 'number') {
      // Plain object with _seconds and _nanoseconds
      createdAtDate = new Date(data.createdAt._seconds * 1000);
    } else {
      // Skip if the format is not recognized
      return;
    }

    // Check for invalid date
    if (isNaN(createdAtDate.getTime())) {
      return;
    }

    const createdAt = createdAtDate.toISOString().split('T')[0];
    const trend = dailyData.find(d => d.date === createdAt);
    if (trend) {
      trend.newSignups++;
    }
  });
  
  return dailyData;
}


export async function getRecentProjectActivity(limit: number = 20) {
  const q = query(
    collection(db, 'analytics_project_activity'),
    orderBy('timestamp', 'desc'),
    firestoreLimit(limit)
  );
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate()
  }));
}

export async function getTotalUsersCount(): Promise<number> {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  return snapshot.size;
}

export async function getActiveUsersCount(days: number = 30): Promise<number> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const dateString = startDate.toISOString().split('T')[0];
  
  const q = query(
    collection(db, 'analytics_daily'),
    where('date', '>=', dateString)
  );
  
  const snapshot = await getDocs(q);
  const uniqueUsers = new Set<string>();
  
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.userId) {
      uniqueUsers.add(data.userId);
    }
  });
  
  return uniqueUsers.size;
}

export async function getAccountActivitySummary(days: number = 30): Promise<AccountActivitySummary> {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // 1. Get AI Messages and Expand Actions from token usage
  const tokenUsageQuery = query(
    collection(db, 'analytics_token_usage'),
    where('timestamp', '>=', Timestamp.fromDate(startDate))
  );
  const tokenUsageSnapshot = await getDocs(tokenUsageQuery);
  let aiMessages = 0;
  let expandActions = 0;
  tokenUsageSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.generationType === 'chat') {
      aiMessages++;
    }
    if (data.generationType === 'expand') {
      expandActions++;
    }
  });

  // 2. Get AI Team Members Used
  const teamMemberQuery = query(
    collection(db, 'analytics_team_member_usage')
  );
  const teamMemberSnapshot = await getDocs(teamMemberQuery);
  const uniqueTeamMembers = new Set<string>();
  teamMemberSnapshot.forEach(doc => {
    uniqueTeamMembers.add(doc.data().roleId);
  });

  // 3. Get Nodes Created and Child Nodes (lifetime stats)
  const usersRef = collection(db, 'users');
  const usersSnapshot = await getDocs(usersRef);
  let nodesCreated = 0;
  let childNodes = 0;
  usersSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.metadata) {
      nodesCreated += data.metadata.totalNodesCreated || 0;
      childNodes += data.metadata.totalChildNodesCreated || 0;
    }
  });

  return {
    aiMessages,
    expandActions,
    nodesCreated,
    childNodes,
    aiTeamMembersUsed: uniqueTeamMembers.size,
  };
}
