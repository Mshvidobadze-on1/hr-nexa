'use client';

import React, { useState } from 'react';
import { useHR } from '@/context/HRContext';
import { DepartmentName, PermissionsRecord, UserAccount } from '@/types/hr';
import {
  ShieldCheck,
  Users,
  Sliders,
  History,
  UserPlus,
  KeyRound,
  Ban,
  CheckCircle2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Sparkles,
  Lock,
  UserCheck,
  Briefcase,
  CalendarClock,
  Landmark,
  Palmtree,
  FileText,
  Clock,
  Receipt,
  Check,
  X,
  GraduationCap,
  Activity,
  Zap,
} from 'lucide-react';

const PERMISSION_CONFIG: {
  key: keyof PermissionsRecord;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    key: 'canManageEmployees',
    title: 'პერსონალის ბაზის ნახვა და მართვა',
    description: 'თანამშრომელთა სიის ნახვა, დამატება, რედაქტირება და ორგანიზაციული ხე',
    icon: Users,
  },
  {
    key: 'canManageTimesheet',
    title: 'ტაბელის მართვა და რედაქტირება',
    description: '30-დღიანი ტაბელის უჯრების ცვლილება, კოდების მინიჭება და რეგენერაცია',
    icon: CalendarClock,
  },
  {
    key: 'canApproveLeaves',
    title: 'შვებულებების დამტკიცება / უარყოფა',
    description: 'გუნდის წევრების შვებულებების, ბიულეტენების და გაცდენების დამტკიცება',
    icon: Palmtree,
  },
  {
    key: 'canManagePayroll',
    title: 'ხელფასების და უწყისების ნახვა/დათვლა',
    description: 'კომპანიის სახელფასო უწყისი, საგადასახადო გაანგარიშება და საბანკო რეესტრი',
    icon: Landmark,
  },
  {
    key: 'canGenerateOrders',
    title: 'ბრძანებების და ცნობების გენერაცია',
    description: 'მიღების, შვებულების და გათავისუფლების ოფიციალური HR ბრძანებების ბეჭდვა',
    icon: FileText,
  },
  {
    key: 'canManageRecruitment',
    title: 'რეკრუტინგის და ვაკანსიების მართვა',
    description: 'ATS Kanban კანდიდატების გადაადგილება და 1-კლიკით თანამშრომლად აყვანა',
    icon: Briefcase,
  },
  {
    key: 'canManageLms',
    title: 'LMS კურსების და ტესტების მართვა',
    description: 'სასწავლო პროგრამების, ვიდეო გაკვეთილების და ქვიზების ადმინისტრირება',
    icon: GraduationCap,
  },
  {
    key: 'canViewAnalytics',
    title: 'AI და პროგნოზული ანალიტიკის ნახვა',
    description: 'Flight Risk მოდელის, გადაწვისა და დასწრების პროგნოზების მონიტორინგი',
    icon: Activity,
  },
  {
    key: 'canRequestLeave',
    title: 'საკუთარი შვებულების მოთხოვნა',
    description: 'კუთვნილი ანაზღაურებადი ან უხელფასო შვებულების განაცხადის გაგზავნა',
    icon: Palmtree,
  },
  {
    key: 'canClockInOut',
    title: 'მოსვლა/წასვლის დაფიქსირება (Clock In/Out)',
    description: 'სამუშაო დროის ტაიმერის გააქტიურება და IP/GPS ფიქსაცია',
    icon: Clock,
  },
  {
    key: 'canViewPayslip',
    title: 'საკუთარი სახელფასო ფურცლის (Payslip) ნახვა',
    description: 'პირადი დარიცხვების, საშემოსავლოს, საპენსიოს და Net ხელფასის ქვითრის ნახვა',
    icon: Receipt,
  },
  {
    key: 'canUseEwa',
    title: 'ხელფასის წინასწარი გამოტანა (EWA FinTech)',
    description: 'ნამუშევარი საათების შესაბამისი ხელფასის 50%-მდე მყისიერი მიღება',
    icon: Zap,
  },
];

