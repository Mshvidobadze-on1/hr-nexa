'use client';

import React, { useState } from 'react';
import { useHR } from '@/context/HRContext';
import { TurnstileLog } from '@/types/hr';
import {
  ScanFace,
  Fingerprint,
  Radio,
  Building2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  Search,
  Download,
  Wifi,
  Server,
  Activity,
} from 'lucide-react';

export function BiometricsModule() {
  const { turnstileLogs, employees, notify } = useHR();
  const [search, setSearch] = useState('');
  const [filterDirection, setFilterDirection] = useState<'ALL' | 'IN' | 'OUT'>('ALL');

  const filteredLogs = turnstileLogs.filter((log) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      log.employeeName.toLowerCase().includes(q) ||
      log.department.toLowerCase().includes(q) ||
      log.location.toLowerCase().includes(q);
    const matchesDir = filterDirection === 'ALL' || log.direction === filterDirection;
    return matchesSearch && matchesDir;
  });

  const exportLogsCSV = () => {
    const headers = ['ID', 'თანამშრომელი', 'დეპარტამენტი', 'დრო', 'მიმართულება', 'აპარატურა', 'ლოკაცია', 'სტატუსი'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.employeeName,
      l.department,
      l.timestamp,
      l.direction === 'IN' ? 'შემოსვლა (IN)' : 'გასვლა (OUT)',
      l.deviceType,
      l.location,
      l.status,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'turnstile_biometric_logs_nexa.csv';
    a.click();
    URL.revokeObjectURL(url);
    notify('ექსპორტი დასრულდა', 'ტურნიკეტების ლოგები ჩამოიტვირთა CSV ფორმატში');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 lg:p-7 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border border-indigo-900/40">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Time & Attendance Hardware API Integration</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black">
            ტურნიკეტები და ბიომეტრიული აპარატები
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            ინტეგრაცია ფიზიკურ გამშვებ პუნქტებთან (RFID ბარათები, Face ID სახის ამომცნობი და
            თითის ანაბეჭდის ტერმინალები). შემოსვლა/გასვლის რეალურ დროში დამუშავება და ტაბელთან
            ავტომატური სინქრონიზაცია.
          </p>
        </div>

        <button
          onClick={exportLogsCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition cursor-pointer"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>ლოგების ექსპორტი (CSV)</span>
        </button>
      </div>

      {/* 3 Hardware Terminal Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ScanFace className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE (99.9%)
            </span>
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">
              Face ID Terminal #1 (სათავო HQ)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">IP: 192.168.1.104 • პორტი: 8080</p>
          </div>
          <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-100 flex justify-between">
            <span>დღევანდელი სკანირება:</span>
            <strong className="text-slate-900">142 ავტორიზაცია</strong>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Fingerprint className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE (99.9%)
            </span>
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">
              Biometric Scanner #2 (სათავო HQ)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">IP: 192.168.1.105 • თითის ანაბეჭდი</p>
          </div>
          <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-100 flex justify-between">
            <span>დღევანდელი სკანირება:</span>
            <strong className="text-slate-900">89 ავტორიზაცია</strong>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE (99.8%)
            </span>
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">
              ბათუმის ფილიალი - ტურნიკეტი #1
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">IP: 212.72.140.19 • RFID & NFC</p>
          </div>
          <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-100 flex justify-between">
            <span>დღევანდელი სკანირება:</span>
            <strong className="text-slate-900">46 ავტორიზაცია</strong>
          </div>
        </div>
      </div>

      {/* Live Turnstile Access Log Stream */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                შემოსვლა/გასვლის ცოცხალი ლოგები (Real-Time Stream)
              </h3>
              <p className="text-xs text-slate-500">
                აპარატებიდან პირდაპირ მიღებული მონაცემები
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ძებნა თანამშრომლით..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Direction Filter */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setFilterDirection('ALL')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  filterDirection === 'ALL' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                ყველა
              </button>
              <button
                onClick={() => setFilterDirection('IN')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  filterDirection === 'IN' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                შემოსვლა (IN)
              </button>
              <button
                onClick={() => setFilterDirection('OUT')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  filterDirection === 'OUT' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                გასვლა (OUT)
              </button>
            </div>
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">თანამშრომელი</th>
                <th className="py-3.5 px-3">დრო & თარიღი</th>
                <th className="py-3.5 px-3">მიმართულება</th>
                <th className="py-3.5 px-3">აპარატურა</th>
                <th className="py-3.5 px-3">ლოკაცია</th>
                <th className="py-3.5 px-4 text-right">სტატუსი</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900">{log.employeeName}</div>
                    <div className="text-[11px] text-slate-500">{log.department}</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-semibold text-slate-700">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                        log.direction === 'IN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {log.direction === 'IN' ? '↓ შემოსვლა (IN)' : '↑ გასვლა (OUT)'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-medium text-slate-700">
                    {log.deviceType}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">
                    {log.location}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        log.status === 'ავტორიზებული'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
