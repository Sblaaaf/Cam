'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import pb, { Bet, Match, Team } from '@/lib/pocketbase';
import { Trophy, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function MyBetsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bets, setBets] = useState<(Bet & { expand?: { match: Match & { expand?: { team1: Team; team2: Team } }; team: Team } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'won' | 'lost'>('all');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadBets();
  }, [user, filter]);

  const loadBets = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      let filterQuery = `user="${user.id}"`;
      if (filter !== 'all') {
        filterQuery += ` && status="${filter}"`;
      }
      
      const records = await pb.collection('bets').getList(1, 50, {
        filter: filterQuery,
        sort: '-created',
        expand: 'match,match.team1,match.team2,team',
      });
      
      setBets(records.items as any);
    } catch (error) {
      console.error('Failed to load bets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won':
        return <CheckCircle className="text-[#00ff88]" size={20} />;
      case 'lost':
        return <XCircle className="text-[#ff0066]" size={20} />;
      default:
        return <Loader className="text-yellow-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'text-[#00ff88]';
      case 'lost':
        return 'text-[#ff0066]';
      default:
        return 'text-yellow-500';
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Background blur gradients */}
      <div className="fixed top-20 right-20 w-96 h-96 blur-gradient-green opacity-30 pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-96 h-96 blur-gradient-pink opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Bets</h1>
            <p className="text-gray-400">Track your betting history</p>
          </div>
          <Trophy className="text-[#00ff88]" size={48} />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
          {(['all', 'pending', 'won', 'lost'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-[#00ff88] text-black'
                  : 'glass border border-white/10 hover:bg-white/5'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading bets...</div>
        ) : bets.length === 0 ? (
          <div className="glass-dark rounded-xl p-12 text-center">
            <p className="text-gray-400 mb-4">No bets found</p>
            <a
              href="/matches"
              className="inline-block px-6 py-2 rounded-lg bg-[#00ff88] text-black font-semibold hover:bg-[#00ff88]/90 transition-all"
            >
              Browse Matches
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {bets.map((bet) => (
              <div key={bet.id} className="glass-dark rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(bet.status)}
                    <span className={`font-semibold ${getStatusColor(bet.status)}`}>
                      {bet.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <Clock size={16} />
                    {formatDate(bet.created)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Match</div>
                    <div className="font-medium">
                      {bet.expand?.match?.expand?.team1?.name || 'Team 1'} vs{' '}
                      {bet.expand?.match?.expand?.team2?.name || 'Team 2'}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {bet.expand?.match?.game_title}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Your Bet</div>
                    <div className="font-medium">{bet.expand?.team?.name}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Amount</div>
                    <div className="text-xl font-bold text-white">
                      ${bet.amount.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Potential Win</div>
                    <div className="text-xl font-bold text-[#00ff88]">
                      ${bet.potential_win.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Result</div>
                    <div className={`text-xl font-bold ${getStatusColor(bet.status)}`}>
                      {bet.status === 'won'
                        ? `+$${bet.potential_win.toFixed(2)}`
                        : bet.status === 'lost'
                        ? `-$${bet.amount.toFixed(2)}`
                        : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
