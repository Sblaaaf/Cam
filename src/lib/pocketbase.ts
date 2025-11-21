import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

export default pb;

// Types for collections
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'moderator' | 'user';
  credits: number;
  avatar?: string;
  created: string;
  updated: string;
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  wins: number;
  losses: number;
  created: string;
  updated: string;
}

export interface Match {
  id: string;
  team1: string;
  team2: string;
  team1_odds: number;
  team2_odds: number;
  status: 'upcoming' | 'live' | 'finished';
  winner?: string;
  scheduled_at: string;
  finished_at?: string;
  game_title: string;
  created: string;
  updated: string;
}

export interface Bet {
  id: string;
  user: string;
  match: string;
  team: string;
  amount: number;
  potential_win: number;
  status: 'pending' | 'won' | 'lost';
  created: string;
  updated: string;
}

export interface Goodie {
  id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  stock: number;
  created: string;
  updated: string;
}

export interface Purchase {
  id: string;
  user: string;
  goodie: string;
  quantity: number;
  total_price: number;
  created: string;
  updated: string;
}

export interface Transaction {
  id: string;
  user: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'purchase';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created: string;
  updated: string;
}
