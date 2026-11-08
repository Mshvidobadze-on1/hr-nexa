'use client';

import React, { useState } from 'react';
import { useHR } from '@/context/HRContext';
import { ShieldAlert, KeyRound, Lock, User, X, Terminal, Eye, EyeOff } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SecretAdminModal({ isOpen, onClose }: Props) {
  const { loginSuperAdmin } = useHR();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = loginSuperAdmin(username, password);
    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'წვდომა უარყოფილია: მონაცემები არასწორია');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">
                Restricted System Access
              </div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                სისტემური ადმინისტრატორის პანელი
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Terminal/Security Indicator */}
        <div className="px-6 py-2.5 bg-slate-900/40 border-b border-slate-800/40 flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-purple-400" />
          <span>Security Protocol: ArgoHR Root Master Authentication</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <KeyRound className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
              ადმინისტრატორის სახელი
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoFocus
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-xs focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none placeholder-slate-600"
                placeholder=""
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
              ადმინისტრატორის პაროლი
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-xs focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none placeholder-slate-600"
                placeholder=""
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-950/50 transition duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>ავტორიზაცია (Master Verify)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
