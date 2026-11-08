'use client';

import React, { useState } from 'react';
import { useHR } from '@/context/HRContext';
import { Award, Plus, Target, Star, TrendingUp, X } from 'lucide-react';

export function PerformanceModule() {
  const { evaluations, employees, addEvaluation } = useHR();
  const [showAddEval, setShowAddEval] = useState(false);
  const [empId, setEmpId] = useState('emp-7');
  const [period, setPeriod] = useState('2026 Q4 (ოქტომბერი - დეკემბერი)');
  const [kpi1Title, setKpi1Title] = useState('ძირითადი კვარტალური OKR მიზნის შესრულება');
  const [kpi1Score, setKpi1Score] = useState(94);
  const [kpi2Title, setKpi2Title] = useState('პროექტების დროული ჩაბარება და ხარისხი');
  const [kpi2Score, setKpi2Score] = useState(90);
  const [strengths, setStrengths] = useState('მაღალი პროფესიონალიზმი და გუნდური მუშაობის უნარი.');
  const [growthAreas, setGrowthAreas] = useState('ახალი ტექნოლოგიების სერტიფიცირება.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEvaluation({
      employeeId: empId,
      period,
      evaluatorName: 'გიორგი ბერიძე / ნინო კაპანაძე',
      kpis: [
        { id: `k-${Date.now()}-1`, title: kpi1Title, weight: 60, score: kpi1Score },
        { id: `k-${Date.now()}-2`, title: kpi2Title, weight: 40, score: kpi2Score },
      ],
      peerFeedbackScore: 4.8,
      managerFeedbackScore: 4.9,
      selfAssessmentScore: 4.7,
      strengths,
      growthAreas,
      status: 'დასრულებული',
    });
    setShowAddEval(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">
              თანამშრომელთა შეფასება, OKR მიზნები და 360° უკუკავშირი
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            კვარტალური და წლიური KPI შესრულების კონტროლი და 360-გრადუსიანი შეფასების ანალიტიკა
          </p>
        </div>

        <button
          onClick={() => setShowAddEval(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          + ახალი შეფასების დამატება
        </button>
      </div>

      {/* Evaluations Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {evaluations.map((ev) => {
          const emp = employees.find((e) => e.id === ev.employeeId);
          if (!emp) return null;

          const weightedKpiScore = Math.round(
            ev.kpis.reduce((acc, k) => acc + (k.score * k.weight) / 100, 0)
          );
          const avg360 = +(
            (ev.peerFeedbackScore + ev.managerFeedbackScore + ev.selfAssessmentScore) /
            3
          ).toFixed(2);

          return (
            <div
              key={ev.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl ${emp.avatarColor} text-white font-bold text-sm flex items-center justify-center`}
                  >
                    {emp.firstName[0]}
                    {emp.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      {emp.firstName} {emp.lastName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {emp.position} • {emp.department}
                    </p>
                    <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">
                      პერიოდი: {ev.period} • შემფასებელი: {ev.evaluatorName}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-sm">
                    <Target className="w-4 h-4" />
                    KPI: {weightedKpiScore}%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{ev.status}</div>
                </div>
              </div>

              {/* KPI Breakdown Bars */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase">
                  KPI მაჩვენებლები და წონები
                </div>
                {ev.kpis.map((k) => (
                  <div key={k.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">
                        {k.title}{' '}
                        <span className="text-slate-400 font-normal">(წონა: {k.weight}%)</span>
                      </span>
                      <span className="font-bold text-indigo-700">{k.score}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-600"
                        style={{ width: `${k.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 360-Degree Feedback Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <div className="text-[11px] text-slate-500">მენეჯერი</div>
                  <div className="font-extrabold text-slate-900 mt-0.5 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    {ev.managerFeedbackScore} / 5
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">კოლეგები (Peers)</div>
                  <div className="font-extrabold text-slate-900 mt-0.5 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    {ev.peerFeedbackScore} / 5
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">თვითშეფასება</div>
                  <div className="font-extrabold text-slate-900 mt-0.5 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    {ev.selfAssessmentScore} / 5
                  </div>
                </div>
                <div className="bg-indigo-600 text-white rounded-lg py-1">
                  <div className="text-[10px] text-indigo-200">360° საშუალო</div>
                  <div className="font-extrabold text-sm">{avg360} / 5.0</div>
                </div>
              </div>

              {/* Qualitative Feedback */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <div className="font-bold text-emerald-900">ძლიერი მხარეები:</div>
                  <p className="text-emerald-800 mt-1">{ev.strengths}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                  <div className="font-bold text-amber-900 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    განვითარების მიმართულება:
                  </div>
                  <p className="text-amber-800 mt-1">{ev.growthAreas}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Evaluation Modal */}
      {showAddEval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">ახალი კვარტალური KPI & 360° შეფასება</h3>
              <button
                onClick={() => setShowAddEval(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">თანამშრომელი</label>
                <select
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.firstName} {e.lastName} — {e.position}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">საანგარიშო პერიოდი</label>
                <input
                  type="text"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">KPI მიზანი #1</label>
                  <input
                    type="text"
                    value={kpi1Title}
                    onChange={(e) => setKpi1Title(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">შესრულება (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={kpi1Score}
                    onChange={(e) => setKpi1Score(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">KPI მიზანი #2</label>
                  <input
                    type="text"
                    value={kpi2Title}
                    onChange={(e) => setKpi2Title(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">შესრულება (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={kpi2Score}
                    onChange={(e) => setKpi2Score(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ძლიერი მხარეები</label>
                <input
                  type="text"
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  განვითარების რეკომენდაცია
                </label>
                <input
                  type="text"
                  value={growthAreas}
                  onChange={(e) => setGrowthAreas(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEval(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300"
                >
                  გაუქმება
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold"
                >
                  შენახვა
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
