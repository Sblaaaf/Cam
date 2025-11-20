'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  Home, 
  Trophy, 
  TrendingUp, 
  ShoppingBag, 
  Wallet, 
  Users, 
  Shield,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Sidebar() {
  const { user, logout, isAdmin, isModerator } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/', icon: Home, public: true },
    { name: 'Matches', href: '/matches', icon: Trophy, public: true },
    { name: 'Rankings', href: '/rankings', icon: TrendingUp, public: true },
  ];

  const userNavItems = [
    { name: 'My Bets', href: '/my-bets', icon: Trophy },
    { name: 'Stats', href: '/stats', icon: TrendingUp },
    { name: 'Goodies', href: '/goodies', icon: ShoppingBag },
    { name: 'Wallet', href: '/wallet', icon: Wallet },
  ];

  const adminNavItems = [
    { name: 'Manage Teams', href: '/admin/teams', icon: Users },
    { name: 'Manage Matches', href: '/admin/matches', icon: Trophy },
    { name: 'Manage Users', href: '/admin/users', icon: Shield },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 glass rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 glass-dark border-r border-white/10 p-6 flex flex-col transition-transform duration-300 z-40",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#ff0066] flex items-center justify-center">
            <Trophy className="text-black" size={24} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-[#00ff88] to-[#ff0066] text-transparent bg-clip-text">
            ESportBet
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto hide-scrollbar">
          {/* Public Links */}
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                  pathname === item.href
                    ? "bg-[#00ff88]/20 text-[#00ff88]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User Links */}
          {user && (
            <>
              <div className="my-4 border-t border-white/10" />
              <div className="space-y-1">
                {userNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                      pathname === item.href
                        ? "bg-[#00ff88]/20 text-[#00ff88]"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Admin/Moderator Links */}
          {isModerator && (
            <>
              <div className="my-4 border-t border-white/10" />
              <div className="text-xs text-gray-500 px-3 mb-2">MANAGEMENT</div>
              <div className="space-y-1">
                {adminNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                      pathname === item.href
                        ? "bg-[#ff0066]/20 text-[#ff0066]"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </nav>

        {/* User info / Auth */}
        <div className="mt-auto pt-4 border-t border-white/10">
          {user ? (
            <div className="space-y-3">
              <div className="px-3">
                <div className="text-sm font-medium">{user.username}</div>
                <div className="text-xs text-gray-400">{user.email}</div>
                <div className="text-sm font-bold text-[#00ff88] mt-1">
                  ${user.credits?.toFixed(2) || '0.00'}
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all w-full"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center px-4 py-2 rounded-lg bg-[#00ff88] text-black font-medium hover:bg-[#00ff88]/90 transition-all"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="block text-center px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
}
