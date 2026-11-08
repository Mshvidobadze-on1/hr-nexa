export type DepartmentName =
  | 'IT დეპარტამენტი'
  | 'ფინანსები და ბუღალტერია'
  | 'გაყიდვები და მარკეტინგი'
  | 'HR და ადმინისტრაცია';

export type ContractType = 'უვადო' | 'ვადიანი' | 'გამოსაცდელი ვადა';

export type WorkScheduleType =
  | 'სტანდარტული 5/2 (40სთ/კვ)'
  | 'ცვლადი გრაფიკი (2/2)'
  | 'მოქნილი (ჰიბრიდული)';

export type EmployeeStatus = 'აქტიური' | 'შვებულებაში' | 'ბიულეტენზე' | 'გათავისუფლებული';

export type TimesheetCode = '8' | 'შ' | 'უ' | 'ბ' | 'დ' | 'უქმე' | 'ზ' | 'ღ';

export interface TimesheetDayEntry {
  code: TimesheetCode;
  hours: number;
  overtimeHours?: number;
  nightHours?: number;
}

export interface OnboardingTask {
  id: string;
  title: string;
  category: 'IT აღჭურვილობა' | 'ხელშეკრულება' | 'ინდუქცია' | 'შემოვლის ფურცელი';
  completed: boolean;
  dueDate: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  personalId: string; // 11 digits
  birthDate: string; // YYYY-MM-DD
  phone: string;
  email: string;
  address: string;
  bankName: 'თიბისი ბანკი (TBC)' | 'საქართველოს ბანკი (BOG)';
  iban: string;
  department: DepartmentName;
  branch: 'თბილისის სათავო ოფისი' | 'ბათუმის ფილიალი' | 'ქუთაისის ფილიალი';
  position: string;
  managerId?: string;
  contractType: ContractType;
  hireDate: string;
  workSchedule: WorkScheduleType;
  grossSalary: number; // GEL
  pensionEnrolled: boolean;
  status: EmployeeStatus;
  avatarColor: string;
  // Leave Quotas
  paidLeaveQuota: number; // default 24
  accruedLeaveDays: number;
  usedPaidLeaveDays: number;
  usedUnpaidLeaveDays: number;
  usedSickLeaveDays: number;
  // Live Attendance today
  todayClockIn?: string;
  todayClockOut?: string;
  todayAttendanceStatus: 'დროულად' | 'დაგვიანებით' | 'შვებულებაში' | 'არ გამოცხადებულა';
  todayIpAddress?: string;
  todayLocation?: string;
  // Gamification & Points
  nexaPoints: number;
  // EWA Wallet (Earned Wage Access)
  withdrawnEwaAmount: number;
  // Payroll monthly extras
  monthlyBonus: number;
  monthlyDeduction: number;
  healthInsuranceDeduction: number;
  // Onboarding / Offboarding
  lifecycleType: 'ადაპტაცია (Onboarding)' | 'სტანდარტული' | 'წასვლა (Offboarding)';
  checklist: OnboardingTask[];
}

export type LeaveType =
  | 'ანაზღაურებადი შვებულება'
  | 'ანაზღაურების გარეშე'
  | 'საავადმყოფო ფურცელი / ბიულეტენი'
  | 'დეკრეტული შვებულება';

export type LeaveApprovalStatus =
  | 'მენეჯერის დასტურის მოლოდინში'
  | 'HR-ის დასტურის მოლოდინში'
  | 'დამტკიცებული'
  | 'უარყოფილი';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  workingDays: number;
  reason: string;
  status: LeaveApprovalStatus;
  createdAt: string;
  approvedByManagerAt?: string;
  approvedByHrAt?: string;
}

export type CandidateStage =
  | 'ახალი რეზიუმე'
  | 'სკრინინგი'
  | 'გასაუბრება'
  | 'ტესტირება'
  | 'შეთავაზება (Offer)'
  | 'აყვანილია';

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  personalId: string;
  phone: string;
  email: string;
  vacancyTitle: string;
  department: DepartmentName;
  expectedSalaryGross: number;
  experienceYears: number;
  stage: CandidateStage;
  appliedDate: string;
  rating: number; // 1-5
  notes: string;
  cvFileName?: string;
  parsedSkills?: string[];
  education?: string;
}

export interface KpiItem {
  id: string;
  title: string;
  weight: number; // %
  score: number;  // 0-100
}

export interface PerformanceEvaluation {
  id: string;
  employeeId: string;
  period: string; // e.g. '2026 Q3'
  evaluatorName: string;
  kpis: KpiItem[];
  peerFeedbackScore: number; // out of 5
  managerFeedbackScore: number; // out of 5
  selfAssessmentScore: number; // out of 5
  strengths: string;
  growthAreas: string;
  status: 'დასრულებული' | 'მიმდინარე' | 'დაგეგმილი';
}

export interface DocumentRequest {
  id: string;
  employeeId: string;
  documentType: 'ცნობა სამსახურიდან (ხელფასით)' | 'ცნობა სამსახურიდან (უხელფასოდ)' | 'შვებულების ბრძანების ასლი' | 'სარეკომენდაციო წერილი';
  language: 'ქართული (KA)' | 'ინგლისური (EN)';
  destination: string;
  status: 'დამუშავებაში' | 'მზადაა ჩამოსატვირთად';
  requestedAt: string;
}

