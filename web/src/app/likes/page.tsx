"use client";

import React, { useState } from "react";
import { Sparkles, Heart } from "lucide-react";

export default function LikesPage() {
  const [activeTab, setActiveTab] = useState("recent");
  
  // Generate 8 blurred mock profiles
  const profiles = Array(8).fill(null).map((_, i) => ({
    id: i,
    bg: [
      "from-pink-500 to-rose-600",
      "from-purple-500 to-indigo-600",
      "from-amber-500 to-orange-600",
      "from-teal-500 to-cyan-600"
    ][i % 4]
  }));

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pb-24 pt-4 px-4 h-[100dvh] overflow-hidden">
      <div className="w-full max-w-md h-full flex flex-col relative">
        <h1 className="text-3xl font-black text-white mb-2 text-center">Likes</h1>
        <p className="text-white/60 mb-6 text-center text-sm">Upgrade to Gold to see who liked you.</p>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-6 border-b border-white/10 pb-2">
          <button 
            className={`font-semibold pb-2 border-b-2 transition-colors ${activeTab === 'recent' ? 'text-brand-orange border-brand-orange' : 'text-white/50 border-transparent'}`}
            onClick={() => setActiveTab('recent')}
          >
            Most Recent
          </button>
          <button 
            className={`font-semibold pb-2 border-b-2 transition-colors ${activeTab === 'type' ? 'text-brand-orange border-brand-orange' : 'text-white/50 border-transparent'}`}
            onClick={() => setActiveTab('type')}
          >
            Your Type
          </button>
        </div>

        {/* Blurred Grid */}
        <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto pb-32">
          {profiles.map((p) => (
            <div key={p.id} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-900 border border-white/5 cursor-pointer group">
              <div className={`absolute inset-0 bg-gradient-to-br ${p.bg} opacity-80 blur-xl scale-125`} />
              
              <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white/50 fill-white/20" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sticky CTA */}
        <div className="absolute bottom-6 inset-x-0 px-4">
          <button className="w-full py-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-black text-lg shadow-[0_0_20px_rgba(250,204,21,0.4)] flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95">
            <Sparkles className="w-5 h-5" />
            See All Your Likes Now
          </button>
        </div>
      </div>
    </div>
  );
}
