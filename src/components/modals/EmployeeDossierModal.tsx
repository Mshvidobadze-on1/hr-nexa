'use client';

import React, { useState } from 'react';
import { Employee, ContractType, WorkScheduleType } from '@/types/hr';
import { useHR } from '@/context/HRContext';
import { calculateGrossToNet, formatGEL } from '@/lib/payroll';
import { DocumentPrintModal, OfficialDocType } from './DocumentPrintModal';
import {
  X,
  User,
  Briefcase,
  FileText,
  CreditCard,
  CheckCircle2,
  Printer,
  Save,
} from 'lucide-react';

interface Props {
  employee: Employee;
  onClose: () => void;
}

export function EmployeeDossierModal({ employee, onClose }: Props) {
  const { updateEmployee, currentUser, hasPermission } = useHR();
  const [activeTab, setActiveTab] = useState<'personal' | 'contract' | 'documents'>('personal');
  const [grossSalary, setGrossSalary] = useState(employee.grossSalary);
  const [pensionEnrolled, setPensionEnrolled] = useState(employee.pensionEnrolled);
  const [contractType, setContractType] = useState<ContractType>(employee.contractType);
  const [workSchedule, setWorkSchedule] = useState<WorkScheduleType>(employee.workSchedule);
  const [iban, setIban] = useState(employee.iban);
  const [phone, setPhone] = useState(employee.phone);
  const [address, setAddress] = useState(employee.address);
  const [printDoc, setPrintDoc] = useState<OfficialDocType | null>(null);

  const tax = calculateGrossToNet(grossSalary, pensionEnrolled);

  const handleSave = () => {
    updateEmployee(employee.id, {
      grossSalary,
      pensionEnrolled,
      contractType,
      workSchedule,
      iban,
      phone,
      address,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden my-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl ${employee.avatarColor} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                >
                  {employee.firstName[0]}
                  {employee.lastName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-bold">
                      {employee.firstName} {employee.lastName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {employee.status}
                    </span>
                  </div>
                  <p className="text-sm text-indigo-200 mt-0.5">
                    {employee.position} • {employee.department}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    პ/ნ: {employee.personalId} • IBAN: {employee.iban}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mt-6 border-t border-white/10 pt-4">
              <button
                onClick={() => setActiveTab('personal')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'personal'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <User className="w-4 h-4" />
                პირადი ინფორმაცია
              </button>
              <button
                onClick={() => setActiveTab('contract')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'contract'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                ხელშეკრულება და ანაზღაურება
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'documents'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <FileText className="w-4 h-4" />
                დოკუმენტები და ბრძანებები
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 text-sm space-y-5">
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs text-slate-500">სახელი და გვარი</div>
                    <div className="font-semibold text-slate-900 mt-0.5">
                      {employee.firstName} {employee.lastName}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs text-slate-500">პირადი ნომერი (11 ციფრი)</div>
                    <div className="font-mono font-semibold text-slate-900 mt-0.5">
                      {employee.personalId}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs text-slate-500">დაბადების თარიღი</div>
                    <div className="font-semibold text-slate-900 mt-0.5">{employee.birthDate}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs text-slate-500">კორპორატიული ელ-ფოსტა</div>
                    <div className="font-semibold text-slate-900 mt-0.5">{employee.email}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ტელეფონი
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ფაქტობრივი მისამართი
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-slate-800">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    საბანკო რეკვიზიტები ({employee.bankName})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        საბანკო ანგარიშის ნომერი (IBAN)
                      </label>
                      <input
                        type="text"
                        value={iban}
                        onChange={(e) => setIban(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs bg-white"
                      />
                    </div>
                    <div className="flex items-end">
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4" />
                        ვერიფიცირებულია სახელფასო რეესტრში
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contract' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ხელშეკრულების ტიპი
                    </label>
                    <select
                      value={contractType}
                      onChange={(e) => setContractType(e.target.value as ContractType)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="უვადო">უვადო</option>
                      <option value="ვადიანი">ვადიანი</option>
                      <option value="გამოსაცდელი ვადა">გამოსაცდელი ვადა</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      სამუშაო გრაფიკი
                    </label>
                    <select
                      value={workSchedule}
                      onChange={(e) => setWorkSchedule(e.target.value as WorkScheduleType)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="სტანდარტული 5/2 (40სთ/კვ)">სტანდარტული 5/2 (40სთ/კვ)</option>
                      <option value="ცვლადი გრაფიკი (2/2)">ცვლადი გრაფიკი (2/2)</option>
                      <option value="მოქნილი (ჰიბრიდული)">მოქნილი (ჰიბრიდული)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      დარიცხული ხელფასი (Gross - ₾)
                    </label>
                    <input
                      type="number"
                      step={50}
                      value={grossSalary}
                      onChange={(e) => setGrossSalary(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      საპენსიო სქემაში ჩართულობა
                    </label>
                    <select
                      value={pensionEnrolled ? 'კი' : 'არა'}
                      onChange={(e) => setPensionEnrolled(e.target.value === 'კი')}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
                    >
                      <option value="კი">საპენსიო სქემაში ჩართული: კი (2% + 2%)</option>
                      <option value="არა">საპენსიო სქემაში ჩართული: არა (0%)</option>
                    </select>
                  </div>
                </div>

                {/* Breakdown Card */}
                <div className="p-4 rounded-xl bg-slate-900 text-white grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="text-[11px] text-slate-400">დარიცხული (Gross)</div>
                    <div className="text-base font-bold mt-0.5">{formatGEL(tax.gross)}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">საპენსიო (2%)</div>
                    <div className="text-base font-bold text-amber-400 mt-0.5">
                      {formatGEL(tax.employeePension)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">საშემოსავლო (20%)</div>
                    <div className="text-base font-bold text-rose-400 mt-0.5">
                      {formatGEL(tax.incomeTax)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">ხელზე ასაღები (Net)</div>
                    <div className="text-base font-bold text-emerald-400 mt-0.5">
                      {formatGEL(tax.netSalary)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  აირჩიეთ ოფიციალური HR ბრძანება ან ცნობა ავტომატური გენერაციისა და ბეჭდვისთვის:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    [
                      {
                        type: 'მიღების ბრძანება',
                        desc: 'საქართველოს შრომის კოდექსის მე-11 მუხლის შესაბამისად',
                      },
                      {
                        type: 'შვებულების ბრძანება',
                        desc: 'ანაზღაურებადი შვებულების ბრძანება და ბალანსი',
                      },
                      {
                        type: 'გათავისუფლების ბრძანება',
                        desc: 'შრომითი ხელშეკრულების შეწყვეტისა და ანგარიშსწორების ბრძანება',
                      },
                      {
                        type: 'ცნობა სამსახურიდან (KA)',
                        desc: 'ქართულ ენაზე — ბანკში ან დანიშნულებისამებრ წარსადგენად',
                      },
                      {
                        type: 'ცნობა სამსახურიდან (EN)',
                        desc: 'ინგლისურ ენაზე — საელჩოში / საკონსულოში წარსადგენად',
                      },
                    ] as const
                  ).map((doc) => (
                    <div
                      key={doc.type}
                      className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/70 flex items-center justify-between gap-3 transition"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{doc.type}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{doc.desc}</div>
                      </div>
                      <button
                        onClick={() => setPrintDoc(doc.type)}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        გენერაცია
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-500">
                მიღების თარიღი: <strong>{employee.hireDate}</strong> • ფილიალი:{' '}
                <strong>{employee.branch}</strong>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-xs"
                >
                  დახურვა
                </button>
                {(currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'HR_ADMIN' || currentUser?.role === 'LINE_MANAGER' || hasPermission('canManageEmployees')) && activeTab !== 'documents' && (
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    ცვლილებების შენახვა
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {printDoc && (
        <DocumentPrintModal
          employee={employee}
          docType={printDoc}
          onClose={() => setPrintDoc(null)}
        />
      )}
    </>
  );
}
