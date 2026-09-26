"use client";

import React from "react";
import { Sparkles, Coffee, Heart, Zap, Users, Search } from "lucide-react";

const EXPLORE_CATEGORIES = [
  { id: "long-term", label: "Long-term partner", icon: Heart, color: "text-pink-400", bg: "bg-pink-400/20" },
  { id: "long-to-short", label: "Long-term, open to short", icon: Search, color: "text-blue-400", bg: "bg-blue-400/20" },
  { id: "short-to-long", label: "Short-term, open to long", icon: Coffee, color: "text-amber-400", bg: "bg-amber-400/20" },
  { id: "short-term", label: "Short-term fun", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/20" },
  { id: "friends", label: "New friends", icon: Users, color: "text-green-400", bg: "bg-green-400/20" },
  { id: "figuring", label: "Still figuring it out", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-400/20" },
];

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center pb-24 pt-6 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-black text-white mb-2">Explore</h1>
        <p className="text-white/60 mb-6">Welcome to Explore. Find what you're looking for.</p>

        <h2 className="text-xl font-bold text-white mb-4">Looking For</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {EXPLORE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="bg-gray-900 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-800 transition-colors border border-white/5 aspect-square"
            >
              <div className={`w-16 h-16 rounded-full ${cat.bg} flex items-center justify-center mb-4`}>
                <cat.icon className={`w-8 h-8 ${cat.color}`} />
              </div>
              <span className="text-white font-semibold text-sm leading-tight px-2">{cat.label}</span>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-white mt-10 mb-4">For You</h2>
        
        <div className="bg-gradient-to-r from-brand-orange/20 to-brand-peach/20 rounded-2xl p-6 border border-brand-orange/30 flex items-center justify-between cursor-pointer">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Verified Members</h3>
            <p className="text-white/70 text-sm">Stand out with a blue tick</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-400 fill-blue-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Shield(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}
