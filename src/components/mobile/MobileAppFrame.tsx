'use client';

import React, { useState } from 'react';
import { useHR, ModuleId } from '@/context/HRContext';
import {
  MessageSquare,
  UserCircle,
  GraduationCap,
  Zap,
  ShoppingBag,
  Bot,
  Wifi,
  Battery,
  Clock,
  Sparkles,
  ArrowLeft,
  X,
  Palmtree,
  Receipt,
  CheckCircle2,
} from 'lucide-react';
import { SocialFeedModule } from '@/components/modules/SocialFeedModule';
import { ESSModule } from '@/components/modules/ESSModule';
import { LmsModule } from '@/components/modules/LmsModule';
import { EwaModule } from '@/components/modules/EwaModule';
import { GamificationModule } from '@/components/modules/GamificationModule';
import { AiAssistantModule } from '@/components/modules/AiAssistantModule';

export function MobileAppFrame() {
  const { setViewDevice, currentUser, employees } = useHR();
  const [mobileTab, setMobileTab] = useState<'feed' | 'ess' | 'lms' | 'ewa' | 'rewards' | 'ai'>(
    'feed'
  );

  const currentEmp =
    employees.find((e) => e.id === currentUser?.employeeId) || employees[3] || employees[0];

  return (
    <div className="min-h-[850px] py-6 flex flex-col items-center justify-center bg-slate-900/60 rounded-3xl p-4">
      {/* Top Banner to switch back */}
      <div className="mb-4 flex items-center justify-between w-full max-w-[420px] px-2 text-white text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm">HR NEXA Mobile App Simulator</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
            iOS & Android
          </span>
        </div>
        <button
          onClick={() => setViewDevice('desktop')}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition cursor-pointer"
        >
          💻 Desktop-ზე დაბრუნება
        </button>
      </div>

      {/* iPhone Device Shell */}
      <div className="w-full max-w-[400px] h-[780px] bg-slate-950 rounded-[50px] p-3.5 shadow-2xl border-4 border-slate-700/80 ring-12 ring-slate-900/90 relative flex flex-col overflow-hidden">
        {/* Dynamic Island Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-between px-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
        </div>

        {/* Status Bar */}
        <div className="h-8 w-full flex items-center justify-between px-6 text-white text-[11px] font-bold shrink-0 pt-1 z-40">
          <span>09:41</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Mobile Viewport Content */}
        <div className="flex-1 overflow-y-auto px-1 py-2 space-y-4 text-xs select-none">
          {mobileTab === 'feed' && <SocialFeedModule />}
          {mobileTab === 'ess' && <ESSModule />}
          {mobileTab === 'lms' && <LmsModule />}
          {mobileTab === 'ewa' && <EwaModule />}
          {mobileTab === 'rewards' && <GamificationModule />}
          {mobileTab === 'ai' && <AiAssistantModule />}
        </div>

        {/* Bottom App Navigation Bar */}
        <div className="h-16 w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800 rounded-b-[40px] flex items-center justify-around px-2 text-[10px] font-bold text-slate-400 shrink-0 z-40">
          <button
            onClick={() => setMobileTab('feed')}
            className={`flex flex-col items-center gap-1 transition cursor-pointer ${
              mobileTab === 'feed' ? 'text-indigo-400 font-extrabold' : 'hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>კედელი</span>
          </button>

          <button
            onClick={() => setMobileTab('ess')}
            className={`flex flex-col items-center gap-1 transition cursor-pointer ${
              mobileTab === 'ess' ? 'text-indigo-400 font-extrabold' : 'hover:text-slate-200'
            }`}
          >
            <UserCircle className="w-5 h-5" />
            <span>კაბინეტი</span>
          </button>

          <button
            onClick={() => setMobileTab('lms')}
            className={`flex flex-col items-center gap-1 transition cursor-pointer ${
              mobileTab === 'lms' ? 'text-indigo-400 font-extrabold' : 'hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span>სწავლება</span>
          </button>

          <button
            onClick={() => setMobileTab('ewa')}
            className={`flex flex-col items-center gap-1 transition cursor-pointer ${
              mobileTab === 'ewa' ? 'text-emerald-400 font-extrabold' : 'hover:text-slate-200'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span>EWA</span>
          </button>

          <button
            onClick={() => setMobileTab('rewards')}
            className={`flex flex-col items-center gap-1 transition cursor-pointer ${
              mobileTab === 'rewards' ? 'text-amber-400 font-extrabold' : 'hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>ქულები</span>
          </button>

          <button
            onClick={() => setMobileTab('ai')}
            className={`flex flex-col items-center gap-1 transition cursor-pointer ${
              mobileTab === 'ai' ? 'text-cyan-400 font-extrabold' : 'hover:text-slate-200'
            }`}
          >
            <Bot className="w-5 h-5" />
            <span>AI</span>
          </button>
        </div>

        {/* Home Indicator bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full" />
      </div>
    </div>
  );
}
