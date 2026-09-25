"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WalletPage() {
  const router = useRouter();
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'balance' | 'packages'>('balance');

  const packages = [
    { id: '1', name: 'Starter', priceKsh: 100, coins: 100, bonus: 0 },
    { id: '2', name: 'Basic', priceKsh: 250, coins: 275, bonus: 25 },
    { id: '3', name: 'Popular', priceKsh: 500, coins: 600, bonus: 100 },
    { id: '4', name: 'Premium', priceKsh: 1000, coins: 1300, bonus: 300 },
    { id: '5', name: 'VIP', priceKsh: 2500, coins: 3500, bonus: 1000 },
    { id: '6', name: 'Ultimate', priceKsh: 5000, coins: 7500, bonus: 2500 },
  ];

  useEffect(() => {
    // In a real app, we would fetch from the backend using the JWT token
    // For now, let's mock it to show the UI
    setTimeout(() => {
      setBalance(150);
      setTransactions([
        { id: 't1', type: 'WELCOME', amount: 150, description: 'Welcome coins after email verification', createdAt: new Date().toISOString() }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handlePurchase = (pkg: any) => {
    // Mock purchase flow
    alert(`Initiating M-Pesa payment for ${pkg.name} (KSh ${pkg.priceKsh})...\n\nIn the real app, this will trigger the M-Pesa STK push.`);
    setTimeout(() => {
      setBalance((prev) => (prev || 0) + pkg.coins);
      setTransactions((prev) => [
        { id: Math.random().toString(), type: 'PURCHASE', amount: pkg.coins, description: `Purchase ${pkg.name} package`, createdAt: new Date().toISOString() },
        ...prev
      ]);
      setActiveTab('balance');
      alert(`Payment successful! ${pkg.coins} coins added to your wallet.`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24 selection:bg-brand-orange/30">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-peach">
              My Wallet
            </h1>
            <p className="text-white/60 text-sm mt-1">Manage your coins and transactions</p>
          </div>
          <button onClick={() => router.back()} className="text-white/60 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Balance Card */}
        <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/20 to-brand-peach/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 flex flex-col items-center justify-center py-6">
            <div className="text-white/60 mb-2 uppercase tracking-wider text-xs font-semibold">Available Balance</div>
            <div className="flex items-center gap-3">
              <span className="text-5xl font-black text-white">{loading ? '...' : balance}</span>
              <span className="text-2xl font-bold text-brand-orange">Coins</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-white/10 pb-4">
          <button 
            onClick={() => setActiveTab('balance')}
            className={`font-semibold transition-colors ${activeTab === 'balance' ? 'text-brand-orange border-b-2 border-brand-orange pb-4 -mb-[18px]' : 'text-white/60 hover:text-white'}`}
          >
            Transactions
          </button>
          <button 
            onClick={() => setActiveTab('packages')}
            className={`font-semibold transition-colors ${activeTab === 'packages' ? 'text-brand-orange border-b-2 border-brand-orange pb-4 -mb-[18px]' : 'text-white/60 hover:text-white'}`}
          >
            Buy Coins
          </button>
        </div>

        {/* Content */}
        <div className="pt-4">
          {activeTab === 'balance' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-white/40 py-8">Loading history...</div>
              ) : transactions.length === 0 ? (
                <div className="text-center text-white/40 py-8">No transactions yet.</div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div>
                      <div className="font-medium text-white">{tx.description}</div>
                      <div className="text-xs text-white/50 mt-1">{new Date(tx.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className={`font-bold ${tx.type === 'WELCOME' || tx.type === 'PURCHASE' ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.type === 'WELCOME' || tx.type === 'PURCHASE' ? '+' : '-'}{tx.amount}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'packages' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="glass-panel p-5 rounded-3xl flex flex-col justify-between border border-white/10 hover:border-brand-orange/50 transition-all cursor-pointer relative overflow-hidden group" onClick={() => handlePurchase(pkg)}>
                  {pkg.bonus > 0 && (
                    <div className="absolute top-0 right-0 bg-brand-orange text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">
                      Bonus +{pkg.bonus}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{pkg.name}</h3>
                    <div className="flex items-end gap-1 mb-4">
                      <span className="text-3xl font-black text-brand-orange">{pkg.coins}</span>
                      <span className="text-sm text-white/60 font-medium mb-1">Coins</span>
                    </div>
                  </div>
                  <button className="w-full py-3 rounded-full bg-white/10 hover:bg-brand-orange text-white font-semibold transition-colors">
                    KSh {pkg.priceKsh.toLocaleString()}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
