'use client';

import React, { useState, useEffect } from 'react';
import { useHR } from '@/context/HRContext';
import {
  Play,
  Square,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Radio,
  Flame,
} from 'lucide-react';

interface WorkTrackerProps {
  compact?: boolean;
  className?: string;
}

export function WorkTrackerCircleWidget({ compact = false, className = '' }: WorkTrackerProps) {
  const { clockedInSession, toggleClockInOut, currentUser } = useHR();

  // Current real-time clock
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('ka-GE', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setCurrentDate(
        now.toLocaleDateString('ka-GE', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format elapsed seconds as HH:MM:SS
  const formatElapsedTime = (sec: number) => {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`;
  };

  const isActive = clockedInSession.active;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white shadow-2xl border border-indigo-500/20 p-4 sm:p-6 lg:p-8 ${className}`}
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div
        className={`absolute bottom-0 left-1/3 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isActive ? 'bg-emerald-500/15' : 'bg-purple-500/10'
        }`}
      />

      {/* Top Header Bar: Status & Real-time Clock */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
              isActive
                ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30'
                : 'bg-indigo-500/20 text-indigo-300'
            }`}
          >
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white">
                სამუშაო დროის აღრიცხვა
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'
                  }`}
                />
                {isActive ? 'ცვლა მიმდინარეობს' : 'ცვლა არ დაწყებულა'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 capitalize mt-0.5">
              {currentDate || 'დღეს არის სამუშაო დღე'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
          <div className="text-left sm:text-right">
            <div className="font-mono text-base sm:text-xl font-black text-indigo-200 tracking-wider">
              {currentTime}
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1 sm:justify-end">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>თბილისის დრო (GMT+4)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Center Section: Gorgeous Circular Interactive Button */}
      <div className="relative z-10 py-5 sm:py-7 flex flex-col items-center justify-center text-center">
        {/* Outer Glow / Ripple Container */}
        <div className="relative group">
          {/* Ambient Glow behind the button */}
          <div
            className={`absolute -inset-3 sm:-inset-4 rounded-full blur-2xl opacity-60 transition duration-700 ${
              isActive
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 animate-pulse opacity-80'
                : 'bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 group-hover:opacity-90'
            }`}
          />

          {/* Concentric Outer Ring */}
          <div
            className={`relative p-2.5 sm:p-4 rounded-full transition-all duration-500 ${
              isActive
                ? 'ring-4 ring-emerald-400/30 bg-emerald-950/40 shadow-2xl shadow-emerald-500/30'
                : 'ring-2 ring-white/10 hover:ring-indigo-400/40 bg-slate-900/60 shadow-2xl'
            }`}
          >
            {/* The Main Circular Clickable Button */}
            <button
              onClick={toggleClockInOut}
              type="button"
              className={`w-36 h-36 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-full flex flex-col items-center justify-center p-3 sm:p-4 transition-all duration-300 transform active:scale-95 cursor-pointer relative overflow-hidden select-none ${
                isActive
                  ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 border-2 border-emerald-400/60 text-white shadow-inner'
                  : 'bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white shadow-xl hover:shadow-2xl'
              }`}
            >
              {/* Radial light flare inside button */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 rounded-t-full pointer-events-none" />

              {!isActive ? (
                /* IDLE STATE: "სამუშაოს დაწყება" */
                <div className="relative z-10 flex flex-col items-center space-y-1.5 sm:space-y-2">
                  <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                    <Play className="w-5 h-5 sm:w-8 sm:h-8 text-white fill-white ml-0.5 sm:ml-1" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-emerald-200">
                      დააჭირეთ
                    </span>
                    <h3 className="text-sm sm:text-lg font-black tracking-tight leading-tight">
                      სამუშაოს დაწყება
                    </h3>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-white/80 bg-black/20 px-2 py-0.5 rounded-full font-medium">
                    ცვლა 10:00 — 19:00
                  </span>
                </div>
              ) : (
                /* ACTIVE RUNNING STATE: Live Stopwatch + "სამუშაოს დასრულება" */
                <div className="relative z-10 flex flex-col items-center space-y-1 sm:space-y-1.5">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>მიმდინარეობს</span>
                  </div>

                  {/* Big Digital Stopwatch */}
                  <div className="font-mono text-xl sm:text-3xl font-black text-emerald-300 tracking-wider drop-shadow-md">
                    {formatElapsedTime(clockedInSession.elapsedSeconds)}
                  </div>

                  <div className="text-[9px] sm:text-[11px] text-slate-300">
                    დაიწყო: <strong className="text-white font-bold">{clockedInSession.startTime}</strong>
                  </div>

                  {/* Stop prompt */}
                  <div className="mt-0.5 sm:mt-1 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white text-[9px] sm:text-xs font-extrabold shadow-md transition group-hover:scale-105">
                    <Square className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white" />
                    <span>დასრულება</span>
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Informational Subtext */}
        <p className="mt-3 sm:mt-4 text-[11px] sm:text-sm text-slate-300 max-w-xs sm:max-w-md font-medium">
          {!isActive
            ? 'დააჭირეთ მრგვალ ღილაკს სამუშაო დროის ასათვლელად. მონაცემი მომენტალურად აისახება ტაბელში.'
            : 'სამუშაო პროცესი აქტიურია. სამუშაო დღის ბოლოს დააჭირეთ წრეს სამუშაოს დასასრულებლად.'}
        </p>
      </div>

      {/* Bottom KPI Bar: Fast Attendance Stats */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-white/10 text-xs">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-white/10">
          <span className="text-[9px] sm:text-[10px] text-slate-400 block font-semibold uppercase">
            დაწყების დრო
          </span>
          <span className="font-bold text-white text-xs sm:text-sm mt-0.5 block truncate">
            {isActive ? clockedInSession.startTime : 'არ არის აქტიური'}
          </span>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-white/10">
          <span className="text-[9px] sm:text-[10px] text-slate-400 block font-semibold uppercase">
            დღეს ნამუშევარი
          </span>
          <span className="font-bold text-emerald-400 text-xs sm:text-sm mt-0.5 block font-mono truncate">
            {formatElapsedTime(clockedInSession.elapsedSeconds)}
          </span>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-white/10">
          <span className="text-[9px] sm:text-[10px] text-slate-400 block font-semibold uppercase">
            დღიური ნორმა
          </span>
          <span className="font-bold text-indigo-300 text-xs sm:text-sm mt-0.5 block truncate">
            8 საათი (40 სთ/კვ)
          </span>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-white/10">
          <span className="text-[9px] sm:text-[10px] text-slate-400 block font-semibold uppercase">
            სინქრონიზაცია
          </span>
          <span className="font-bold text-emerald-300 text-xs sm:text-sm mt-0.5 flex items-center gap-1.5 truncate">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">ტაბელი & RS.ge</span>
          </span>
        </div>
      </div>
    </div>
  );
}
