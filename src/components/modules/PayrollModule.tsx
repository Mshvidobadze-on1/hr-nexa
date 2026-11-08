'use client';

import React, { useState } from 'react';
import { useHR } from '@/context/HRContext';
import {
  calculateEmployeeMonthlyPayroll,
  calculateGrossToNet,
  calculateNetToGross,
  formatGEL,
  summarizeEmployeeTimesheet,
  PayrollBreakdown,
} from '@/lib/payroll';
import { Employee } from '@/types/hr';
import {
  Landmark,
  Calculator,
  Download,
  FileSpreadsheet,
  Receipt,
  Printer,
  X,
  ArrowLeftRight,
  Building2,
  Search,
  CheckCircle2,
  TrendingUp,
  Percent,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

export function PayrollModule() {
  const { employees, timesheet, updateEmployee, notify } = useHR();

  // Standalone Georgian Calculator State
  const [calcDirection, setCalcDirection] = useState<'GROSS_TO_NET' | 'NET_TO_GROSS'>(
    'GROSS_TO_NET'
  );
  const [calcInputAmount, setCalcInputAmount] = useState<number>(3500);
  const [calcPension, setCalcPension] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Payslip Modal State
  const [payslipTarget, setPayslipTarget] = useState<{
    emp: Employee;
    breakdown: PayrollBreakdown;
  } | null>(null);

  const calcResult =
    calcDirection === 'GROSS_TO_NET'
      ? calculateGrossToNet(calcInputAmount, calcPension)
      : calculateNetToGross(calcInputAmount, calcPension);

  // Quick salary presets for instant calculation
  const salaryPresets = [1500, 2500, 3500, 5000, 7500, 10000];

  // Calculate all employees payroll
  const rows = employees.map((emp) => {
    const summary = summarizeEmployeeTimesheet(timesheet[emp.id] || {});
    const breakdown = calculateEmployeeMonthlyPayroll(emp, summary);
    return { emp, summary, breakdown };
  });

  const filteredRows = rows.filter(({ emp }) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      emp.firstName.toLowerCase().includes(q) ||
      emp.lastName.toLowerCase().includes(q) ||
      emp.personalId.includes(q) ||
      emp.position.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q)
    );
  });

  const totals = rows.reduce(
    (acc, r) => {
      acc.totalGross += r.breakdown.totalAccruedGross;
      acc.empPension += r.breakdown.employeePension;
      acc.incomeTax += r.breakdown.incomeTax;
      acc.finalNet += r.breakdown.finalNetSalary;
      acc.employerPension += r.breakdown.employerPension;
      acc.companyCost += r.breakdown.totalCompanyCost;
      return acc;
    },
    {
      totalGross: 0,
      empPension: 0,
      incomeTax: 0,
      finalNet: 0,
      employerPension: 0,
      companyCost: 0,
    }
  );

  const exportBankBatchRegistry = (bankFilter: 'ALL' | 'TBC' | 'BOG') => {
    const filtered = rows.filter((r) => {
      if (bankFilter === 'TBC') return r.emp.bankName.includes('TBC');
      if (bankFilter === 'BOG') return r.emp.bankName.includes('BOG');
      return true;
    });

    const headers = [
      'მიმღების IBAN ანგარიში',
      'პირადი ნომერი (11 ციფრი)',
      'მიმღების სახელი და გვარი',
      'მომსახურე ბანკი',
      'ჩასარიცხი თანხა (Net GEL)',
      'დანიშნულება',
    ];

    const csvRows = filtered.map(({ emp, breakdown }) =>
      [
        emp.iban,
        `'${emp.personalId}`,
        `${emp.firstName} ${emp.lastName}`,
        emp.bankName,
        breakdown.finalNetSalary.toFixed(2),
        'ხელფასი - ნოემბერი/2026',
      ].join(',')
    );

    const csvContent = '\uFEFF' + [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sabanko_reestri_${bankFilter.toLowerCase()}_noemberi_2026.csv`;
    a.click();
    URL.revokeObjectURL(url);

    const bankNameGeo =
      bankFilter === 'TBC'
        ? 'თიბისი ბანკის (TBC Bank)'
        : bankFilter === 'BOG'
        ? 'საქართველოს ბანკის (BOG)'
        : 'ყველა ბანკის';

    notify(
      'საბანკო რეესტრი ექსპორტირებულია!',
      `${bankNameGeo} გადარიცხვის რეესტრი (${filtered.length} თანამშრომელი) ჩამოიტვირთა CSV ფორმატში`
    );
  };

  return (
    <div className="space-y-6">
      {/* Visual Georgian Tax Law Flow Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-3xl p-6 text-white shadow-xl border border-indigo-900/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>საქართველოს საგადასახადო კოდექსი & დაგროვებითი საპენსიო კანონი</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              ხელფასების კალკულაცია და საბანკო უწყისები
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              ავტომატური გაანგარიშება: ტაბელის სამუშაო საათები + ზეგანაკვეთური + 2% საპენსიო + 20%
              საშემოსავლო გადასახადი და პირდაპირი ექსპორტი თიბისისა და საქართველოს ბანკში.
            </p>
          </div>

          {/* Quick Bank Export Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* TBC Button */}
            <button
              onClick={() => exportBankBatchRegistry('TBC')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00A3E0] hover:bg-[#0092c9] text-white text-xs font-bold shadow-lg shadow-[#00A3E0]/20 transition transform active:scale-95 cursor-pointer"
              title="ექსპორტი TBC ბიზნეს ინტერნეტ-ბანკისთვის"
            >
              <CreditCard className="w-4 h-4" />
              TBC ბანკის რეესტრი
            </button>

            {/* BOG Button */}
            <button
              onClick={() => exportBankBatchRegistry('BOG')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF6600] hover:bg-[#e65c00] text-white text-xs font-bold shadow-lg shadow-[#FF6600]/20 transition transform active:scale-95 cursor-pointer"
              title="ექსპორტი საქართველოს ბანკის BOG Business-ისთვის"
            >
              <CreditCard className="w-4 h-4" />
              საქართველოს ბანკი (BOG)
            </button>

            {/* All Banks Button */}
            <button
              onClick={() => exportBankBatchRegistry('ALL')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition transform active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              ყველა ბანკი (CSV)
            </button>
          </div>
        </div>

        {/* Visual Tax Step Flow Diagram */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>როგორ იანგარიშება ხელფასი საქართველოში (გამჭვირვალე ფორმულა):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">1. დარიცხული (Gross)</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                  100%
                </span>
              </div>
              <div className="text-lg font-bold text-white mt-1">
                {formatGEL(totals.totalGross)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">ხელშეკრულებით გათვალისწინებული</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-200">2. საპენსიო (თანამშრომლის)</span>
                <span className="text-[10px] bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  -2%
                </span>
              </div>
              <div className="text-lg font-bold text-amber-300 mt-1">
                -{formatGEL(totals.empPension)}
              </div>
              <div className="text-[10px] text-amber-200/70 mt-0.5">საპენსიო ფონდში (პირად ანგარიშზე)</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-200">3. საშემოსავლო (სახელმწიფო)</span>
                <span className="text-[10px] bg-rose-500/30 text-rose-300 px-2 py-0.5 rounded-full font-bold">
                  -20%
                </span>
              </div>
              <div className="text-lg font-bold text-rose-300 mt-1">
                -{formatGEL(totals.incomeTax)}
              </div>
              <div className="text-[10px] text-rose-200/70 mt-0.5">იანგარიშება: (Gross - 2%) × 20%</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-200">4. ხელზე ასაღები (Net)</span>
                <span className="text-[10px] bg-emerald-500/40 text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  78.4%
                </span>
              </div>
              <div className="text-lg font-extrabold text-emerald-300 mt-1">
                {formatGEL(totals.finalNet)}
              </div>
              <div className="text-[10px] text-emerald-200/80 mt-0.5">საბანკო ანგარიშზე ჩასარიცხი</div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-400 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <div>
              დამსაქმებლის დამატებითი +2% საპენსიო:{' '}
              <span className="text-indigo-300 font-bold">{formatGEL(totals.employerPension)}</span>
            </div>
            <div>
              კომპანიის სრული სახელფასო ხარჯი:{' '}
              <span className="text-cyan-300 font-bold">{formatGEL(totals.companyCost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Georgian Calculator Widget (Simple & Visual) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">
                სწრაფი ქართული ხელფასის კალკულატორი
              </h2>
              <p className="text-xs text-slate-500">
                შეიყვანეთ თანხა ან აირჩიეთ მზა შაბლონი — შედეგები მყისიერად დაითვლება
              </p>
            </div>
          </div>

          {/* Toggle Direction */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setCalcDirection('GROSS_TO_NET')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                calcDirection === 'GROSS_TO_NET'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              დარიცხული ➔ ხელზე (Gross → Net)
            </button>
            <button
              onClick={() => setCalcDirection('NET_TO_GROSS')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                calcDirection === 'NET_TO_GROSS'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              ხელზე ➔ დარიცხულზე (Net → Gross)
            </button>
          </div>
        </div>

        {/* Input + Quick Presets + Visual Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 items-center">
          {/* Input & Presets (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {calcDirection === 'GROSS_TO_NET'
                  ? 'სასურველი დარიცხული ხელფასი (Gross - ₾):'
                  : 'სასურველი ხელზე ასაღები თანხა (Net - ₾):'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={calcInputAmount}
                  onChange={(e) => setCalcInputAmount(Number(e.target.value))}
                  className="w-full pl-4 pr-10 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 font-black text-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  ₾
                </span>
              </div>
            </div>

            {/* Quick 1-Click Salary Presets */}
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                სწრაფი თანხები (დააჭირეთ პირდაპირ):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {salaryPresets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setCalcInputAmount(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      calcInputAmount === preset
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {preset.toLocaleString()} ₾
                  </button>
                ))}
              </div>
            </div>

            {/* Pension Checkbox */}
            <label className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 cursor-pointer transition hover:bg-indigo-50">
              <input
                type="checkbox"
                checked={calcPension}
                onChange={(e) => setCalcPension(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div>
                <div className="text-xs font-bold text-indigo-950">
                  საპენსიო სქემაში მონაწილეობა: {calcPension ? 'კი (2% + 2%)' : 'არა (0%)'}
                </div>
                <div className="text-[11px] text-indigo-700">
                  {calcPension
                    ? 'თანამშრომელი: 2%, დამსაქმებელი: 2%'
                    : 'გადასახადი იანგარიშება სრული თანხიდან'}
                </div>
              </div>
            </label>
          </div>

          {/* Result Cards (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-medium text-slate-500">დარიცხული (Gross)</div>
              <div className="text-lg font-black text-slate-900 mt-1">
                {formatGEL(calcResult.gross)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">სრული ფონდი</div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <div className="text-[11px] font-medium text-amber-800">საპენსიო (2%)</div>
              <div className="text-lg font-black text-amber-900 mt-1">
                {formatGEL(calcResult.employeePension)}
              </div>
              <div className="text-[10px] text-amber-700 mt-0.5">თანამშრომლის</div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
              <div className="text-[11px] font-medium text-rose-800">საშემოსავლო (20%)</div>
              <div className="text-lg font-black text-rose-900 mt-1">
                {formatGEL(calcResult.incomeTax)}
              </div>
              <div className="text-[10px] text-rose-700 mt-0.5">სახელმწიფოს</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-sm ring-1 ring-emerald-400/30">
              <div className="text-[11px] font-bold text-emerald-800">ხელზე (Net ₾)</div>
              <div className="text-xl font-black text-emerald-700 mt-1">
                {formatGEL(calcResult.netSalary)}
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                {calcPension ? '78.4%' : '80.0%'} სუფთად
              </div>
            </div>

            {/* Second row summary */}
            <div className="col-span-2 sm:col-span-4 p-3 rounded-2xl bg-slate-100/70 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>
                დამსაქმებლის საპენსიო შენატანი (+2%):{' '}
                <strong className="text-slate-900">{formatGEL(calcResult.employerPension)}</strong>
              </span>
              <span>
                კომპანიის მთლიანი ხარჯი:{' '}
                <strong className="text-indigo-600 font-bold">
                  {formatGEL(calcResult.totalCompanyCost)}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Payroll Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table Top Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                სამუშაო დროის და ხელფასის ყოველთვიური უწყისი
              </h3>
              <p className="text-xs text-slate-500">
                მონაცემები ავტომატურად ითვლება ნოემბრის ტაბელის მიხედვით
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ძებნა (სახელი, პ/ნ, პოზიცია)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">თანამშრომელი & ანგარიში</th>
                <th className="py-3.5 px-3">საბაზისო</th>
                <th className="py-3.5 px-3">ზეგანაკვეთური</th>
                <th className="py-3.5 px-3">პრემია / ბონუსი</th>
                <th className="py-3.5 px-3">სულ დარიცხული</th>
                <th className="py-3.5 px-3 text-amber-700">საპენსიო (2%)</th>
                <th className="py-3.5 px-3 text-rose-700">საშემოსავლო (20%)</th>
                <th className="py-3.5 px-3 bg-emerald-50 text-emerald-900 font-extrabold">
                  ხელზე ასაღები (Net ₾)
                </th>
                <th className="py-3.5 px-3 text-right">ფურცელი (Payslip)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map(({ emp, summary, breakdown }) => (
                <tr key={emp.id} className="hover:bg-indigo-50/30 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl ${emp.avatarColor} text-white font-bold flex items-center justify-center text-xs shadow-sm`}
                      >
                        {emp.firstName[0]}
                        {emp.lastName[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              emp.bankName.includes('TBC')
                                ? 'bg-[#00A3E0]/15 text-[#0081b3]'
                                : 'bg-[#FF6600]/15 text-[#cc5200]'
                            }`}
                          >
                            {emp.bankName.includes('TBC') ? 'TBC' : 'BOG'}
                          </span>
                          <span>{emp.iban.slice(0, 16)}...</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-800">
                    {formatGEL(breakdown.baseGross)}
                  </td>
                  <td className="py-3.5 px-3">
                    {breakdown.overtimeGross + breakdown.nightAndHolidayGross > 0 ? (
                      <div>
                        <div className="font-bold text-violet-700">
                          +{formatGEL(breakdown.overtimeGross + breakdown.nightAndHolidayGross)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {summary.overtimeHours}სთ ზეგ.
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-mono">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    <input
                      type="number"
                      step={50}
                      value={emp.monthlyBonus}
                      onChange={(e) =>
                        updateEmployee(emp.id, { monthlyBonus: Number(e.target.value) })
                      }
                      className="w-24 px-2 py-1 rounded-lg border border-slate-300 font-bold text-indigo-700 bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-3.5 px-3 font-extrabold text-slate-900">
                    {formatGEL(breakdown.totalAccruedGross)}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-amber-700">
                    {formatGEL(breakdown.employeePension)}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-rose-700">
                    {formatGEL(breakdown.incomeTax)}
                  </td>
                  <td className="py-3.5 px-3 bg-emerald-50/80 font-black text-emerald-800 text-sm">
                    {formatGEL(breakdown.finalNetSalary)}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => setPayslipTarget({ emp, breakdown })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-[11px] font-bold shadow-sm transition cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      ნახვა
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Payslip Modal */}
      {payslipTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-sm block">
                    ოფიციალური სახელფასო ფურცელი (Payslip)
                  </span>
                  <span className="text-[11px] text-slate-400">შპს „არგო ეიჩარ საქართველო“</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  ბეჭდვა / PDF
                </button>
                <button
                  onClick={() => setPayslipTarget(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 text-xs">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="font-extrabold text-base text-slate-900">
                    {payslipTarget.emp.firstName} {payslipTarget.emp.lastName}
                  </div>
                  <div className="text-slate-600 font-medium">{payslipTarget.emp.position}</div>
                  <div className="text-slate-400 font-mono mt-0.5">
                    პ/ნ: {payslipTarget.emp.personalId} • {payslipTarget.emp.department}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-500">საანგარიშო პერიოდი</div>
                  <div className="font-bold text-slate-900">ნოემბერი 2026</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                    სტატუსი: დარიცხულია
                  </div>
                </div>
              </div>

              {/* Accrued Items */}
              <div className="space-y-2">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-indigo-950">
                  დარიცხვები (Accrued Earnings)
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">საბაზისო ხელფასი (Gross):</span>
                    <span className="font-bold text-slate-900">
                      {formatGEL(payslipTarget.breakdown.baseGross)}
                    </span>
                  </div>
                  {payslipTarget.breakdown.overtimeGross > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">ზეგანაკვეთური სამუშაო:</span>
                      <span className="font-bold text-violet-700">
                        +{formatGEL(payslipTarget.breakdown.overtimeGross)}
                      </span>
                    </div>
                  )}
                  {payslipTarget.emp.monthlyBonus > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">პრემია / ბონუსი:</span>
                      <span className="font-bold text-indigo-700">
                        +{formatGEL(payslipTarget.emp.monthlyBonus)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-200/80 pt-2 font-black text-slate-900 text-sm">
                    <span>სულ დარიცხული (Total Gross):</span>
                    <span>{formatGEL(payslipTarget.breakdown.totalAccruedGross)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-2">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-rose-950">
                  დაქვითვები (Taxes & Deductions)
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">თანამშრომლის საპენსიო შენატანი (2%):</span>
                    <span className="font-bold text-amber-700">
                      -{formatGEL(payslipTarget.breakdown.employeePension)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">საშემოსავლო გადასახადი (20%):</span>
                    <span className="font-bold text-rose-700">
                      -{formatGEL(payslipTarget.breakdown.incomeTax)}
                    </span>
                  </div>
                  {payslipTarget.breakdown.healthInsurance > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">ჯანმრთელობის დაზღვევა:</span>
                      <span className="font-bold text-slate-700">
                        -{formatGEL(payslipTarget.breakdown.healthInsurance)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Net Payout Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between shadow-lg shadow-emerald-600/20">
                <div>
                  <div className="text-[11px] text-emerald-100 font-medium">ხელზე ჩასარიცხი (Net Salary)</div>
                  <div className="text-2xl font-black">{formatGEL(payslipTarget.breakdown.finalNetSalary)}</div>
                </div>
                <div className="text-right text-[11px] text-emerald-100 font-mono">
                  <div>{payslipTarget.emp.bankName}</div>
                  <div>{payslipTarget.emp.iban}</div>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                დოკუმენტი დაგენერირებულია ArgoHR სისტემის მიერ • დამოწმებულია ელექტრონულად
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
