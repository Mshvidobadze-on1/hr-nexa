'use client';

import React, { useState } from 'react';
import { useHR } from '@/context/HRContext';
import { LeaveType } from '@/types/hr';
import {
  Palmtree,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  ArrowRight,
  ShieldCheck,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';

export function LeavesModule() {
  const {
    employees,
    leaveRequests,
    submitLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    currentUser,
    hasPermission,
  } = useHR();

  const [subTab, setSubTab] = useState<'requests' | 'calendar' | 'balances'>('requests');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(currentUser?.employeeId || employees[3]?.id || 'emp-4');
  const [leaveType, setLeaveType] = useState<LeaveType>('ანაზღაურებადი შვებულება');
  const [startDate, setStartDate] = useState('2026-11-16');
  const [endDate, setEndDate] = useState('2026-11-20');
  const [workingDays, setWorkingDays] = useState(5);
  const [reason, setReason] = useState('');

  const pendingRequests = leaveRequests.filter(
    (r) => r.status === 'მენეჯერის დასტურის მოლოდინში' || r.status === 'HR-ის დასტურის მოლოდინში'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLeaveRequest({
      employeeId: currentUser?.employeeId || selectedEmpId,
      leaveType,
      startDate,
      endDate,
      workingDays,
      reason: reason || 'ყოველწლიური კუთვნილი შვებულება',
    });
    setShowRequestModal(false);
    setReason('');
  };

  const setDurationPreset = (daysCount: number) => {
    setWorkingDays(daysCount);
    // Auto calculate endDate
    const start = new Date(startDate || '2026-11-16');
    start.setDate(start.getDate() + (daysCount <= 5 ? daysCount - 1 : daysCount + 1));
    const y = start.getFullYear();
    const m = String(start.getMonth() + 1).padStart(2, '0');
    const d = String(start.getDate()).padStart(2, '0');
    setEndDate(`${y}-${m}-${d}`);
  };

  const overlaps: { dept: string; names: string[]; dates: string }[] = [
    {
      dept: 'გაყიდვები და მარკეტინგი',
      names: ['ანა ჩხეიძე', 'ირაკლი ლომიძე'],
      dates: '6 ნოემბერი — 9 ნოემბერი (მომიჯნავე შვებულებები)',
    },
  ];

  const daysNov = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Palmtree className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              შვებულებებისა და გაცდენების მართვა
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            საქართველოს შრომის კოდექსით განსაზღვრული 24 სამუშაო დღე • 3-ეტაპიანი დამტკიცების პროცესი
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setSubTab('requests')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                subTab === 'requests'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>განაცხადები</span>
              {pendingRequests.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center">
                  {pendingRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setSubTab('calendar')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                subTab === 'calendar'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>გუნდის კალენდარი</span>
            </button>
            <button
              onClick={() => setSubTab('balances')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                subTab === 'balances'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>ბალანსების რეესტრი</span>
            </button>
          </div>

          {hasPermission('canRequestLeave') && (
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950/40 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ შვებულების მოთხოვნა</span>
            </button>
          )}
        </div>
      </div>

      {/* Quota Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            ანაზღაურებადი (კანონით)
          </div>
          <div className="text-2xl font-black text-indigo-700 mt-1">24 სამუშაო დღე</div>
          <div className="text-[11px] text-slate-500 mt-1">შრომის კოდექსი მუხლი 31</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            უხელფასო შვებულება
          </div>
          <div className="text-2xl font-black text-amber-700 mt-1">≥ 15 კალენდარული დღე</div>
          <div className="text-[11px] text-slate-500 mt-1">წინასწარი 14-დღიანი შეტყობინებით</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            საავადმყოფო ბიულეტენი
          </div>
          <div className="text-2xl font-black text-rose-700 mt-1">40 დღე ზედიზედ</div>
          <div className="text-[11px] text-slate-500 mt-1">სამედიცინო ცნობის საფუძველზე</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            დეკრეტული შვებულება
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">126 დღე ანაზღაურებადი</div>
          <div className="text-[11px] text-slate-500 mt-1">სულ 730 დღემდე კვოტა</div>
        </div>
      </div>

      {/* SUBTAB 1: Leave Requests & Approval Queue */}
      {subTab === 'requests' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-sm text-slate-900">
                შვებულების განაცხადები და დამტკიცების რიგი
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              თქვენი როლი:{' '}
              <strong className="text-indigo-700">
                {currentUser?.role === 'SUPER_ADMIN'
                  ? 'სისტემური ადმინისტრატორი'
                  : currentUser?.role === 'HR_ADMIN'
                  ? 'HR მენეჯერი'
                  : currentUser?.role === 'LINE_MANAGER'
                  ? 'დეპარტამენტის ხელმძღვანელი'
                  : 'თანამშრომელი'}
              </strong>
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {leaveRequests.map((req) => {
              const emp = employees.find((e) => e.id === req.employeeId);
              if (!emp) return null;
              const isPending =
                req.status === 'მენეჯერის დასტურის მოლოდინში' ||
                req.status === 'HR-ის დასტურის მოლოდინში';

              return (
                <div
                  key={req.id}
                  className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50/70 transition"
                >
                  <div className="flex items-center gap-3.5 min-w-[240px]">
                    <div
                      className={`w-11 h-11 rounded-2xl ${emp.avatarColor} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm`}
                    >
                      {emp.firstName[0]}
                      {emp.lastName[0]}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">
                        {emp.firstName} {emp.lastName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {emp.position} • {emp.department}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="font-bold text-indigo-700">{req.leaveType}</div>
                    <div className="text-slate-700 font-semibold flex items-center gap-1.5">
                      <span>{req.startDate}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.endDate}</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded-lg text-slate-600 font-bold">
                        {req.workingDays} სამუშაო დღე
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">მიზეზი: {req.reason}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        req.status === 'დამტკიცებული'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : req.status === 'უარყოფილი'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  {/* Action Buttons for Approver */}
                  {hasPermission('canApproveLeaves') && isPending && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => approveLeaveRequest(req.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {currentUser?.role === 'LINE_MANAGER' && req.status === 'მენეჯერის დასტურის მოლოდინში'
                            ? 'მენეჯერის დასტური'
                            : 'დამტკიცება (+ტაბელი)'}
                        </span>
                      </button>
                      <button
                        onClick={() => rejectLeaveRequest(req.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>უარყოფა</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: Team Leave Calendar */}
      {subTab === 'calendar' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-base text-slate-900 tracking-tight">
                გუნდის შვებულებების კალენდარი (ნოემბერი 2026)
              </h3>
              <p className="text-xs text-slate-500">
                დეპარტამენტის შიგნით გადაფარვების ვიზუალური კონტროლი
              </p>
            </div>

            {overlaps.map((o, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>ყურადღება ({o.dept}):</strong> {o.names.join(' და ')} — {o.dates}
                </span>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full border-collapse text-xs text-center">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                  <th className="py-2.5 px-3 text-left min-w-[200px] font-bold">თანამშრომელი / დეპარტამენტი</th>
                  {daysNov.map((d) => (
                    <th
                      key={d}
                      className={`py-2 px-1 min-w-[28px] border-l border-slate-200 text-[11px] ${
                        d === 23 ? 'bg-fuchsia-100 text-fuchsia-800 font-bold' : ''
                      }`}
                    >
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.slice(0, 8).map((emp) => {
                  const empLeaves = leaveRequests.filter(
                    (r) => r.employeeId === emp.id && r.status !== 'უარყოფილი'
                  );
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50 transition">
                      <td className="py-2 px-3 text-left font-medium text-slate-900">
                        <div className="font-bold text-xs">
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div className="text-[10px] text-slate-500">{emp.department}</div>
                      </td>
                      {daysNov.map((d) => {
                        const activeReq = empLeaves.find((r) => {
                          const s = parseInt(r.startDate.split('-')[2] || '0', 10);
                          const e = parseInt(r.endDate.split('-')[2] || '0', 10);
                          return d >= s && d <= e;
                        });
                        return (
                          <td key={d} className="p-0.5 border-l border-slate-100">
                            {activeReq ? (
                              <div
                                className={`h-6 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                                  activeReq.status === 'დამტკიცებული'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-amber-300 text-amber-950'
                                }`}
                                title={`${activeReq.leaveType} (${activeReq.status})`}
                              >
                                შ
                              </div>
                            ) : d === 23 ? (
                              <div className="h-6 rounded-lg bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center text-[9px] font-bold">
                                უქმე
                              </div>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: Balances Registry */}
      {subTab === 'balances' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-bold text-sm text-slate-900">
              შვებულებების ბალანსის რეესტრი (Leave Balance Engine)
            </h3>
            <p className="text-xs text-slate-500">
              წლიური კვოტა (24 სამუშაო დღე), გამოყენებული და დარჩენილი ბალანსი
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3 px-4">თანამშრომელი</th>
                  <th className="py-3 px-4">დეპარტამენტი</th>
                  <th className="py-3 px-4">წლიური კვოტა</th>
                  <th className="py-3 px-4">დაგროვილი</th>
                  <th className="py-3 px-4">გამოყენებული</th>
                  <th className="py-3 px-4">უხელფასო</th>
                  <th className="py-3 px-4">ბიულეტენი</th>
                  <th className="py-3 px-4">დარჩენილი ბალანსი</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => {
                  const remaining = emp.paidLeaveQuota - emp.usedPaidLeaveDays;
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {emp.firstName} {emp.lastName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{emp.department}</td>
                      <td className="py-3 px-4 font-semibold">{emp.paidLeaveQuota} დღე</td>
                      <td className="py-3 px-4 text-indigo-700 font-semibold">
                        {emp.accruedLeaveDays} დღე
                      </td>
                      <td className="py-3 px-4 text-amber-700 font-semibold">
                        {emp.usedPaidLeaveDays} დღე
                      </td>
                      <td className="py-3 px-4 text-slate-600">{emp.usedUnpaidLeaveDays} დღე</td>
                      <td className="py-3 px-4 text-rose-600 font-medium">
                        {emp.usedSickLeaveDays} დღე
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                          {remaining} დღე დარჩენილი
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave Request Modal with Quick Presets */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in duration-150">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palmtree className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm">ახალი შვებულების მოთხოვნა</h3>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-1 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {currentUser?.role !== 'EMPLOYEE' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">თანამშრომელი</label>
                  <select
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl border border-slate-300 bg-white"
                  >
                    {employees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.firstName} {e.lastName} — {e.department} (ბალანსი:{' '}
                        {e.paidLeaveQuota - e.usedPaidLeaveDays} დღე)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">შვებულების ტიპი</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-2 rounded-2xl border border-slate-300 bg-white"
                >
                  <option value="ანაზღაურებადი შვებულება">
                    ანაზღაურებადი შვებულება (24 სამუშაო დღის კვოტიდან)
                  </option>
                  <option value="ანაზღაურების გარეშე">ანაზღაურების გარეშე (უხელფასო)</option>
                  <option value="საავადმყოფო ფურცელი / ბიულეტენი">
                    საავადმყოფო ფურცელი / ბიულეტენი
                  </option>
                  <option value="დეკრეტული შვებულება">დეკრეტული შვებულება</option>
                </select>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  სწრაფი ხანგრძლივობა (Presets):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: '1 დღე', days: 1 },
                    { label: '3 დღე', days: 3 },
                    { label: '5 დღე (1 კვირა)', days: 5 },
                    { label: '10 დღე', days: 10 },
                  ].map((p) => (
                    <button
                      key={p.days}
                      type="button"
                      onClick={() => setDurationPreset(p.days)}
                      className={`py-1.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                        workingDays === p.days
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">დაწყება</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-2xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">დასრულება</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-2xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">სამუშაო დღეები</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={workingDays}
                    onChange={(e) => setWorkingDays(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-2xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">კომენტარი / მიზეზი</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="მაგ: ოჯახური მოგზაურობა..."
                  className="w-full px-3 py-2 rounded-2xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 rounded-2xl border border-slate-300 text-slate-700 cursor-pointer"
                >
                  გაუქმება
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow cursor-pointer"
                >
                  განაცხადის გაგზავნა
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
