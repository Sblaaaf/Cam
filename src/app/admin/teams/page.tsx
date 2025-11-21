'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import pb, { Team } from '@/lib/pocketbase';
import { Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminTeamsPage() {
  const { user, isModerator } = useAuth();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    wins: 0,
    losses: 0,
  });

  useEffect(() => {
    if (!user || !isModerator) {
      router.push('/');
      return;
    }
    loadTeams();
  }, [user, isModerator]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('teams').getList(1, 100, {
        sort: 'name',
      });
      setTeams(records.items as any);
    } catch (error) {
      console.error('Failed to load teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTeam) {
        await pb.collection('teams').update(editingTeam.id, formData);
      } else {
        await pb.collection('teams').create(formData);
      }
      
      resetForm();
      loadTeams();
    } catch (error) {
      console.error('Failed to save team:', error);
      alert('Failed to save team');
    }
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      description: team.description || '',
      wins: team.wins,
      losses: team.losses,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team?')) return;
    
    try {
      await pb.collection('teams').delete(id);
      loadTeams();
    } catch (error) {
      console.error('Failed to delete team:', error);
      alert('Failed to delete team');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', wins: 0, losses: 0 });
    setEditingTeam(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Background blur gradients */}
      <div className="fixed top-20 right-20 w-96 h-96 blur-gradient-pink opacity-30 pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-96 h-96 blur-gradient-green opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manage Teams</h1>
            <p className="text-gray-400">Add, edit, or remove teams</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-[#00ff88] text-black rounded-lg font-semibold hover:bg-[#00ff88]/90 transition-all"
          >
            <Plus size={20} />
            Add Team
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="glass-dark rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingTeam ? 'Edit Team' : 'Create New Team'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Team Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg glass border border-white/10 focus:border-[#00ff88] focus:outline-none"
                    placeholder="Team Liquid"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg glass border border-white/10 focus:border-[#00ff88] focus:outline-none"
                    placeholder="Professional esports team"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Wins</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.wins}
                    onChange={(e) => setFormData({ ...formData, wins: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg glass border border-white/10 focus:border-[#00ff88] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Losses</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.losses}
                    onChange={(e) => setFormData({ ...formData, losses: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg glass border border-white/10 focus:border-[#00ff88] focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#00ff88] text-black rounded-lg font-semibold hover:bg-[#00ff88]/90 transition-all"
                >
                  {editingTeam ? 'Update Team' : 'Create Team'}
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

        {/* Teams List */}
        <div className="glass-dark rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users size={24} />
            Teams List
          </h2>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading teams...</div>
          ) : teams.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No teams yet</div>
          ) : (
            <div className="space-y-3">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between p-4 rounded-lg glass border border-white/5"
                >
                  <div className="flex-1">
                    <div className="font-bold text-lg">{team.name}</div>
                    {team.description && (
                      <div className="text-sm text-gray-400">{team.description}</div>
                    )}
                    <div className="text-sm text-gray-400 mt-1">
                      Wins: {team.wins} | Losses: {team.losses}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(team)}
                      className="p-2 glass border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(team.id)}
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
