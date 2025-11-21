'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import pb, { Goodie } from '@/lib/pocketbase';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GoodiesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [goodies, setGoodies] = useState<Goodie[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    loadGoodies();
  }, []);

  const loadGoodies = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('goodies').getList(1, 50, {
        filter: 'stock > 0',
        sort: 'price',
      });
      setGoodies(records.items as any);
    } catch (error) {
      console.error('Failed to load goodies:', error);
    } finally {
      setLoading(false);
    }
  };

  const purchaseGoodie = async (goodie: Goodie) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.credits < goodie.price) {
      alert('Insufficient credits');
      return;
    }

    if (goodie.stock < 1) {
      alert('Out of stock');
      return;
    }

    setPurchasing(goodie.id);

    try {
      // Create purchase
      await pb.collection('purchases').create({
        user: user.id,
        goodie: goodie.id,
        quantity: 1,
        total_price: goodie.price,
      });

      // Update user credits
      await pb.collection('users').update(user.id, {
        credits: user.credits - goodie.price,
      });

      // Update goodie stock
      await pb.collection('goodies').update(goodie.id, {
        stock: goodie.stock - 1,
      });

      alert('Purchase successful!');
      window.location.reload();
    } catch (error) {
      console.error('Failed to purchase:', error);
      alert('Purchase failed');
    } finally {
      setPurchasing(null);
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
            <h1 className="text-4xl font-bold mb-2">Goodies Store</h1>
            <p className="text-gray-400">Spend your credits on exclusive items</p>
          </div>
          <ShoppingBag className="text-[#ff0066]" size={48} />
        </div>

        {user && (
          <div className="glass-dark rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Your Balance</div>
                <div className="text-3xl font-bold text-[#00ff88]">
                  ${user.credits.toFixed(2)}
                </div>
              </div>
              <ShoppingCart className="text-[#00ff88]" size={32} />
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading goodies...</div>
        ) : goodies.length === 0 ? (
          <div className="glass-dark rounded-xl p-12 text-center">
            <p className="text-gray-400">No goodies available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goodies.map((goodie) => (
              <div key={goodie.id} className="glass-dark rounded-xl overflow-hidden group">
                {/* Image placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-[#00ff88]/20 to-[#ff0066]/20 flex items-center justify-center">
                  <ShoppingBag size={48} className="text-white/50" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{goodie.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {goodie.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-[#00ff88]">
                      ${goodie.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">
                      Stock: {goodie.stock}
                    </div>
                  </div>

                  {user ? (
                    <button
                      onClick={() => purchaseGoodie(goodie)}
                      disabled={purchasing === goodie.id || user.credits < goodie.price || goodie.stock < 1}
                      className="w-full py-2 rounded-lg bg-[#00ff88] text-black font-semibold hover:bg-[#00ff88]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {purchasing === goodie.id
                        ? 'Purchasing...'
                        : user.credits < goodie.price
                        ? 'Insufficient Credits'
                        : goodie.stock < 1
                        ? 'Out of Stock'
                        : 'Purchase'}
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push('/login')}
                      className="w-full py-2 rounded-lg bg-[#00ff88] text-black font-semibold hover:bg-[#00ff88]/90 transition-all"
                    >
                      Login to Purchase
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
