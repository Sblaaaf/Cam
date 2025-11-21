'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import pb, { Match, Team } from '@/lib/pocketbase';
import { Trophy, Plus, Edit2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';

export default function AdminMatchesPage() {
  const { user, isModerator } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<(Match & { expand?: { team1: Team; team2: Team } })[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    team1_odds: 1.5,
    team2_odds: 2.5,
    status: 'upcoming' as 'upcoming' | 'live' | 'finished',
    winner: '',
    scheduled_at: '',
    game_title: '',
  });

  useEffect(() => {
    if (!user || !isModerator) {
      router.push('/');
      return;
    }
    loadData();
  }, [user, isModerator]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [matchesData, teamsData] = await Promise.all([
        pb.collection('matches').getList(1, 100, {
          sort: '-scheduled_at',
          expand: 'team1,team2',
        }),
        pb.collection('teams').getList(1, 100, { sort: 'name' }),
      ]);
      setMatches(matchesData.items as any);
      setTeams(teamsData.items as any);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.team1 === formData.team2) {
      alert('Please select different teams');
      return;
    }

    try {
      const data = {
        ...formData,
        winner: formData.status === 'finished' ? formData.winner : null,
        finished_at: formData.status === 'finished' ? new Date().toISOString() : null,
      };

      if (editingMatch) {
        await pb.collection('matches').update(editingMatch.id, data);
      } else {
        await pb.collection('matches').create(data);
      }
      
      resetForm();
      loadData();
    } catch (error) {
      console.error('Failed to save match:', error);
      alert('Failed to save match');
    }
  };

  const handleEdit = (match: Match) => {
    setEditingMatch(match);
    setFormData({
      team1: match.team1,
      team2: match.team2,
      team1_odds: match.team1_odds,
      team2_odds: match.team2_odds,
      status: match.status,
      winner: match.winner || '',
      scheduled_at: match.scheduled_at,
      game_title: match.game_title,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this match?')) return;
    
    try {
      await pb.collection('matches').delete(id);
      loadData();
    } catch (error) {
      console.error('Failed to delete match:', error);
      alert('Failed to delete match');
    }
  };

  const resetForm = () => {
    setFormData({
      team1: '',
      team2: '',
      team1_odds: 1.5,
      team2_odds: 2.5,
      status: 'upcoming',
      winner: '',
      scheduled_at: '',
      game_title: '',
    });
    setEditingMatch(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Background blur gradients */}
      <div className="fixed top-20 right-20 w-96 h-96 blur-gradient-green opacity-30 pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-96 h-96 blur-gradient-pink opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manage Matches</h1>
            <p className="text-gray-400">Create and manage esport matches</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-[#00ff88] text-black rounded-lg font-semibold hover:bg-[#00ff88]/90 transition-all"
          >
            <Plus size={20} />
            Add Match
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="glass-dark rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingMatch ? 'Edit Match' : 'Create New Match'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Team 1 *</label>
                  <select
                    value={formData.team1}
                    onChange={(e) => setFormData({ ...formData, team1: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg glass border border-white/10 focus:border-[#00ff88] focus:outline-none"
                  >
                    <option value="">Select Team 1</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Team 2 *</label>
                  <select
                    value={formData.team2}
                    onChange={(e) => setFormData({ ...formData, team2: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg glass border border-white/10 focus:border-[#00ff88] focus:outline-none"
                  >
                    <option value="">Select Team 2</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Team 1 Odds *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={formData.team1_odds}
                    onChange={(e) => setFormData({ ...formData, team1_odds: parseFloat(e.target.value) })}
                    required
                    className="w-full px-4 py-2 rounded-lg glass border border-white/10 focus:border-[#00ff88] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Team 2 Odds *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={formData.team2_odds}
                    onChange={(e) => setFormData({ ...formData, team2_odds: parseFloat(e.target.value) })}
                    required
                    className="w-full px-4 py-2 rounded-lg glass border border-white/10 focus:border-[#00ff88] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Game Title *</label>
                  <input
                    type="text"
                    value={formData.game_title}
                    onChange={(e) => setFormData({ ...formData, game_title: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg glass border border-white/10 focus:border-[#00ff88] focus:outline-none"
                    placeholder="League of Legends"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Scheduled At *</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg glass border border-white/10 focus:border-[#00ff88] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    required
                    className="w-full px-4 py-2 rounded-lg glass border border-white/10 focus:border-[#00ff88] focus:outline-none"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="finished">Finished</option>
                  </select>
                </div>
                {formData.status === 'finished' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Winner *</label>
                    <select
                      value={formData.winner}
                      onChange={(e) => setFormData({ ...formData, winner: e.target.value })}
                      required
                      className="w-full px-4 py-2 rounded-lg glass border border-white/10 focus:border-[#00ff88] focus:outline-none"
                    >
                      <option value="">Select Winner</option>
                      <option value={formData.team1}>Team 1</option>
                      <option value={formData.team2}>Team 2</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#00ff88] text-black rounded-lg font-semibold hover:bg-[#00ff88]/90 transition-all"
                >
                  {editingMatch ? 'Update Match' : 'Create Match'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 glass border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Matches List */}
        <div className="glass-dark rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Trophy size={24} />
            Matches List
          </h2>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading matches...</div>
          ) : matches.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No matches yet</div>
          ) : (
            <div className="space-y-3">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-4 rounded-lg glass border border-white/5"
                >
                  <div className="flex-1">
                    <div className="font-bold text-lg">
                      {match.expand?.team1?.name} vs {match.expand?.team2?.name}
                    </div>
                    <div className="text-sm text-gray-400">{match.game_title}</div>
                    <div className="text-sm text-gray-400">
                      {formatDate(match.scheduled_at)} | Status: {match.status}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(match)}
                      className="p-2 glass border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(match.id)}
                      className="p-2 glass border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
