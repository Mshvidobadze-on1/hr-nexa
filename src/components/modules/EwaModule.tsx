'use client';

import React, { useState } from 'react';
import { useHR } from '@/context/HRContext';
import { formatGEL } from '@/lib/payroll';
import {
  Wallet,
  Zap,
  TrendingUp,
  CreditCard,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export function EwaModule() {
  const { employees, currentUser, ewaTransactions, requestEwa } = useHR();

  const currentEmp =
    employees.find((e) => e.id === currentUser?.employeeId) || employees[3] || employees[0];

  // Accrued earnings calculation:
  // Month has ~21 working days. As of day 5, ~4 working days worked.
  const workedDaysRatio = 0.25; // ~25% of month elapsed
  const earnedGrossSoFar = Math.round(currentEmp.grossSalary * workedDaysRatio);
  const earnedNetSoFar = Math.round(earnedGrossSoFar * 0.784);
  const maxAllowedWithdrawal = Math.round(currentEmp.grossSalary * 0.5); // 50% max policy
  const alreadyWithdrawn = currentEmp.withdrawnEwaAmount || 0;
  const availableToWithdraw = Math.max(0, maxAllowedWithdrawal - alreadyWithdrawn);

  const [withdrawAmount, setWithdrawAmount] = useState<number>(
    Math.min(300, availableToWithdraw)
  );
  const [selectedBank, setSelectedBank] = useState<string>(currentEmp.bankName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceFee = 5; // Flat fee 5 GEL
  const netReceived = Math.max(0, withdrawAmount - serviceFee);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || withdrawAmount > availableToWithdraw) return;

    setIsSubmitting(true);
    setTimeout(() => {
      requestEwa(currentEmp.id, withdrawAmount);
      setIsSubmitting(false);
    }, 600);
  };

  const myTransactions = ewaTransactions.filter((tx) => tx.employeeId === currentEmp.id);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-3xl p-6 lg:p-7 text-white shadow-xl flex flex-wrap items-center justify-between gap-6 border border-emerald-900/50">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 fill-emerald-400" />
            <span>HR NEXA • Earned Wage Access (EWA) FinTech Engine</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black">
            ხელფასი მოთხოვნამდე (Earned Wage Access)
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            არ დაელოდოთ თვის ბოლოს! გამოიტანეთ უკვე ნამუშევარი საათების შესაბამისი ხელფასის ნაწილი
            მყისიერად, პირდაპირ თქვენს საბანკო ანგარიშზე (TBC / BOG) 0% საპროცენტო განაკვეთით.
          </p>
        </div>

        {/* Available Balance Box */}
        <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[220px] shadow-lg">
          <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
            ხელმისაწვდომია გამოსატანად
          </div>
          <div className="text-4xl font-black text-emerald-400 mt-1">
            {formatGEL(availableToWithdraw)}
          </div>
          <div className="text-[11px] text-slate-300 mt-1">
            თვის ლიმიტი: <strong>{formatGEL(maxAllowedWithdrawal)}</strong> (50%)
          </div>
        </div>
      </div>

      {/* 4 Financial Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500">სრული თვიური ხელფასი</div>
          <div className="text-xl font-black text-slate-900">
            {formatGEL(currentEmp.grossSalary)}
          </div>
          <div className="text-[11px] text-slate-400">ხელშეკრულებით გათვალისწინებული</div>
        </div>

        <div className="p-5 rounded-3xl bg-indigo-50/70 border border-indigo-100 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-indigo-800">უკვე გამომუშავებული (Gross)</div>
          <div className="text-xl font-black text-indigo-700">
            {formatGEL(earnedGrossSoFar)}
          </div>
          <div className="text-[11px] text-indigo-600">ნოემბრის 5 სამუშაო დღის მიხედვით</div>
        </div>

        <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-100 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-amber-800">უკვე გამოტანილი თანხა</div>
          <div className="text-xl font-black text-amber-700">
            {formatGEL(alreadyWithdrawn)}
          </div>
          <div className="text-[11px] text-amber-600">მიმდინარე თვეში EWA-ით</div>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-300 shadow-sm ring-1 ring-emerald-400/30 space-y-1">
          <div className="text-xs font-bold text-emerald-800">ხელმისაწვდომი ნაშთი</div>
          <div className="text-2xl font-black text-emerald-700">
            {formatGEL(availableToWithdraw)}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">მყისიერი გადარიცხვა</div>
        </div>
      </div>

      {/* Main Action Area: Transfer Form & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 6 Cols: Instant Withdrawal Form */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 fill-emerald-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                თანხის მყისიერი გადარიცხვა
              </h3>
              <p className="text-xs text-slate-500">
                თანხა ირიცხება 60 წამში თქვენს პირად IBAN ანგარიშზე
              </p>
            </div>
          </div>

          <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                გამოსატანი თანხა (GEL):
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={50}
                  max={availableToWithdraw}
                  step={50}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full pl-4 pr-12 py-3.5 rounded-2xl border border-slate-300 font-black text-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                  ₾
                </span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2">
              {[100, 200, 300, 500, 1000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setWithdrawAmount(Math.min(preset, availableToWithdraw))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    withdrawAmount === preset
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset} ₾
                </button>
              ))}
            </div>

            {/* Bank Card / IBAN display */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">მიმღები ბანკი:</span>
                <span className="font-extrabold text-indigo-700">{currentEmp.bankName}</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-600">
                <span>IBAN:</span>
                <span>{currentEmp.iban}</span>
              </div>
            </div>

            {/* Breakdown summary */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5 text-xs text-emerald-950">
              <div className="flex justify-between">
                <span>გამოსატანი თანხა:</span>
                <strong className="font-bold">{formatGEL(withdrawAmount)}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>საბანკო საკომისიო (Flat fee):</span>
                <span>5.00 ₾</span>
              </div>
              <div className="flex justify-between border-t border-emerald-300 pt-1.5 font-black text-emerald-900 text-sm">
                <span>ხელზე ჩასარიცხი თანხა:</span>
                <span>{formatGEL(netReceived)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || withdrawAmount <= 0 || withdrawAmount > availableToWithdraw}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-sm shadow-lg shadow-emerald-600/25 transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-white" />
              <span>{isSubmitting ? 'მიმდინარეობს გადარიცხვა...' : 'დადასტურება და ჩარიცხვა (Instant)'}</span>
            </button>
          </form>
        </div>

        {/* Right 6 Cols: EWA Transaction History */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-base text-slate-900">გადარიცხვების ისტორია</h3>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              სულ {myTransactions.length} ტრანზაქცია
            </span>
          </div>

          <div className="space-y-3">
            {myTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-extrabold text-xs text-slate-900">
                      EWA გადარიცხვა ({tx.bankName.includes('TBC') ? 'TBC' : 'BOG'})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {tx.requestedAt} • IBAN: {tx.iban.slice(0, 14)}...
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-sm text-emerald-700">
                    +{formatGEL(tx.netTransferred)}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}

            {myTransactions.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">
                მიმდინარე თვეში EWA ტრანზაქციები არ ფიქსირდება.
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-900 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>
              გამოტანილი თანხა ავტომატურად დაუკავდება თვის ბოლო სახელფასო უწყისს (Payslip).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
