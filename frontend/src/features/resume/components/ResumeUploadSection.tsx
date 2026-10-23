import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCheck,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Card, CardHeaderTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { salaryService } from '../../../services/salaryService';
import { supabaseService } from '../../../services/supabase';
import { ResumeUploadResponse, ResumeParsedProfile } from '../../../types';
import { ResumeAnalysisOverlay } from './ResumeAnalysisOverlay';

interface ResumeUploadSectionProps {
  onApplyToSimulator: (profile: ResumeParsedProfile) => void;
  onNavigateToLedger?: () => void;
  className?: string;
}

const SAMPLE_RESUMES = [
  {
    title: 'Aarav Gupta — Senior Python / AI Engineer',
    experience: '6.0 Yrs',
    role: 'Python',
    rating: '4.8 / 5.0',
    salary: '₹18 LPA',
    text: `Aarav Gupta
Email: aarav.gupta@enterprise.io | Phone: +91 98765 43210
Location: Bangalore, India
Senior Software Engineer (Python & Data Systems)

Professional Summary:
Backend Software Architect with 6.0 years of experience designing high-performance microservices, event-driven data streaming pipelines, and AI/ML inference infrastructure.
Performance Appraisal: Annual Score 4.8 / 5.0 (Consistent Exceeds Expectations, Band A).
Current Compensation: 18.0 LPA

Core Technical Skills:
Python, FastAPI, Django, PostgreSQL, Redis, Docker, Kubernetes, AWS, Kafka, Microservices, CI/CD, Git, System Design.

Experience:
Senior Software Engineer at CloudCorp (2020 - Present)
- Architected core backend services processing 30M+ requests daily.
Software Developer at DataScale (2018 - 2020)
- Optimized query pipelines and built RESTful endpoints.`
  },
  {
    title: 'Sneha Rao — Staff Frontend Architect',
    experience: '7.5 Yrs',
    role: 'Frontend',
    rating: '4.6 / 5.0',
    salary: '₹22 LPA',
    text: `Sneha Rao
Email: sneha.rao@techhub.in | Phone: +91 98112 23344
Location: Hyderabad, India
Staff Frontend Engineer & UI Architect

Summary:
Distinguished Frontend Engineer with 7.5 years of industry experience leading design systems, client-side rendering engines, and high-scale web platforms.
Appraisal Rating: 4.6 / 5.0 (Outstanding Contribution).
Current Base Salary: 22.0 LPA

Technical Skills:
React, TypeScript, Next.js, Tailwind CSS, GraphQL, State Management, Vite, Microfrontends, Jest, Webpack, UI/UX Architecture.

Professional History:
Lead UI Engineer at NextGen Systems (2021 - Present)
- Led team of 12 engineers in enterprise frontend redesign.
Senior Frontend Developer at WebTech (2017 - 2021)
- Developed reusable component libraries and accessibility suites.`
  },
  {
    title: 'Vikram Malhotra — Android & Mobile Specialist',
    experience: '4.5 Yrs',
    role: 'Android',
    rating: '4.3 / 5.0',
    salary: '₹13 LPA',
    text: `Vikram Malhotra
Email: vikram.m@appworks.com | Phone: +91 97654 32109
Location: Pune, India
Senior Android & Mobile Developer

Summary:
Mobile application developer with 4.5 years of professional experience building scalable Android native and Kotlin Multiplatform applications.
Annual Performance Rating: 4.3 / 5.0 (Strong Exceeds Standard).
Current CTC: 13.0 LPA

Skills:
Android, Kotlin, Jetpack Compose, Coroutines, Flow, SQLite, Gradle, REST APIs, Git, Google Play Deployment, Firebase.

Employment Experience:
Senior Mobile Developer at AppCraft (2022 - Present)
Android Engineer at MobileFirst (2019 - 2022)`
  }
];

