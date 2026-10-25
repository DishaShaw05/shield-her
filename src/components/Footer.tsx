import React from 'react';
import { Shield, Phone, ExternalLink, RefreshCw, AlertCircle, Heart } from 'lucide-react';

interface FooterProps {
  onResetData: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onResetData }) => {
  return (
    <footer className="mt-20 border-t border-purple-950/60 bg-navy-950/90 py-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid: Brand, Helplines & Portals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center p-0.5">
                <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-pink-400" />
                </div>
              </div>
              <span className="font-bold text-lg text-white">SHIELD HER</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              <strong>Your Safety. Your Privacy. Your Power.</strong><br />
              An integrated physical safety and digital threat mitigation platform engineered for women, students, and professionals.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-purple-400">
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
              <span>Built with empathy, privacy-by-design & zero trackers</span>
            </div>
          </div>

          {/* Official Indian Emergency Helplines */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-pink-400" />
              Official National Helplines (India)
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a 
                href="tel:112" 
                className="p-2.5 rounded-xl bg-navy-900 border border-slate-800 hover:border-pink-500/50 hover:bg-slate-850 text-slate-300 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="block font-bold text-white">112</span>
                  <span className="text-[11px] text-slate-400">All Emergencies</span>
                </div>
                <Phone className="w-3.5 h-3.5 text-red-400" />
              </a>

              <a 
                href="tel:1091" 
                className="p-2.5 rounded-xl bg-navy-900 border border-slate-800 hover:border-pink-500/50 hover:bg-slate-850 text-slate-300 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="block font-bold text-white">1091</span>
                  <span className="text-[11px] text-slate-400">Women Helpline</span>
                </div>
                <Phone className="w-3.5 h-3.5 text-pink-400" />
              </a>

              <a 
                href="tel:1930" 
                className="p-2.5 rounded-xl bg-navy-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-850 text-slate-300 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="block font-bold text-white">1930</span>
                  <span className="text-[11px] text-slate-400">Cyber Financial Fraud</span>
                </div>
                <Phone className="w-3.5 h-3.5 text-purple-400" />
              </a>

              <a 
                href="tel:181" 
                className="p-2.5 rounded-xl bg-navy-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-850 text-slate-300 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="block font-bold text-white">181</span>
                  <span className="text-[11px] text-slate-400">Domestic Abuse</span>
                </div>
                <Phone className="w-3.5 h-3.5 text-purple-400" />
              </a>
            </div>
          </div>

          {/* Official Portals & Reset Control */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
              Official Government Portals
            </h4>
            <div className="space-y-1.5 text-xs">
              <a 
                href="https://112.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-lg bg-navy-900 border border-slate-850 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <span>National Emergency Support (112.gov.in)</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
              <a 
                href="https://cybercrime.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-lg bg-navy-900 border border-slate-850 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <span>National Cyber Crime Portal (cybercrime.gov.in)</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={onResetData}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 transition-all"
                title="Resets local storage demo data back to default test dataset"
              >
                <RefreshCw className="w-3 h-3 text-slate-400" />
                <span>Reset Demo Prototype Data</span>
              </button>
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-900 pt-6">
          <p>© 2026 SHIELD HER Platform. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Client-Side Architecture • Zero External Tracking • Privacy-First</p>
        </div>

      </div>
    </footer>
  );
};
