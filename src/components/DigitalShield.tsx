import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  Lock, 
  Info,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { MessageAnalysisResult } from '../types';
import { analyzeSuspiciousMessage, PRESET_TEST_MESSAGES } from '../utils/analyzer';

interface DigitalShieldProps {
  onLogIncidentFromAnalysis: (text: string, category: string) => void;
}

export const DigitalShield: React.FC<DigitalShieldProps> = ({
  onLogIncidentFromAnalysis,
}) => {
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<MessageAnalysisResult | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAnalyze = () => {
    if (!inputText.trim()) {
      setAnalysisResult(null);
      setHasAnalyzed(false);
      return;
    }
    const result = analyzeSuspiciousMessage(inputText);
    setAnalysisResult(result);
    setHasAnalyzed(true);
  };

  const handleReset = () => {
    setInputText('');
    setAnalysisResult(null);
    setHasAnalyzed(false);
  };

  const loadPreset = (text: string) => {
    setInputText(text);
    const result = analyzeSuspiciousMessage(text);
    setAnalysisResult(result);
    setHasAnalyzed(true);
  };

  const handleExportToVault = () => {
    if (!inputText.trim() || !analysisResult) return;

    let category = 'Other';
    if (analysisResult.detectedSigns.some(s => s.id === 'blackmail_sextortion' || s.id === 'threats_intimidation')) {
      category = 'Threats or Blackmail';
    } else if (analysisResult.detectedSigns.some(s => s.id === 'authority_spoofing')) {
      category = 'Impersonation';
    } else if (analysisResult.detectedSigns.some(s => s.id === 'intimate_images_requests')) {
      category = 'Online Harassment';
    } else if (analysisResult.detectedSigns.some(s => s.id === 'otp_password_theft' || s.id === 'banking_upi_fraud')) {
      category = 'Privacy Breach';
    }

    onLogIncidentFromAnalysis(inputText, category);
    showToast('Transferred to Evidence Vault! Switched to draft record.');
  };

  // Warning level styling
  const getBadgeStyle = (label: string) => {
    switch (label) {
      case 'Several Warning Signs Detected':
        return {
          bg: 'bg-red-950/80',
          border: 'border-red-500',
          text: 'text-red-400',
          glow: 'shadow-glow-red',
        };
      case 'Some Warning Signs Detected':
        return {
          bg: 'bg-amber-950/80',
          border: 'border-amber-500',
          text: 'text-amber-400',
          glow: 'shadow-none',
        };
      default:
        return {
          bg: 'bg-emerald-950/80',
          border: 'border-emerald-500',
          text: 'text-emerald-400',
          glow: 'shadow-none',
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-purple-600 text-white font-medium text-sm shadow-xl">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-900/40 border border-rose-500/40 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Digital Shield — Threat Analyzer
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Detect blackmail, sextortion, impersonation, UPI traps, fake arrests, and credential theft using deterministic rule-based analysis.
        </p>
      </div>

      {/* CRITICAL PRIVACY WARNING BANNER */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 space-y-1">
        <div className="flex items-center gap-2 font-bold text-amber-300">
          <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Privacy Safety Rule: Never Paste Active Credentials</span>
        </div>
        <p className="leading-relaxed">
          Do NOT paste your real passwords, active 6-digit OTPs, banking PINs, or confidential government identification numbers into any tool. This analyzer runs purely locally inside your browser; however, safe cyber hygiene dictates withholding active secrets.
        </p>
      </div>

      {/* QUICK PRESET TEST MESSAGES */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          One-Click Threat Test Presets:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_TEST_MESSAGES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(preset.text)}
              className="text-left p-3 rounded-xl bg-navy-900 border border-slate-800 hover:border-pink-500/40 hover:bg-slate-850 transition-all group"
            >
              <div className="font-semibold text-xs text-white group-hover:text-pink-300 flex items-center justify-between">
                <span>{preset.title}</span>
                <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-pink-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ANALYZER INPUT AREA */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-purple-900/40 space-y-4">
        
        <div className="flex items-center justify-between">
          <label htmlFor="messageInput" className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Paste Message, SMS, DM, or Threat Text:
          </label>
          <span className="text-xs text-slate-500 font-mono">
            {inputText.length} characters
          </span>
        </div>

        <textarea
          id="messageInput"
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste suspicious WhatsApp text, Instagram DM, SMS, or email here for instant safety screening..."
          className="w-full p-4 rounded-2xl bg-navy-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-mono leading-relaxed"
        />

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={!inputText && !hasAnalyzed}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear / Reset</span>
          </button>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!inputText.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:brightness-110 disabled:opacity-40 text-white font-bold text-sm shadow-glow-pink transition-all active:scale-95"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Analyze Safety Risk</span>
          </button>
        </div>

      </div>

      {/* ANALYSIS RESULTS SECTION */}
      {hasAnalyzed && analysisResult && (
        <div className="space-y-6 animate-in slide-in-from-bottom-3 duration-300">
          
          {/* Risk Level Banner */}
          {(() => {
            const style = getBadgeStyle(analysisResult.label);
            return (
              <div className={`p-6 rounded-3xl border-2 ${style.bg} ${style.border} ${style.glow} space-y-3`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-300">
                      Overall Warning Assessment
                    </span>
                    <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${style.text} mt-0.5`}>
                      {analysisResult.label}
                    </h2>
                  </div>

                  {/* Vault Export Shortcut */}
                  {analysisResult.detectedSigns.length > 0 && (
                    <button
                      onClick={handleExportToVault}
                      className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Save as Incident in Vault</span>
                    </button>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
                  {analysisResult.summary}
                </p>
              </div>
            );
          })()}

          {/* DETECTED WARNING SIGNS CARDS */}
          {analysisResult.detectedSigns.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Detected Threat Signatures ({analysisResult.detectedSigns.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {analysisResult.detectedSigns.map((sign) => (
                  <div
                    key={sign.id}
                    className="p-4 rounded-2xl bg-navy-900 border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-white">{sign.title}</h4>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                        sign.severity === 'high' 
                          ? 'bg-red-500/20 text-red-300 border-red-500/40' 
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {sign.severity} SEVERITY
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {sign.explanation}
                    </p>

                    {/* Matched Triggers */}
                    <div className="pt-1 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Matched:</span>
                      {sign.matchedKeywords.map((kw, i) => (
                        <span 
                          key={i} 
                          className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-navy-950 border border-slate-700 text-pink-300"
                        >
                          "{kw}"
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RECOMMENDED NEXT STEPS */}
          <div className="p-6 rounded-3xl bg-navy-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Recommended Immediate Actions
            </h3>

            <div className="space-y-2">
              {analysisResult.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-purple-900/60 text-purple-300 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>

            {/* Official Report Links */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">
                Official Reporting: National Cyber Crime Helpline <strong>1930</strong>
              </span>

              <a
                href="https://cybercrime.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-pink-400 hover:text-pink-300 font-semibold underline"
              >
                <span>Report on cybercrime.gov.in</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* REALISTIC ENGINE BOUNDARY DISCLAIMER */}
          <div className="p-4 rounded-2xl bg-navy-950/70 border border-slate-800/80 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-400">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Safety Limitations Notice</span>
            </div>
            <p>
              This analyzer operates on pattern heuristics for known coercion, harassment, and fraud patterns. Attackers continuously alter syntax, slang, and context. A message classified as "No Common Warning Signs Detected" does not guarantee absolute safety. Never transfer money, share credentials, or isolate yourself under pressure.
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
