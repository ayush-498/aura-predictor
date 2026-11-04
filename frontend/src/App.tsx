import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppraisalLedgerProvider } from './context/AppraisalLedgerContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { TabType } from './components/layout/Sidebar';
import { useSalaryPredictor } from './hooks/useSalaryPredictor';
import { LandingPage } from './features/landing/LandingPage';
import { PredictorForm } from './features/predictor/components/PredictorForm';
import { PredictionResultCard } from './features/predictor/components/PredictionResultCard';
import { ModelComparisonCard } from './features/predictor/components/ModelComparisonCard';
import { RecentAppraisalsTable } from './features/appraisals/components/RecentAppraisalsTable';
import { ModelBenchmarkPanel } from './features/analytics/components/ModelBenchmarkPanel';
import { DocumentationView } from './features/analytics/components/DocumentationView';
import { EmployeeCohortsView } from './features/analytics/components/EmployeeCohortsView';
import { CompensationBandsView } from './features/analytics/components/CompensationBandsView';
import { BatchEvaluationView } from './features/analytics/components/BatchEvaluationView';
import { TelemetryLogsView } from './features/analytics/components/TelemetryLogsView';
import { PipelineConfigView } from './features/analytics/components/PipelineConfigView';
import { ResumeUploadSection } from './features/resume/components/ResumeUploadSection';
import { GravityGridBackground } from './components/ui/GravityGridBackground';
import { LoginPage } from './features/auth/LoginPage';
import { PredictionRequest, ResumeParsedProfile } from './types';

function AppContent() {
  const [view, setView] = useState<'landing' | 'login' | 'app'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'app' || window.location.hash === '#app') {
        return 'app';
      }
      if (params.get('view') === 'login' || window.location.hash === '#login') {
        return 'login';
      }
    }
    return 'landing';
  });

  const [activeTab, setActiveTab] = useState<TabType>('predictor');
  const {
    params,
    prediction,
    loading,
    isBackendOnline,
    updateParam,
    updateParams,
    resetParams,
    checkBackendHealth,
  } = useSalaryPredictor();

  // Handle URL history state for view toggling
  const navigateToView = (newView: 'landing' | 'login' | 'app', tab?: TabType) => {
    setView(newView);
    if (tab) setActiveTab(tab);
    if (newView === 'app') {
      window.history.pushState(null, '', `?view=app&tab=${tab || activeTab}`);
    } else if (newView === 'login') {
      window.history.pushState(null, '', '?view=login');
    } else {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchFromLanding = (targetTab: TabType = 'predictor', initialParams?: PredictionRequest) => {
    if (initialParams) {
      updateParams({
        ...initialParams,
        roles: initialParams.roles || (initialParams.role ? [initialParams.role] : []),
        skills: initialParams.skills || [],
      });
    }
    navigateToView('app', targetTab);
  };

  const handleApplyFromResume = (profile: ResumeParsedProfile) => {
    updateParams({
      role: profile.role,
      roles: [profile.role, ...(profile.skills || []).slice(0, 3)],
      skills: profile.skills || [],
      experience: profile.experience,
      rating: profile.rating,
      salary: profile.salary,
      location: profile.location,
    });
    setActiveTab('predictor');
  };

  if (view === 'landing') {
    return (
      <>
        <GravityGridBackground />
        <LandingPage
          isBackendOnline={isBackendOnline}
          onRefreshHealth={checkBackendHealth}
          onLaunchApp={handleLaunchFromLanding}
          onLaunchPlatform={() => navigateToView('login')}
        />
      </>
    );
  }

  if (view === 'login') {
    return (
      <LoginPage
        onLoginSuccess={() => navigateToView('app', 'predictor')}
        onNavigateToLanding={() => navigateToView('landing')}
      />
    );
  }

  return (
    <>
      <GravityGridBackground />
      <DashboardLayout
      activeTab={activeTab}
      onSelectTab={(tab) => {
        setActiveTab(tab);
        window.history.replaceState(null, '', `?view=app&tab=${tab}`);
      }}
      isBackendOnline={isBackendOnline}
      onRefreshHealth={checkBackendHealth}
      onNavigateToLanding={() => navigateToView('landing')}
    >
      {activeTab === 'predictor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          <div className="lg:col-span-5">
            <PredictorForm
              params={params}
              onUpdate={updateParam}
              onUpdateMultiple={updateParams}
              onReset={resetParams}
              loading={loading}
              onOpenResumeScanner={() => setActiveTab('resume')}
            />
          </div>

          <div className="lg:col-span-7 space-y-6">
            <PredictionResultCard
              prediction={prediction}
              params={params}
              loading={loading}
              onApproveCandidate={() => setActiveTab('appraisals')}
            />
            <ModelComparisonCard prediction={prediction} />
          </div>
        </div>
      )}

      {activeTab === 'resume' && (
        <div className="animate-fadeIn">
          <ResumeUploadSection
            onApplyToSimulator={handleApplyFromResume}
            onNavigateToLedger={() => setActiveTab('appraisals')}
          />
        </div>
      )}

      {activeTab === 'cohorts' && (
        <EmployeeCohortsView
          onSelectRoleForSimulator={(role) => {
            updateParams({
              role,
              roles: [role],
              skills: [], // Reset skills for new cohort simulation
            });
            setActiveTab('predictor');
          }}
        />
      )}

      {activeTab === 'bands' && (
        <CompensationBandsView />
      )}

      {activeTab === 'appraisals' && (
        <RecentAppraisalsTable
          onSelectEmployee={emp => {
            updateParams({
              role: emp.role,
              roles: [emp.role],
              skills: [], // Reset skills so new person simulation starts clean without carryover
              experience: emp.experience,
              rating: emp.rating,
              salary: emp.currentSalary || 1200000,
              location: emp.location || 'Bangalore',
            });
            setActiveTab('predictor');
          }}
          onNavigateToSimulator={() => setActiveTab('predictor')}
          onNavigateToResumeScanner={() => setActiveTab('resume')}
        />
      )}

      {activeTab === 'batch' && (
        <BatchEvaluationView />
      )}

      {activeTab === 'benchmarks' && (
        <ModelBenchmarkPanel />
      )}

      {activeTab === 'telemetry' && (
        <TelemetryLogsView />
      )}

      {activeTab === 'config' && (
        <PipelineConfigView />
      )}

      {activeTab === 'docs' && (
        <DocumentationView />
      )}
    </DashboardLayout>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppraisalLedgerProvider>
        <AppContent />
      </AppraisalLedgerProvider>
    </ThemeProvider>
  );
}