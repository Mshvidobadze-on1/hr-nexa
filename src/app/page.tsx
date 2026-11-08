'use client';

import React from 'react';
import { HRProvider, useHR } from '@/context/HRContext';
import { LoginPage } from '@/components/auth/LoginPage';
import { AppShell } from '@/components/layout/AppShell';
import { SuperAdminModule } from '@/components/modules/SuperAdminModule';
import { DashboardModule } from '@/components/modules/DashboardModule';
import { EmployeesModule } from '@/components/modules/EmployeesModule';
import { TimesheetModule } from '@/components/modules/TimesheetModule';
import { LeavesModule } from '@/components/modules/LeavesModule';
import { PayrollModule } from '@/components/modules/PayrollModule';
import { RecruitmentModule } from '@/components/modules/RecruitmentModule';
import { PerformanceModule } from '@/components/modules/PerformanceModule';
import { ESSModule } from '@/components/modules/ESSModule';
import { SocialFeedModule } from '@/components/modules/SocialFeedModule';
import { LmsModule } from '@/components/modules/LmsModule';
import { GamificationModule } from '@/components/modules/GamificationModule';
import { EwaModule } from '@/components/modules/EwaModule';
import { AiAssistantModule } from '@/components/modules/AiAssistantModule';
import { BiometricsModule } from '@/components/modules/BiometricsModule';

function ModuleRouter() {
  const { activeModule, currentUser, hasPermission } = useHR();

  switch (activeModule) {
    case 'super-admin':
      return currentUser?.role === 'SUPER_ADMIN' ? <SuperAdminModule /> : <DashboardModule />;
    case 'dashboard':
      return <DashboardModule />;
    case 'social-feed':
      return <SocialFeedModule />;
    case 'lms':
      return <LmsModule />;
    case 'gamification':
      return <GamificationModule />;
    case 'ewa':
      return <EwaModule />;
    case 'ai-assistant':
      return <AiAssistantModule />;
    case 'employees':
      return hasPermission('canManageEmployees') ? <EmployeesModule /> : <DashboardModule />;
    case 'biometrics':
      return <BiometricsModule />;
    case 'timesheet':
      return hasPermission('canManageTimesheet') ? <TimesheetModule /> : <DashboardModule />;
    case 'leaves':
      return <LeavesModule />;
    case 'payroll':
      return hasPermission('canManagePayroll') ? <PayrollModule /> : <DashboardModule />;
    case 'recruitment':
      return hasPermission('canManageRecruitment') ? <RecruitmentModule /> : <DashboardModule />;
    case 'performance':
      return <PerformanceModule />;
    case 'ess':
      return <ESSModule />;
    default:
      return <DashboardModule />;
  }
}

function MainApp() {
  const { currentUser } = useHR();

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <AppShell>
      <ModuleRouter />
    </AppShell>
  );
}

export default function HomePage() {
  return (
    <HRProvider>
      <MainApp />
    </HRProvider>
  );
}
