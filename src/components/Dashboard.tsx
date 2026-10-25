import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  PhoneCall, 
  Compass, 
  Users, 
  ShieldAlert, 
  FileText, 
  CheckSquare, 
  BookOpen, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Lightbulb, 
  ArrowUpRight,
  Sparkles,
  Lock,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { ActiveSection, Contact, Journey, IncidentRecord, PrivacyCheckItem, User } from '../types';

interface DashboardProps {
  onNavigate: (section: ActiveSection) => void;
  onOpenSOS: () => void;
  journey: Journey | null;
  contacts: Contact[];
  incidents: IncidentRecord[];
  privacyItems: PrivacyCheckItem[];
  currentUser?: User | null;
  onLogout?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenSOS,
  journey,
  contacts,
  incidents,
  privacyItems,
  currentUser,
  onLogout,
}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const quickTips = [
    {
      title: 'Night Travel Verification',
      text: 'Always check that the child lock is disabled before entering a private cab, and share the live ride status with a trusted contact.',
      category: 'Physical Safety'
    },
    {
      title: 'Digital Arrest Scam Alert',
      text: 'Indian Police, CBI, or Customs never interrogate or place citizens under "digital arrest" via Skype or WhatsApp video calls. Hang up and dial 112.',
      category: 'Cyber Scam Defense'
    },
    {
      title: 'Preserving Stalker Evidence',
      text: 'Before blocking abusive accounts, capture uncropped screenshots displaying date, time, and full handle/URL for police admissibility.',
      category: 'Legal Evidence'
    },
    {
      title: 'Lock Screen Privacy',
      text: 'Disable SMS and WhatsApp notification previews on your lock screen so sensitive 2FA OTP codes cannot be read by strangers.',
      category: 'Device Hygiene'
    }
  ];

  // Rotate tips periodically
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % quickTips.length);
    }, 8000);
    return () => clearInterval(tipInterval);
  }, [quickTips.length]);

  // Privacy completed percentage
  const completedPrivacy = privacyItems.filter(item => item.completed).length;
  const privacyPercentage = Math.round((completedPrivacy / (privacyItems.length || 1)) * 100);

  // Determine Journey status badge & banner
  const isJourneyActive = journey?.status === 'active';
  const isJourneyOverdue = journey?.status === 'overdue';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* OVERDUE JOURNEY ALERT BANNER (High Priority Alert) */}
      {isJourneyOverdue && (
        <div className="p-4 sm:p-5 rounded-3xl bg-red-950/80 border-2 border-red-500 shadow-glow-red flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600 text-white">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                SAFE JOURNEY CHECK-IN OVERDUE!
              </h3>
              <p className="text-sm text-red-200">
                Your check-in deadline for destination <strong>"{journey?.destination}"</strong> has passed. Confirm you are safe or notify emergency contacts.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('journey')}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-white text-red-700 font-bold text-sm hover:bg-red-50 transition-colors shadow-sm"
            >
              View Journey
            </button>
            <button
              onClick={onOpenSOS}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-500 transition-colors"
            >
              SOS Help
            </button>
          </div>
        </div>
      )}

      {/* USER ACCOUNT INFORMATION & LOGOUT BAR */}
      {currentUser && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-navy-900/90 via-purple-950/40 to-navy-900/90 border border-purple-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 shadow-sm flex-shrink-0">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center font-black text-pink-300 text-base">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-white">
                  Welcome, {currentUser.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold">
                  Protected
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {currentUser.email} • Client-Side Encrypted Session
              </p>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-red-950/60 hover:text-red-300 hover:border-red-500/40 border border-slate-700 text-slate-300 text-xs font-semibold transition-all"
              title="Sign out of your protected session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      )}

      {/* HERO SECTION: Title & Prominent SOS Button */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-850 to-purple-950/60 border border-purple-900/40 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Welcome & Platform Overview */}
          <div className="space-y-4 text-center lg:text-left max-w-2xl">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                SHIELD <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-rose-400 bg-clip-text text-transparent">HER</span>
              </h1>
              <p className="text-base sm:text-lg font-medium text-purple-200/90">
                Personal Safety & Digital Threat Protection
              </p>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                Your Safety. Your Privacy. Your Power. An integrated guardian for transit monitoring, trusted speed dial, digital extortion defense, and private evidence logging.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100% Client-Side Privacy
              </span>
              <span className="flex items-center gap-1 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" /> India Emergency 112 Ready
              </span>
              <span className="flex items-center gap-1 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Cyber Fraud Detection
              </span>
            </div>
          </div>

          {/* Prominent Circular SOS Button with Multi-layer Glow */}
          <div className="flex flex-col items-center justify-center gap-3">
            <button
              onClick={onOpenSOS}
              className="group relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-pink-600 shadow-glow-red hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-400 cursor-pointer"
              aria-label="Activate Emergency SOS Assistance"
            >
              {/* Pulsing outer aura ring */}
              <div className="absolute inset-0 rounded-full bg-red-500 opacity-30 animate-ping-slow"></div>
              
              {/* Inner content */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-3 text-white">
                <PhoneCall className="w-10 h-10 sm:w-12 sm:h-12 text-white group-hover:scale-110 transition-transform mb-1" />
                <span className="text-xl sm:text-2xl font-black tracking-widest leading-none">
                  SOS
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-100 opacity-90 mt-1">
                  EMERGENCY
                </span>
              </div>
            </button>
            <span className="text-xs text-slate-400 font-medium text-center">
              Tap for 112 Speed-Dial & Circle Broadcast
            </span>
          </div>

        </div>
      </div>

      {/* METRIC STATUS CARDS (4 Columns) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1: Journey Status */}
        <div 
          onClick={() => onNavigate('journey')}
          className="glass-card glass-card-hover p-4 sm:p-5 rounded-2xl cursor-pointer group"
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-400 group-hover:text-purple-300">
              <Compass className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-purple-300 transition-colors" />
          </div>
          <span className="text-xs text-slate-400 font-medium">Safe Journey Status</span>
          <div className="mt-1 flex items-center gap-2">
            {!journey || journey.status === 'not_started' ? (
              <span className="text-sm sm:text-base font-bold text-slate-300">Not Started</span>
            ) : journey.status === 'active' ? (
              <span className="text-sm sm:text-base font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Active Journey
              </span>
            ) : journey.status === 'overdue' ? (
              <span className="text-sm sm:text-base font-bold text-red-400">Overdue Check-in</span>
            ) : journey.status === 'safe' ? (
              <span className="text-sm sm:text-base font-bold text-purple-300">Arrived Safe</span>
            ) : (
              <span className="text-sm sm:text-base font-bold text-slate-400">Cancelled</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            {journey?.destination ? `To: ${journey.destination}` : 'Tap to plan check-in timer'}
          </p>
        </div>

        {/* Metric 2: Trusted Circle */}
        <div 
          onClick={() => onNavigate('circle')}
          className="glass-card glass-card-hover p-4 sm:p-5 rounded-2xl cursor-pointer group"
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-pink-900/40 border border-pink-500/30 text-pink-400 group-hover:text-pink-300">
              <Users className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-pink-300 transition-colors" />
          </div>
          <span className="text-xs text-slate-400 font-medium">Trusted Circle</span>
          <div className="mt-1">
            <span className="text-xl sm:text-2xl font-bold text-white">{contacts.length}</span>
            <span className="text-xs text-slate-400 ml-1.5">Contacts</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            {contacts.find(c => c.isPrimary)?.name 
              ? `Primary: ${contacts.find(c => c.isPrimary)?.name}`
              : 'Add family or friend'}
          </p>
        </div>

        {/* Metric 3: Digital Privacy Score */}
        <div 
          onClick={() => onNavigate('privacy')}
          className="glass-card glass-card-hover p-4 sm:p-5 rounded-2xl cursor-pointer group"
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-indigo-900/40 border border-indigo-500/30 text-indigo-400 group-hover:text-indigo-300">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-indigo-300">{privacyPercentage}%</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Privacy Checkup</span>
          <div className="mt-1">
            <span className="text-lg sm:text-xl font-bold text-white">{completedPrivacy} / {privacyItems.length}</span>
            <span className="text-xs text-slate-400 ml-1">Tasks</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${privacyPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 4: Evidence Vault */}
        <div 
          onClick={() => onNavigate('vault')}
          className="glass-card glass-card-hover p-4 sm:p-5 rounded-2xl cursor-pointer group"
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-rose-900/40 border border-rose-500/30 text-rose-400 group-hover:text-rose-300">
              <FileText className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-rose-300 transition-colors" />
          </div>
          <span className="text-xs text-slate-400 font-medium">Evidence Vault</span>
          <div className="mt-1">
            <span className="text-xl sm:text-2xl font-bold text-white">{incidents.length}</span>
            <span className="text-xs text-slate-400 ml-1.5">Logged Record(s)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            Client-side timestamped log
          </p>
        </div>

      </div>

      {/* CORE FEATURE NAVIGATION GRID (6 Interactive Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            Core Safety & Defense Modules
          </h2>
          <span className="text-xs text-slate-400">All tools fully interactive & offline capable</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Feature 1: Safe Journey */}
          <div 
            onClick={() => onNavigate('journey')}
            className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group relative overflow-hidden"
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="p-3 rounded-2xl bg-purple-900/30 border border-purple-500/30 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-base text-white mt-4 group-hover:text-purple-300 transition-colors">
              Safe Journey Tracker
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Schedule your destination, set expected arrival deadlines, view live countdowns, and receive overdue alerts if you fail to check in.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-purple-400 font-semibold">
              <span>{isJourneyActive ? 'Manage active journey' : 'Start journey countdown'}</span>
              <span>→</span>
            </div>
          </div>

          {/* Feature 2: Trusted Circle */}
          <div 
            onClick={() => onNavigate('circle')}
            className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group relative overflow-hidden"
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="p-3 rounded-2xl bg-pink-900/30 border border-pink-500/30 text-pink-400 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-base text-white mt-4 group-hover:text-pink-300 transition-colors">
              Trusted Circle
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Maintain your emergency guardian network. Add phone numbers, relationship roles, primary contacts, and launch 1-click calls or alerts.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-pink-400 font-semibold">
              <span>View & add contacts</span>
              <span>→</span>
            </div>
          </div>

          {/* Feature 3: Digital Shield (Suspicious Message Analyzer) */}
          <div 
            onClick={() => onNavigate('analyzer')}
            className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group relative overflow-hidden"
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="p-3 rounded-2xl bg-rose-900/30 border border-rose-500/30 text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-base text-white mt-4 group-hover:text-rose-300 transition-colors">
              Digital Shield Analyzer
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Paste suspicious messages, SMS, or DMs to detect extortion, sextortion, threats, fake CBI/police digital arrest, or OTP harvesting.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-rose-400 font-semibold">
              <span>Analyze message safety</span>
              <span>→</span>
            </div>
          </div>

          {/* Feature 4: Evidence Vault */}
          <div 
            onClick={() => onNavigate('vault')}
            className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group relative overflow-hidden"
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="p-3 rounded-2xl bg-indigo-900/30 border border-indigo-500/30 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-base text-white mt-4 group-hover:text-indigo-300 transition-colors">
              Evidence Vault
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Log harassment incidents, stalker handles, date-stamped notes, and reference files securely client-side for police or legal filing.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-indigo-400 font-semibold">
              <span>Review incident records</span>
              <span>→</span>
            </div>
          </div>

          {/* Feature 5: Privacy Checkup */}
          <div 
            onClick={() => onNavigate('privacy')}
            className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group relative overflow-hidden"
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="p-3 rounded-2xl bg-violet-900/30 border border-violet-500/30 text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                <CheckSquare className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-base text-white mt-4 group-hover:text-violet-300 transition-colors">
              Digital Privacy Audit
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              An interactive 9-point audit covering 2FA, screen lock, location sharing, social media stalker restrictions, and session audits.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-violet-400 font-semibold">
              <span>Complete your checkup</span>
              <span>→</span>
            </div>
          </div>

          {/* Feature 6: Safety Resources & Helplines */}
          <div 
            onClick={() => onNavigate('resources')}
            className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group relative overflow-hidden"
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="p-3 rounded-2xl bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-base text-white mt-4 group-hover:text-cyan-300 transition-colors">
              Safety Resources & Law
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Official Indian government emergency numbers (112, 1091, 1930, NCW) and practical step-by-step guides for physical and cyber defense.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-cyan-400 font-semibold">
              <span>Explore resources & rights</span>
              <span>→</span>
            </div>
          </div>

        </div>
      </div>

      {/* QUICK SAFETY TIP BANNER (Rotates practical wisdom) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-navy-900 to-navy-850 border border-purple-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-purple-600/20 text-pink-400 border border-purple-500/30 flex-shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-pink-400">
                {quickTips[currentTipIndex].category}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-semibold text-slate-300">
                {quickTips[currentTipIndex].title}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              {quickTips[currentTipIndex].text}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
          {quickTips.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentTipIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentTipIndex ? 'w-6 bg-pink-500' : 'bg-slate-700 hover:bg-slate-600'
              }`}
              aria-label={`Jump to safety tip ${i + 1}`}
            />
          ))}
        </div>
      </div>

    </div>
  );
};
