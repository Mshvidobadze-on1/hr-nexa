'use client';

import React from 'react';
import { Employee } from '@/types/hr';
import { calculateGrossToNet, formatGEL } from '@/lib/payroll';
import { Printer, X, ShieldCheck, Building2 } from 'lucide-react';

export type OfficialDocType =
  | 'მიღების ბრძანება'
  | 'შვებულების ბრძანება'
  | 'გათავისუფლების ბრძანება'
  | 'ცნობა სამსახურიდან (KA)'
  | 'ცნობა სამსახურიდან (EN)';

interface Props {
  employee: Employee;
  docType: OfficialDocType;
  destination?: string;
  onClose: () => void;
}

export function DocumentPrintModal({ employee, docType, destination, onClose }: Props) {
  const tax = calculateGrossToNet(employee.grossSalary, employee.pensionEnrolled);
  const orderNumber = `№ HR-2026/${employee.personalId.slice(-4)}`;
  const todayFormatted = '03 ნოემბერი, 2026 წ.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden my-8">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">
              ოფიციალური HR დოკუმენტის გენერატორი — {docType}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium transition"
            >
              <Printer className="w-4 h-4" />
              დაბეჭდვა / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 md:p-10 bg-white text-slate-900 space-y-6 text-sm leading-relaxed">
          {/* Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900">შპს „ეიჩარ ნექსა საქართველო“</h2>
                <p className="text-xs text-slate-500">
                  ს/კ: 405928174 • ქ. თბილისი, ი. ჭავჭავაძის გამზ. #34
                </p>
                <p className="text-xs text-slate-500">
                  ტელ: +995 32 2 42 42 42 • info@hrnexa.ge • www.hrnexa.ge
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-600">
              <div className="font-semibold text-slate-900">{orderNumber}</div>
              <div>თარიღი: {todayFormatted}</div>
              <div>ქ. თბილისი</div>
            </div>
          </div>

          {docType === 'მიღების ბრძანება' && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <h3 className="text-base font-bold uppercase tracking-wide">
                  ბრძანება {orderNumber}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  თანამშრომლის სამუშაოზე მიღების შესახებ
                </p>
              </div>
              <p>
                საქართველოს ორგანული კანონის „საქართველოს შრომის კოდექსის“ მე-11 და მე-12 მუხლების
                შესაბამისად, ვბრძანებ:
              </p>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li>
                  დაინიშნოს <strong>{employee.firstName} {employee.lastName}</strong> (პირადი ნომერი:{' '}
                  <strong>{employee.personalId}</strong>) შპს „ეიჩარ ნექსა საქართველოს“{' '}
                  <strong>{employee.department}</strong>ს <strong>{employee.position}</strong>ს
                  პოზიციაზე <strong>{employee.hireDate}</strong>-დან.
                </li>
                <li>
                  შრომითი ხელშეკრულების ტიპი განისაზღვროს როგორც: <strong>{employee.contractType}</strong>,
                  სამუშაო გრაფიკი: <strong>{employee.workSchedule}</strong>.
                </li>
                <li>
                  თანამშრომელს განესაზღვროს ყოველთვიური დარიცხული შრომის ანაზღაურება (Gross){' '}
                  <strong>{formatGEL(employee.grossSalary)}</strong> (ხელზე ასაღები Net:{' '}
                  <strong>{formatGEL(tax.netSalary)}</strong>) ოდენობით.
                </li>
                <li>
                  ბრძანება ძალაშია ხელმოწერისთანავე და გადაეცეს ფინანსურ და HR დეპარტამენტებს
                  შესასრულებლად.
                </li>
              </ol>
            </div>
          )}

          {docType === 'შვებულების ბრძანება' && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <h3 className="text-base font-bold uppercase tracking-wide">
                  ბრძანება {orderNumber}-შ
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  ყოველწლიური ანაზღაურებადი შვებულების მიცემის შესახებ
                </p>
              </div>
              <p>
                საქართველოს ორგანული კანონის „საქართველოს შრომის კოდექსის“ 31-ე მუხლისა და
                თანამშრომლის პირადი განცხადების საფუძველზე, ვბრძანებ:
              </p>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li>
                  მიეცეს <strong>{employee.department}</strong>ს თანამშრომელს,{' '}
                  <strong>{employee.firstName} {employee.lastName}</strong>-ს (პ/ნ:{' '}
                  <strong>{employee.personalId}</strong>) კუთვნილი ანაზღაურებადი შვებულება 5 სამუშაო
                  დღის ოდენობით.
                </li>
                <li>
                  შვებულების დარჩენილი წლიური ბალანსი შეადგენს:{' '}
                  <strong>{employee.paidLeaveQuota - employee.usedPaidLeaveDays} სამუშაო დღეს</strong>{' '}
                  (წლიური კვოტა: {employee.paidLeaveQuota} სამუშაო დღე).
                </li>
                <li>
                  დაევალოს ბუღალტერიას შვებულების თანხის ანაზღაურება კანონმდებლობით დადგენილი წესით
                  საბანკო ანგარიშზე: <strong>{employee.iban}</strong>.
                </li>
              </ol>
            </div>
          )}

          {docType === 'გათავისუფლების ბრძანება' && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <h3 className="text-base font-bold uppercase tracking-wide">
                  ბრძანება {orderNumber}-გ
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  შრომითი ხელშეკრულების შეწყვეტის შესახებ
                </p>
              </div>
              <p>
                საქართველოს ორგანული კანონის „საქართველოს შრომის კოდექსის“ 47-ე მუხლის პირველი
                პუნქტის შესაბამისად, ვბრძანებ:
              </p>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li>
                  შეწყდეს შრომითი ურთიერთობა <strong>{employee.firstName} {employee.lastName}</strong>
                  -თან (პ/ნ: <strong>{employee.personalId}</strong>), დაკავებული პოზიცია:{' '}
                  <strong>{employee.position}</strong> ({employee.department}).
                </li>
                <li>
                  დაევალოს ფინანსებისა და ბუღალტერიის დეპარტამენტს თანამშრომელთან საბოლოო
                  ანგარიშსწორების (მათ შორის გამოუყენებელი შვებულების კომპენსაციის —{' '}
                  {employee.paidLeaveQuota - employee.usedPaidLeaveDays} დღე) განხორციელება არაუგვიანეს
                  7 კალენდარული დღისა.
                </li>
              </ol>
            </div>
          )}

          {docType === 'ცნობა სამსახურიდან (KA)' && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <h3 className="text-base font-bold uppercase tracking-wide">
                  ცნობა სამსახურიდან
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  წარსადგენად: {destination || 'დანიშნულებისამებრ წარსადგენად'}
                </p>
              </div>
              <p>
                ეძლევა <strong>{employee.firstName} {employee.lastName}</strong>-ს (პირადი ნომერი:{' '}
                <strong>{employee.personalId}</strong>) მასზედ, რომ იგი ნამდვილად მუშაობს შპს
                „ეიჩარ ნექსა საქართველო“-ში (ს/კ 405928174) <strong>{employee.hireDate}</strong>-დან
                დღემდე, <strong>{employee.department}</strong>ს <strong>{employee.position}</strong>ს
                პოზიციაზე.
              </p>
              <p>
                მისი ყოველთვიური დარიცხული შრომის ანაზღაურება (Gross) შეადგენს{' '}
                <strong>{formatGEL(employee.grossSalary)}</strong>-ს, ხოლო საქართველოს კანონმდებლობით
                გათვალისწინებული საშემოსავლო გადასახადისა (20%) და საპენსიო შენატანის ({employee.pensionEnrolled ? '2%' : '0%'})
                დაქვითვის შემდეგ ხელზე ასაღები თანხა (Net) შეადგენს{' '}
                <strong>{formatGEL(tax.netSalary)}</strong>-ს.
              </p>
              <p>
                ხელფასის ჩარიცხვა ხორციელდება ყოველთვიურად <strong>{employee.bankName}</strong>-ის
                ანგარიშზე: <strong>{employee.iban}</strong>.
              </p>
            </div>
          )}

          {docType === 'ცნობა სამსახურიდან (EN)' && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <h3 className="text-base font-bold uppercase tracking-wide">
                  CERTIFICATE OF EMPLOYMENT & INCOME
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  To Whom It May Concern ({destination || 'Embassy / Financial Institution'})
                </p>
              </div>
              <p>
                This is to certify that <strong>{employee.firstName} {employee.lastName}</strong>{' '}
                (Georgian Personal ID: <strong>{employee.personalId}</strong>) has been employed full-time at{' '}
                <strong>HR NEXA Georgia LLC</strong> (ID: 405928174) since{' '}
                <strong>{employee.hireDate}</strong>, currently holding the position of{' '}
                <strong>{employee.position}</strong> in the <strong>{employee.department}</strong>.
              </p>
              <p>
                Their monthly Gross salary amounts to <strong>{formatGEL(employee.grossSalary)}</strong>{' '}
                (Net monthly salary after Georgian Income Tax 20% and Pension contribution:{' '}
                <strong>{formatGEL(tax.netSalary)}</strong>). During their annual paid vacation, the
                company retains their position and regular remuneration.
              </p>
            </div>
          )}

          {/* Signatures & Official Stamp */}
          <div className="pt-8 mt-6 border-t border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">უფლებამოსილი პირი:</p>
              <p className="font-bold text-slate-900 mt-1">ნინო კაპანაძე</p>
              <p className="text-xs text-slate-600">HR დირექტორი • შპს „ეიჩარ ნექსა საქართველო“</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right font-serif italic text-indigo-700 text-lg select-none">
                ნ. კაპანაძე
              </div>
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-indigo-600/70 flex flex-col items-center justify-center text-center p-2 text-[10px] font-bold text-indigo-700 rotate-[-12deg] select-none">
                <span>შპს HR NEXA</span>
                <span className="text-[9px] font-normal">ს/კ 405928174</span>
                <span>ელ. ბეჭედი</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
