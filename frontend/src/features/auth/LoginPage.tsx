import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import { LightCoveBackground } from '../../components/ui/LightCoveBackground';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigateToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToLanding,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your corporate email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    // Simulated authentic authentication handshake
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 650);
  };

  const handleQuickDemoFill = () => {
    setEmail('lead.analyst@aura.enterprise');
    setPassword('AuraSecure2026!');
    setErrorMessage(null);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden text-zinc-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Light Cove Canvas Animation Background */}
      <LightCoveBackground />

      {/* Top Header Navigation */}
      <header className="relative z-10 w-full px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <button
          onClick={onNavigateToLanding}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-150 py-1.5 px-3 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/80 backdrop-blur-md"
          aria-label="Return to landing page"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Overview</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/60 border border-cyan-500/20 backdrop-blur-md text-xs text-cyan-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>AURA Engine v2.4</span>
        </div>
      </header>

      {/* Centered Authentication Surface */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-[420px]">
          {/* Main Auth Card Container */}
          <div className="relative rounded-2xl bg-zinc-950/85 backdrop-blur-2xl border border-zinc-800/80 shadow-2xl shadow-cyan-950/30 p-7 sm:p-9 transition-all">
            
            {/* Header / Identity */}
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/30 text-cyan-400 mb-3.5 shadow-inner">
                <KeyRound className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Platform Authentication
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 leading-relaxed">
                Sign in to access real-time compensation models & ledger records
              </p>
            </div>

            {/* Error Notification Banner */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <span className="shrink-0 font-bold">!</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Corporate ID */}
              <div>
                <label
                  htmlFor="email-input"
                  className="block text-xs font-semibold text-zinc-300 mb-1.5 tracking-wide uppercase"
                >
                  Corporate Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@aura.enterprise"
                    autoComplete="username"
                    autoFocus
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password-input"
                    className="block text-xs font-semibold text-zinc-300 tracking-wide uppercase"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage('Password reset link sent to registered email.');
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Session Option */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-xs text-zinc-400">Remember session</span>
                </label>

                {/* Quick 1-click test fill */}
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="text-[11px] text-zinc-500 hover:text-cyan-300 underline underline-offset-2 transition-colors"
                  title="Auto-fill sample credentials for rapid review"
                >
                  Quick Fill Demo
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-900/40 hover:shadow-cyan-900/60 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Platform</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Security Note */}
            <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 1.3 End-to-End Encrypted Session</span>
            </div>
          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} AURA Platform. All rights reserved.
      </footer>
    </div>
  );
};