export const ResumeUploadSection: React.FC<ResumeUploadSectionProps> = ({
  onApplyToSimulator,
  onNavigateToLedger,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ResumeUploadResponse | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-read handler as soon as document is selected
  const processFile = async (file: File) => {
    setError(null);
    setIsProcessing(true);

    const validExtensions = ['.pdf', '.docx', '.txt'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setError(`Unsupported format. Please upload a PDF, DOCX, or TXT document.`);
      setIsProcessing(false);
      return;
    }

    try {
      setCurrentStep('Reading document byte streams & structure...');
      await new Promise(r => setTimeout(r, 200));

      setCurrentStep('Extracting candidate tenure, appraisal rating & technical skills...');
      const response = await salaryService.uploadResume(file);

      setCurrentStep('Running dual-model Machine Learning inference...');
      await new Promise(r => setTimeout(r, 250));

      if (response && response.status === 'success') {
        setAnalysisResult(response);
        setIsOverlayOpen(true);
        supabaseService.recordCVUpload({
          filename: file.name,
          candidate_name: response.extracted_profile?.candidate_name,
          role: response.extracted_profile?.role,
          experience: response.extracted_profile?.experience,
          rating: response.extracted_profile?.rating,
          current_salary: response.extracted_profile?.salary,
          predicted_hike: response.prediction?.recommended_hike_pct,
          skills: response.extracted_profile?.skills || []
        }).catch(e => console.warn('Supabase CV log skip:', e));
      } else {
        throw new Error(response.error || 'Failed to extract features from resume.');
      }
    } catch (err: any) {
      console.error('Resume processing error:', err);
      setError(err.message || 'Error parsing document. Please check the file and try again.');
    } finally {
      setIsProcessing(false);
      setCurrentStep('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleSampleClick = (sample: typeof SAMPLE_RESUMES[0]) => {
    const blob = new Blob([sample.text], { type: 'text/plain' });
    const file = new File([blob], `${sample.title.split('—')[0].trim().replace(/\s+/g, '_')}_Resume.txt`, {
      type: 'text/plain',
    });
    processFile(file);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <CardHeaderTitle
        icon={Upload}
        title="Candidate CV / Resume AI Scanner"
        subtitle="Upload or drop any candidate resume (PDF, DOCX, TXT) for instant automated reading & ML hike forecasting"
        badge={
          <Badge variant="success">
            Auto-Read Active
          </Badge>
        }
      />

      {/* Main Drag-and-Drop Auto-Read Box */}
      <Card className="p-8 relative overflow-hidden border-2 border-dashed transition-all duration-300">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-8 rounded-2xl cursor-pointer transition-all ${
            isDragging
              ? 'bg-emerald-500/10 border-emerald-500 scale-[1.01]'
              : 'bg-white/[0.02] hover:bg-white/[0.04]'
          }`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin flex items-center justify-center" />
                <Sparkles className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Auto-Reading Document...</h3>
                <p className="text-xs text-emerald-400 font-mono tracking-wide">
                  {currentStep || 'Extracting features and running ML models...'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600/30 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition-transform">
                <Upload className="w-8 h-8 text-emerald-400" />
              </div>

              <div className="space-y-1.5 max-w-md">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Drop candidate resume here, or <span className="text-emerald-400 underline underline-offset-2">browse file</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Supports <strong className="text-zinc-900 dark:text-zinc-200">PDF, DOCX, TXT</strong> up to 15MB. The ML model auto-reads experience, skills, rating, and role immediately upon selection.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Badge variant="outline">
                  <FileText className="w-3 h-3 mr-1 text-zinc-400" />
                  Native PDF / DOCX Stream
                </Badge>
                <Badge variant="outline">
                  <Zap className="w-3 h-3 mr-1 text-amber-400" />
                  Instant ML Inference
                </Badge>
                <Badge variant="outline">
                  <ShieldCheck className="w-3 h-3 mr-1 text-teal-400" />
                  Dual Model Verification
                </Badge>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </Card>

      {/* Quick-Test Sample Candidate Resumes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Or Test With 1-Click Sample Resumes
          </span>
          <span className="text-[11px] text-zinc-400">
            Click any candidate to auto-read & predict
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_RESUMES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isProcessing}
              onClick={() => handleSampleClick(sample)}
              className="text-left p-4 rounded-2xl bg-white/[0.03] hover:bg-emerald-950/20 border border-white/8 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors block">
                    {sample.title}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                    <span className="text-emerald-400">{sample.experience}</span>
                    <span>•</span>
                    <span>{sample.rating}</span>
                    <span>•</span>
                    <span>{sample.salary}</span>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] group-hover:bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-zinc-400 group-hover:text-emerald-400 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Output Overlay Modal */}
      <ResumeAnalysisOverlay
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        result={analysisResult}
        onApplyToSimulator={onApplyToSimulator}
        onNavigateToLedger={onNavigateToLedger}
      />
    </div>
  );
};
