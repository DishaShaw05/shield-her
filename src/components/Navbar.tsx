import React, { useState } from 'react';
import { 
  Shield, 
  PhoneCall, 
  Menu, 
  X, 
  Users, 
  Compass, 
  ShieldAlert, 
  FileText, 
  CheckSquare, 
  BookOpen, 
  MapPin, 
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { ActiveSection, User } from '../types';

interface NavbarProps {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  onOpenSOS: () => void;
  isJourneyActive: boolean;
  currentUser?: User | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  setActiveSection,
  onOpenSOS,
  isJourneyActive,
  currentUser,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveSection; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Shield className="w-4 h-4" /> },
    { id: 'journey', label: 'Safe Journey', icon: <Compass className="w-4 h-4" />, badge: isJourneyActive ? 'LIVE' : undefined },
    { id: 'circle', label: 'Trusted Circle', icon: <Users className="w-4 h-4" /> },
    { id: 'analyzer', label: 'Digital Shield', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'vault', label: 'Evidence Vault', icon: <FileText className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy Checkup', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'location', label: 'GPS Tool', icon: <MapPin className="w-4 h-4" /> },
    { id: 'resources', label: 'Safety Resources', icon: <BookOpen className="w-4 h-4" /> },
  ];

  const handleNavClick = (section: ActiveSection) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-navy-950/85 backdrop-blur-md border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavClick('dashboard'); }}
            aria-label="Go to Shield Her Dashboard"
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-rose-500 shadow-glow-pink p-0.5 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-pink-400 group-hover:text-pink-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-pink-100 to-pink-300 bg-clip-text text-transparent">
                  SHIELD HER
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden md:block">
                Your Safety. Your Privacy. Your Power.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'text-white bg-purple-900/40 border border-purple-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={isActive ? 'text-pink-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions: Emergency SOS & User Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Prominent Emergency SOS Button */}
            <button
              onClick={onOpenSOS}
              className="relative group flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white font-bold text-xs sm:text-sm tracking-wide shadow-glow-red hover:brightness-110 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label="Open Emergency SOS Dialog"
            >
              <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-white"></span>
              </span>
              <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span>SOS</span>
            </button>

            {/* Desktop User Profile & Logout */}
            {currentUser && onLogout && (
              <div className="hidden sm:flex items-center gap-2 border-l border-purple-900/40 pl-3">
                <div 
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300"
                  title={`Logged in as ${currentUser.name} (${currentUser.email})`}
                >
                  <div className="w-6 h-6 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold text-[11px]">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate font-medium text-slate-200">{currentUser.name}</span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-red-400 hover:bg-slate-800 border border-slate-700/60 transition-colors"
                  title="Sign out of account"
                  aria-label="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-900/95 border-b border-purple-900/40 backdrop-blur-xl px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          
          {/* User Account Mobile Header */}
          {currentUser && (
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{currentUser.email}</div>
                </div>
              </div>
              {onLogout && (
                <button
                  onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-300 text-xs font-semibold border border-red-500/40 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          )}

          <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-300 border-b border-purple-900/30">
            Platform Modules
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-white bg-purple-900/40 border border-purple-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-pink-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      )}
    </header>
  );
};