export function SuperAdminModule() {
  const {
    userAccounts,
    rolePermissions,
    auditLogs,
    employees,
    createUserAccount,
    updateUserAccount,
    deleteUserAccount,
    updateRolePermissions,
    updateUserCustomPermission,
    setActiveModule,
  } = useHR();

  const [activeTab, setActiveTab] = useState<'users' | 'permissions' | 'audit' | 'overview'>('users');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'HR_ADMIN' | 'LINE_MANAGER' | 'EMPLOYEE'>('ALL');

  // Password visibility state in table
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Create User Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('123456');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<'HR_ADMIN' | 'LINE_MANAGER' | 'EMPLOYEE'>('EMPLOYEE');
  const [newDept, setNewDept] = useState<DepartmentName>('IT დეპარტამენტი');
  const [newLinkedEmpId, setNewLinkedEmpId] = useState<string>('');

  // Password reset inline state
  const [editingPasswordUserId, setEditingPasswordUserId] = useState<string | null>(null);
  const [inlinePassword, setInlinePassword] = useState('');

  // Selected User for Individual Permissions override
  const [selectedUserForOverride, setSelectedUserForOverride] = useState<UserAccount | null>(null);

  const filteredUsers = userAccounts.filter((u) => {
    const q = userSearch.toLowerCase().trim();
    const matchesQuery = !q || u.username.toLowerCase().includes(q) || u.fullName.toLowerCase().includes(q);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newFullName.trim() || !newPassword.trim()) return;

    createUserAccount({
      username: newUsername.trim(),
      password: newPassword.trim(),
      fullName: newFullName.trim(),
      role: newRole,
      department: newDept,
      employeeId: newLinkedEmpId || undefined,
      status: 'აქტიური',
    });

    setShowCreateModal(false);
    setNewUsername('');
    setNewFullName('');
    setNewPassword('123456');
  };

  const handleSaveInlinePassword = (userId: string) => {
    if (!inlinePassword.trim()) return;
    updateUserAccount(userId, { password: inlinePassword.trim() });
    setEditingPasswordUserId(null);
    setInlinePassword('');
  };

  return (
    <div className="space-y-6">
      {/* Super Admin Top Control Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-purple-500/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg border border-purple-400/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                  Master Control & System Owner
                </span>
                <span className="text-xs text-slate-400">• ადმინისტრატორი: lucaskawaiii</span>
              </div>
              <h1 className="text-2xl font-black mt-1 tracking-tight">
                HR NEXA — სისტემური მართვის ცენტრი
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                მომხმარებლების, როლების (HR Admin / Line Manager / Employee) და უფლებების მატრიცა
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-950/50 transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              + ახალი მომხმარებლის შექმნა
            </button>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4" />
            მომხმარებლები და პაროლები ({userAccounts.length})
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'permissions'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Sliders className="w-4 h-4" />
            უფლებების მატრიცა (RBAC Matrix)
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <History className="w-4 h-4" />
            სისტემური ჟურნალი (Audit Log)
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            სრული მონიტორინგი
          </button>
        </div>
      </div>

      {/* SUBTAB 1: Users & Passwords Table */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[260px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ძებნა მომხმარებლის სახელით ან გვარით..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              {['ALL', 'HR_ADMIN', 'LINE_MANAGER', 'EMPLOYEE'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r as typeof roleFilter)}
                  className={`px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                    roleFilter === r
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {r === 'ALL'
                    ? 'ყველა'
                    : r === 'HR_ADMIN'
                    ? 'HR Admin'
                    : r === 'LINE_MANAGER'
                    ? 'Line Manager'
                    : 'Employee'}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3 px-4">მომხმარებელი & სახელი</th>
                  <th className="py-3 px-3">როლი (RBAC)</th>
                  <th className="py-3 px-3">დეპარტამენტი</th>
                  <th className="py-3 px-3">პაროლი</th>
                  <th className="py-3 px-3">სტატუსი</th>
                  <th className="py-3 px-4 text-right">მოქმედება</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{user.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">@{user.username}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          user.role === 'HR_ADMIN'
                            ? 'bg-emerald-100 text-emerald-800'
                            : user.role === 'LINE_MANAGER'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">{user.department}</td>
                    <td className="py-3.5 px-3">
                      {editingPasswordUserId === user.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={inlinePassword}
                            onChange={(e) => setInlinePassword(e.target.value)}
                            placeholder="ახალი პაროლი"
                            className="w-28 px-2 py-1 rounded border border-purple-400 text-xs font-mono font-bold"
                          />
                          <button
                            onClick={() => handleSaveInlinePassword(user.id)}
                            className="px-2 py-1 rounded bg-purple-600 text-white font-bold text-[10px]"
                          >
                            შენახვა
                          </button>
                          <button
                            onClick={() => setEditingPasswordUserId(null)}
                            className="px-2 py-1 rounded bg-slate-200 text-slate-700 text-[10px]"
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold">
                            {visiblePasswords[user.id] ? user.password : '••••••'}
                          </span>
                          <button
                            onClick={() =>
                              setVisiblePasswords((prev) => ({
                                ...prev,
                                [user.id]: !prev[user.id],
                              }))
                            }
                            className="text-slate-400 hover:text-slate-600"
                          >
                            {visiblePasswords[user.id] ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setEditingPasswordUserId(user.id);
                              setInlinePassword(user.password);
                            }}
                            className="text-[10px] font-bold text-purple-600 hover:underline ml-1"
                          >
                            შეცვლა
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() =>
                          updateUserAccount(user.id, {
                            status: user.status === 'აქტიური' ? 'დაბლოკილი' : 'აქტიური',
                          })
                        }
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                          user.status === 'აქტიური'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {user.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedUserForOverride(user);
                            setActiveTab('permissions');
                          }}
                          className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] border border-purple-200 transition"
                        >
                          უფლებები
                        </button>
                        <button
                          onClick={() => deleteUserAccount(user.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="წაშლა"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Role Permissions Matrix */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  გლობალური როლების უფლებების მატრიცა (Role Permissions)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  HR Admin, Line Manager და Employee როლების ნაგულისხმევი წესები
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                სინქრონიზებული
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                    <th className="py-3 px-4">სისტემის მოდული / ფუნქცია</th>
                    <th className="py-3 px-4 text-center w-36 bg-emerald-50 text-emerald-900">
                      HR Admin
                    </th>
                    <th className="py-3 px-4 text-center w-36 bg-blue-50 text-blue-900">
                      Line Manager
                    </th>
                    <th className="py-3 px-4 text-center w-36 bg-slate-100 text-slate-900">
                      Employee (ESS)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PERMISSION_CONFIG.map((item) => {
                    const Icon = item.icon;
                    const hrVal = rolePermissions.HR_ADMIN?.[item.key] ?? true;
                    const mgrVal = rolePermissions.LINE_MANAGER?.[item.key] ?? false;
                    const empVal = rolePermissions.EMPLOYEE?.[item.key] ?? false;

                    return (
                      <tr key={item.key} className="hover:bg-slate-50/60">
                        <td className="py-3.5 px-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{item.title}</div>
                              <div className="text-[11px] text-slate-500">{item.description}</div>
                            </div>
                          </div>
                        </td>

                        {/* HR Admin */}
                        <td className="py-3.5 px-4 text-center bg-emerald-50/30">
                          <input
                            type="checkbox"
                            checked={hrVal}
                            onChange={(e) =>
                              updateRolePermissions('HR_ADMIN', item.key, e.target.checked)
                            }
                            className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                          />
                        </td>

                        {/* Line Manager */}
                        <td className="py-3.5 px-4 text-center bg-blue-50/30">
                          <input
                            type="checkbox"
                            checked={mgrVal}
                            onChange={(e) =>
                              updateRolePermissions('LINE_MANAGER', item.key, e.target.checked)
                            }
                            className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                          />
                        </td>

                        {/* Employee */}
                        <td className="py-3.5 px-4 text-center bg-slate-50/50">
                          <input
                            type="checkbox"
                            checked={empVal}
                            onChange={(e) =>
                              updateRolePermissions('EMPLOYEE', item.key, e.target.checked)
                            }
                            className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Individual Override */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  ინდივიდუალური წვდომების მორგება (User Overrides)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  შეარჩიეთ კონკრეტული პირი როლის ნაგულისხმევი წესის გადასაფარად
                </p>
              </div>

              <select
                value={selectedUserForOverride?.id || ''}
                onChange={(e) => {
                  const found = userAccounts.find((u) => u.id === e.target.value);
                  setSelectedUserForOverride(found || null);
                }}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="">-- აირჩიეთ მომხმარებელი --</option>
                {userAccounts.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName} (@{u.username} • {u.role})
                  </option>
                ))}
              </select>
            </div>

            {selectedUserForOverride && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {PERMISSION_CONFIG.map((p) => {
                  const roleKey = selectedUserForOverride.role;
                  const defaultVal = rolePermissions[roleKey]?.[p.key] ?? false;
                  const customVal = selectedUserForOverride.customPermissions?.[p.key];
                  const effective = customVal !== undefined ? customVal : defaultVal;

                  return (
                    <div
                      key={p.key}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900">{p.title}</div>
                        <div className="text-[10px] text-slate-400">
                          როლის წესი: {defaultVal ? 'ჩართული' : 'გამორთული'}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={effective}
                        onChange={(e) => {
                          updateUserCustomPermission(
                            selectedUserForOverride.id,
                            p.key,
                            e.target.checked
                          );
                          setSelectedUserForOverride((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  customPermissions: {
                                    ...(prev.customPermissions || {}),
                                    [p.key]: e.target.checked,
                                  },
                                }
                              : null
                          );
                        }}
                        className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            სისტემური აუდიტის ჟურნალი (GDPR Audit Trail)
          </h3>
          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-900">
                    {log.actorName} ({log.action})
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{log.details}</div>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-mono">
                  <div>{log.timestamp}</div>
                  <div>IP: {log.ipAddress}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">მომხმარებლები</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{userAccounts.length}</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">HR Admins</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {userAccounts.filter((u) => u.role === 'HR_ADMIN').length}
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">Line Managers</div>
              <div className="text-2xl font-black text-blue-700 mt-1">
                {userAccounts.filter((u) => u.role === 'LINE_MANAGER').length}
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">Employees (ESS)</div>
              <div className="text-2xl font-black text-indigo-700 mt-1">
                {userAccounts.filter((u) => u.role === 'EMPLOYEE').length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-400" />
                <h3 className="font-extrabold text-sm">ახალი მომხმარებლის რეგისტრაცია</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Username *</label>
                <input
                  type="text"
                  required
                  placeholder="მაგ: a.kapanadze"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">სრული სახელი და გვარი *</label>
                <input
                  type="text"
                  required
                  placeholder="მაგ: ალექსანდრე კაპანაძე"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">პაროლი *</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">როლი (RBAC)</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as typeof newRole)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="HR_ADMIN">HR Manager / Admin</option>
                    <option value="LINE_MANAGER">Line Manager</option>
                    <option value="EMPLOYEE">Employee (ESS)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">დეპარტამენტი</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value as DepartmentName)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="IT დეპარტამენტი">IT დეპარტამენტი</option>
                    <option value="ფინანსები და ბუღალტერია">ფინანსები</option>
                    <option value="გაყიდვები და მარკეტინგი">გაყიდვები</option>
                    <option value="HR და ადმინისტრაცია">HR</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700"
                >
                  გაუქმება
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold shadow-md"
                >
                  შექმნა
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
