import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  RefreshCw, 
  Clock, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { LocationState } from '../types';

interface LocationToolProps {
  locationState: LocationState;
  onRequestLocation: () => void;
}

export const LocationTool: React.FC<LocationToolProps> = ({
  locationState,
  onRequestLocation,
}) => {
  const [copied, setCopied] = useState(false);

  const hasCoords = locationState.latitude !== null && locationState.longitude !== null;

  const mapsUrl = hasCoords
    ? `https://www.google.com/maps?q=${locationState.latitude},${locationState.longitude}`
    : '';

  const locationMessage = hasCoords
    ? `EMERGENCY LOCATION PIN: I am currently near this point: https://maps.google.com/?q=${locationState.latitude},${locationState.longitude} (Accuracy: ~${Math.round(locationState.accuracy || 0)}m). Please check on me.`
    : '';

  const handleCopy = () => {
    if (!hasCoords) return;
    navigator.clipboard.writeText(locationMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-900/40 border border-cyan-500/40 text-cyan-400">
            <MapPin className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Emergency GPS Pinpoint
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Obtain exact on-demand GPS coordinates to dispatch to trusted emergency contacts or emergency responders.
        </p>
      </div>

      {/* PRIVACY & EXPLICIT CONSENT ARCHITECTURE NOTICE */}
      <div className="p-4 rounded-2xl bg-navy-900/80 border border-cyan-900/40 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-bold text-cyan-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>Zero Server Tracking & Explicit Consent Architecture</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-400 leading-relaxed">
          <li><strong>No Background Surveillance:</strong> Coordinates are queried only when you click the button below.</li>
          <li><strong>No Remote Transmission:</strong> Your latitude and longitude remain solely in client memory and are never uploaded to any remote server.</li>
          <li><strong>Discretionary Sharing:</strong> You choose if, when, and to whom you copy or send the coordinates.</li>
        </ul>
      </div>

      {/* MAIN LOCATION ACTION CARD */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6 text-center">
        
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto shadow-glow-purple">
            <Navigation className={`w-8 h-8 ${locationState.loading ? 'animate-spin' : ''}`} />
          </div>

          <h2 className="text-xl font-bold text-white">
            {hasCoords ? 'GPS Fix Acquired' : 'Request On-Demand GPS Coordinates'}
          </h2>

          <p className="text-xs text-slate-400 leading-relaxed">
            {hasCoords 
              ? 'Your device has successfully reported latitude and longitude coordinates. Ready to copy or open in maps.'
              : 'Click below to query your browser’s Geolocation sensor. Your browser will prompt for one-time permission.'}
          </p>

          <button
            onClick={onRequestLocation}
            disabled={locationState.loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:brightness-110 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${locationState.loading ? 'animate-spin' : ''}`} />
            <span>{locationState.loading ? 'Acquiring GPS Signal...' : hasCoords ? 'Refresh Current Coordinates' : 'Get My Coordinates'}</span>
          </button>
        </div>

        {/* ERROR NOTICE IF PERMISSION DENIED OR TIMEOUT */}
        {locationState.error && (
          <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 text-left flex items-start gap-3 max-w-lg mx-auto">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white block">Geolocation Error:</span>
              <p>{locationState.error}</p>
              <p className="text-red-300 text-[11px] pt-1">
                Tip: In Chrome/Edge, click the tune icon or padlock in the URL address bar, find "Location", and toggle it to "Allow".
              </p>
            </div>
          </div>
        )}

        {/* COORDINATES DISPLAY */}
        {hasCoords && (
          <div className="pt-4 border-t border-slate-800 space-y-4 max-w-xl mx-auto text-left">
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              
              <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 space-y-0.5">
                <span className="text-[11px] text-slate-500 uppercase font-bold">Latitude</span>
                <span className="font-mono text-sm font-bold text-cyan-300 block">
                  {locationState.latitude?.toFixed(6)}°
                </span>
              </div>

              <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 space-y-0.5">
                <span className="text-[11px] text-slate-500 uppercase font-bold">Longitude</span>
                <span className="font-mono text-sm font-bold text-cyan-300 block">
                  {locationState.longitude?.toFixed(6)}°
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-navy-950 border border-slate-800 space-y-0.5">
                <span className="text-[11px] text-slate-500 uppercase font-bold">Accuracy Radius</span>
                <span className="font-mono text-sm font-bold text-emerald-400 block">
                  ±{Math.round(locationState.accuracy || 0)} meters
                </span>
              </div>

            </div>

            {/* Formatted Message Preview */}
            <div className="p-3.5 rounded-2xl bg-navy-950 border border-slate-800 space-y-1.5">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                Formatted Emergency SMS / WhatsApp Template:
              </span>
              <div className="text-xs text-slate-300 font-mono select-all break-words leading-relaxed">
                {locationMessage}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Location Message'}</span>
              </button>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in Google Maps</span>
              </a>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
