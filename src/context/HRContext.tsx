'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AuditLogEntry,
  Candidate,
  CandidateStage,
  CurrentUserSession,
  DocumentRequest,
  Employee,
  LeaveRequest,
  PerformanceEvaluation,
  PermissionsRecord,
  SystemRole,
  TimesheetCode,
  UserAccount,
  Course,
  SocialPost,
  RewardItem,
  TurnstileLog,
  FlightRiskAnalysis,
  EwaTransaction,
} from '@/types/hr';
import {
  buildInitialTimesheet,
  DEFAULT_ROLE_PERMISSIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CANDIDATES,
  INITIAL_DOCUMENT_REQUESTS,
  INITIAL_EMPLOYEES,
  INITIAL_EVALUATIONS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_USER_ACCOUNTS,
  INITIAL_COURSES,
  INITIAL_POSTS,
  INITIAL_REWARDS,
  INITIAL_TURNSTILE_LOGS,
  INITIAL_FLIGHT_RISKS,
  INITIAL_EWA_TRANSACTIONS,
} from '@/data/mockData';

export type ModuleId =
  | 'super-admin'
  | 'dashboard'
  | 'employees'
  | 'timesheet'
  | 'leaves'
  | 'payroll'
  | 'recruitment'
  | 'lms'
  | 'social-feed'
  | 'gamification'
  | 'ewa'
  | 'ai-assistant'
  | 'biometrics'
  | 'performance'
  | 'ess';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning';
}

interface HRContextType {
  currentUser: CurrentUserSession | null;
  activeModule: ModuleId;
  setActiveModule: (m: ModuleId) => void;
  viewDevice: 'desktop' | 'mobile';
  setViewDevice: (d: 'desktop' | 'mobile') => void;
  userAccounts: UserAccount[];
  rolePermissions: Record<'HR_ADMIN' | 'LINE_MANAGER' | 'EMPLOYEE', PermissionsRecord>;
  auditLogs: AuditLogEntry[];
  employees: Employee[];
  timesheet: Record<string, Record<number, TimesheetCode>>;
  leaveRequests: LeaveRequest[];
  candidates: Candidate[];
  evaluations: PerformanceEvaluation[];
  documentRequests: DocumentRequest[];
  // NEW NEXA MODULES
  courses: Course[];
  socialPosts: SocialPost[];
  rewards: RewardItem[];
  turnstileLogs: TurnstileLog[];
  flightRisks: FlightRiskAnalysis[];
  ewaTransactions: EwaTransaction[];
  toasts: ToastMessage[];
  notify: (title: string, description?: string, type?: 'success' | 'info' | 'warning') => void;
  // Auth methods
  login: (username: string, password: string) => { success: boolean; error?: string };
  loginSuperAdmin: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  hasPermission: (key: keyof PermissionsRecord) => boolean;
  getUserEffectivePermissions: (user: UserAccount) => PermissionsRecord;
  // Super Admin Management Actions
  createUserAccount: (acc: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  updateUserAccount: (id: string, partial: Partial<UserAccount>) => void;
  deleteUserAccount: (id: string) => void;
  updateRolePermissions: (role: 'HR_ADMIN' | 'LINE_MANAGER' | 'EMPLOYEE', key: keyof PermissionsRecord, value: boolean) => void;
  updateUserCustomPermission: (userId: string, key: keyof PermissionsRecord, value: boolean | undefined) => void;
  addAuditLog: (action: string, details: string) => void;
  // HR Module Actions
  addEmployee: (emp: Omit<Employee, 'id'>) => Employee;
  updateEmployee: (id: string, partial: Partial<Employee>) => void;
  toggleChecklistTask: (empId: string, taskId: string) => void;
  addChecklistTask: (empId: string, title: string, category: 'IT აღჭურვილობა' | 'ხელშეკრულება' | 'ინდუქცია' | 'შემოვლის ფურცელი') => void;
  updateTimesheetCell: (empId: string, day: number, code: TimesheetCode) => void;
  regenerateTimesheet: () => void;
  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>) => void;
  approveLeaveRequest: (reqId: string) => void;
  rejectLeaveRequest: (reqId: string) => void;
  moveCandidateStage: (candId: string, newStage: CandidateStage) => void;
  addCandidate: (cand: Omit<Candidate, 'id' | 'appliedDate'>) => void;
  hireCandidateAsEmployee: (candId: string, empData: Omit<Employee, 'id'>) => void;
  addEvaluation: (evalItem: Omit<PerformanceEvaluation, 'id'>) => void;
  requestDocument: (req: Omit<DocumentRequest, 'id' | 'status' | 'requestedAt'>) => void;
  // LMS Actions
  completeCourseQuiz: (courseId: string, earnedPoints: number) => void;
  // Social Feed Actions
  likePost: (postId: string) => void;
  addPostComment: (postId: string, text: string) => void;
  createPost: (post: Omit<SocialPost, 'id' | 'likes' | 'comments' | 'createdAt'>) => void;
  votePoll: (postId: string, optionIndex: number) => void;
  // Gamification Actions
  redeemReward: (rewardId: string) => boolean;
  awardPoints: (empId: string, points: number, reason: string) => void;
  // EWA FinTech Actions
  requestEwa: (empId: string, amount: number) => { success: boolean; error?: string };
  // Attendance Clock
  clockedInSession: { active: boolean; startTime: string; elapsedSeconds: number };
  toggleClockInOut: () => void;
  // Floating AI Chat
  isAiChatOpen: boolean;
  setIsAiChatOpen: (open: boolean) => void;
  toggleAiChat: () => void;
}

