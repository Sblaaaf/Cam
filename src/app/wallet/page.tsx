'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import pb, { Transaction } from '@/lib/pocketbase';
import { Wallet as WalletIcon, Plus, Minus, Clock, CheckCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function WalletPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState<'deposit' | 'withdrawal'>('deposit');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadTransactions();
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const records = await pb.collection('transactions').getList(1, 50, {
        filter: `user="${user.id}"`,
        sort: '-created',
      });
      setTransactions(records.items as any);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (action === 'withdrawal' && amountNum > user.credits) {
      alert('Insufficient balance');
      return;
    }

    setProcessing(true);

    try {
      // Create transaction
      await pb.collection('transactions').create({
        user: user.id,
        type: action,
        amount: amountNum,
        status: 'completed',
      });

      // Update user credits
      const newCredits = action === 'deposit'
        ? user.credits + amountNum
        : user.credits - amountNum;

      await pb.collection('users').update(user.id, {
        credits: newCredits,
      });

      alert(`${action === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`);
      setAmount('');
      window.location.reload();
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed');
    } finally {
      setProcessing(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Plus className="text-[#00ff88]" size={20} />;
      case 'withdrawal':
        return <Minus className="text-[#ff0066]" size={20} />;
      case 'win':
        return <CheckCircle className="text-[#00ff88]" size={20} />;
      default:
        return <WalletIcon className="text-gray-400" size={20} />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'win':
        return 'text-[#00ff88]';
      case 'withdrawal':
      case 'bet':
      case 'purchase':
        return 'text-[#ff0066]';
      default:
        return 'text-gray-400';
    }
  };

  const getAmountPrefix = (type: string) => {
    return ['deposit', 'win'].includes(type) ? '+' : '-';
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Background blur gradients */}
      <div className="fixed top-20 right-20 w-96 h-96 blur-gradient-green opacity-30 pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-96 h-96 blur-gradient-pink opacity-30 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Wallet</h1>
            <p className="text-gray-400">Manage your credits</p>
          </div>
          <WalletIcon className="text-[#00ff88]" size={48} />
        </div>

        {/* Balance Card */}
        <div className="glass-dark rounded-2xl p-8 mb-8">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Current Balance</div>
            <div className="text-5xl font-bold text-[#00ff88] mb-8">
              ${user?.credits.toFixed(2) || '0.00'}
            </div>

            {/* Transaction Form */}
            <form onSubmit={handleTransaction} className="max-w-md mx-auto">
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setAction('deposit')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    action === 'deposit'
                      ? 'bg-[#00ff88] text-black'
                      : 'glass border border-white/10 hover:bg-white/5'
                  }`}
                >
                  Deposit
                </button>
                <button
                  type="button"
                  onClick={() => setAction('withdrawal')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    action === 'withdrawal'
                      ? 'bg-[#ff0066] text-black'
                      : 'glass border border-white/10 hover:bg-white/5'
                  }`}
                >
                  Withdraw
                </button>
              </div>

              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-[#00ff88] focus:outline-none transition-all mb-4"
                required
              />

              <button
                type="submit"
                disabled={processing}
                className={`w-full py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  action === 'deposit'
                    ? 'bg-[#00ff88] text-black hover:bg-[#00ff88]/90'
                    : 'bg-[#ff0066] text-black hover:bg-[#ff0066]/90'
                }`}
              >
                {processing
                  ? 'Processing...'
                  : action === 'deposit'
                  ? 'Add Credits'
                  : 'Withdraw Credits'}
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-4">
              * This is a simulation. No real money is involved.
            </p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="glass-dark rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Transaction History</h2>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No transactions yet</div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg glass border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <div className="font-medium capitalize">{transaction.type}</div>
                      <div className="text-sm text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(transaction.created)}
                      </div>
                    </div>
                  </div>
                  <div className={`text-xl font-bold ${getTransactionColor(transaction.type)}`}>
                    {getAmountPrefix(transaction.type)}${transaction.amount.toFixed(2)}
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
