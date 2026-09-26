"use client";

import React from "react";
import { Settings, Pencil, Camera, ChevronRight, Shield, Heart, Search, MapPin, Briefcase, Ruler, Zap } from "lucide-react";

export default function ProfilePage() {
  const profile = {
    name: "John",
    age: 28,
    photos: ["gradient:from-blue-500 to-indigo-600"],
    completion: 65,
    bio: "Looking for something real.",
    tags: [
      { icon: MapPin, text: "Living in Nairobi" },
      { icon: Briefcase, text: "Software Engineer" },
      { icon: Ruler, text: "180 cm" }
    ],
    prompts: [
      { q: "A shower thought I recently had...", a: "Why do we say 'slept like a baby' when babies wake up every 2 hours?" }
    ],
    interests: ["Travel", "Coffee", "Gym", "Music", "Photography"]
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] pb-24 h-[100dvh] overflow-y-auto">
      
      {/* Top Header / Profile Circle */}
      <div className="bg-gray-900 pt-12 pb-6 rounded-b-[40px] shadow-lg relative border-b border-white/5">
        <div className="flex justify-between items-start px-6 absolute top-4 inset-x-0">
          <button className="text-white/50 font-medium text-sm flex items-center gap-1">
            <Settings className="w-5 h-5 text-gray-400" />
            Settings
          </button>
          <button className="text-white font-semibold text-sm flex items-center gap-1">
            Preview
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center mt-6">
          <div className="relative">
            {/* Circular Progress Ring */}
            <svg className="absolute inset-0 w-32 h-32 -m-2 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#E8336D" strokeWidth="4" strokeDasharray="283" strokeDashoffset={283 - (283 * profile.completion) / 100} />
            </svg>
            <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${profile.photos[0].replace("gradient:", "")} border-4 border-[#0D0D0D] shadow-inner flex items-center justify-center`}>
              <Camera className="w-8 h-8 text-white/50" />
            </div>
            
            <div className="absolute -bottom-2 inset-x-0 flex justify-center">
              <div className="bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-gray-200">
                {profile.completion}% COMPLETE
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mt-6 flex items-center gap-2">
            {profile.name}, {profile.age}
            <Shield className="w-5 h-5 text-blue-400 fill-blue-400" />
          </h1>
        </div>
      </div>

      <div className="px-4 mt-6 max-w-md mx-auto">
        
        {/* Upsell Banner */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
            <div>
              <h3 className="text-white font-bold">Get Tinder Gold</h3>
              <p className="text-white/60 text-xs">See who likes you & more!</p>
            </div>
          </div>
          <button className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-sm">
            Upgrade
          </button>
        </div>

        {/* Edit Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Profile Details</h2>
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Pencil className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {Array(6).fill(null).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-900 rounded-lg relative overflow-hidden border border-white/5 border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
              {i === 0 ? (
                <div className={`absolute inset-0 bg-gradient-to-br ${profile.photos[0].replace("gradient:", "")}`} />
              ) : (
                <span className="text-white/30 text-2xl font-light">+</span>
              )}
            </div>
          ))}
        </div>

        {/* Info Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {profile.tags.map((t, i) => (
            <div key={i} className="bg-gray-900 border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2">
              <t.icon className="w-4 h-4 text-white/50" />
              <span className="text-white/80 text-sm">{t.text}</span>
            </div>
          ))}
        </div>

        {/* Prompts */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-3">My Prompts</h2>
          {profile.prompts.map((p, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-4 border border-white/10 mb-2">
              <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">{p.q}</p>
              <p className="text-white font-medium text-lg leading-snug">{p.a}</p>
            </div>
          ))}
          <button className="w-full py-3 mt-2 border border-brand-orange text-brand-orange rounded-xl font-bold border-dashed hover:bg-brand-orange/10 transition-colors">
            + Add a Prompt
          </button>
        </div>

        {/* Interests */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white">Interests</h2>
            <span className="text-white/50 text-sm">{profile.interests.length}/5</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((int, i) => (
              <div key={i} className="border border-white/20 rounded-full px-4 py-1.5 text-white text-sm">
                {int}
              </div>
            ))}
            <button className="border border-brand-orange/50 text-brand-orange rounded-full px-4 py-1.5 text-sm font-semibold hover:bg-brand-orange/10 transition-colors">
              + Add more
            </button>
          </div>
        </div>
        
        {/* Settings Links */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-white mb-3">Settings</h2>
          <div className="bg-gray-900 rounded-xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center cursor-pointer hover:bg-gray-800">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <span className="text-white font-medium">Discovery Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </div>
            <div className="p-4 border-b border-white/5 flex justify-between items-center cursor-pointer hover:bg-gray-800">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-gray-400" />
                <span className="text-white font-medium">Boost Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </div>
            <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-800">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="text-white font-medium">Account Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
