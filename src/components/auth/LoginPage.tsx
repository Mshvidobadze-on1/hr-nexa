'use client';

import React, { useState, useRef } from 'react';
import { useHR } from '@/context/HRContext';
import { SecretAdminModal } from './SecretAdminModal';
import {
  Lock,
  User,
  LogIn,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export function LoginPage() {
  const { login } = useHR();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSecretModal, setShowSecretModal] = useState(false);

  // Triple-click tracking ref on Company Logo
  const clickTimestamps = useRef<number[]>([]);

  const handleLogoClick = () => {
    const now = Date.now();
    clickTimestamps.current = clickTimestamps.current.filter((t) => now - t <= 1500);
    clickTimestamps.current.push(now);

    if (clickTimestamps.current.length >= 3) {
      clickTimestamps.current = [];
      setShowSecretModal(true);
    }
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = login(username, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'მომხმარებელი ან პაროლი არასწორია');
    }
  };

  // Quick 1-click demo logins
  const handleQuickDemoLogin = (demoUser: string, demoPass: string) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setError(null);
    login(demoUser, demoPass);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-900 text-slate-100 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-indigo-600/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 right-10 w-[500px] h-[400px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-[400px] h-[300px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <header className="px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3.5">
          {/* Interactive Logo: 3 consecutive clicks triggers Secret Admin Modal */}
          <div
            onClick={handleLogoClick}
            className="group relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-emerald-400 p-[1.5px] cursor-pointer active:scale-95 transition-all shadow-xl shadow-indigo-950/40"
            title="HR NEXA (3-ჯერ დაწკაპუნებით სისტემური ადმინ-პანელი)"
          >
            <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-white font-black text-2xl group-hover:bg-slate-900 transition">
              N
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-white">HR NEXA</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SaaS CLOUD
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              HR, LMS & Employee Wellbeing Platform
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
          <Building2 className="w-4 h-4 text-indigo-400" />
          <span>HR NEXA Enterprise • GDPR Compliant</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10 my-4">
        <div className="w-full max-w-[460px] bg-slate-950/85 backdrop-blur-2xl border border-slate-800/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-9 shadow-2xl space-y-5 sm:space-y-6">
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-black text-white tracking-tight">ავტორიზაცია</h1>
            <p className="text-xs text-slate-400">
              შეიყვანეთ კორპორატიული მომხმარებელი ან ისარგებლეთ სწრაფი ტესტით
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleStandardLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                მომხმარებელი ან ელ-ფოსტა
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="მაგ: n.kapanadze, g.beridze ან t.gelashvili"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">პაროლი</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  title={showPassword ? 'დამალვა' : 'ჩვენება'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4" />
              <span>სისტემაში შესვლა</span>
            </button>
          </form>

          {/* Quick 1-Click Demo Testing Pills (Roles from Technical Task) */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>სწრაფი 1-კლიკით ტესტირება:</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">პაროლი: 123</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('n.kapanadze', '123')}
                className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/50 text-left transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white group-hover:text-emerald-300 transition">
                    ნინო კაპანაძე
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
                </div>
                <div className="text-[10px] text-emerald-400 font-bold mt-0.5">HR Manager</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('g.beridze', '123')}
                className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-blue-950/60 border border-slate-800 hover:border-blue-500/50 text-left transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white group-hover:text-blue-300 transition">
                    გიორგი ბერიძე
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition" />
                </div>
                <div className="text-[10px] text-blue-400 font-bold mt-0.5">Line Manager</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('t.gelashvili', '123')}
                className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/50 text-left transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white group-hover:text-indigo-300 transition">
                    თამარ გელაშვილი
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
                </div>
                <div className="text-[10px] text-indigo-400 font-bold mt-0.5">Employee (ESS)</div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 sm:px-10 py-5 text-center text-xs text-slate-500 z-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>© 2026 HR NEXA Platform • ISO 27001 & GDPR Ready</span>
        </div>
        <div className="text-[11px] text-slate-500">
          საქართველოს შრომის კოდექსი & RS.ge API ინტეგრაცია
        </div>
      </footer>

      {/* Secret Super-Admin Access Modal (Triggered by 3 clicks on logo) */}
      <SecretAdminModal
        isOpen={showSecretModal}
        onClose={() => setShowSecretModal(false)}
      />
    </div>
  );
}
