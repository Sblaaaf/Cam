'use client';

import { useEffect, useState } from 'react';
import pb, { Team } from '@/lib/pocketbase';
import { TrendingUp, Trophy, Medal } from 'lucide-react';

export default function RankingsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('teams').getList(1, 50, {
        sort: '-wins',
      });
      setTeams(records.items as any);
    } catch (error) {
      console.error('Failed to load teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWinRate = (wins: number, losses: number) => {
    const total = wins + losses;
    return total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="text-yellow-500" size={24} />;
    if (index === 1) return <Medal className="text-gray-400" size={24} />;
    if (index === 2) return <Medal className="text-orange-600" size={24} />;
    return null;
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Background blur gradients */}
      <div className="fixed top-20 right-20 w-96 h-96 blur-gradient-pink opacity-30 pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-96 h-96 blur-gradient-green opacity-30 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Team Rankings</h1>
            <p className="text-gray-400">Top performing esport teams</p>
          </div>
          <TrendingUp className="text-[#ff0066]" size={48} />
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading rankings...</div>
        ) : teams.length === 0 ? (
          <div className="glass-dark rounded-xl p-12 text-center">
            <p className="text-gray-400">No teams found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {teams.map((team, index) => (
              <div
                key={team.id}
                className="glass-dark rounded-xl p-6 hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-white/5">
                    {getRankIcon(index) || (
                      <span className="text-2xl font-bold text-gray-400">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Team Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{team.name}</h3>
                    {team.description && (
                      <p className="text-sm text-gray-400">{team.description}</p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-[#00ff88]">
                        {team.wins}
                      </div>
                      <div className="text-xs text-gray-400">Wins</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#ff0066]">
                        {team.losses}
                      </div>
                      <div className="text-xs text-gray-400">Losses</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {getWinRate(team.wins, team.losses)}%
                      </div>
                      <div className="text-xs text-gray-400">Win Rate</div>
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
