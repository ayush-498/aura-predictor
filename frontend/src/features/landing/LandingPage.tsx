import React, { useState } from 'react';
import { LandingNavbar } from './components/LandingNavbar';
import { HeroSection } from './components/HeroSection';
import { TrustValidationStrip } from './components/TrustValidationStrip';
import { CompensationDilemma } from './components/CompensationDilemma';
import { CoreFeatureMatrix } from './components/CoreFeatureMatrix';
import { MLEngineDeepDive } from './components/MLEngineDeepDive';
import { WorkflowSection } from './components/WorkflowSection';
import { SecurityIntegrationsSection } from './components/SecurityIntegrationsSection';
import { BusinessImpactROI } from './components/BusinessImpactROI';
import { DualCTASection } from './components/DualCTASection';
import { GlobalFooter } from './components/GlobalFooter';
import { EnterpriseConsultationModal } from './components/EnterpriseConsultationModal';
import { PredictionRequest } from '../../types';
import { TabType } from '../../components/layout/Sidebar';

interface LandingPageProps {
  isBackendOnline: boolean | null;
  onRefreshHealth?: () => void;
  onLaunchApp: (tab?: TabType, initialParams?: PredictionRequest) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  isBackendOnline,
  onRefreshHealth,
  onLaunchApp,
}) => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  const handleOpenAppWithParams = (params: PredictionRequest, targetTab: TabType = 'predictor') => {
    onLaunchApp(targetTab, params);
  };

  const handleOpenApp = (tab: TabType = 'predictor') => {
    onLaunchApp(tab);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950/25 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      
      {/* 1. Top Navigation Bar (Sticky glassmorphism + Status Pill + App CTA) */}
      <LandingNavbar
        isBackendOnline={isBackendOnline}
        onOpenApp={handleOpenApp}
        onRefreshHealth={onRefreshHealth}
      />

      <main className="relative">
        {/* 2. Hero Section: Precision Compensation Engineering (Split Layout with Mini-Simulator Widget) */}
        <HeroSection
          onOpenAppWithParams={handleOpenAppWithParams}
          onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
        />

        {/* 3. Trust & Validation Strip (22,700+ Records · Sub-15ms · 94.9% Acc) */}
        <TrustValidationStrip />

        {/* 4. The Compensation Dilemma (Spreadsheet Chaos vs. Algorithmic Fair) */}
        <CompensationDilemma />

        {/* 5. Core Feature Matrix (Mapped to Platform Modules: Pillars A, B, C, D) */}
        <CoreFeatureMatrix onOpenApp={handleOpenApp} />

        {/* 6. Machine Learning Engine & Explainability Deep-Dive (Dual-Model Benchmarking & Shapley) */}
        <MLEngineDeepDive onOpenApp={handleOpenApp} />

        {/* 7. Workflow / How It Works (3-Step Pipeline: Ingest → Infer → Audit) */}
        <WorkflowSection onOpenApp={handleOpenApp} />

        {/* 8. Enterprise Security, Bias Auditing & HRIS Ecosystem Integration */}
        <SecurityIntegrationsSection />

        {/* 9. Quantified Business Impact (ROI & Cycle Acceleration) */}
        <BusinessImpactROI
          onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
        />

        {/* 10. High-Conversion Dual CTA Block (Test Drive Simulator / Enterprise) */}
        <DualCTASection
          onOpenApp={handleOpenApp}
          onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
        />
      </main>

      {/* 11. Comprehensive Global Footer */}
      <GlobalFooter
        onOpenApp={handleOpenApp}
        onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
      />

      {/* Enterprise Consultation & Architecture Modal */}
      <EnterpriseConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />

    </div>
  );
};