import { Employee, TimesheetCode } from '@/types/hr';

export interface TimesheetSummary {
  workedDays: number;
  workedHours: number;
  overtimeHours: number;
  nightHours: number;
  holidayHours: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  sickLeaveDays: number;
  absentDays: number;
}

export interface PayrollBreakdown {
  employeeId: string;
  baseGross: number;
  unpaidLeaveDeductionGross: number;
  overtimeGross: number;
  nightAndHolidayGross: number;
  bonusGross: number;
  totalAccruedGross: number; // სულ დარიცხული (Gross)
  employeePension: number;   // 2%
  taxableBase: number;       // Gross - 2%
  incomeTax: number;         // 20% of (Gross - 2%)
  netBeforeDeductions: number;
  healthInsurance: number;
  finesDeduction: number;
  finalNetSalary: number;    // ხელზე ასაღები (Net)
  employerPension: number;   // დამსაქმებლის 2%
  totalCompanyCost: number;  // კომპანიის სრული ხარჯი (Gross + 2%)
}

export function calculateGrossToNet(gross: number, pensionEnrolled: boolean) {
  const cleanGross = Math.max(0, gross);
  const employeePension = pensionEnrolled ? +(cleanGross * 0.02).toFixed(2) : 0;
  const taxableBase = +(cleanGross - employeePension).toFixed(2);
  const incomeTax = +(taxableBase * 0.20).toFixed(2);
  const netSalary = +(cleanGross - employeePension - incomeTax).toFixed(2);
  const employerPension = pensionEnrolled ? +(cleanGross * 0.02).toFixed(2) : 0;
  const totalCompanyCost = +(cleanGross + employerPension).toFixed(2);

  return {
    gross: +cleanGross.toFixed(2),
    employeePension,
    taxableBase,
    incomeTax,
    netSalary,
    employerPension,
    totalCompanyCost,
  };
}

export function calculateNetToGross(targetNet: number, pensionEnrolled: boolean) {
  const cleanNet = Math.max(0, targetNet);
  // If pension enrolled: Net = Gross * (1 - 0.02) * (1 - 0.20) = Gross * 0.784
  // If not enrolled: Net = Gross * 0.80
  const factor = pensionEnrolled ? 0.784 : 0.80;
  const gross = +(cleanNet / factor).toFixed(2);
  return calculateGrossToNet(gross, pensionEnrolled);
}

export function summarizeEmployeeTimesheet(
  daysRow: Record<number, TimesheetCode>,
  daysInMonth = 30
): TimesheetSummary {
  let workedDays = 0;
  let workedHours = 0;
  let overtimeHours = 0;
  let nightHours = 0;
  let holidayHours = 0;
  let paidLeaveDays = 0;
  let unpaidLeaveDays = 0;
  let sickLeaveDays = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const code = daysRow[d] || 'დ';
    switch (code) {
      case '8':
        workedDays += 1;
        workedHours += 8;
        break;
      case 'ზ': // Overtime day: 8 standard + 3 overtime hours
        workedDays += 1;
        workedHours += 11;
        overtimeHours += 3;
        break;
      case 'ღ': // Night shift: 8 hours (including 6 night hours)
        workedDays += 1;
        workedHours += 8;
        nightHours += 6;
        break;
      case 'უქმე': // Public holiday
        holidayHours += 8;
        break;
      case 'შ':
        paidLeaveDays += 1;
        break;
      case 'უ':
        unpaidLeaveDays += 1;
        break;
      case 'ბ':
        sickLeaveDays += 1;
        break;
      default:
        break;
    }
  }

  const absentDays = paidLeaveDays + unpaidLeaveDays + sickLeaveDays;

  return {
    workedDays,
    workedHours,
    overtimeHours,
    nightHours,
    holidayHours,
    paidLeaveDays,
    unpaidLeaveDays,
    sickLeaveDays,
    absentDays,
  };
}

export function calculateEmployeeMonthlyPayroll(
  employee: Employee,
  summary: TimesheetSummary
): PayrollBreakdown {
  const standardMonthlyDays = 21;
  const standardMonthlyHours = 168;
  const dailyRate = employee.grossSalary / standardMonthlyDays;
  const hourlyRate = employee.grossSalary / standardMonthlyHours;

  const unpaidLeaveDeductionGross = +(summary.unpaidLeaveDays * dailyRate).toFixed(2);
  // Overtime at 1.25x hourly rate (Georgian Labor Code custom)
  const overtimeGross = +(summary.overtimeHours * hourlyRate * 1.25).toFixed(2);
  // Night hours bonus (+0.25x)
  const nightAndHolidayGross = +(summary.nightHours * hourlyRate * 0.25).toFixed(2);
  const bonusGross = employee.monthlyBonus || 0;

  const totalAccruedGross = Math.max(
    0,
    +(
      employee.grossSalary -
      unpaidLeaveDeductionGross +
      overtimeGross +
      nightAndHolidayGross +
      bonusGross
    ).toFixed(2)
  );

  const taxResult = calculateGrossToNet(totalAccruedGross, employee.pensionEnrolled);
  const healthInsurance = employee.healthInsuranceDeduction || 0;
  const finesDeduction = employee.monthlyDeduction || 0;
  const finalNetSalary = Math.max(
    0,
    +(taxResult.netSalary - healthInsurance - finesDeduction).toFixed(2)
  );

  return {
    employeeId: employee.id,
    baseGross: employee.grossSalary,
    unpaidLeaveDeductionGross,
    overtimeGross,
    nightAndHolidayGross,
    bonusGross,
    totalAccruedGross,
    employeePension: taxResult.employeePension,
    taxableBase: taxResult.taxableBase,
    incomeTax: taxResult.incomeTax,
    netBeforeDeductions: taxResult.netSalary,
    healthInsurance,
    finesDeduction,
    finalNetSalary,
    employerPension: taxResult.employerPension,
    totalCompanyCost: taxResult.totalCompanyCost,
  };
}

export function formatGEL(amount: number): string {
  return `${amount.toLocaleString('ka-GE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ₾`;
}
