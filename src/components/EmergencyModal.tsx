import React, { useState } from 'react';
import { Phone, X, AlertTriangle, ShieldAlert, Copy, Check, Users, MapPin, ExternalLink, HeartHandshake } from 'lucide-react';
import { Contact, LocationState } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  currentLocation: LocationState | null;
  onNavigateToCircle: () => void;
  onRequestLocation: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  contacts,
  currentLocation,
  onNavigateToCircle,
  onRequestLocation,
}) => {
  const [copied, setCopied] = useState(false);

  // Close on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const locationSnippet = currentLocation?.latitude && currentLocation?.longitude
    ? `\nApprox GPS: https://maps.google.com/?q=${currentLocation.latitude},${currentLocation.longitude}`
    : '';

  const emergencyMessage = `EMERGENCY SOS ALERT: I feel unsafe and require immediate assistance! Please call or check on me right now.${locationSnippet}\n(Sent via SHIELD HER Safety Platform)`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(emergencyMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(emergencyMessage)}`;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-4 pt-4 sm:pt-8 pb-16 bg-navy-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
      onClick={onClose}
    >
      {/* Main Modal Card */}
      <div 
        className="relative w-full max-w-2xl bg-[#0e1628] border-2 border-red-500/70 rounded-3xl shadow-glow-red overflow-hidden p-5 sm:p-8 space-y-5 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header with Pulse Indicator & Single Clean Cross (X) Button */}
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-red-950/80">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-2xl bg-red-500 opacity-20"></span>
              <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
            </div>
            <div>
              <h2 id="emergency-modal-title" className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                EMERGENCY ASSISTANCE
              </h2>
              <p className="text-xs sm:text-sm text-red-300/90 font-medium">
                Immediate Action Center • India Emergency 112
              </p>
            </div>
          </div>

          {/* Exactly ONE Cross Button in Header */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 hover:text-white border border-red-500/60 transition-all font-bold text-xs shadow-md"
            aria-label="Close emergency modal"
            title="Close"
          >
            <X className="w-4 h-4 text-red-400" />
            <span>Close</span>
          </button>
        </div>

        {/* Real Service vs Simulation Notice */}
        <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 text-xs text-red-200/90 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Direct Dispatch Transparency:</strong> Clicking the emergency call buttons below will open your device's native phone dialer. SHIELD HER does not silently place calls or dispatch police without your manual trigger.
          </p>
        </div>

        {/* Primary Calling Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          {/* Call 112 (National Emergency) */}
          <a
            href="tel:112"
            className="group relative flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-lg shadow-glow-red hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Phone className="w-6 h-6 animate-bounce" />
            <div className="text-left">
              <span className="block text-xs uppercase font-semibold tracking-wider text-red-200">National Emergency</span>
              <span className="text-xl">CALL 112 NOW</span>
            </div>
          </a>

          {/* Call Women Helpline 1091 */}
          <a
            href="tel:1091"
            className="group flex items-center justify-center gap-3 p-4 rounded-2xl bg-purple-900/60 hover:bg-purple-900/90 border border-purple-500/50 text-white font-bold text-base transition-all active:scale-[0.98]"
          >
            <HeartHandshake className="w-6 h-6 text-pink-400" />
            <div className="text-left">
              <span className="block text-xs uppercase font-medium text-purple-300">Women Helpline (India)</span>
              <span className="text-lg">CALL 1091</span>
            </div>
          </a>

        </div>

        {/* Trusted Circle Quick Contacts */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-slate-400">
              <Users className="w-3.5 h-3.5 text-pink-400" />
              Trusted Circle Speed Dial
            </span>
            <button
              onClick={() => { onClose(); onNavigateToCircle(); }}
              className="text-pink-400 hover:text-pink-300 underline font-medium"
            >
              Manage Contacts ({contacts.length})
            </button>
          </div>

          {contacts.length === 0 ? (
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 text-center">
              No trusted contacts configured yet.{' '}
              <button 
                onClick={() => { onClose(); onNavigateToCircle(); }} 
                className="text-pink-400 hover:underline font-semibold"
              >
                Add family or friends now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {contacts.slice(0, 4).map((c) => (
                <a
                  key={c.id}
                  href={`tel:${c.phone}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-navy-900/80 hover:bg-slate-800/80 border border-slate-700/60 transition-all group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-white truncate">{c.name}</span>
                      {c.isPrimary && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40">
                          Primary
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 block">{c.relationship} • {c.phone}</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-pink-600/20 text-pink-400 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-colors flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Location & Quick Pre-formatted Message Broadcast */}
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Emergency Broadcast Text
            </span>
            {!currentLocation?.latitude ? (
              <button
                onClick={onRequestLocation}
                className="text-cyan-400 hover:text-cyan-300 font-medium underline flex items-center gap-1"
              >
                Attach Current GPS Location
              </button>
            ) : (
              <span className="text-emerald-400 font-mono text-[11px]">
                GPS Attached ({currentLocation.latitude.toFixed(4)}, {currentLocation.longitude?.toFixed(4)})
              </span>
            )}
          </div>

          <div className="p-2.5 rounded-xl bg-navy-950 border border-slate-800/80 text-xs text-slate-300 font-mono select-all break-words">
            {emergencyMessage}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleCopyMessage}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Emergency Text'}</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Share via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Tactical Safety Guidance */}
        <div className="space-y-1.5 border-t border-slate-800/80 pt-4 text-xs text-slate-400">
          <p className="font-bold text-slate-200">Immediate Tactical Safety Guidance:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Move towards populated, well-lit spaces (metro stations, 24/7 stores, hotel lobbies).</li>
            <li>If followed, do not head home. Enter a public establishment and inform the manager or security guard.</li>
            <li>Keep your phone unlocked and in hand; be ready to press power button repeatedly if your phone has native SOS enabled.</li>
          </ul>
        </div>

        {/* Bottom Dismiss Button with single icon */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 text-white text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <X className="w-4 h-4 text-white" />
            <span>Close Emergency Panel & Return to Dashboard</span>
          </button>
        </div>

      </div>
    </div>
  );
};
