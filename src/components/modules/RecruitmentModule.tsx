'use client';

import React, { useState } from 'react';
import { useHR } from '@/context/HRContext';
import { Candidate, CandidateStage, ContractType, DepartmentName } from '@/types/hr';
import { formatGEL, calculateGrossToNet } from '@/lib/payroll';
import {
  Briefcase,
  UserCheck,
  ArrowRight,
  Star,
  Plus,
  Phone,
  Mail,
  X,
  Sparkles,
  TrendingUp,
  UserPlus,
  CheckCircle2,
  FileText,
  Globe,
  UploadCloud,
  Check,
  Building2,
  MapPin,
} from 'lucide-react';

const STAGES: CandidateStage[] = [
  'ახალი რეზიუმე',
  'სკრინინგი',
  'გასაუბრება',
  'ტესტირება',
  'შეთავაზება (Offer)',
  'აყვანილია',
];

export function RecruitmentModule() {
  const { candidates, moveCandidateStage, hireCandidateAsEmployee, addCandidate } = useHR();
  const [activeTab, setActiveTab] = useState<'kanban' | 'careerPage'>('kanban');
  const [hireModalCandidate, setHireModalCandidate] = useState<Candidate | null>(null);
  const [showNewCandidateModal, setShowNewCandidateModal] = useState(false);

  // Hire Conversion Modal State
  const [hireIban, setHireIban] = useState('GE29TB7788990011223344');
  const [hireBank, setHireBank] = useState<'თიბისი ბანკი (TBC)' | 'საქართველოს ბანკი (BOG)'>(
    'თიბისი ბანკი (TBC)'
  );
  const [hireContract, setHireContract] = useState<ContractType>('გამოსაცდელი ვადა');
  const [hireGross, setHireGross] = useState(5000);
  const [hirePension, setHirePension] = useState(true);

  // New Candidate Form State
  const [candFirst, setCandFirst] = useState('');
  const [candLast, setCandLast] = useState('');
  const [candVacancy, setCandVacancy] = useState('Full-Stack დეველოპერი');
  const [candDept, setCandDept] = useState<DepartmentName>('IT დეპარტამენტი');
  const [candSalary, setCandSalary] = useState(4500);
  const [candCvName, setCandCvName] = useState('resume_2026.pdf');
  const [parsedSkills, setParsedSkills] = useState<string[]>(['React', 'Next.js', 'PostgreSQL']);

  const triggerStageChange = (cand: Candidate, nextStage: CandidateStage) => {
    if (nextStage === 'აყვანილია') {
      setHireGross(cand.expectedSalaryGross);
      setHireModalCandidate(cand);
    } else {
      moveCandidateStage(cand.id, nextStage);
    }
  };

  const handleConfirmHire = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hireModalCandidate) return;

    hireCandidateAsEmployee(hireModalCandidate.id, {
      firstName: hireModalCandidate.firstName,
      lastName: hireModalCandidate.lastName,
      personalId: hireModalCandidate.personalId,
      birthDate: '1996-05-14',
      phone: hireModalCandidate.phone,
      email: hireModalCandidate.email,
      address: 'თბილისი, ჭავჭავაძის გამზ. #34',
      bankName: hireBank,
      iban: hireIban,
      department: hireModalCandidate.department,
      branch: 'თბილისის სათავო ოფისი',
      position: hireModalCandidate.vacancyTitle,
      contractType: hireContract,
      hireDate: '2026-11-03',
      workSchedule: 'სტანდარტული 5/2 (40სთ/კვ)',
      grossSalary: hireGross,
      pensionEnrolled: hirePension,
      status: 'აქტიური',
      avatarColor: 'bg-emerald-600',
      paidLeaveQuota: 24,
      accruedLeaveDays: 24,
      usedPaidLeaveDays: 0,
      usedUnpaidLeaveDays: 0,
      usedSickLeaveDays: 0,
      todayClockIn: '10:00',
      todayAttendanceStatus: 'დროულად',
      todayIpAddress: '188.169.214.12 (თბილისი HQ)',
      todayLocation: 'თბილისის სათავო ოფისი',
      nexaPoints: 300,
      withdrawnEwaAmount: 0,
      monthlyBonus: 0,
      monthlyDeduction: 0,
      healthInsuranceDeduction: 80,
      lifecycleType: 'ადაპტაცია (Onboarding)',
      checklist: [
        {
          id: `chk-${Date.now()}-1`,
          title: 'შრომითი ხელშეკრულების რეგისტრაცია RS.ge-ზე',
          category: 'ხელშეკრულება',
          completed: true,
          dueDate: '2026-11-03',
        },
        {
          id: `chk-${Date.now()}-2`,
          title: 'კორპორატიული ლეპტოპის და წვდომების გადაცემა',
          category: 'IT აღჭურვილობა',
          completed: false,
          dueDate: '2026-11-05',
        },
      ],
    });
    setHireModalCandidate(null);
  };

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candFirst.trim() || !candLast.trim()) return;
    addCandidate({
      firstName: candFirst.trim(),
      lastName: candLast.trim(),
      personalId: '01035091827',
      phone: '+995 599 10 20 30',
      email: `${candFirst.toLowerCase()}@gmail.com`,
      vacancyTitle: candVacancy,
      department: candDept,
      expectedSalaryGross: candSalary,
      experienceYears: 4,
      stage: 'ახალი რეზიუმე',
      rating: 5,
      notes: 'CV წარმატებით დაპარსულია AI ძრავის მიერ.',
      cvFileName: candCvName,
      parsedSkills,
    });
    setShowNewCandidateModal(false);
    setCandFirst('');
    setCandLast('');
  };

  const previewTax = calculateGrossToNet(hireGross, hirePension);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-4 h-4" />
            <span>ტალანტების მოზიდვა & ATS (Applicant Tracking System)</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-slate-900 mt-0.5">
            რეკრუტინგი, CV Parsing და კარიერული პორტალი
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            AI CV Parsing (ტექსტისა და უნარების ავტომატური ამოღება), 6-ეტაპიანი Kanban და საჯარო
            კარიერული გვერდი.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'kanban' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              ATS Kanban ({candidates.length})
            </button>
            <button
              onClick={() => setActiveTab('careerPage')}
              className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'careerPage' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>კარიერის გვერდი</span>
            </button>
          </div>

          <button
            onClick={() => setShowNewCandidateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + CV ატვირთვა
          </button>
        </div>
      </div>

      {/* VIEW 1: Kanban Board */}
      {activeTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3.5">
          {STAGES.map((stage, stageIdx) => {
            const stageCandidates = candidates.filter((c) => c.stage === stage);
            const isHiredStage = stage === 'აყვანილია';

            return (
              <div
                key={stage}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const candId = e.dataTransfer.getData('text/plain');
                  const cand = candidates.find((c) => c.id === candId);
                  if (cand && cand.stage !== stage) {
                    triggerStageChange(cand, stage);
                  }
                }}
                className={`rounded-3xl border p-3 flex flex-col min-h-[500px] transition ${
                  isHiredStage
                    ? 'bg-emerald-50/40 border-emerald-200/80'
                    : 'bg-slate-100/70 border-slate-200/80'
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 px-1">
                  <span
                    className={`font-black text-xs ${
                      isHiredStage ? 'text-emerald-800' : 'text-slate-800'
                    }`}
                  >
                    {stage}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isHiredStage
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    {stageCandidates.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-3 flex-1">
                  {stageCandidates.map((cand) => {
                    const nextStage = STAGES[stageIdx + 1];
                    return (
                      <div
                        key={cand.id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', cand.id)}
                        className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition space-y-3 cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-extrabold text-xs text-slate-900">
                              {cand.firstName} {cand.lastName}
                            </div>
                            <div className="text-[11px] font-bold text-indigo-600 mt-0.5">
                              {cand.vacancyTitle}
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-500 text-[11px] font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            {cand.rating}.0
                          </div>
                        </div>

                        {/* AI CV Badge & Parsed Skills */}
                        {cand.cvFileName && (
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-[10px]">
                            <div className="flex items-center gap-1.5 text-slate-600 font-mono">
                              <FileText className="w-3.5 h-3.5 text-indigo-600" />
                              <span className="truncate">{cand.cvFileName}</span>
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold">
                                Parsed
                              </span>
                            </div>
                            {cand.parsedSkills && cand.parsedSkills.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {cand.parsedSkills.map((s, idx) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-semibold"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="text-[11px] text-slate-500 space-y-1">
                          <div className="flex items-center justify-between">
                            <span>მოთხოვნა:</span>
                            <strong className="text-slate-900 font-black">
                              {formatGEL(cand.expectedSalaryGross)}
                            </strong>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                          {nextStage && nextStage !== 'აყვანილია' && (
                            <button
                              onClick={() => triggerStageChange(cand, nextStage)}
                              className="w-full py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                            >
                              <span>➔ {nextStage}</span>
                            </button>
                          )}
                          {stage !== 'აყვანილია' && (
                            <button
                              onClick={() => triggerStageChange(cand, 'აყვანილია')}
                              className="w-full py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 transition cursor-pointer transform active:scale-95"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>1-კლიკით აყვანა ✨</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: Public Career Page Preview */}
      {activeTab === 'careerPage' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 space-y-8 animate-in fade-in duration-200">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              კარიერული პორტალი • careers.hrnexa.ge
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              შემოუერთდით HR NEXA-ს გუნდს! 🚀
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              ჩვენ ვქმნით ულტრათანამედროვე SaaS პროდუქტებს. გთავაზობთ კონკურენტულ ანაზღაურებას,
              EWA სერვისს, ჯანმრთელობის დაზღვევასა და უწყვეტ პროფესიულ სწავლებას.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: 'Senior React / Next.js დეველოპერი',
                dept: 'IT დეპარტამენტი',
                loc: 'თბილისი • ჰიბრიდული',
                salary: '5,500 — 7,500 ₾',
              },
              {
                title: 'Product Manager (B2B SaaS)',
                dept: 'IT დეპარტამენტი',
                loc: 'თბილისი • ოფისი',
                salary: '5,000 — 6,500 ₾',
              },
              {
                title: 'B2B გაყიდვების მენეჯერი',
                dept: 'გაყიდვები და მარკეტინგი',
                loc: 'ბათუმი / თბილისი',
                salary: '3,500 ₾ + საბონუსე სისტემა',
              },
            ].map((vac, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-lg transition space-y-4"
              >
                <div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    {vac.dept}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 mt-2">{vac.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{vac.loc}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <div className="font-black text-sm text-slate-900">{vac.salary}</div>
                  <button
                    onClick={() => {
                      setCandVacancy(vac.title);
                      setShowNewCandidateModal(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                  >
                    აპლიკაცია (Apply)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1-Click Hire Modal */}
      {hireModalCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-emerald-100" />
                <h3 className="font-extrabold text-sm">თანამშრომლად გაფორმება (One-Click Hire)</h3>
              </div>
              <button
                onClick={() => setHireModalCandidate(null)}
                className="p-1 rounded-lg bg-white/10 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmHire} className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-slate-500">კანდიდატი:</div>
                  <div className="font-extrabold text-sm text-slate-900">
                    {hireModalCandidate.firstName} {hireModalCandidate.lastName}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">პოზიცია:</div>
                  <div className="font-bold text-indigo-700">{hireModalCandidate.vacancyTitle}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ხელშეკრულება:</label>
                  <select
                    value={hireContract}
                    onChange={(e) => setHireContract(e.target.value as ContractType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="გამოსაცდელი ვადა">გამოსაცდელი ვადა</option>
                    <option value="უვადო">უვადო</option>
                    <option value="ვადიანი">ვადიანი</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">დარიცხული Gross ₾:</label>
                  <input
                    type="number"
                    value={hireGross}
                    onChange={(e) => setHireGross(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex justify-between">
                <span>ხელზე (Net):</span>
                <strong className="text-emerald-700">{formatGEL(previewTax.netSalary)}</strong>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setHireModalCandidate(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700"
                >
                  გაუქმება
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-md cursor-pointer"
                >
                  დადასტურება ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Candidate with AI CV Parser Modal */}
      {showNewCandidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm">CV ატვირთვა & AI Parsing</h3>
              </div>
              <button
                onClick={() => setShowNewCandidateModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCandidate} className="p-6 space-y-4 text-xs">
              {/* CV File Drop Zone Simulation */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 text-center space-y-1">
                <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto" />
                <div className="font-bold text-slate-800 text-xs">
                  აირჩიეთ CV ფაილი (PDF / Word)
                </div>
                <div className="text-[10px] text-indigo-600 font-mono">
                  {candCvName} • AI Auto-Parsing აქტიურია
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">სახელი:</label>
                  <input
                    type="text"
                    required
                    placeholder="მაგ: გიორგი"
                    value={candFirst}
                    onChange={(e) => setCandFirst(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">გვარი:</label>
                  <input
                    type="text"
                    required
                    placeholder="მაგ: კობახიძე"
                    value={candLast}
                    onChange={(e) => setCandLast(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ვაკანსია:</label>
                <input
                  type="text"
                  required
                  value={candVacancy}
                  onChange={(e) => setCandVacancy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">მოთხოვნილი Gross ₾:</label>
                <input
                  type="number"
                  step={100}
                  value={candSalary}
                  onChange={(e) => setCandSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCandidateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700"
                >
                  გაუქმება
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold shadow-md"
                >
                  დამატება
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