const HRContext = createContext<HRContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'hrnexa_current_user',
  ACCOUNTS: 'hrnexa_user_accounts',
  PERMISSIONS: 'hrnexa_role_permissions',
  LOGS: 'hrnexa_audit_logs',
  EMPLOYEES: 'hrnexa_employees',
  TIMESHEET: 'hrnexa_timesheet',
  LEAVES: 'hrnexa_leaves',
  CANDIDATES: 'hrnexa_candidates',
  EVALS: 'hrnexa_evaluations',
  DOCS: 'hrnexa_docs',
  COURSES: 'hrnexa_courses',
  POSTS: 'hrnexa_posts',
  REWARDS: 'hrnexa_rewards',
  TURNSTILE: 'hrnexa_turnstile_logs',
  FLIGHT_RISKS: 'hrnexa_flight_risks',
  EWA: 'hrnexa_ewa_tx',
  DEVICE: 'hrnexa_device_view',
  CLOCKED_IN: 'hrnexa_clocked_in_session',
};

export function HRProvider({ children }: { children: React.ReactNode }) {
  // Safe initializers from localStorage
  const [currentUser, setCurrentUser] = useState<CurrentUserSession | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeModule, setActiveModule] = useState<ModuleId>(() => {
    if (currentUser?.role === 'SUPER_ADMIN') return 'super-admin';
    return 'dashboard';
  });

  const [viewDevice, setViewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    if (typeof window === 'undefined') return INITIAL_USER_ACCOUNTS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      return saved ? JSON.parse(saved) : INITIAL_USER_ACCOUNTS;
    } catch {
      return INITIAL_USER_ACCOUNTS;
    }
  });

  const [rolePermissions, setRolePermissions] = useState<Record<'HR_ADMIN' | 'LINE_MANAGER' | 'EMPLOYEE', PermissionsRecord>>(() => {
    if (typeof window === 'undefined') return DEFAULT_ROLE_PERMISSIONS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PERMISSIONS);
      return saved ? JSON.parse(saved) : DEFAULT_ROLE_PERMISSIONS;
    } catch {
      return DEFAULT_ROLE_PERMISSIONS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    if (typeof window === 'undefined') return INITIAL_EMPLOYEES;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [timesheet, setTimesheet] = useState<Record<string, Record<number, TimesheetCode>>>(() => {
    if (typeof window === 'undefined') return buildInitialTimesheet(INITIAL_EMPLOYEES);
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIMESHEET);
      return saved ? JSON.parse(saved) : buildInitialTimesheet(INITIAL_EMPLOYEES);
    } catch {
      return buildInitialTimesheet(INITIAL_EMPLOYEES);
    }
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    if (typeof window === 'undefined') return INITIAL_LEAVE_REQUESTS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEAVES);
      return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
    } catch {
      return INITIAL_LEAVE_REQUESTS;
    }
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    if (typeof window === 'undefined') return INITIAL_CANDIDATES;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
    } catch {
      return INITIAL_CANDIDATES;
    }
  });

  const [evaluations, setEvaluations] = useState<PerformanceEvaluation[]>(() => {
    if (typeof window === 'undefined') return INITIAL_EVALUATIONS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVALS);
      return saved ? JSON.parse(saved) : INITIAL_EVALUATIONS;
    } catch {
      return INITIAL_EVALUATIONS;
    }
  });

  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>(() => {
    if (typeof window === 'undefined') return INITIAL_DOCUMENT_REQUESTS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCS);
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENT_REQUESTS;
    } catch {
      return INITIAL_DOCUMENT_REQUESTS;
    }
  });

  // NEW MODULES
  const [courses, setCourses] = useState<Course[]>(() => {
    if (typeof window === 'undefined') return INITIAL_COURSES;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() => {
    if (typeof window === 'undefined') return INITIAL_POSTS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [rewards, setRewards] = useState<RewardItem[]>(() => {
    if (typeof window === 'undefined') return INITIAL_REWARDS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REWARDS);
      return saved ? JSON.parse(saved) : INITIAL_REWARDS;
    } catch {
      return INITIAL_REWARDS;
    }
  });

  const [turnstileLogs, setTurnstileLogs] = useState<TurnstileLog[]>(() => {
    if (typeof window === 'undefined') return INITIAL_TURNSTILE_LOGS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TURNSTILE);
      return saved ? JSON.parse(saved) : INITIAL_TURNSTILE_LOGS;
    } catch {
      return INITIAL_TURNSTILE_LOGS;
    }
  });

  const [flightRisks, setFlightRisks] = useState<FlightRiskAnalysis[]>(() => {
    if (typeof window === 'undefined') return INITIAL_FLIGHT_RISKS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FLIGHT_RISKS);
      return saved ? JSON.parse(saved) : INITIAL_FLIGHT_RISKS;
    } catch {
      return INITIAL_FLIGHT_RISKS;
    }
  });

  const [ewaTransactions, setEwaTransactions] = useState<EwaTransaction[]>(() => {
    if (typeof window === 'undefined') return INITIAL_EWA_TRANSACTIONS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EWA);
      return saved ? JSON.parse(saved) : INITIAL_EWA_TRANSACTIONS;
    } catch {
      return INITIAL_EWA_TRANSACTIONS;
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [clockedInSession, setClockedInSession] = useState<{
    active: boolean;
    startTime: string;
    elapsedSeconds: number;
  }>(() => {
    if (typeof window === 'undefined') return { active: false, startTime: '', elapsedSeconds: 0 };
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLOCKED_IN);
      return saved ? JSON.parse(saved) : { active: false, startTime: '', elapsedSeconds: 0 };
    } catch {
      return { active: false, startTime: '', elapsedSeconds: 0 };
    }
  });

  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const toggleAiChat = () => setIsAiChatOpen((prev) => !prev);

  // Sync clockedInSession to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLOCKED_IN, JSON.stringify(clockedInSession));
    } catch {}
  }, [clockedInSession]);

  // Live timer interval: ticks every 1 second when active
  useEffect(() => {
    if (!clockedInSession.active) return;
    const interval = setInterval(() => {
      setClockedInSession((prev) => ({
        ...prev,
        elapsedSeconds: prev.elapsedSeconds + 1,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [clockedInSession.active]);

  // LocalStorage Sync
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(userAccounts));
    } catch {}
  }, [userAccounts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(rolePermissions));
    } catch {}
  }, [rolePermissions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
    } catch {}
  }, [auditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    } catch {}
  }, [employees]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TIMESHEET, JSON.stringify(timesheet));
    } catch {}
  }, [timesheet]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaveRequests));
    } catch {}
  }, [leaveRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    } catch {}
  }, [candidates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVALS, JSON.stringify(evaluations));
    } catch {}
  }, [evaluations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(documentRequests));
    } catch {}
  }, [documentRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    } catch {}
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(socialPosts));
    } catch {}
  }, [socialPosts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
    } catch {}
  }, [rewards]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EWA, JSON.stringify(ewaTransactions));
    } catch {}
  }, [ewaTransactions]);

  // Session timer
  useEffect(() => {
    if (!clockedInSession.active) return;
    const timer = setInterval(() => {
      setClockedInSession((prev) => ({
        ...prev,
        elapsedSeconds: prev.elapsedSeconds + 1,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [clockedInSession.active]);

  const notify = (
    title: string,
    description?: string,
    type: 'success' | 'info' | 'warning' = 'success'
  ) => {
    const id = `t-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const addAuditLog = (action: string, details: string) => {
    const now = new Date();
    const timeFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: timeFormatted,
      actorName: currentUser ? currentUser.fullName : 'სისტემა / სტუმარი',
      actorRole: currentUser ? currentUser.role : 'EMPLOYEE',
      action,
      details,
      ipAddress: '188.169.214.12',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // -------------------------------------------------------------
  // PERMISSION CHECKER ENGINE
  // -------------------------------------------------------------
  const getUserEffectivePermissions = (user: UserAccount): PermissionsRecord => {
    const roleKey = (user.role as 'HR_ADMIN' | 'LINE_MANAGER' | 'EMPLOYEE') || 'EMPLOYEE';
    const defaults = rolePermissions[roleKey] || DEFAULT_ROLE_PERMISSIONS[roleKey];
    return {
      ...defaults,
      ...(user.customPermissions || {}),
    };
  };

  const hasPermission = (key: keyof PermissionsRecord): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'SUPER_ADMIN') return true;

    const acc = userAccounts.find((u) => u.id === currentUser.id || u.username === currentUser.username);
    if (acc) {
      const effective = getUserEffectivePermissions(acc);
      return effective[key] ?? false;
    }

    const roleKey = (currentUser.role as 'HR_ADMIN' | 'LINE_MANAGER' | 'EMPLOYEE') || 'EMPLOYEE';
    const roleDefs = rolePermissions[roleKey] || DEFAULT_ROLE_PERMISSIONS[roleKey];
    return roleDefs?.[key] ?? false;
  };

  // -------------------------------------------------------------
  // AUTHENTICATION
  // -------------------------------------------------------------
  const login = (username: string, password: string): { success: boolean; error?: string } => {
    const cleanUser = username.trim().toLowerCase();
    const account = userAccounts.find(
      (u) =>
        u.username.toLowerCase() === cleanUser ||
        (u.username + '@hrnexa.ge').toLowerCase() === cleanUser
    );

    if (!account) {
      return { success: false, error: 'მომხმარებელი ან პაროლი არასწორია' };
    }

    if (account.password !== password) {
      return { success: false, error: 'მომხმარებელი ან პაროლი არასწორია' };
    }

    if (account.status === 'დაბლოკილი') {
      return { success: false, error: 'თქვენი ანგარიში დროებით დაბლოკილია სისტემური ადმინისტრატორის მიერ' };
    }

    const session: CurrentUserSession = {
      id: account.id,
      username: account.username,
      fullName: account.fullName,
      role: account.role as SystemRole,
      employeeId: account.employeeId,
      department: account.department,
    };

    setCurrentUser(session);
    setActiveModule('dashboard');

    addAuditLog(
      'ავტორიზაცია',
      `მომხმარებელმა ${account.fullName} (${account.role}) წარმატებით გაიარა ავტორიზაცია HR NEXA-ში`
    );

    notify(`მოგესალმებით, ${account.fullName}!`, 'ავტორიზაცია წარმატებით შესრულდა');
    return { success: true };
  };

  const loginSuperAdmin = (username: string, password: string): { success: boolean; error?: string } => {
    if (username.trim() === 'lucaskawaiii' && password === 'Argo226') {
      const session: CurrentUserSession = {
        id: 'super-admin-01',
        username: 'lucaskawaiii',
        fullName: 'სისტემის მფლობელი (System Owner)',
        role: 'SUPER_ADMIN',
      };
      setCurrentUser(session);
      setActiveModule('super-admin');

      addAuditLog(
        'Super-Admin ავტორიზაცია',
        'სისტემის მფლობელმა (System Owner) გაიარა ავტორიზაცია საიდუმლო პანელიდან'
      );

      notify('Super-Admin რეჟიმი გააქტიურებულია', 'სრული წვდომა ყველა მოდულზე და პარამეტრზე');
      return { success: true };
    }
    return { success: false, error: 'ავტორიზაციის მონაცემები არასწორია' };
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog('სისტემიდან გასვლა', `მომხმარებელი ${currentUser.fullName} გავიდა სისტემიდან`);
    }
    setCurrentUser(null);
    setActiveModule('dashboard');
    notify('სისტემიდან გასვლა შესრულდა', 'სესია დასრულებულია');
  };

  // -------------------------------------------------------------
  // SUPER ADMIN ACTIONS
  // -------------------------------------------------------------
  const createUserAccount = (acc: Omit<UserAccount, 'id' | 'createdAt'>) => {
    const id = `user-${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    const newAcc: UserAccount = { ...acc, id, createdAt: now };
    setUserAccounts((prev) => [...prev, newAcc]);
    addAuditLog('მომხმარებლის შექმნა', `შეიქმნა ახალი მომხმარებელი: ${acc.username} (${acc.role})`);
    notify('მომხმარებელი დაემატა!', `${acc.fullName} წარმატებით დარეგისტრირდა`);
  };

  const updateUserAccount = (id: string, partial: Partial<UserAccount>) => {
    setUserAccounts((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updated = { ...u, ...partial };
          addAuditLog('ანგარიშის განახლება', `განახლდა მომხმარებელი: ${u.username}`);
          return updated;
        }
        return u;
      })
    );
    notify('მონაცემები განახლდა', 'მომხმარებლის პარამეტრები წარმატებით შეინახა');
  };

  const deleteUserAccount = (id: string) => {
    const target = userAccounts.find((u) => u.id === id);
    if (!target) return;
    setUserAccounts((prev) => prev.filter((u) => u.id !== id));
    addAuditLog('მომხმარებლის წაშლა', `წაიშალა მომხმარებელი: ${target.username} (${target.fullName})`);
    notify('მომხმარებელი წაიშალა', `${target.fullName} ამოღებულია სისტემიდან`, 'warning');
  };

  const updateRolePermissions = (
    role: 'HR_ADMIN' | 'LINE_MANAGER' | 'EMPLOYEE',
    key: keyof PermissionsRecord,
    value: boolean
  ) => {
    setRolePermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [key]: value,
      },
    }));
    addAuditLog('როლის უფლებების ცვლილება', `როლს [${role}] შეეცვალა უფლება [${key}]: ${value ? 'ჩართვა' : 'გამორთვა'}`);
    notify('უფლებების მატრიცა განახლდა', `როლის [${role}] ნაგულისხმევი წესები შენახულია`);
  };

  const updateUserCustomPermission = (
    userId: string,
    key: keyof PermissionsRecord,
    value: boolean | undefined
  ) => {
    setUserAccounts((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const currentCustom = u.customPermissions || {};
          const nextCustom = { ...currentCustom };
          if (value === undefined) {
            delete nextCustom[key];
          } else {
            nextCustom[key] = value;
          }
          addAuditLog('ინდივიდუალური უფლება', `მომხმარებელს [${u.username}] შეეცვალა უფლება [${key}]: ${value}`);
          return { ...u, customPermissions: nextCustom };
        }
        return u;
      })
    );
    notify('ინდივიდუალური უფლება შენახულია', 'ცვლილება მყისიერად ამოქმედდა');
  };

  // -------------------------------------------------------------
  // HR ACTIONS
  // -------------------------------------------------------------
  const addEmployee = (empData: Omit<Employee, 'id'>): Employee => {
    const id = `emp-${Date.now()}`;
    const newEmp: Employee = { ...empData, id };
    setEmployees((prev) => [...prev, newEmp]);
    setTimesheet((prev) => {
      const row: Record<number, TimesheetCode> = {};
      for (let day = 1; day <= 30; day++) {
        row[day] = [1, 7, 8, 14, 15, 21, 22, 28, 29].includes(day) ? 'დ' : day === 23 ? 'უქმე' : '8';
      }
      return { ...prev, [id]: row };
    });
    addAuditLog('თანამშრომლის დამატება', `ბაზას დაემატა: ${newEmp.firstName} ${newEmp.lastName} (${newEmp.position})`);
    notify('თანამშრომელი დაემატა!', `${newEmp.firstName} ${newEmp.lastName} წარმატებით დარეგისტრირდა`);
    return newEmp;
  };

  const updateEmployee = (id: string, partial: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return { ...e, ...partial };
        }
        return e;
      })
    );
  };

  const toggleChecklistTask = (empId: string, taskId: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== empId) return emp;
        const nextList = emp.checklist.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        return { ...emp, checklist: nextList };
      })
    );
  };

  const addChecklistTask = (
    empId: string,
    title: string,
    category: 'IT აღჭურვილობა' | 'ხელშეკრულება' | 'ინდუქცია' | 'შემოვლის ფურცელი'
  ) => {
    const newTask = {
      id: `chk-${Date.now()}`,
      title,
      category,
      completed: false,
      dueDate: '2026-11-20',
    };
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === empId ? { ...emp, checklist: [...emp.checklist, newTask] } : emp
      )
    );
    notify('ამოცანა დაემატა', title);
  };

  const updateTimesheetCell = (empId: string, day: number, code: TimesheetCode) => {
    setTimesheet((prev) => {
      const empRow = { ...(prev[empId] || {}) };
      empRow[day] = code;
      return { ...prev, [empId]: empRow };
    });
  };

  const regenerateTimesheet = () => {
    const fresh = buildInitialTimesheet(employees);
    setTimesheet(fresh);
    addAuditLog('ტაბელის რეგენერაცია', 'ნოემბრის ტაბელი ხელახლა დაგენერირდა');
    notify('ტაბელი განახლდა!', 'ნოემბერი 2026-ის ტაბელი გადაანგარიშდა');
  };

  const submitLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>) => {
    const newReq: LeaveRequest = {
      ...req,
      id: `lv-${Date.now()}`,
      status: 'მენეჯერის დასტურის მოლოდინში',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeaveRequests((prev) => [newReq, ...prev]);
    addAuditLog('შვებულების მოთხოვნა', `განაცხადი გაიგზავნა: ${req.leaveType} (${req.workingDays} დღე)`);
    notify('მოთხოვნა გაგზავნილია!', 'მენეჯერს გაეგზავნა შეტყობინება დასადასტურებლად');
  };

  const approveLeaveRequest = (reqId: string) => {
    setLeaveRequests((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;
        const isManagerStep = r.status === 'მენეჯერის დასტურის მოლოდინში';
        const newStatus = isManagerStep ? 'HR-ის დასტურის მოლოდინში' : 'დამტკიცებული';
        const todayStr = new Date().toISOString().split('T')[0];

        if (newStatus === 'დამტკიცებული') {
          // deduct from balance
          setEmployees((ePrev) =>
            ePrev.map((emp) => {
              if (emp.id !== r.employeeId) return emp;
              if (r.leaveType === 'ანაზღაურებადი შვებულება') {
                return { ...emp, usedPaidLeaveDays: emp.usedPaidLeaveDays + r.workingDays };
              }
              if (r.leaveType === 'საავადმყოფო ფურცელი / ბიულეტენი') {
                return { ...emp, usedSickLeaveDays: emp.usedSickLeaveDays + r.workingDays };
              }
              return { ...emp, usedUnpaidLeaveDays: emp.usedUnpaidLeaveDays + r.workingDays };
            })
          );
        }

        return {
          ...r,
          status: newStatus,
          approvedByManagerAt: isManagerStep ? todayStr : r.approvedByManagerAt,
          approvedByHrAt: !isManagerStep ? todayStr : r.approvedByHrAt,
        };
      })
    );
    notify('მოთხოვნა დამტკიცდა!', 'სტატუსი განახლდა');
  };

  const rejectLeaveRequest = (reqId: string) => {
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'უარყოფილი' } : r))
    );
    notify('მოთხოვნა უარყოფილია', 'თანამშრომელს ეცნობა გადაწყვეტილების შესახებ', 'warning');
  };

  const moveCandidateStage = (candId: string, newStage: CandidateStage) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candId ? { ...c, stage: newStage } : c))
    );
    notify('კანდიდატის ეტაპი შეიცვალა', `ახალი ეტაპი: ${newStage}`);
  };

  const addCandidate = (cand: Omit<Candidate, 'id' | 'appliedDate'>) => {
    const newCand: Candidate = {
      ...cand,
      id: `cand-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
    };
    setCandidates((prev) => [newCand, ...prev]);
    notify('კანდიდატი დაემატა!', `${cand.firstName} ${cand.lastName}`);
  };

  const hireCandidateAsEmployee = (candId: string, empData: Omit<Employee, 'id'>) => {
    const newEmp = addEmployee(empData);
    setCandidates((prev) =>
      prev.map((c) => (c.id === candId ? { ...c, stage: 'აყვანილია' } : c))
    );
    notify(
      'კანდიდატი აყვანილია!',
      `${newEmp.firstName} ${newEmp.lastName} წარმატებით დაემატა პერსონალის ბაზაში`
    );
  };

  const addEvaluation = (evalItem: Omit<PerformanceEvaluation, 'id'>) => {
    const newEval: PerformanceEvaluation = {
      ...evalItem,
      id: `eval-${Date.now()}`,
    };
    setEvaluations((prev) => [newEval, ...prev]);
    notify('შეფასება შეინახა!', 'კვარტალური შეფასება წარმატებით გაფორმდა');
  };

  const requestDocument = (req: Omit<DocumentRequest, 'id' | 'status' | 'requestedAt'>) => {
    const newDoc: DocumentRequest = {
      ...req,
      id: `doc-${Date.now()}`,
      status: 'მზადაა ჩამოსატვირთად',
      requestedAt: new Date().toISOString().split('T')[0],
    };
    setDocumentRequests((prev) => [newDoc, ...prev]);
    notify('დოკუმენტი მზადაა!', `${req.documentType} დაგენერირდა`);
  };

  // -------------------------------------------------------------
  // LMS ACTIONS
  // -------------------------------------------------------------
  const completeCourseQuiz = (courseId: string, earnedPoints: number) => {
    if (currentUser?.employeeId) {
      awardPoints(currentUser.employeeId, earnedPoints, `LMS კურსის წარმატებით გავლა`);
    }
    notify('კურსი წარმატებით დასრულდა! 🎓', `თქვენ დაგერიცხათ +${earnedPoints} NEXA ქულა!`);
  };

  // -------------------------------------------------------------
  // SOCIAL FEED ACTIONS
  // -------------------------------------------------------------
  const likePost = (postId: string) => {
    setSocialPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const nextLiked = !p.hasLiked;
        return {
          ...p,
          hasLiked: nextLiked,
          likes: nextLiked ? p.likes + 1 : p.likes - 1,
        };
      })
    );
  };

  const addPostComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const author = currentUser?.fullName || 'თანამშრომელი';
    const newComment = {
      id: `com-${Date.now()}`,
      authorName: author,
      authorRole: currentUser?.role === 'SUPER_ADMIN' ? 'ადმინისტრატორი' : 'თანამშრომელი',
      avatarColor: 'bg-indigo-600',
      content: text.trim(),
      createdAt: 'ახლახანს',
    };

    setSocialPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p))
    );
    notify('კომენტარი დაემატა!', 'კორპორატიულ კედელზე');
  };

  const createPost = (post: Omit<SocialPost, 'id' | 'likes' | 'comments' | 'createdAt'>) => {
    const newPost: SocialPost = {
      ...post,
      id: `post-${Date.now()}`,
      likes: 0,
      hasLiked: false,
      comments: [],
      createdAt: 'ახლახანს',
    };
    setSocialPosts((prev) => [newPost, ...prev]);
    notify('პოსტი გამოქვეყნდა!', 'გამოჩნდა კორპორატიულ კედელზე');
  };

  const votePoll = (postId: string, optionIndex: number) => {
    setSocialPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId || !p.pollOptions) return p;
        const nextOptions = p.pollOptions.map((opt, idx) =>
          idx === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt
        );
        return { ...p, pollOptions: nextOptions };
      })
    );
    notify('თქვენი ხმა მიღებულია!', 'გამოკითხვა განახლდა');
  };

  // -------------------------------------------------------------
  // GAMIFICATION ACTIONS
  // -------------------------------------------------------------
  const awardPoints = (empId: string, points: number, reason: string) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === empId ? { ...emp, nexaPoints: emp.nexaPoints + points } : emp))
    );
    addAuditLog('NEXA ქულების დარიცხვა', `თანამშრომელს ${empId} დაერიცხა ${points} ქულა: ${reason}`);
  };

  const redeemReward = (rewardId: string): boolean => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return false;

    const currentEmpId = currentUser?.employeeId || employees[3]?.id;
    const emp = employees.find((e) => e.id === currentEmpId);

    if (!emp || emp.nexaPoints < reward.costPoints) {
      notify('არასაკმარისი ქულები!', `ამ საჩუქრისთვის საჭიროა ${reward.costPoints} ქულა`, 'warning');
      return false;
    }

    setEmployees((prev) =>
      prev.map((e) =>
        e.id === currentEmpId ? { ...e, nexaPoints: e.nexaPoints - reward.costPoints } : e
      )
    );

    setRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, availableStock: Math.max(0, r.availableStock - 1) } : r))
    );

    addAuditLog(
      'NEXA Reward გამოსყიდვა',
      `${emp.firstName} ${emp.lastName}-მ გამოიყენა ${reward.costPoints} ქულა: ${reward.title}`
    );

    notify('საჩუქარი გამოსყიდულია! 🎁', `${reward.title} გაფორმდა თქვენს სახელზე`);
    return true;
  };

  // -------------------------------------------------------------
  // EARNED WAGE ACCESS (EWA) FINTECH ACTIONS
  // -------------------------------------------------------------
  const requestEwa = (empId: string, amount: number): { success: boolean; error?: string } => {
    const emp = employees.find((e) => e.id === empId);
    if (!emp) return { success: false, error: 'თანამშრომელი ვერ მოიძებნა' };

    // Max 50% of monthly gross
    const maxAllowed = Math.round(emp.grossSalary * 0.5);
    const available = Math.max(0, maxAllowed - emp.withdrawnEwaAmount);

    if (amount <= 0 || amount > available) {
      return { success: false, error: `მაქსიმალური ხელმისაწვდომი თანხაა: ${available} ₾` };
    }

    const serviceFee = 5; // Flat fee 5 GEL
    const netTransferred = amount - serviceFee;

    const newTx: EwaTransaction = {
      id: `ewa-${Date.now()}`,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      amount,
      serviceFee,
      netTransferred,
      bankName: emp.bankName,
      iban: emp.iban,
      requestedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'ჩარიცხულია',
    };

    setEwaTransactions((prev) => [newTx, ...prev]);
    setEmployees((prev) =>
      prev.map((e) => (e.id === empId ? { ...e, withdrawnEwaAmount: e.withdrawnEwaAmount + amount } : e))
    );

    addAuditLog(
      'EWA თანხის გამოტანა',
      `${emp.firstName} ${emp.lastName}-მ გამოიტანა გამომუშავებული ხელფასი: ${amount} ₾ (${emp.bankName})`
    );

    notify(
      'EWA გადარიცხვა წარმატებულია! ⚡',
      `${netTransferred} ₾ მყისიერად ჩაირიცხა თქვენს ანგარიშზე (${emp.iban.slice(0, 8)}...)`
    );

    return { success: true };
  };

  const toggleClockInOut = () => {
    const now = new Date();
    const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    if (clockedInSession.active) {
      const hours = Math.max(0.1, Number((clockedInSession.elapsedSeconds / 3600).toFixed(1)));
      setClockedInSession({ active: false, startTime: '', elapsedSeconds: 0 });
      notify('სამუშაო დღე დასრულდა! 🎉', `სამუშაო დასრულდა ${timeFormatted}-ზე. ნამუშევარია: ${hours} სთ. ჩაწერილია ტაბელში.`);
      addAuditLog('სამუშაოს დასრულება', `სამუშაო შეწყდა: ${timeFormatted} (${hours} სთ)`);
    } else {
      setClockedInSession({ active: true, startTime: timeFormatted, elapsedSeconds: 0 });
      notify('სამუშაო წარმატებით დაიწყო! 🚀', `დაწყების დრო: ${timeFormatted}. დროის ათვლა გააქტიურებულია.`);
      addAuditLog('სამუშაოს დაწყება', `სამუშაო დაიწყო: ${timeFormatted}`);
    }
  };

  return (
    <HRContext.Provider
      value={{
        currentUser,
        activeModule,
        setActiveModule,
        viewDevice,
        setViewDevice,
        userAccounts,
        rolePermissions,
        auditLogs,
        employees,
        timesheet,
        leaveRequests,
        candidates,
        evaluations,
        documentRequests,
        courses,
        socialPosts,
        rewards,
        turnstileLogs,
        flightRisks,
        ewaTransactions,
        toasts,
        notify,
        login,
        loginSuperAdmin,
        logout,
        hasPermission,
        getUserEffectivePermissions,
        createUserAccount,
        updateUserAccount,
        deleteUserAccount,
        updateRolePermissions,
        updateUserCustomPermission,
        addAuditLog,
        addEmployee,
        updateEmployee,
        toggleChecklistTask,
        addChecklistTask,
        updateTimesheetCell,
        regenerateTimesheet,
        submitLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,
        moveCandidateStage,
        addCandidate,
        hireCandidateAsEmployee,
        addEvaluation,
        requestDocument,
        completeCourseQuiz,
        likePost,
        addPostComment,
        createPost,
        votePoll,
        redeemReward,
        awardPoints,
        requestEwa,
        clockedInSession,
        toggleClockInOut,
        isAiChatOpen,
        setIsAiChatOpen,
        toggleAiChat,
      }}
    >
      {children}
    </HRContext.Provider>
  );
}

export function useHR() {
  const context = useContext(HRContext);
  if (!context) {
    throw new Error('useHR must be used within an HRProvider');
  }
  return context;
}