export interface GeorgianHoliday {
  date: string; // MM-DD
  dayOfMonthNov?: number;
  name: string;
}

// -------------------------------------------------------------
// 3.1 BIOMETRICS & TURNSTILE ACCESS LOGS
// -------------------------------------------------------------
export interface TurnstileLog {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  timestamp: string;
  direction: 'IN' | 'OUT';
  deviceType: 'ტურნიკეტი (RFID)' | 'სახის ამოცნობა (Face ID)' | 'თითის ანაბეჭდი (Biometric)';
  location: string;
  status: 'ავტორიზებული' | 'დაგვიანება' | 'ზეგანაკვეთური' | 'არაავტორიზებული';
}

// -------------------------------------------------------------
// 3.2 LMS (LEARNING MANAGEMENT SYSTEM)
// -------------------------------------------------------------
export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'presentation' | 'article';
  videoUrl?: string;
  summary: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Course {
  id: string;
  title: string;
  category: 'HR & Management' | 'IT & Security' | 'FinTech & Law' | 'Soft Skills';
  description: string;
  instructor: string;
  thumbnail: string;
  totalDuration: string;
  pointsReward: number; // Gamification points
  lessons: CourseLesson[];
  quiz: QuizQuestion[];
  enrolledCount: number;
}

// -------------------------------------------------------------
// 3.3 EMPLOYEE EXPERIENCE: SOCIAL FEED & GAMIFICATION & EWA
// -------------------------------------------------------------
export interface SocialComment {
  id: string;
  authorName: string;
  authorRole: string;
  avatarColor: string;
  content: string;
  createdAt: string;
}

export interface SocialPost {
  id: string;
  authorName: string;
  authorRole: string;
  avatarColor: string;
  department: string;
  type: 'announcement' | 'kudos' | 'celebration' | 'poll';
  title?: string;
  content: string;
  likes: number;
  hasLiked?: boolean;
  comments: SocialComment[];
  createdAt: string;
  pollOptions?: { label: string; votes: number }[];
}

export interface RewardItem {
  id: string;
  title: string;
  category: 'დასვენება' | 'ვაუჩერი' | 'მერჩი' | 'კეთილდღეობა';
  costPoints: number;
  icon: string;
  description: string;
  availableStock: number;
}

export interface EwaTransaction {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  serviceFee: number;
  netTransferred: number;
  bankName: string;
  iban: string;
  requestedAt: string;
  status: 'ჩარიცხულია' | 'მოლოდინში';
}

// -------------------------------------------------------------
// 3.4 AI & ANALYTICS: PREDICTIVE FLIGHT RISK & AI CHAT
// -------------------------------------------------------------
export interface FlightRiskAnalysis {
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  riskScore: number; // 0-100%
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  keyFactors: string[];
  recommendation: string;
  lastEvaluationScore: number;
  overtimeHoursCount: number;
  unusedLeaveDays: number;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
}

// -------------------------------------------------------------
// AUTH, RBAC & DYNAMIC PERMISSIONS SYSTEM
// -------------------------------------------------------------
export type SystemRole = 'SUPER_ADMIN' | 'HR_ADMIN' | 'LINE_MANAGER' | 'EMPLOYEE';

export interface PermissionsRecord {
  canManageEmployees: boolean; // პერსონალის ბაზის ნახვა და მართვა
  canManageTimesheet: boolean; // ტაბელის მართვა და რედაქტირება
  canApproveLeaves: boolean;   // შვებულებების დამტკიცება / უარყოფა
  canManagePayroll: boolean;   // ხელფასების და უწყისების ნახვა/დათვლა
  canGenerateOrders: boolean;  // ბრძანებების და ცნობების გენერაცია
  canManageRecruitment: boolean;// რეკრუტინგის და ვაკანსიების მართვა
  canManageLms: boolean;        // LMS კურსების და ტესტების მართვა
  canViewAnalytics: boolean;   // AI და პროგნოზული ანალიტიკის ნახვა
  canRequestLeave: boolean;    // საკუთარი შვებულების მოთხოვნა
  canClockInOut: boolean;      // მოსვლა/წასვლის დაფიქსირება (Clock In/Out)
  canViewPayslip: boolean;     // საკუთარი სახელფასო ფურცლის (Payslip) ნახვა
  canUseEwa: boolean;          // ხელფასის წინასწარი გამოტანა (EWA)
}

export interface UserAccount {
  id: string;
  username: string; // e.g. "g.beridze"
  password: string; // e.g. "123456"
  fullName: string;
  role: 'HR_ADMIN' | 'LINE_MANAGER' | 'EMPLOYEE';
  employeeId?: string; // linked Employee id
  department?: DepartmentName;
  status: 'აქტიური' | 'დაბლოკილი';
  customPermissions?: Partial<PermissionsRecord>;
  createdAt: string;
}

export interface CurrentUserSession {
  id: string;
  username: string;
  fullName: string;
  role: SystemRole;
  employeeId?: string;
  department?: DepartmentName;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: SystemRole;
  action: string;
  details: string;
  ipAddress: string;
}
