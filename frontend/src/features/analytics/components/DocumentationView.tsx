import React from 'react';
import { FileSpreadsheet, ShieldCheck, Scale, Award, Info } from 'lucide-react';
import { Card, CardHeaderTitle } from '../../../components/ui/Card';

export const DocumentationView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <Card className="p-6 space-y-4">
        <CardHeaderTitle
          icon={FileSpreadsheet}
          title="Corporate Compensation & Appraisal Policy Manual"
          subtitle="Operational rules governing Machine Learning-assisted salary increments"
        />

        <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-500" />
              1. Policy Ceiling & Floor Boundaries
            </h3>
            <p>
              All salary hike recommendations are programmatically bounded between a floor of{' '}
              <strong>5.0%</strong> (cost of living baseline) and an absolute ceiling of{' '}
              <strong>35.0%</strong> (standard organizational retention cap). Recommendations exceeding
              35% require explicit Compensation Committee escalation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-500" />
              2. Performance Rating Tiers
            </h3>
            <ul className="list-disc list-inside space-y-1.5 pl-1">
              <li>
                <strong>Tier 1 (4.5 - 5.0):</strong> Top 10% performers. Fast-track approval; eligible for 20% - 35% hikes plus equity refreshes.
              </li>
              <li>
                <strong>Tier 2 (3.8 - 4.4):</strong> Core high performers (60% cohort). Standard merit band between 14% - 20%.
              </li>
              <li>
                <strong>Tier 3 (3.0 - 3.7):</strong> Solid contributors meeting expectations. Standard 8% - 13% increment.
              </li>
              <li>
                <strong>Tier 4 (&lt; 3.0):</strong> Below standard; triggers PIP review and capped at 5.0% cost-of-living increment.
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              3. Machine Learning Governance & Dual-Pipeline Verification
            </h3>
            <p>
              The system runs two distinct algorithms concurrently:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>
                <strong>Gradient Boosting Regressor:</strong> Captures non-linear tenure effects, experience saturation, and role supply premiums (R² = 0.949).
              </li>
              <li>
                <strong>Linear Regression:</strong> Serves as an unconstrained baseline for parity auditing and audit compliance (R² = 0.925).
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
