'use client';

import React, { useState } from 'react';
import { useHR } from '@/context/HRContext';
import { Employee, DepartmentName } from '@/types/hr';
import { calculateGrossToNet, formatGEL } from '@/lib/payroll';
import { AddEmployeeModal } from '@/components/modals/AddEmployeeModal';
import { EmployeeDossierModal } from '@/components/modals/EmployeeDossierModal';
import {
  Search,
  Download,
  UserPlus,
  Building2,
  GitBranch,
  ClipboardCheck,
  FileText,
  CheckSquare,
  Square,
  Plus,
  Users,
  LayoutGrid,
  List,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export function EmployeesModule() {
  const { employees, toggleChecklistTask, addChecklistTask, notify } = useHR();
  const [subTab, setSubTab] = useState<'directory' | 'orgchart' | 'onboarding'>('directory');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState<Record<string, string>>({});

  const departments = [
    'IT დეპარტამენტი',
    'ფინანსები და ბუღალტერია',
    'გაყიდვები და მარკეტინგი',
    'HR და ადმინისტრაცია',
  ] as const;

  const branches = [
    'თბილისის სათავო ოფისი',
    'ბათუმის ფილიალი',
    'ქუთაისის ფილიალი',
  ] as const;

  const filteredEmployees = employees.filter((emp) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(q) ||
      emp.personalId.includes(q) ||
      emp.position.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q);
    const matchesDept = deptFilter === 'ALL' || emp.department === deptFilter;
    const matchesStatus = statusFilter === 'ALL' || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const exportDirectoryCSV = () => {
    const headers = [
      'სახელი',
      'გვარი',
      'პირადი ნომერი',
      'დეპარტამენტი',
      'პოზიცია',
      'ფილიალი',
      'ხელშეკრულება',
      'დარიცხული (Gross GEL)',
      'ხელზე (Net GEL)',
      'საპენსიო',
      'IBAN',
      'სტატუსი',
    ];
    const rows = filteredEmployees.map((emp) => {
      const t = calculateGrossToNet(emp.grossSalary, emp.pensionEnrolled);
      return [
        emp.firstName,
        emp.lastName,
        `'${emp.personalId}`,
        emp.department,
        emp.position,
        emp.branch,
        emp.contractType,
        t.gross,
        t.netSalary,
        emp.pensionEnrolled ? 'კი (2%)' : 'არა',
        emp.iban,
        emp.status,
      ].join(',');
    });
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tanamshromelta_baza_argohr.csv';
    a.click();
    URL.revokeObjectURL(url);
    notify('ექსპორტი დასრულდა', 'თანამშრომელთა ბაზა ჩამოიტვირთა CSV/Excel ფორმატში');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>პერსონალის მართვის მოდული</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-slate-900 mt-0.5">
            თანამშრომლები და სტრუქტურა
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            სულ {employees.length} დასაქმებული • 3 ფილიალი • 4 დეპარტამენტი
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Subtabs Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setSubTab('directory')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                subTab === 'directory'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              თანამშრომლები ({employees.length})
            </button>
            <button
              onClick={() => setSubTab('orgchart')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                subTab === 'orgchart'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              სტრუქტურული ხე
            </button>
            <button
              onClick={() => setSubTab('onboarding')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                subTab === 'onboarding'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              ადაპტაცია & წასვლა
            </button>
          </div>

          {/* Add Employee Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition transform active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            + თანამშრომლის დამატება
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: Directory */}
      {subTab === 'directory' && (
        <div className="space-y-4">
          {/* Filters Bar & View Switcher */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative min-w-[260px] flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ძებნა (სახელი, გვარი, პ/ნ, პოზიცია)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 focus:bg-white"
              />
            </div>

            {/* Department Quick Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setDeptFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  deptFilter === 'ALL'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ყველა ({employees.length})
              </button>
              {departments.map((dept) => {
                const count = employees.filter((e) => e.department === dept).length;
                const shortName = dept.split(' ')[0];
                return (
                  <button
                    key={dept}
                    onClick={() => setDeptFilter(dept)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      deptFilter === dept
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {shortName} ({count})
                  </button>
                );
              })}
            </div>

            {/* Right Tools: View Mode & Export */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewMode === 'cards'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="ბარათების ხედი"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="ცხრილის ხედი"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={exportDirectoryCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                CSV ექსპორტი
              </button>
            </div>
          </div>

          {/* View Mode 1: Modern Card Grid (Friendly & Visual) */}
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredEmployees.map((emp) => {
                const tax = calculateGrossToNet(emp.grossSalary, emp.pensionEnrolled);
                return (
                  <div
                    key={emp.id}
                    onClick={() => setSelectedEmp(emp)}
                    className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    {/* Card Top: Avatar + Status */}
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl ${emp.avatarColor} text-white font-black text-base flex items-center justify-center shadow-md ring-2 ring-white`}
                        >
                          {emp.firstName[0]}
                          {emp.lastName[0]}
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            emp.status === 'აქტიური'
                              ? 'bg-emerald-100 text-emerald-800'
                              : emp.status === 'შვებულებაში'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {emp.status}
                        </span>
                      </div>

                      {/* Name & Position */}
                      <div className="mt-3">
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition">
                          {emp.firstName} {emp.lastName}
                        </h3>
                        <p className="text-xs text-indigo-700 font-semibold mt-0.5">
                          {emp.position}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {emp.department} • {emp.branch.split(' ')[0]}
                        </p>
                      </div>

                      {/* Contact & ID Snippet */}
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-2 text-[11px]">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{emp.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{emp.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Bottom: Salary & Button */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">ხელზე (Net ₾)</div>
                        <div className="text-sm font-black text-emerald-700">
                          {formatGEL(tax.netSalary)}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmp(emp);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold text-xs transition cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        საქმე 360°
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* View Mode 2: Dense Table */
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase">
                      <th className="py-3.5 px-4">თანამშრომელი</th>
                      <th className="py-3.5 px-3">პირადი ნომერი</th>
                      <th className="py-3.5 px-3">დეპარტამენტი & პოზიცია</th>
                      <th className="py-3.5 px-3">ხელშეკრულება</th>
                      <th className="py-3.5 px-3">დარიცხული (Gross)</th>
                      <th className="py-3.5 px-3 bg-emerald-50 text-emerald-900 font-extrabold">
                        ხელზე (Net)
                      </th>
                      <th className="py-3.5 px-3">სტატუსი</th>
                      <th className="py-3.5 px-4 text-right">პირადი საქმე</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEmployees.map((emp) => {
                      const tax = calculateGrossToNet(emp.grossSalary, emp.pensionEnrolled);
                      return (
                        <tr
                          key={emp.id}
                          onClick={() => setSelectedEmp(emp)}
                          className="hover:bg-indigo-50/40 transition cursor-pointer"
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-xl ${emp.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                              >
                                {emp.firstName[0]}
                                {emp.lastName[0]}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">
                                  {emp.firstName} {emp.lastName}
                                </div>
                                <div className="text-[11px] text-slate-500">{emp.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-mono font-medium text-slate-700">
                            {emp.personalId}
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="font-semibold text-slate-900">{emp.position}</div>
                            <div className="text-[11px] text-slate-500">{emp.department}</div>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                              {emp.contractType}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-bold text-slate-900">
                            {formatGEL(emp.grossSalary)}
                          </td>
                          <td className="py-3.5 px-3 bg-emerald-50/80 font-black text-emerald-800">
                            {formatGEL(tax.netSalary)}
                          </td>
                          <td className="py-3.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                emp.status === 'აქტიური'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {emp.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEmp(emp);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold text-xs transition cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              360°
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: Org Chart */}
      {subTab === 'orgchart' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          {/* Company Node */}
          <div className="flex flex-col items-center">
            <div className="px-8 py-5 rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white shadow-xl border border-indigo-500/30 text-center max-w-lg w-full">
              <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>სათავო ჰოლდინგი • ს/კ 405928174</span>
              </div>
              <div className="text-xl font-extrabold mt-1">შპს „არგო ეიჩარ საქართველო“</div>
              <div className="text-xs text-slate-300 mt-0.5">
                3 ფილიალი • 4 დეპარტამენტი • {employees.length} თანამშრომელი
              </div>
            </div>

            <div className="w-0.5 h-6 bg-indigo-300" />

            {/* Branches Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {branches.map((b) => {
                const branchEmps = employees.filter((e) => e.branch === b);
                return (
                  <div
                    key={b}
                    className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                        ფილიალი
                      </div>
                      <div className="font-bold text-sm text-slate-900">{b}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-white text-indigo-700 font-bold text-xs border border-indigo-100 shadow-xs">
                      {branchEmps.length} შტატი
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Departments Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 pt-2">
            {departments.map((dept) => {
              const deptEmps = employees.filter((e) => e.department === dept);
              return (
                <div
                  key={dept}
                  className="rounded-3xl border border-slate-200/80 bg-slate-50/50 overflow-hidden flex flex-col"
                >
                  <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold">
                        დეპარტამენტი
                      </div>
                      <div className="font-bold text-sm">{dept}</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-600">
                      {deptEmps.length}
                    </span>
                  </div>

                  <div className="p-3 space-y-2.5 flex-1">
                    {deptEmps.map((emp, idx) => (
                      <div
                        key={emp.id}
                        onClick={() => setSelectedEmp(emp)}
                        className={`p-3 rounded-2xl border transition cursor-pointer ${
                          idx === 0
                            ? 'bg-white border-indigo-300 shadow-xs'
                            : 'bg-white/90 border-slate-200 hover:border-indigo-300 ml-2'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl ${emp.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                          >
                            {emp.firstName[0]}
                            {emp.lastName[0]}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {emp.firstName} {emp.lastName}
                            </div>
                            <div className="text-[11px] text-indigo-700 font-semibold truncate">
                              {emp.position}
                            </div>
                            <div className="text-[10px] text-slate-400">{emp.branch}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Onboarding & Offboarding */}
      {subTab === 'onboarding' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {employees
            .filter((e) => e.checklist.length > 0)
            .map((emp) => {
              const completedCount = emp.checklist.filter((c) => c.completed).length;
              const progressPct = Math.round((completedCount / emp.checklist.length) * 100);
              const isOffboarding = emp.lifecycleType === 'წასვლა (Offboarding)';

              return (
                <div
                  key={emp.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl ${emp.avatarColor} text-white font-bold text-base flex items-center justify-center shadow-md`}
                      >
                        {emp.firstName[0]}
                        {emp.lastName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-slate-900">
                            {emp.firstName} {emp.lastName}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isOffboarding
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isOffboarding ? 'შემოვლის ფურცელი' : 'ადაპტაცია (Onboarding)'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {emp.position} • {emp.department}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-indigo-600">{progressPct}%</span>
                      <div className="text-[10px] text-slate-400">
                        {completedCount}/{emp.checklist.length} შესრულდა
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOffboarding ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-2">
                    {emp.checklist.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleChecklistTask(emp.id, task.id)}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                          task.completed
                            ? 'bg-emerald-50/50 border-emerald-200 text-slate-500 line-through'
                            : 'bg-slate-50/70 border-slate-200 hover:border-indigo-300 text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {task.completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className="text-xs font-semibold">{task.title}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-600 shrink-0">
                          {task.category}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Add New Task */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="ახალი პუნქტი (მაგ: საბანკო ბარათის დამზადება)..."
                      value={newTaskTitle[emp.id] || ''}
                      onChange={(e) =>
                        setNewTaskTitle((prev) => ({ ...prev, [emp.id]: e.target.value }))
                      }
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => {
                        const title = (newTaskTitle[emp.id] || '').trim();
                        if (!title) return;
                        addChecklistTask(
                          emp.id,
                          title,
                          isOffboarding ? 'შემოვლის ფურცელი' : 'ინდუქცია'
                        );
                        setNewTaskTitle((prev) => ({ ...prev, [emp.id]: '' }));
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      დამატება
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {showAddModal && <AddEmployeeModal onClose={() => setShowAddModal(false)} />}
      {selectedEmp && (
        <EmployeeDossierModal employee={selectedEmp} onClose={() => setSelectedEmp(null)} />
      )}
    </div>
  );
}
