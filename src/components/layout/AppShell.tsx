'use client';

import React, { useState } from 'react';
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
  Menu,
  X,
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCount = leaveRequests.filter(
    (r) =>
      r.status === 'მენეჯერის დასტურის მოლოდინში' || r.status === 'HR-ის დასტურის მოლოდინში'
  ).length;

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isHrAdmin = currentUser?.role === 'HR_ADMIN';
  const isLineManager = currentUser?.role === 'LINE_MANAGER';

  interface NavItem {
    id: ModuleId;
    label: string;
    subtitle: string;
    icon: any;
    visible: boolean;
    badge?: number;
  }

  const navItems: NavItem[] = [
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

  const renderNavLinks = (isMobile = false) => (
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
            onClick={() => {
              setActiveModule(item.id);
              if (isMobile) setMobileMenuOpen(false);
            }}
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
                <div className="font-bold text-xs truncate">{item.label}</div>
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
              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-sm">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* 1. Desktop Permanent Sidebar (Hidden on < lg) */}
      <aside className="hidden lg:flex w-72 bg-slate-950 text-slate-100 flex-col shrink-0 border-r border-slate-800/90 shadow-2xl z-20">
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
        {renderNavLinks(false)}

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>შპს „ეიჩარ ნექსა“</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            v3.2
          </span>
        </div>
      </aside>

      {/* 2. Mobile Drawer Backdrop & Drawer (Visible on < lg when opened) */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-slate-950 text-slate-100 flex flex-col shadow-2xl border-r border-slate-800/90 lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-emerald-400 flex items-center justify-center text-white font-black text-lg">
              N
            </div>
            <div>
              <span className="font-black text-base text-white">HR NEXA</span>
              <p className="text-[10px] text-slate-400">პორტალის მენიუ</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Links */}
        {renderNavLinks(true)}

        {/* Drawer Footer Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs transition"
          >
            <LogOut className="w-4 h-4" />
            <span>სისტემიდან გასვლა</span>
          </button>
        </div>
      </aside>

      {/* 3. Main Viewport Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3.5 sm:px-6 lg:px-8 py-3 sticky top-0 z-30 flex items-center justify-between gap-3 shadow-xs">
          {/* Left: Mobile Hamburger & Current Page Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer shrink-0"
              title="მენიუ"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate flex items-center gap-2">
                {activeItem?.label || 'მთავარი დაფა'}
              </h2>
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>საანგარიშო პერიოდი:</span>
                <strong className="text-slate-800">ნოემბერი 2026</strong>
              </div>
            </div>
          </div>

          {/* Right Tools: Switcher, User Pill, Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop / Mobile App Switcher (hidden on mobile) */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setViewDevice('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  viewDevice === 'desktop'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Web (Desktop)</span>
              </button>
              <button
                onClick={() => setViewDevice('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  viewDevice === 'mobile'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile App</span>
              </button>
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 bg-slate-50 border border-slate-200/90 rounded-2xl">
              <div
                className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-bold text-white flex items-center justify-center text-xs shadow-sm ${
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
              <div className="text-left hidden sm:block">
                <div className="font-bold text-xs text-slate-900 leading-tight truncate max-w-[130px]">
                  {currentUser?.fullName}
                </div>
                <div className="text-[10px] text-slate-500 font-medium truncate max-w-[130px]">
                  {isSuperAdmin
                    ? 'System Owner'
                    : isHrAdmin
                    ? 'HR Manager'
                    : isLineManager
                    ? 'Line Manager'
                    : 'Employee'}
                </div>
              </div>
            </div>

            {/* Notification Bell */}
            {hasPermission('canApproveLeaves') && (
              <button
                onClick={() => setActiveModule('leaves')}
                className="relative p-2 sm:p-2.5 rounded-2xl border border-slate-200/90 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
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
              className="flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-2xl border border-slate-200/90 hover:border-rose-300 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold transition cursor-pointer"
              title="სისტემიდან გასვლა"
            >
              <LogOut className="w-4 h-4 text-slate-500 hover:text-rose-600" />
              <span className="hidden sm:inline">გასვლა</span>
            </button>
          </div>
        </header>

        {/* Page Body: pb-24 on mobile ensures bottom nav never covers content */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-5 sm:space-y-6 pb-24 lg:pb-8">
          {viewDevice === 'mobile' ? <MobileAppFrame /> : children}
        </main>
      </div>

      {/* 4. Mobile Bottom Navigation Bar (Visible only on < lg) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 lg:hidden flex items-center justify-around px-1 py-2 text-slate-400 shadow-2xl">
        <button
          onClick={() => setActiveModule('dashboard')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${
            activeModule === 'dashboard' ? 'text-indigo-400 font-black' : 'hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">მთავარი</span>
        </button>

        <button
          onClick={() => setActiveModule('social-feed')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${
            activeModule === 'social-feed' ? 'text-indigo-400 font-black' : 'hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">კედელი</span>
        </button>

        <button
          onClick={() => setActiveModule('leaves')}
          className={`relative flex flex-col items-center gap-1 transition cursor-pointer ${
            activeModule === 'leaves' ? 'text-indigo-400 font-black' : 'hover:text-slate-200'
          }`}
        >
          <Palmtree className="w-5 h-5" />
          <span className="text-[10px]">შვებულება</span>
          {pendingCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveModule('ess')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${
            activeModule === 'ess' ? 'text-indigo-400 font-black' : 'hover:text-slate-200'
          }`}
        >
          <UserCircle className="w-5 h-5" />
          <span className="text-[10px]">კაბინეტი</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px]">მენიუ</span>
        </button>
      </nav>

      {/* Floating AI Chat Assistant */}
      <FloatingAiChat />

      {/* Live Toast Notifications */}
      <div className="fixed bottom-20 sm:bottom-5 right-3.5 sm:right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-bottom-4"
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
