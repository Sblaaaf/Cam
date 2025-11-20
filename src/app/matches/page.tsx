'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import pb, { Match, Team } from '@/lib/pocketbase';
import { Trophy, Clock, Flame } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function MatchesPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<(Match & { expand?: { team1: Team; team2: Team } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'finished'>('all');
  const [betAmount, setBetAmount] = useState<{ [key: string]: number }>({});
  const [selectedTeam, setSelectedTeam] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadMatches();
  }, [filter]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      let filterQuery = '';
      if (filter !== 'all') {
        filterQuery = `status="${filter}"`;
      }
      
      const records = await pb.collection('matches').getList(1, 50, {
        filter: filterQuery,
        sort: '-scheduled_at',
        expand: 'team1,team2',
      });
      
      setMatches(records.items as any);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const placeBet = async (matchId: string) => {
    if (!user) {
      alert('Please login to place bets');
      return;
    }

    const amount = betAmount[matchId];
    const team = selectedTeam[matchId];

    if (!amount || !team || amount <= 0) {
      alert('Please select a team and enter a valid amount');
      return;
    }

    if (amount > user.credits) {
      alert('Insufficient credits');
      return;
    }

    try {
      const match = matches.find(m => m.id === matchId);
      const odds = team === match?.team1 ? match?.team1_odds : match?.team2_odds;
      const potentialWin = amount * (odds || 1);

      await pb.collection('bets').create({
        user: user.id,
        match: matchId,
        team,
        amount,
        potential_win: potentialWin,
        status: 'pending',
      });

      // Update user credits
      await pb.collection('users').update(user.id, {
        credits: user.credits - amount,
      });

      alert('Bet placed successfully!');
      setBetAmount({ ...betAmount, [matchId]: 0 });
      setSelectedTeam({ ...selectedTeam, [matchId]: '' });
      window.location.reload();
    } catch (error) {
      console.error('Failed to place bet:', error);
      alert('Failed to place bet');
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
            <h1 className="text-4xl font-bold mb-2">Matches</h1>
            <p className="text-gray-400">Browse and bet on esport matches</p>
          </div>
          <Trophy className="text-[#00ff88]" size={48} />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
          {(['all', 'upcoming', 'live', 'finished'] as const).map((f) => (
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
          <div className="text-center py-12 text-gray-400">Loading matches...</div>
        ) : matches.length === 0 ? (
          <div className="glass-dark rounded-xl p-12 text-center">
            <p className="text-gray-400">No matches found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="glass-dark rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {match.status === 'live' && (
                      <span className="flex items-center gap-1 text-[#ff0066] text-sm font-medium">
                        <Flame size={16} />
                        LIVE
                      </span>
                    )}
                    <span className="text-gray-400 text-sm">{match.game_title}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <Clock size={16} />
                    {formatDate(match.scheduled_at)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Team 1 */}
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">
                      {match.expand?.team1?.name || 'Team 1'}
                    </div>
                    <div className="text-[#00ff88] text-xl font-semibold">
                      {match.team1_odds}x
                    </div>
                  </div>

                  {/* VS */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-400">VS</div>
                    {match.status === 'finished' && match.winner && (
                      <div className="mt-2 text-sm text-[#00ff88]">
                        Winner: {match.expand?.[match.winner === match.team1 ? 'team1' : 'team2']?.name}
                      </div>
                    )}
                  </div>

                  {/* Team 2 */}
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">
                      {match.expand?.team2?.name || 'Team 2'}
                    </div>
                    <div className="text-[#00ff88] text-xl font-semibold">
                      {match.team2_odds}x
                    </div>
                  </div>
                </div>

                {/* Betting Section - Only for logged in users and non-finished matches */}
                {user && match.status !== 'finished' && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Select Team</label>
                        <select
                          value={selectedTeam[match.id] || ''}
                          onChange={(e) => setSelectedTeam({ ...selectedTeam, [match.id]: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg glass border border-white/10 focus:border-[#00ff88] focus:outline-none"
                        >
                          <option value="">Choose...</option>
                          <option value={match.team1}>{match.expand?.team1?.name || 'Team 1'}</option>
                          <option value={match.team2}>{match.expand?.team2?.name || 'Team 2'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Bet Amount</label>
                        <input
                          type="number"
                          min="1"
                          max={user.credits}
                          value={betAmount[match.id] || ''}
                          onChange={(e) => setBetAmount({ ...betAmount, [match.id]: Number(e.target.value) })}
                          className="w-full px-4 py-2 rounded-lg glass border border-white/10 focus:border-[#00ff88] focus:outline-none"
                          placeholder="Amount"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => placeBet(match.id)}
                          className="w-full py-2 rounded-lg bg-[#00ff88] text-black font-semibold hover:bg-[#00ff88]/90 transition-all"
                        >
                          Place Bet
                        </button>
                      </div>
                    </div>
                    {betAmount[match.id] > 0 && selectedTeam[match.id] && (
                      <div className="mt-2 text-sm text-gray-400">
                        Potential win: ${(betAmount[match.id] * (selectedTeam[match.id] === match.team1 ? match.team1_odds : match.team2_odds)).toFixed(2)}
                      </div>
                    )}
                  </div>
                )}

                {!user && match.status !== 'finished' && (
                  <div className="mt-6 pt-6 border-t border-white/10 text-center">
                    <Link
                      href="/login"
                      className="inline-block px-6 py-2 rounded-lg bg-[#00ff88] text-black font-semibold hover:bg-[#00ff88]/90 transition-all"
                    >
                      Login to Bet
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
