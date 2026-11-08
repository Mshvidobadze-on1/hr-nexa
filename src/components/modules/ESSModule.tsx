'use client';

import React, { useState } from 'react';
import { useHR } from '@/context/HRContext';
import {
  calculateEmployeeMonthlyPayroll,
  formatGEL,
  summarizeEmployeeTimesheet,
} from '@/lib/payroll';
import { LeaveType } from '@/types/hr';
import { DocumentPrintModal, OfficialDocType } from '@/components/modals/DocumentPrintModal';
import { WorkTrackerCircleWidget } from '@/components/widgets/WorkTrackerCircleWidget';
import {
  UserCircle,
  Clock,
  Palmtree,
  Receipt,
  FileText,
  Plus,
  Printer,
  Wifi,
  CheckCircle2,
  X,
  Lock,
  Calendar,
  Sparkles,
  CreditCard,
  Building,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export function ESSModule() {
  const {
    employees,
    timesheet,
    clockedInSession,
    toggleClockInOut,
    submitLeaveRequest,
    documentRequests,
    requestDocument,
    currentUser,
    hasPermission,
  } = useHR();

  const [selectedDemoId, setSelectedDemoId] = useState<string>(
    currentUser?.employeeId || employees[3]?.id || 'emp-4'
  );

  const currentEmp =
    (currentUser?.role === 'SUPER_ADMIN'
      ? employees.find((e) => e.id === selectedDemoId)
      : employees.find((e) => e.id === currentUser?.employeeId)) ||
    employees[3] ||
    employees[0];

  const empTimesheet = timesheet[currentEmp.id] || {};
  const summary = summarizeEmployeeTimesheet(empTimesheet);
  const currentPayroll = calculateEmployeeMonthlyPayroll(currentEmp, summary);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType>('ანაზღაურებადი შვებულება');
  const [startDate, setStartDate] = useState('2026-11-24');
  const [endDate, setEndDate] = useState('2026-11-27');
  const [workingDays, setWorkingDays] = useState(4);
  const [reason, setReason] = useState('');

  // Document Request State
  const [docLang, setDocLang] = useState<'ქართული (KA)' | 'ინგლისური (EN)'>('ქართული (KA)');
  const [docDestination, setDocDestination] = useState('თიბისი ბანკი (სესხისთვის)');
  const [previewDoc, setPreviewDoc] = useState<{
    type: OfficialDocType;
    dest: string;
  } | null>(null);

  const remainingLeave = currentEmp.paidLeaveQuota - currentEmp.usedPaidLeaveDays;

  const formatTimer = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(
      2,
      '0'
    )}`;
  };

  const handleQuickDuration = (days: number) => {
    setWorkingDays(days);
    const start = new Date(startDate || '2026-11-24');
    const end = new Date(start);
    end.setDate(start.getDate() + (days <= 5 ? days : days + 2) - 1);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLeaveRequest({
      employeeId: currentEmp.id,
      leaveType,
      startDate,
      endDate,
      workingDays,
      reason: reason || 'პირადი განცხადება ArgoHR პორტალიდან',
    });
    setShowLeaveModal(false);
    setReason('');
  };

  const handleDocRequest = (e: React.FormEvent) => {
    e.preventDefault();
    requestDocument({
      employeeId: currentEmp.id,
      documentType: 'ცნობა სამსახურიდან (ხელფასით)',
      language: docLang,
      destination: docDestination,
    });
  };

  const myDocs = documentRequests.filter((d) => d.employeeId === currentEmp.id);

  return (
    <div className="space-y-6">
      {/* Friendly Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 lg:p-7 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border border-indigo-900/40">
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-2xl ${currentEmp.avatarColor} text-white font-black text-2xl flex items-center justify-center shadow-lg ring-4 ring-white/10`}
          >
            {currentEmp.firstName[0]}
            {currentEmp.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>თანამშრომლის პირადი სივრცე (HR NEXA ESS)</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold mt-1">
              გამარჯობა, {currentEmp.firstName}! 👋
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              {currentEmp.position} • {currentEmp.department} • პირადი ნომერი: {currentEmp.personalId}
            </p>
          </div>
        </div>

        {/* Profile Switcher (Only visible to Super Admin for quick testing) */}
        {currentUser?.role === 'SUPER_ADMIN' && (
          <div className="flex items-center gap-2.5 bg-white/10 p-2 rounded-2xl border border-white/15 text-xs">
            <span className="text-slate-300 font-semibold pl-1">ადმინ ტესტი:</span>
            <select
              value={selectedDemoId}
              onChange={(e) => setSelectedDemoId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold border border-slate-700 focus:outline-none"
            >
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.firstName} {e.lastName} ({e.position})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Hero Circular Work Tracker Button */}
      {hasPermission('canClockInOut') && <WorkTrackerCircleWidget />}

      {/* Top Grid: Leave Balance & Quick Request Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Leave Balance & Quick Request Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Palmtree className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-slate-900">ჩემი შვებულების ბალანსი</h2>
                <p className="text-xs text-slate-500">
                  საქართველოს შრომის კოდექსით: წელიწადში 24 სამუშაო დღე
                </p>
              </div>
            </div>

            {hasPermission('canRequestLeave') && (
              <button
                onClick={() => setShowLeaveModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition transform active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                + შვებულების მოთხოვნა
              </button>
            )}
          </div>

          {/* 3 Metric Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
              <div className="text-xs font-bold text-emerald-900">დაგრჩათ გამოსაყენებელი</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {remainingLeave} / {currentEmp.paidLeaveQuota} დღე
              </div>
              <div className="text-[11px] text-emerald-600 mt-0.5">სრულად ანაზღაურებადი</div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80">
              <div className="text-xs font-bold text-indigo-900">გამოყენებული 2026 წელს</div>
              <div className="text-2xl font-black text-indigo-700 mt-1">
                {currentEmp.usedPaidLeaveDays} დღე
              </div>
              <div className="text-[11px] text-indigo-600 mt-0.5">
                დაგროვილი: {currentEmp.accruedLeaveDays} დღე
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-xs font-bold text-slate-700">ბიულეტენი / უხელფასო</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {currentEmp.usedSickLeaveDays} / {currentEmp.usedUnpaidLeaveDays} დღე
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">სამედიცინო ცნობით</div>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">წლიური კვოტის ათვისება</span>
              <span className="text-emerald-700 font-bold">
                {Math.round((remainingLeave / currentEmp.paidLeaveQuota) * 100)}% ხელმისაწვდომია
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-teal-500 to-emerald-500 transition-all duration-500"
                style={{
                  width: `${Math.round((remainingLeave / currentEmp.paidLeaveQuota) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Payslip Receipts + 1-Click Official Certificate Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payslips Receipts */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">ჩემი სახელფასო ფურცლები</h3>
                <p className="text-xs text-slate-500">
                  ანგარიში: {currentEmp.iban} ({currentEmp.bankName})
                </p>
              </div>
            </div>
          </div>

          {hasPermission('canViewPayslip') ? (
            <div className="space-y-3">
              {[
                {
                  month: 'ნოემბერი 2026 (მიმდინარე)',
                  gross: currentPayroll.totalAccruedGross,
                  pension: currentPayroll.employeePension,
                  tax: currentPayroll.incomeTax,
                  net: currentPayroll.finalNetSalary,
                  status: 'დარიცხულია',
                  active: true,
                },
                {
                  month: 'ოქტომბერი 2026',
                  gross: currentEmp.grossSalary,
                  pension: +(currentEmp.grossSalary * 0.02).toFixed(2),
                  tax: +(currentEmp.grossSalary * 0.98 * 0.2).toFixed(2),
                  net: +(currentEmp.grossSalary * 0.784).toFixed(2),
                  status: 'ჩარიცხულია',
                  active: false,
                },
                {
                  month: 'სექტემბერი 2026',
                  gross: currentEmp.grossSalary,
                  pension: +(currentEmp.grossSalary * 0.02).toFixed(2),
                  tax: +(currentEmp.grossSalary * 0.98 * 0.2).toFixed(2),
                  net: +(currentEmp.grossSalary * 0.784).toFixed(2),
                  status: 'ჩარიცხულია',
                  active: false,
                },
              ].map((p, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition flex flex-wrap items-center justify-between gap-3 ${
                    p.active
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{p.month}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      დარიცხული: <strong>{formatGEL(p.gross)}</strong> • საპენსიო:{' '}
                      {formatGEL(p.pension)} • საშემოსავლო: {formatGEL(p.tax)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-black text-emerald-700 text-base">
                        {formatGEL(p.net)}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {p.status}
                      </span>
                    </div>

                    <button
                      onClick={() => window.print()}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-indigo-50 text-indigo-600 transition shadow-sm cursor-pointer"
                      title="ქვითრის ამობეჭდვა"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2">
              <Lock className="w-6 h-6 text-slate-300" />
              <span>სახელფასო ფურცლების ნახვა შეზღუდულია ადმინისტრატორის მიერ</span>
            </div>
          )}
        </div>

        {/* 1-Click Official Certificate Generator */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                ოფიციალური ცნობის მოთხოვნა
              </h3>
              <p className="text-xs text-slate-500">
                ცნობა სამსახურისა და ხელფასის შესახებ ბანკებისთვის ან საელჩოებისთვის
              </p>
            </div>
          </div>

          {hasPermission('canGenerateOrders') ? (
            <div className="space-y-4">
              <form
                onSubmit={handleDocRequest}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3.5 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">დოკუმენტის ენა:</label>
                    <select
                      value={docLang}
                      onChange={(e) => setDocLang(e.target.value as typeof docLang)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="ქართული (KA)">ქართული (KA) — ბანკებისთვის</option>
                      <option value="ინგლისური (EN)">ინგლისური (EN) — საელჩოსთვის</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      წარსადგენი დაწესებულება:
                    </label>
                    <input
                      type="text"
                      value={docDestination}
                      onChange={(e) => setDocDestination(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Destination Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[11px] text-slate-400 font-medium">სწრაფი არჩევანი:</span>
                  {[
                    'თიბისი ბანკი',
                    'საქართველოს ბანკი',
                    'აშშ საელჩოს საკონსულო',
                    'შენგენის საკონსულო',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDocDestination(preset)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-indigo-50 text-[11px] text-slate-700 font-semibold cursor-pointer transition"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/20 transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  ოფიციალური ცნობის მყისიერი გენერაცია
                </button>
              </form>

              {/* Generated Docs List */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  ჩემი გაცემული ცნობები:
                </div>
                {myDocs.map((d) => (
                  <div
                    key={d.id}
                    className="p-3.5 rounded-2xl border border-slate-200/80 bg-white flex items-center justify-between gap-3 shadow-xs hover:border-indigo-300 transition"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {d.documentType} ({d.language})
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        ორგანიზაცია: <strong>{d.destination}</strong> • {d.requestedAt}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setPreviewDoc({
                          type:
                            d.language === 'ინგლისური (EN)'
                              ? 'ცნობა სამსახურიდან (EN)'
                              : 'ცნობა სამსახურიდან (KA)',
                          dest: d.destination,
                        })
                      }
                      className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      გახსნა / PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2">
              <Lock className="w-6 h-6 text-slate-300" />
              <span>ცნობების გენერირება შეზღუდულია ადმინისტრატორის მიერ</span>
            </div>
          )}
        </div>
      </div>

      {/* Leave Request Modal with Friendly Duration Presets */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palmtree className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">შვებულების მოთხოვნის გაფორმება</h3>
              </div>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">შვებულების ტიპი:</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ანაზღაურებადი შვებულება">
                    ანაზღაურებადი შვებულება (დაგრჩათ {remainingLeave} დღე)
                  </option>
                  <option value="ანაზღაურების გარეშე">ანაზღაურების გარეშე</option>
                  <option value="საავადმყოფო ფურცელი / ბიულეტენი">
                    საავადმყოფო ფურცელი (ბიულეტენი)
                  </option>
                </select>
              </div>

              {/* Duration Presets */}
              <div>
                <div className="font-bold text-slate-700 mb-1.5">სწრაფი პერიოდის არჩევა:</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: '1 დღე', days: 1 },
                    { label: '3 დღე', days: 3 },
                    { label: '5 დღე', days: 5 },
                    { label: '10 დღე', days: 10 },
                  ].map((p) => (
                    <button
                      key={p.days}
                      type="button"
                      onClick={() => handleQuickDuration(p.days)}
                      className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
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

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">დაწყება:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">დასრულება:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">სამუშაო დღე:</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={workingDays}
                    onChange={(e) => setWorkingDays(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-black text-center text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">კომენტარი / მიზეზი:</label>
                <textarea
                  rows={2}
                  placeholder="მაგ: წლიური კუთვნილი შვებულება ოჯახური მოგზაურობისთვის..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  გაუქმება
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/20 cursor-pointer transition transform active:scale-95"
                >
                  განაცხადის გაგზავნა
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewDoc && (
        <DocumentPrintModal
          employee={currentEmp}
          docType={previewDoc.type}
          destination={previewDoc.dest}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </div>
  );
}
