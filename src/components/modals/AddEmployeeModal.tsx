'use client';

import React, { useState } from 'react';
import { useHR } from '@/context/HRContext';
import { ContractType, DepartmentName, WorkScheduleType } from '@/types/hr';
import { calculateGrossToNet, formatGEL } from '@/lib/payroll';
import { UserPlus, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function AddEmployeeModal({ onClose }: Props) {
  const { addEmployee } = useHR();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [personalId, setPersonalId] = useState('01029088412');
  const [phone, setPhone] = useState('+995 599 ');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState<DepartmentName>('IT დეპარტამენტი');
  const [position, setPosition] = useState('');
  const [branch, setBranch] = useState<
    'თბილისის სათავო ოფისი' | 'ბათუმის ფილიალი' | 'ქუთაისის ფილიალი'
  >('თბილისის სათავო ოფისი');
  const [contractType, setContractType] = useState<ContractType>('უვადო');
  const [workSchedule, setWorkSchedule] =
    useState<WorkScheduleType>('სტანდარტული 5/2 (40სთ/კვ)');
  const [bankName, setBankName] = useState<'თიბისი ბანკი (TBC)' | 'საქართველოს ბანკი (BOG)'>(
    'თიბისი ბანკი (TBC)'
  );
  const [iban, setIban] = useState('GE29TB7700112233445566');
  const [grossSalary, setGrossSalary] = useState(4500);
  const [pensionEnrolled, setPensionEnrolled] = useState(true);

  const previewTax = calculateGrossToNet(grossSalary, pensionEnrolled);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !position.trim()) return;

    addEmployee({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      personalId,
      birthDate: '1995-06-15',
      phone,
      email: email || `${firstName.toLowerCase()}@hrnexa.ge`,
      address: 'თბილისი, ჭავჭავაძის გამზ. #34',
      bankName,
      iban,
      department,
      branch,
      position,
      contractType,
      hireDate: '2026-11-03',
      workSchedule,
      grossSalary,
      pensionEnrolled,
      status: 'აქტიური',
      avatarColor: 'bg-indigo-600',
      paidLeaveQuota: 24,
      accruedLeaveDays: 24,
      usedPaidLeaveDays: 0,
      usedUnpaidLeaveDays: 0,
      usedSickLeaveDays: 0,
      todayClockIn: '09:55',
      todayAttendanceStatus: 'დროულად',
      todayIpAddress: '188.169.214.12 (თბილისი HQ)',
      todayLocation: branch,
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
          completed: false,
          dueDate: '2026-11-05',
        },
        {
          id: `chk-${Date.now()}-2`,
          title: 'კორპორატიული ლეპტოპის და ელ-ფოსტის გადაცემა',
          category: 'IT აღჭურვილობა',
          completed: false,
          dueDate: '2026-11-05',
        },
      ],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-base">ახალი თანამშრომლის რეგისტრაცია</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                სახელი (ქართულად) *
              </label>
              <input
                type="text"
                required
                placeholder="მაგ: ალექსანდრე"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                გვარი (ქართულად) *
              </label>
              <input
                type="text"
                required
                placeholder="მაგ: ჯავახიშვილი"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                პირადი ნომერი (11 ციფრი) *
              </label>
              <input
                type="text"
                maxLength={11}
                required
                value={personalId}
                onChange={(e) => setPersonalId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ტელეფონის ნომერი
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                დეპარტამენტი *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as DepartmentName)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="IT დეპარტამენტი">IT დეპარტამენტი</option>
                <option value="ფინანსები და ბუღალტერია">ფინანსები და ბუღალტერია</option>
                <option value="გაყიდვები და მარკეტინგი">გაყიდვები და მარკეტინგი</option>
                <option value="HR და ადმინისტრაცია">HR და ადმინისტრაცია</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                პოზიცია / თანამდებობა *
              </label>
              <input
                type="text"
                required
                placeholder="მაგ: უფროსი ბიზნეს ანალიტიკოსი"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ფილიალი
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value as typeof branch)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="თბილისის სათავო ოფისი">თბილისის სათავო ოფისი</option>
                <option value="ბათუმის ფილიალი">ბათუმის ფილიალი</option>
                <option value="ქუთაისის ფილიალი">ქუთაისის ფილიალი</option>
              </select>
            </div>
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
                მომსახურე ბანკი
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value as typeof bankName)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="თიბისი ბანკი (TBC)">თიბისი ბანკი (TBC)</option>
                <option value="საქართველოს ბანკი (BOG)">საქართველოს ბანკი (BOG)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                საბანკო ანგარიში (IBAN)
              </label>
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                დარიცხული ხელფასი (Gross - ₾)
              </label>
              <input
                type="number"
                min={500}
                step={100}
                value={grossSalary}
                onChange={(e) => setGrossSalary(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pensionEnrolled}
                  onChange={(e) => setPensionEnrolled(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span className="text-xs font-medium text-slate-800">
                  საპენსიო სქემაში ჩართული (2% + 2%)
                </span>
              </label>
            </div>
          </div>

          {/* Live Tax Preview Box */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500">დარიცხული (Gross):</span>{' '}
              <strong className="text-slate-900">{formatGEL(previewTax.gross)}</strong>
            </div>
            <div>
              <span className="text-slate-500">საპენსიო (2%):</span>{' '}
              <strong className="text-amber-700">{formatGEL(previewTax.employeePension)}</strong>
            </div>
            <div>
              <span className="text-slate-500">საშემოსავლო (20%):</span>{' '}
              <strong className="text-rose-700">{formatGEL(previewTax.incomeTax)}</strong>
            </div>
            <div>
              <span className="text-slate-500">ხელზე ასაღები (Net):</span>{' '}
              <strong className="text-emerald-700 text-sm">{formatGEL(previewTax.netSalary)}</strong>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
            >
              გაუქმება
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm"
            >
              თანამშრომლის დამატება
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
