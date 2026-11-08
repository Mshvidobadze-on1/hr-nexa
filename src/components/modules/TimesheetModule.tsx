'use client';

import React, { useState } from 'react';
import { useHR } from '@/context/HRContext';
import { TimesheetCode } from '@/types/hr';
import { summarizeEmployeeTimesheet } from '@/lib/payroll';
import { GEORGIAN_PUBLIC_HOLIDAYS } from '@/data/mockData';
import {
  CalendarClock,
  RefreshCw,
  Download,
  MapPin,
  Wifi,
  Clock,
  CheckCircle2,
  Sparkles,
  Search,
  Info,
  Calendar,
} from 'lucide-react';

const CODE_DEFINITIONS: {
  code: TimesheetCode;
  label: string;
  desc: string;
  badgeClass: string;
}[] = [
  {
    code: '8',
    label: '8 (სამუშაო)',
    desc: 'სტანდარტული 8 საათი',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    code: 'შ',
    label: 'შ (შვებულება)',
    desc: 'ანაზღაურებადი შვებულება',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  },
  {
    code: 'უ',
    label: 'უ (უხელფასო)',
    desc: 'უხელფასო შვებულება',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    code: 'ბ',
    label: 'ბ (ბიულეტენი)',
    desc: 'საავადმყოფო ფურცელი',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  {
    code: 'ზ',
    label: 'ზ (ზეგანაკვეთური)',
    desc: '8 სთ + 3 სთ ზეგანაკვეთური (125%)',
    badgeClass: 'bg-violet-100 text-violet-800 border-violet-300',
  },
  {
    code: 'ღ',
    label: 'ღ (ღამის ცვლა)',
    desc: 'ღამის ცვლის საათები (+25%)',
    badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-300',
  },
  {
    code: 'უქმე',
    label: 'უქმე (დღესასწაული)',
    desc: 'საქართველოს ოფიციალური უქმე დღე',
    badgeClass: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300',
  },
  {
    code: 'დ',
    label: 'დ (დასვენება)',
    desc: 'შაბათ-კვირა / დასვენება',
    badgeClass: 'bg-slate-100 text-slate-500 border-slate-200',
  },
];

export function TimesheetModule() {
  const {
    employees,
    timesheet,
    updateTimesheetCell,
    regenerateTimesheet,
    notify,
  } = useHR();

  const [selectedBrush, setSelectedBrush] = useState<TimesheetCode>('8');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [employeeSearch, setEmployeeSearch] = useState('');

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const filteredEmployees = employees.filter((e) => {
    const matchesDept = deptFilter === 'ALL' || e.department === deptFilter;
    const q = employeeSearch.toLowerCase().trim();
    const matchesSearch = !q || `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) || e.position.toLowerCase().includes(q);
    return matchesDept && matchesSearch;
  });

  const getCellStyle = (code: TimesheetCode) => {
    switch (code) {
      case '8':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-bold';
      case 'შ':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300 font-extrabold';
      case 'უ':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold';
      case 'ბ':
        return 'bg-rose-100 text-rose-900 border-rose-300 font-extrabold';
      case 'ზ':
        return 'bg-violet-100 text-violet-900 border-violet-300 font-extrabold';
      case 'ღ':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300 font-extrabold';
      case 'უქმე':
        return 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300 font-extrabold text-[9px]';
      default:
        return 'bg-slate-100/70 text-slate-400 border-slate-200 font-medium';
    }
  };

  const exportTimesheetCSV = () => {
    const header = [
      'თანამშრომელი',
      'პირადი ნომერი',
      'დეპარტამენტი',
      'გრაფიკი',
      ...days.map((d) => `${d} ნოე`),
      'ნამუშევარი დღე',
      'ნამუშევარი სთ',
      'ზეგანაკვეთური სთ',
      'ღამის სთ',
      'უქმე სთ',
      'გაცდენილი დღე',
    ];
    const rows = filteredEmployees.map((emp) => {
      const empRow = timesheet[emp.id] || {};
      const sum = summarizeEmployeeTimesheet(empRow);
      return [
        `${emp.firstName} ${emp.lastName}`,
        `'${emp.personalId}`,
        emp.department,
        emp.workSchedule,
        ...days.map((d) => empRow[d] || 'დ'),
        sum.workedDays,
        sum.workedHours,
        sum.overtimeHours,
        sum.nightHours,
        sum.holidayHours,
        sum.absentDays,
      ].join(',');
    });
    const csvContent = '\uFEFF' + [header.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'samushao_drois_tabeli_noemberi_2026.csv';
    a.click();
    URL.revokeObjectURL(url);
    notify('ტაბელი ექსპორტირებულია', 'საქართველოს შრომის კოდექსის ფორმატი (CSV/Excel)');
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              სამუშაო დროის აღრიცხვის ტაბელი
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ნოემბერი 2026 • საქართველოს ორგანული კანონის „შრომის კოდექსის“ სტანდარტული 40-საათიანი კვირა
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={regenerateTimesheet}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-indigo-600" />
            <span>ტაბელის გენერაცია</span>
          </button>

          <button
            onClick={exportTimesheetCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>ტაბელის ექსპორტი (CSV)</span>
          </button>
        </div>
      </div>

      {/* Helpful Guidance Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-950">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>როგორ მუშაობს:</strong> აირჩიეთ სასურველი კოდი ქვემოთ (მაგ. 8, შ, ბ) და დააწკაპუნეთ ნებისმიერ უჯრაზე — საათები და ხელფასი მყისიერად გადაითვლება!
          </span>
        </div>
        <div className="flex items-center gap-2 text-fuchsia-800 font-bold">
          <span className="w-2 h-2 rounded-full bg-fuchsia-600 animate-pulse" />
          <span>23 ნოემბერი — გიორგობა (ოფიციალური უქმე დღე)</span>
        </div>
      </div>

      {/* Code Palette & Filters Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700 mr-1">სტატუსის ფუნჯი:</span>
            {CODE_DEFINITIONS.map((item) => {
              const isSelected = selectedBrush === item.code;
              return (
                <button
                  key={item.code}
                  onClick={() => setSelectedBrush(item.code)}
                  title={item.desc}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-indigo-600 ring-offset-1 bg-slate-900 text-white border-slate-900 shadow-sm'
                      : `${item.badgeClass} hover:opacity-90`
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                placeholder="ძებნა თანამშრომლით..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"
            >
              <option value="ALL">ყველა დეპარტამენტი ({employees.length})</option>
              <option value="IT დეპარტამენტი">IT დეპარტამენტი</option>
              <option value="ფინანსები და ბუღალტერია">ფინანსები და ბუღალტერია</option>
              <option value="გაყიდვები და მარკეტინგი">გაყიდვები და მარკეტინგი</option>
              <option value="HR და ადმინისტრაცია">HR და ადმინისტრაცია</option>
            </select>
          </div>
        </div>

        {/* 30-Day Timesheet Grid */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full border-collapse text-center text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold">
                <th className="py-3 px-3 text-left sticky left-0 bg-slate-100 z-10 min-w-[210px] border-r border-slate-200">
                  თანამშრომელი / გრაფიკი
                </th>
                {days.map((d) => {
                  const isWeekend = [1, 7, 8, 14, 15, 21, 22, 28, 29].includes(d);
                  const isHoliday = d === 23;
                  return (
                    <th
                      key={d}
                      className={`py-2 px-1 min-w-[34px] border-r border-slate-200/70 text-[11px] ${
                        isHoliday
                          ? 'bg-fuchsia-100 text-fuchsia-900 font-black'
                          : isWeekend
                          ? 'bg-slate-200/70 text-slate-500'
                          : 'text-slate-800'
                      }`}
                      title={isHoliday ? '23 ნოემბერი — გიორგობა (უქმე)' : undefined}
                    >
                      <div>{d}</div>
                      <div className="text-[9px] font-normal">
                        {isHoliday ? 'უქმე' : isWeekend ? 'შ/კ' : 'ნოე'}
                      </div>
                    </th>
                  );
                })}
                <th className="py-2 px-2.5 bg-emerald-50 text-emerald-900 border-l border-slate-300">
                  დღე
                </th>
                <th className="py-2 px-2.5 bg-emerald-50 text-emerald-900">საათი</th>
                <th className="py-2 px-2.5 bg-violet-50 text-violet-900">ზეგანაკვ.</th>
                <th className="py-2 px-2.5 bg-cyan-50 text-cyan-900">ღამის</th>
                <th className="py-2 px-2.5 bg-fuchsia-50 text-fuchsia-900">უქმე სთ</th>
                <th className="py-2 px-2.5 bg-amber-50 text-amber-900">გაცდენა</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEmployees.map((emp) => {
                const empRow = timesheet[emp.id] || {};
                const summary = summarizeEmployeeTimesheet(empRow);

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 text-left sticky left-0 bg-white z-10 border-r border-slate-200">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {emp.firstName} {emp.lastName}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {emp.department} • {emp.workSchedule}
                      </div>
                    </td>

                    {days.map((d) => {
                      const code = empRow[d] || 'დ';
                      return (
                        <td
                          key={d}
                          onClick={() => updateTimesheetCell(emp.id, d, selectedBrush)}
                          className="p-0.5 border-r border-slate-100 cursor-pointer select-none"
                          title={`${emp.firstName} ${emp.lastName} — ${d} ნოემბერი: დააწკაპუნეთ "${selectedBrush}"-ით შესაცვლელად`}
                        >
                          <div
                            className={`w-full h-7 rounded-lg flex items-center justify-center border transition transform active:scale-90 ${getCellStyle(
                              code
                            )}`}
                          >
                            {code}
                          </div>
                        </td>
                      );
                    })}

                    <td className="py-2 px-2 font-bold text-emerald-800 bg-emerald-50/40 border-l border-slate-300">
                      {summary.workedDays}
                    </td>
                    <td className="py-2 px-2 font-black text-emerald-900 bg-emerald-50/40">
                      {summary.workedHours} სთ
                    </td>
                    <td className="py-2 px-2 font-bold text-violet-800 bg-violet-50/40">
                      {summary.overtimeHours > 0 ? `+${summary.overtimeHours} სთ` : '0'}
                    </td>
                    <td className="py-2 px-2 font-bold text-cyan-800 bg-cyan-50/40">
                      {summary.nightHours > 0 ? `${summary.nightHours} სთ` : '0'}
                    </td>
                    <td className="py-2 px-2 font-bold text-fuchsia-800 bg-fuchsia-50/40">
                      {summary.holidayHours} სთ
                    </td>
                    <td className="py-2 px-2 font-bold text-amber-800 bg-amber-50/40">
                      {summary.absentDays} დღე
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
