'use client';

import React from 'react';
import { useHR, ModuleId } from '@/context/HRContext';
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  CalendarClock,
  Palmtree,
  Landmark,
  Briefcase,
  Award,
  UserCircle,
  Bell,
  Building2,
  CheckCircle2,
  Sparkles,
  LogOut,
  Crown,
  Calendar,
  ChevronRight,
  Clock,
  MessageSquare,
  GraduationCap,
  ShoppingBag,
  Zap,
  Bot,
  Radio,
  Smartphone,
  Monitor,
  TrendingUp,
} from 'lucide-react';
import { MobileAppFrame } from '@/components/mobile/MobileAppFrame';
import { FloatingAiChat } from '@/components/ai/FloatingAiChat';

export function AppShell({ children }: { children: React.ReactNode }) {
  const {
    currentUser,
    logout,
    activeModule,
    setActiveModule,
    viewDevice,
    setViewDevice,
    leaveRequests,
    toasts,
    clockedInSession,
    toggleClockInOut,
    hasPermission,
  } = useHR();

  const pendingCount = leaveRequests.filter(
    (r) =>
      r.status === 'მენეჯერის დასტურის მოლოდინში' || r.status === 'HR-ის დასტურის მოლოდინში'
  ).length;

  const formatTimer = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(
      2,
      '0'
    )}`;
  };

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isHrAdmin = currentUser?.role === 'HR_ADMIN';
  const isLineManager = currentUser?.role === 'LINE_MANAGER';
  const isEmployee = currentUser?.role === 'EMPLOYEE';

  const navItems: {
    id: ModuleId;
    label: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    visible: boolean;
    badge?: number;
    tag?: string;
  }[] = [
    {
      id: 'super-admin',
      label: 'სისტემის მართვა',
      subtitle: 'Config, Users & Permissions',
      icon: ShieldAlert,
      visible: isSuperAdmin,
    },
    {
      id: 'dashboard',
      label: 'მთავარი დაფა',
      subtitle: 'Executive & Attendance Hub',
      icon: LayoutDashboard,
      visible: true,
    },
    {
      id: 'social-feed',
      label: 'კორპორატიული კედელი',
      subtitle: 'Social Feed, Kudos & Polls',
      icon: MessageSquare,
      visible: true,
    },
    {
      id: 'lms',
      label: 'სწავლება და კურსები',
      subtitle: 'LMS Videos, Quizzes & Certs',
      icon: GraduationCap,
      visible: true,
    },
    {
      id: 'gamification',
      label: 'გემიფიკაცია & მაღაზია',
      subtitle: 'NEXA Rewards Points & Shop',
      icon: ShoppingBag,
      visible: true,
    },
    {
      id: 'ewa',
      label: 'ხელფასი მოთხოვნამდე',
      subtitle: 'Earned Wage Access (FinTech)',
      icon: Zap,
      visible: true,
    },
    {
      id: 'ai-assistant',
      label: 'პროგნოზული ანალიტიკა',
      subtitle: 'Flight Risk & Turnover Model',
      icon: TrendingUp,
      visible: isSuperAdmin || isHrAdmin || isLineManager,
    },
    {
      id: 'employees',
      label: 'პერსონალი და სტრუქტურა',
      subtitle: 'Employee DB & Org Tree',
      icon: Users,
      visible: isSuperAdmin || hasPermission('canManageEmployees'),
    },
    {
      id: 'biometrics',
      label: 'ტურნიკეტები & ბიომეტრია',
      subtitle: 'Hardware API & Live Logs',
      icon: Radio,
      visible: isSuperAdmin || isHrAdmin || isLineManager,
    },
    {
      id: 'timesheet',
      label: 'დროის აღრიცხვა და ტაბელი',
      subtitle: 'Labor Code Timesheet Grid',
      icon: CalendarClock,
      visible: isSuperAdmin || hasPermission('canManageTimesheet'),
    },
    {
      id: 'leaves',
      label: 'შვებულებები და გაცდენები',
      subtitle: 'Leave Approval Workflow',
      icon: Palmtree,
      visible: isSuperAdmin || hasPermission('canApproveLeaves') || hasPermission('canRequestLeave'),
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      id: 'payroll',
      label: 'ხელფასები და უწყისები',
      subtitle: 'Georgian Tax & Bank Registry',
      icon: Landmark,
      visible: isSuperAdmin || hasPermission('canManagePayroll'),
    },
    {
      id: 'recruitment',
      label: 'რეკრუტინგი და ATS',
      subtitle: 'CV Parsing & Kanban Board',
      icon: Briefcase,
      visible: isSuperAdmin || hasPermission('canManageRecruitment'),
    },
    {
      id: 'performance',
      label: 'შეფასება და KPI',
      subtitle: 'OKRs & 360° Evaluation',
      icon: Award,
      visible: isSuperAdmin || isHrAdmin || isLineManager,
    },
    {
      id: 'ess',
      label: 'თანამშრომლის კაბინეტი',
      subtitle: 'Self-Service & Payslips',
      icon: UserCircle,
      visible: true,
    },
  ];

  const visibleNav = navItems.filter((item) => item.visible);
  const activeItem = navItems.find((n) => n.id === activeModule);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-950 text-slate-100 flex flex-col shrink-0 border-r border-slate-800/90 shadow-2xl z-20">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-emerald-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-950/60 ring-2 ring-white/10">
              N
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-white">HR NEXA</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SaaS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                People & Wellbeing Platform
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>
              {isSuperAdmin
                ? 'Super Admin / Owner'
                : isHrAdmin
                ? 'HR Manager Portal'
                : isLineManager
                ? 'Line Manager Portal'
                : 'Employee Workspace'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {visibleNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? item.id === 'super-admin'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
                      : 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
                    : 'text-slate-300 hover:bg-slate-900/90 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-1.5 rounded-xl transition ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-900 text-slate-400 group-hover:text-indigo-400 group-hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  <div className="min-w-0 truncate">
                    <div className="font-bold text-xs truncate flex items-center gap-1.5">
                      <span>{item.label}</span>
                      {item.tag && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-md font-extrabold ${
                            item.tag === 'AI'
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : item.tag === 'EWA'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[10px] truncate ${
                        isActive ? 'text-indigo-100' : 'text-slate-400'
                      }`}
                    >
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                      isActive ? 'bg-white text-indigo-700' : 'bg-rose-500 text-white animate-pulse'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Live Attendance Clock-In Widget in Sidebar */}
        {hasPermission('canClockInOut') && (
          <div className="p-4 mx-3 mb-3 rounded-2xl bg-slate-900/90 border border-slate-800/90 text-center space-y-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>დღევანდელი ცვლა</span>
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  clockedInSession.active
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {clockedInSession.active ? 'აქტიური' : 'დასრულებული'}
              </span>
            </div>
            <div className="text-2xl font-black font-mono tracking-wider text-emerald-400">
              {formatTimer(clockedInSession.elapsedSeconds)}
            </div>
            <button
              onClick={toggleClockInOut}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer active:scale-98 ${
                clockedInSession.active
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
              }`}
            >
              {clockedInSession.active
                ? 'წასვლის დაფიქსირება (Clock-Out)'
                : 'მოსვლის დაფიქსირება (Clock-In)'}
            </button>
          </div>
        )}

        {/* Company Footer */}
        <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            HR NEXA Enterprise Cloud
          </span>
          <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            v3.0
          </span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/90 px-6 sm:px-8 py-3.5 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          {/* Active Module Title */}
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                {activeItem?.label || 'მთავარი დაფა'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>საანგარიშო პერიოდი:</span>
                <strong className="text-slate-800">ნოემბერი 2026</strong>
                <span className="text-slate-300">•</span>
                <span className="hidden md:inline text-slate-500">
                  საქართველოს შრომის კოდექსი & RS.ge
                </span>
              </div>
            </div>
          </div>

          {/* Right Tools: View Device Switcher & User Profile & Logout */}
          <div className="flex items-center gap-3">
            {/* Desktop / Mobile App Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setViewDevice('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  viewDevice === 'desktop'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="ვებ აპლიკაცია (Desktop)"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Web (Desktop)</span>
              </button>
              <button
                onClick={() => setViewDevice('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  viewDevice === 'mobile'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="მობილური აპლიკაციის ხედი (iOS & Android)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile App</span>
              </button>
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-3 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 rounded-2xl transition">
              <div
                className={`relative w-8 h-8 rounded-xl font-bold text-white flex items-center justify-center text-xs shadow-sm ${
                  isSuperAdmin
                    ? 'bg-gradient-to-tr from-purple-700 to-indigo-600'
                    : isHrAdmin
                    ? 'bg-gradient-to-tr from-emerald-700 to-teal-600'
                    : isLineManager
                    ? 'bg-gradient-to-tr from-blue-700 to-indigo-600'
                    : 'bg-gradient-to-tr from-indigo-600 to-purple-600'
                }`}
              >
                {isSuperAdmin ? (
                  <Crown className="w-4 h-4 text-amber-300" />
                ) : (
                  currentUser?.fullName?.slice(0, 1) || 'U'
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <span>{currentUser?.fullName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-block px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                      isSuperAdmin
                        ? 'bg-purple-100 text-purple-800'
                        : isHrAdmin
                        ? 'bg-emerald-100 text-emerald-800'
                        : isLineManager
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {isSuperAdmin
                      ? 'System Owner'
                      : isHrAdmin
                      ? 'HR Manager / Admin'
                      : isLineManager
                      ? 'Line Manager'
                      : 'Employee'}
                  </span>
                  {currentUser?.department && (
                    <span className="text-[10px] text-slate-500 hidden lg:inline">
                      • {currentUser.department}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Notification Bell */}
            {hasPermission('canApproveLeaves') && (
              <button
                onClick={() => setActiveModule('leaves')}
                className="relative p-2.5 rounded-2xl border border-slate-200/90 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                title="დასადასტურებელი მოთხოვნები"
              >
                <Bell className="w-4 h-4" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-slate-200/90 hover:border-rose-300 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold transition cursor-pointer"
              title="სისტემიდან გასვლა"
            >
              <LogOut className="w-4 h-4 text-slate-500 hover:text-rose-600" />
              <span>გასვლა</span>
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-[1600px] w-full mx-auto space-y-6">
          {viewDevice === 'mobile' ? <MobileAppFrame /> : children}
        </main>
      </div>

      {/* Floating AI Chat Assistant */}
      <FloatingAiChat />

      {/* Live Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-bottom-4"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-white">{t.title}</div>
              {t.description && <div className="text-slate-300 mt-0.5">{t.description}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
