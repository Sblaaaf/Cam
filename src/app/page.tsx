'use client';

import { Trophy, TrendingUp, Zap, Star } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Background blur gradients */}
      <div className="fixed top-20 left-20 w-96 h-96 blur-gradient-green opacity-50 pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-96 h-96 blur-gradient-pink opacity-50 pointer-events-none" />

      {/* Hero Section */}
      <div className="relative mb-8">
        <div className="glass-dark rounded-2xl p-8 lg:p-12 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-[#00ff88] to-[#ff0066] text-transparent bg-clip-text">
            Welcome to ESportBet
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Bet on your favorite esport teams, track your stats, and win amazing prizes
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/matches"
              className="px-8 py-3 bg-[#00ff88] text-black rounded-lg font-semibold hover:bg-[#00ff88]/90 transition-all"
            >
              View Matches
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 glass border border-white/20 rounded-lg font-semibold hover:bg-white/10 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Feature Card 1 - Span 2 columns */}
        <Link
          href="/matches"
          className="md:col-span-2 glass-dark rounded-2xl p-6 lg:p-8 hover:bg-white/5 transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#00ff88]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="text-[#00ff88]" size={24} />
            </div>
            <span className="text-[#00ff88] text-sm font-medium">LIVE NOW</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Live Matches</h3>
          <p className="text-gray-400">
            Watch and bet on live esport matches happening right now
          </p>
        </Link>

        {/* Feature Card 2 */}
        <Link
          href="/rankings"
          className="glass-dark rounded-2xl p-6 hover:bg-white/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#ff0066]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <TrendingUp className="text-[#ff0066]" size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Rankings</h3>
          <p className="text-gray-400 text-sm">
            Check out the top teams and players
          </p>
        </Link>

        {/* Feature Card 3 */}
        <div className="glass-dark rounded-2xl p-6 group">
          <div className="w-12 h-12 rounded-xl bg-[#00ff88]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Zap className="text-[#00ff88]" size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Fast Bets</h3>
          <p className="text-gray-400 text-sm">
            Quick and easy betting system
          </p>
        </div>

        {/* Stats Card */}
        <div className="glass-dark rounded-2xl p-6">
          <div className="text-4xl font-bold text-[#00ff88] mb-2">1000+</div>
          <p className="text-gray-400">Active Matches</p>
        </div>

        {/* Feature Card 4 - Span 2 columns */}
        <Link
          href="/goodies"
          className="md:col-span-2 glass-dark rounded-2xl p-6 lg:p-8 hover:bg-white/5 transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#ff0066]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star className="text-[#ff0066]" size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">Exclusive Goodies</h3>
          <p className="text-gray-400">
            Spend your winnings on amazing merchandise and prizes
          </p>
        </Link>

        {/* Stats Card 2 */}
        <div className="glass-dark rounded-2xl p-6">
          <div className="text-4xl font-bold text-[#ff0066] mb-2">$50K+</div>
          <p className="text-gray-400">Total Prizes</p>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-dark rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#00ff88]/20 flex items-center justify-center mx-auto mb-4 text-[#00ff88] font-bold text-xl">
              1
            </div>
            <h3 className="text-xl font-bold mb-2">Create Account</h3>
            <p className="text-gray-400">
              Sign up and get 1000 free credits to start betting
            </p>
          </div>
          <div className="glass-dark rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#00ff88]/20 flex items-center justify-center mx-auto mb-4 text-[#00ff88] font-bold text-xl">
              2
            </div>
            <h3 className="text-xl font-bold mb-2">Place Your Bets</h3>
            <p className="text-gray-400">
              Choose your favorite teams and place your bets
            </p>
          </div>
          <div className="glass-dark rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#00ff88]/20 flex items-center justify-center mx-auto mb-4 text-[#00ff88] font-bold text-xl">
              3
            </div>
            <h3 className="text-xl font-bold mb-2">Win Prizes</h3>
            <p className="text-gray-400">
              Win credits and spend them on exclusive goodies
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

