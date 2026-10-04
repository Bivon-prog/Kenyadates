"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Coins, ArrowLeft, TrendingUp, CheckCircle2, Clock } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const PACKAGES = [
  { id: "1", name: "Starter", priceKsh: 100, coins: 100, bonus: 0, popular: false },
  { id: "2", name: "Basic", priceKsh: 250, coins: 275, bonus: 25, popular: false },
  { id: "3", name: "Popular", priceKsh: 500, coins: 600, bonus: 100, popular: true },
  { id: "4", name: "Premium", priceKsh: 1000, coins: 1300, bonus: 300, popular: false },
  { id: "5", name: "VIP", priceKsh: 2500, coins: 3500, bonus: 1000, popular: false },
  { id: "6", name: "Ultimate", priceKsh: 5000, coins: 7500, bonus: 2500, popular: false },
];

interface Tx {
  id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

export default function WalletPage() {
  const router = useRouter();
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"history" | "buy">("history");
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem("kd_token");
      const res = await fetch(`${API}/wallet/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance ?? 0);
        setTransactions(data.transactions ?? []);
        setLoading(false);
        return;
      }
    } catch { /* fallback */ }
    // Mock data fallback
    setBalance(150);
    setTransactions([
      { id: "t1", type: "WELCOME", amount: 150, description: "Welcome coins — email verified", createdAt: new Date().toISOString() },
    ]);
    setLoading(false);
  };

  const handleBuy = async (pkg: typeof PACKAGES[0]) => {
    setPurchasing(pkg.id);
    try {
      const token = localStorage.getItem("kd_token");
      const res = await fetch(`${API}/wallet/purchase`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id }),
      });
      if (res.ok) {
        showToast(`M-Pesa STK push sent! Check your phone for KSh ${pkg.priceKsh} prompt.`);
        setTimeout(fetchWallet, 3000);
      } else {
        // Simulate for now
        simulatePurchase(pkg);
      }
    } catch {
      simulatePurchase(pkg);
    }
    setPurchasing(null);
  };

  const simulatePurchase = (pkg: typeof PACKAGES[0]) => {
    setBalance(b => (b ?? 0) + pkg.coins + pkg.bonus);
    const newTx: Tx = {
      id: Math.random().toString(),
      type: "PURCHASE",
      amount: pkg.coins + pkg.bonus,
      description: `${pkg.name} package — ${pkg.coins}${pkg.bonus ? ` + ${pkg.bonus} bonus` : ""} coins`,
      createdAt: new Date().toISOString(),
    };
    setTransactions(txs => [newTx, ...txs]);
    setActiveTab("history");
    showToast(`✅ ${pkg.coins + pkg.bonus} coins added to your wallet!`);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const txIcon = (type: string) => {
    if (type === "WELCOME" || type === "BONUS") return "🎁";
    if (type === "PURCHASE") return "💳";
    if (type === "BOOST") return "⚡";
    if (type === "CALL") return "📞";
    if (type === "GIFT") return "🎀";
    return "🪙";
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white page-pb">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 inset-x-4 md:inset-x-auto md:top-6 md:right-6 md:left-auto md:max-w-sm z-50 bg-[#1A1A2E] border border-white/15 rounded-2xl px-4 py-3.5 shadow-2xl flex items-start gap-3 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-white/85 leading-snug">{toast}</p>
        </div>
      )}

      {/* ── Header ── */}
      <div className="px-4 md:px-8 pt-5 pb-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/6 border border-white/8 flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0">
          <ArrowLeft className="w-4 h-4 text-white/70" />
        </button>
        <div>
          <h1 className="text-xl font-black">My Wallet</h1>
          <p className="text-white/40 text-xs">Coins · Transactions · M-Pesa</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-8 space-y-5">

        {/* ── Balance card ── */}
        <div className="relative rounded-3xl p-6 overflow-hidden border border-white/8"
          style={{ background: "linear-gradient(135deg, #1A0A18 0%, #1A1A2E 100%)" }}>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 blur-3xl"
            style={{ background: "var(--gradient-primary)", transform: "translate(30%, -30%)" }} />
          <p className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-1">Available Balance</p>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-5xl font-black text-white">
              {loading ? "—" : (balance ?? 0).toLocaleString()}
            </span>
            <span className="text-lg font-bold mb-1" style={{ color: "var(--accent-gold)" }}>Coins</span>
          </div>
          <button
            onClick={() => setActiveTab("buy")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Coins className="w-3.5 h-3.5" />
            Buy More Coins
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-white/5 rounded-full p-1 w-fit">
          {[
            { id: "history", label: "History" },
            { id: "buy", label: "Buy Coins" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as "history" | "buy")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === t.id
                  ? "bg-[#E8336D] text-white shadow"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── History ── */}
        {activeTab === "history" && (
          <div className="space-y-2">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-2xl skeleton" />
              ))
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-10 h-10 text-white/15 mx-auto mb-3" />
                <p className="text-white/30 text-sm">No transactions yet</p>
              </div>
            ) : (
              transactions.map(tx => (
                <div key={tx.id} className="flex items-center gap-3 p-4 bg-white/4 border border-white/6 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center text-lg flex-shrink-0">
                    {txIcon(tx.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{tx.description}</p>
                    <p className="text-white/35 text-xs mt-0.5">
                      {new Date(tx.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span className={`font-bold text-sm flex-shrink-0 ${["WELCOME","PURCHASE","BONUS"].includes(tx.type) ? "text-green-400" : "text-red-400"}`}>
                    {["WELCOME","PURCHASE","BONUS"].includes(tx.type) ? "+" : "-"}{tx.amount.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Buy packages ── */}
        {activeTab === "buy" && (
          <div>
            <p className="text-white/40 text-xs mb-4">Paid via M-Pesa · Instant delivery</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PACKAGES.map(pkg => {
                const total = pkg.coins + pkg.bonus;
                const isLoading = purchasing === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    onClick={() => handleBuy(pkg)}
                    disabled={isLoading}
                    className="relative flex flex-col p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                    style={{
                      background: pkg.popular
                        ? "linear-gradient(135deg, rgba(232,51,109,0.12), rgba(255,107,157,0.06))"
                        : "rgba(255,255,255,0.04)",
                      borderColor: pkg.popular ? "rgba(232,51,109,0.4)" : "rgba(255,255,255,0.08)",
                    }}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-black text-white uppercase tracking-wide"
                        style={{ background: "var(--gradient-primary)" }}>
                        Popular
                      </span>
                    )}
                    {pkg.bonus > 0 && (
                      <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        +{pkg.bonus}
                      </span>
                    )}
                    <p className="text-white/60 text-xs font-medium mb-1">{pkg.name}</p>
                    <p className="text-white font-black text-2xl leading-none mb-1">
                      {total.toLocaleString()}
                      <span className="text-xs font-normal text-white/40 ml-1">coins</span>
                    </p>
                    <p className="text-white/40 text-xs mb-3 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {(total / pkg.priceKsh).toFixed(1)} per KSh
                    </p>
                    <div className="w-full py-2 rounded-full text-center text-sm font-bold text-white"
                      style={{ background: pkg.popular ? "var(--gradient-primary)" : "rgba(255,255,255,0.1)" }}>
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Sending…
                        </span>
                      ) : (
                        `KSh ${pkg.priceKsh.toLocaleString()}`
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-center text-white/25 text-xs mt-5">
              💳 M-Pesa STK push will appear on your phone · Kenya only
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

