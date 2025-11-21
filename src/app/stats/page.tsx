'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import pb, { Bet } from '@/lib/pocketbase';
import { TrendingUp, Trophy, Target, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function StatsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const records = await pb.collection('bets').getList(1, 500, {
        filter: `user="${user.id}"`,
        sort: '-created',
      });
      setBets(records.items as any);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats: {
    total: number;
    won: number;
    lost: number;
    pending: number;
    totalWagered: number;
    totalWon: number;
    totalLost: number;
    winRate: string;
    profit: number;
  } = {
    total: bets.length,
    won: bets.filter(b => b.status === 'won').length,
    lost: bets.filter(b => b.status === 'lost').length,
    pending: bets.filter(b => b.status === 'pending').length,
    totalWagered: bets.reduce((sum, b) => sum + b.amount, 0),
    totalWon: bets.filter(b => b.status === 'won').reduce((sum, b) => sum + b.potential_win, 0),
    totalLost: bets.filter(b => b.status === 'lost').reduce((sum, b) => sum + b.amount, 0),
    winRate: '0.0',
    profit: 0,
  };

  stats.winRate = stats.total > 0 ? ((stats.won / (stats.won + stats.lost)) * 100).toFixed(1) : '0.0';
  stats.profit = stats.totalWon - stats.totalLost;

  const statusData = [
    { name: 'Won', value: stats.won, color: '#00ff88' },
    { name: 'Lost', value: stats.lost, color: '#ff0066' },
    { name: 'Pending', value: stats.pending, color: '#eab308' },
  ].filter(d => d.value > 0);

  // Monthly stats
  const monthlyData = bets.reduce((acc: any[], bet) => {
    const month = new Date(bet.created).toLocaleDateString('en-US', { month: 'short' });
    const existing = acc.find(d => d.month === month);
    if (existing) {
      existing.bets += 1;
      if (bet.status === 'won') existing.won += 1;
      if (bet.status === 'lost') existing.lost += 1;
    } else {
      acc.push({
        month,
        bets: 1,
        won: bet.status === 'won' ? 1 : 0,
        lost: bet.status === 'lost' ? 1 : 0,
      });
    }
    return acc;
  }, []).slice(0, 6).reverse();

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Background blur gradients */}
      <div className="fixed top-20 right-20 w-96 h-96 blur-gradient-green opacity-30 pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-96 h-96 blur-gradient-pink opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Statistics</h1>
            <p className="text-gray-400">Track your betting performance</p>
          </div>
          <TrendingUp className="text-[#ff0066]" size={48} />
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading stats...</div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="glass-dark rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="text-[#00ff88]" size={24} />
                  <div className="text-sm text-gray-400">Total Bets</div>
                </div>
                <div className="text-3xl font-bold">{stats.total}</div>
              </div>

              <div className="glass-dark rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="text-[#00ff88]" size={24} />
                  <div className="text-sm text-gray-400">Win Rate</div>
                </div>
                <div className="text-3xl font-bold text-[#00ff88]">{stats.winRate}%</div>
              </div>

              <div className="glass-dark rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className={stats.profit >= 0 ? 'text-[#00ff88]' : 'text-[#ff0066]'} size={24} />
                  <div className="text-sm text-gray-400">Profit/Loss</div>
                </div>
                <div className={`text-3xl font-bold ${stats.profit >= 0 ? 'text-[#00ff88]' : 'text-[#ff0066]'}`}>
                  {stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}
                </div>
              </div>

              <div className="glass-dark rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="text-white" size={24} />
                  <div className="text-sm text-gray-400">Total Wagered</div>
                </div>
                <div className="text-3xl font-bold">${stats.totalWagered.toFixed(2)}</div>
              </div>
            </div>

            {/* Charts */}
            {bets.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bet Status Distribution */}
                <div className="glass-dark rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Bet Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Monthly Performance */}
                <div className="glass-dark rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Monthly Performance</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="month" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                        />
                        <Bar dataKey="won" fill="#00ff88" name="Won" />
                        <Bar dataKey="lost" fill="#ff0066" name="Lost" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
