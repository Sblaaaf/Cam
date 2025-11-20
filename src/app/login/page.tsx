'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background blur gradients */}
      <div className="fixed top-20 left-20 w-96 h-96 blur-gradient-green opacity-50 pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-96 h-96 blur-gradient-pink opacity-50 pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="glass-dark rounded-2xl p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#ff0066] flex items-center justify-center">
              <LogIn className="text-black" size={32} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-center mb-8">Login to continue betting</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-[#00ff88] focus:outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-[#00ff88] focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#00ff88] text-black font-semibold hover:bg-[#00ff88]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#00ff88] hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
