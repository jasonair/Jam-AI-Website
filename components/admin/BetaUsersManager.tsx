'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import { getBetaSignups, updateBetaSignupStatus } from '@/lib/analytics';

// Define the structure of a beta signup
export interface BetaSignup {
  id: string;
  email: string;
  status: 'pending' | 'approved';
  createdAt: any; // Firestore timestamp
}

export default function BetaUsersManager() {
  const [signups, setSignups] = useState<BetaSignup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSignups = async () => {
    setLoading(true);
    try {
      const fetchedSignups = await getBetaSignups();
      setSignups(fetchedSignups);
    } catch (error) {
      console.error('Failed to fetch beta signups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignups();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await updateBetaSignupStatus(id, 'approved');
      // Refresh the list
      fetchSignups();
    } catch (error) {
      console.error('Failed to approve user:', error);
    }
  };

  if (loading) {
    return <div>Loading beta signups...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-5 h-5 text-accent" />
        <h2 className="text-xl font-bold">Beta Signup Requests</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-semibold">Email</th>
              <th className="text-left py-3 px-4 font-semibold">Signup Date</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-right py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {signups.length > 0 ? (
              signups.map((signup) => (
                <tr key={signup.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4">{signup.email}</td>
                  <td className="py-3 px-4">{new Date(signup.createdAt?.toDate()).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${signup.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                      {signup.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {signup.status === 'pending' && (
                      <Button size="sm" onClick={() => handleApprove(signup.id)}>Approve</Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No beta signups yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
