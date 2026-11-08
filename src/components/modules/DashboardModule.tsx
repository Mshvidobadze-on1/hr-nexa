'use client';

import React, { useState } from 'react';
import { useHR } from '@/context/HRContext';
import {
  calculateEmployeeMonthlyPayroll,
  formatGEL,
  summarizeEmployeeTimesheet,
} from '@/lib/payroll';
import { AddEmployeeModal } from '@/components/modals/AddEmployeeModal';
import { EmployeeDossierModal } from '@/components/modals/EmployeeDossierModal';
import { WorkTrackerCircleWidget } from '@/components/widgets/WorkTrackerCircleWidget';
import { Employee } from '@/types/hr';
import {
  Users,
  Palmtree,
  Clock,
  Wallet,
  UserPlus,
  CalendarCheck2,
  CheckCircle2,
  Cake,
  Sparkles,
  TrendingDown,
  MapPin,
  ArrowUpRight,
  AlertCircle,
  Search,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export function DashboardModule() {
  const {
    employees,
    timesheet,
    leaveRequests,
    regenerateTimesheet,
    approveLeaveRequest,
    setActiveModule,
    currentUser,
    hasPermission,
  } = useHR();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [attendanceSearch, setAttendanceSearch] = useState('');

  const visibleEmployees =
    currentUser?.role === 'LINE_MANAGER' && currentUser.department
      ? employees.filter((e) => e.department === currentUser.department)
      : employees;

  const activeEmployeesCount = visibleEmployees.filter((e) => e.status === 'აქტიური').length;
  const onLeaveTodayCount = visibleEmployees.filter(
    (e) => e.status === 'შვებულებაში' || e.status === 'ბიულეტენზე'
  ).length;
  const pendingApprovals = leaveRequests.filter(
    (r) =>
      r.status === 'მენეჯერის დასტურის მოლოდინში' || r.status === 'HR-ის დასტურის მოლოდინში'
  );

  const totalPayrollBudget = visibleEmployees.reduce((sum, emp) => {
    const summary = summarizeEmployeeTimesheet(timesheet[emp.id] || {});
    const p = calculateEmployeeMonthlyPayroll(emp, summary);
    return sum + p.totalAccruedGross;
  }, 0);

  const deptCounts = [
    {
      name: 'IT დეპარტამენტი',
      count: employees.filter((e) => e.department === 'IT დეპარტამენტი').length,
      color: 'bg-indigo-600',
    },
    {
      name: 'ფინანსები და ბუღალტერია',
      count: employees.filter((e) => e.department === 'ფინანსები და ბუღალტერია').length,
      color: 'bg-blue-500',
    },
    {
      name: 'გაყიდვები და მარკეტინგი',
      count: employees.filter((e) => e.department === 'გაყიდვები და მარკეტინგი').length,
      color: 'bg-emerald-500',
    },
    {
      name: 'HR და ადმინისტრაცია',
      count: employees.filter((e) => e.department === 'HR და ადმინისტრაცია').length,
      color: 'bg-amber-500',
    },
  ];

  const celebrations = [
    {
      id: 'cel-1',
      name: 'დავით მაისურაძე',
      position: 'ფინანსური დირექტორი (CFO)',
      type: 'სამუშაო იუბილე (6 წელი)',
      date: '3 ნოემბერი',
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'cel-2',
      name: 'ანა ჩხეიძე',
      position: 'ციფრული მარკეტინგის მენეჯერი',
      type: 'სამუშაო იუბილე (4 წელი)',
      date: '3 ნოემბერი',
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'cel-3',
      name: 'გიორგი ბერიძე',
      position: 'IT დეპარტამენტის ხელმძღვანელი',
      type: 'დაბადების დღე 🎂',
      date: '8 ნოემბერი',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'cel-4',
      name: 'ნინო კაპანაძე',
      position: 'HR დირექტორი',
      type: 'დაბადების დღე 🎂',
      date: '14 ნოემბერი',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'cel-5',
      name: 'მარიამ გოგოლაძე',
      position: 'HR და Payroll სპეციალისტი',
      type: 'დაბადების დღე 🎂',
      date: '19 ნოემბერი',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
  ];

  const filteredAttendance = visibleEmployees.filter((emp) => {
    const q = attendanceSearch.toLowerCase().trim();
    return (
      !q ||
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(q) ||
      emp.position.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Hero Circular Work Tracker Button */}
      <WorkTrackerCircleWidget />

      {/* Friendly Top Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HR NEXA • {currentUser?.role === 'LINE_MANAGER' ? `${currentUser.department || 'დეპარტამენტი'}` : 'კომპანიის სათავო მართვა'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              გამარჯობა, {currentUser?.fullName?.split(' ')[0] || 'ადმინისტრატორო'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              დღეს არის 5 ნოემბერი, 2026 წელი. ყველა ძირითადი ინდიკატორი ნორმაშია — ტაბელი, შვებულებები და სახელფასო უწყისი სრულად სინქრონიზებულია.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {hasPermission('canManageEmployees') && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/50 transition cursor-pointer active:scale-98"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ თანამშრომლის დამატება</span>
              </button>
            )}
            {hasPermission('canManageTimesheet') && (
              <button
                onClick={() => {
                  regenerateTimesheet();
                  setActiveModule('timesheet');
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 transition cursor-pointer active:scale-98"
              >
                <CalendarCheck2 className="w-4 h-4" />
                <span>ტაბელის გენერაცია</span>
              </button>
            )}
            {hasPermission('canApproveLeaves') && (
              <button
                onClick={() => {
                  if (pendingApprovals.length > 0) {
                    approveLeaveRequest(pendingApprovals[0].id);
                  } else {
                    setActiveModule('leaves');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition cursor-pointer active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>შვებულების დასტური ({pendingApprovals.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Clean, Beautiful KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        <div
          onClick={() => setActiveModule('employees')}
          className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              აქტიური თანამშრომლები
            </span>
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {activeEmployeesCount}{' '}
              <span className="text-xs font-normal text-slate-400">/ {visibleEmployees.length} სულ</span>
            </div>
            <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>92% გამოცხადების ინდექსი</span>
            </div>
          </div>
        </div>

        <div
          onClick={() => setActiveModule('leaves')}
          className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              დღეს შვებულებაში
            </span>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
              <Palmtree className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {onLeaveTodayCount}{' '}
              <span className="text-xs font-normal text-slate-400">თანამშრომელი</span>
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              1 კუთვნილ შვებულებაში • 1 ბიულეტენზე
            </div>
          </div>
        </div>

        <div
          onClick={() => setActiveModule('leaves')}
          className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              დასადასტურებელი
            </span>
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {pendingApprovals.length}{' '}
              <span className="text-xs font-normal text-slate-400">განაცხადი</span>
            </div>
            <div className="text-xs text-rose-600 font-bold mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>ელოდება დასტურს</span>
            </div>
          </div>
        </div>

        <div
          onClick={() => hasPermission('canManagePayroll') && setActiveModule('payroll')}
          className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              სახელფასო ფონდი
            </span>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {formatGEL(totalPayrollBudget)}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              დარიცხული Gross • ნოემბერი
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Attendance Live Feed + Birthdays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Live Feed */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-black text-base text-slate-900 tracking-tight">
                დასწრების ცოცხალი მონიტორინგი (დღეს)
              </h2>
              <p className="text-xs text-slate-500">
                თანამშრომელთა მოსვლის ფიქსაცია და დროული აღრიცხვა
              </p>
            </div>

            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={attendanceSearch}
                onChange={(e) => setAttendanceSearch(e.target.value)}
                placeholder="ძებნა სიაში..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[380px]">
            {filteredAttendance.map((emp) => (
              <div
                key={emp.id}
                onClick={() => setSelectedEmp(emp)}
                className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-indigo-50/30 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl ${emp.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition`}
                  >
                    {emp.firstName[0]}
                    {emp.lastName[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900 truncate">
                      {emp.firstName} {emp.lastName}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {emp.position} • {emp.department}
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{emp.todayLocation || emp.branch}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {emp.todayClockIn && (
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl">
                      {emp.todayClockIn}
                    </span>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                      emp.todayAttendanceStatus === 'დროულად'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : emp.todayAttendanceStatus === 'დაგვიანებით'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : emp.todayAttendanceStatus === 'შვებულებაში'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {emp.todayAttendanceStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Birthdays & Anniversaries Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Cake className="w-5 h-5 text-amber-500" />
              <h3 className="font-black text-sm text-slate-900 tracking-tight">
                დაბადების დღეები და იუბილეები
              </h3>
            </div>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              ნოემბერი
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[320px]">
            {celebrations.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-slate-100/60 transition"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900">{c.name}</div>
                  <div className="text-[11px] text-slate-500">{c.position}</div>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${c.badgeColor}`}
                  >
                    {c.type}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-xs">
                  {c.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Department Headcount Distribution */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-base text-slate-900 tracking-tight">
              პერსონალის განაწილება დეპარტამენტების მიხედვით
            </h3>
            <p className="text-xs text-slate-500">საშტატო ერთეულები და პროცენტული წილი ორგანიზაციაში</p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            სულ: {employees.length} საშტატო ერთეული
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {deptCounts.map((d) => {
            const pct = Math.round((d.count / employees.length) * 100);
            return (
              <div key={d.name} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{d.name}</span>
                  <span className="font-black text-indigo-700">{d.count} შტატი</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${d.color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500 font-medium text-right">{pct}% წილი</div>
              </div>
            );
          })}
        </div>
      </div>

      {showAddModal && <AddEmployeeModal onClose={() => setShowAddModal(false)} />}
      {selectedEmp && (
        <EmployeeDossierModal employee={selectedEmp} onClose={() => setSelectedEmp(null)} />
      )}
    </div>
  );
}
