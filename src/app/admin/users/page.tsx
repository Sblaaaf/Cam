'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import pb, { User } from '@/lib/pocketbase';
import { Shield, Edit2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';

export default function AdminUsersPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    role: 'user' as 'admin' | 'moderator' | 'user',
    credits: 0,
  });

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/');
      return;
    }
    loadUsers();
  }, [user, isAdmin]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('users').getList(1, 100, {
        sort: '-created',
      });
      setUsers(records.items as any);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (targetUser: User) => {
    setEditingUser(targetUser);
    setFormData({
      role: targetUser.role,
      credits: targetUser.credits,
    });
  };

  const handleSave = async () => {
    if (!editingUser) return;

    try {
      await pb.collection('users').update(editingUser.id, formData);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await pb.collection('users').delete(id);
      loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-[#ff0066]/20 text-[#ff0066] border-[#ff0066]/50';
      case 'moderator':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Background blur gradients */}
      <div className="fixed top-20 right-20 w-96 h-96 blur-gradient-pink opacity-30 pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-96 h-96 blur-gradient-green opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manage Users</h1>
            <p className="text-gray-400">View and manage user accounts</p>
          </div>
          <Shield className="text-[#ff0066]" size={48} />
        </div>

        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-dark rounded-xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Edit User</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Username</div>
                  <div className="font-medium">{editingUser.username}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Email</div>
                  <div className="font-medium">{editingUser.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-lg glass border border-white/10 focus:border-[#00ff88] focus:outline-none"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Credits</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg glass border border-white/10 focus:border-[#00ff88] focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 py-2 bg-[#00ff88] text-black rounded-lg font-semibold hover:bg-[#00ff88]/90 transition-all"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="flex-1 py-2 glass border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="glass-dark rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Shield size={24} />
            Users List ({users.length})
          </h2>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No users yet</div>
          ) : (
            <div className="space-y-3">
              {users.map((targetUser) => (
                <div
                  key={targetUser.id}
                  className="flex items-center justify-between p-4 rounded-lg glass border border-white/5"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-bold text-lg">{targetUser.username}</div>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getRoleBadgeColor(targetUser.role)}`}>
                        {targetUser.role.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">{targetUser.email}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      Credits: ${targetUser.credits.toFixed(2)} | Joined: {formatDate(targetUser.created)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(targetUser)}
                      className="p-2 glass border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    {targetUser.id !== user?.id && (
                      <button
                        onClick={() => handleDelete(targetUser.id)}
                        className="p-2 glass border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
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
