import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Play, 
  ShieldCheck, 
  AlertOctagon, 
  HelpCircle,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { Journey, JourneyStatus } from '../types';

interface SafeJourneyProps {
  journey: Journey | null;
  onSaveJourney: (journey: Journey | null) => void;
  onOpenSOS: () => void;
}

export const SafeJourney: React.FC<SafeJourneyProps> = ({
  journey,
  onSaveJourney,
  onOpenSOS,
}) => {
  // Input fields for creating new journey
  const [destination, setDestination] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [checkInDeadline, setCheckInDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Remaining time in seconds
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number | null>(null);

  // Initialize form default dates (30 min / 45 min in future)
  useEffect(() => {
    if (!journey) {
      const now = new Date();
      
      // Default arrival: 45 minutes from now
      const arrival = new Date(now.getTime() + 45 * 60 * 1000);
      // Default check-in deadline: 30 minutes from now (must not be later than arrival)
      const deadline = new Date(now.getTime() + 30 * 60 * 1000);

      const formatForInput = (d: Date) => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      };

      setArrivalTime(formatForInput(arrival));
      setCheckInDeadline(formatForInput(deadline));
    }
  }, [journey]);

  // Live countdown and overdue detector
  useEffect(() => {
    if (!journey || journey.status === 'safe' || journey.status === 'cancelled' || journey.status === 'not_started') {
      setTimeRemainingSeconds(null);
      return;
    }

    const checkTimer = () => {
      const nowMs = Date.now();
      const deadlineMs = new Date(journey.checkInDeadline).getTime();
      const diffSecs = Math.floor((deadlineMs - nowMs) / 1000);

      if (diffSecs <= 0) {
        setTimeRemainingSeconds(0);
        if (journey.status === 'active') {
          // Transition to overdue
          onSaveJourney({
            ...journey,
            status: 'overdue',
          });
        }
      } else {
        setTimeRemainingSeconds(diffSecs);
      }
    };

    checkTimer();
    const interval = setInterval(checkTimer, 1000);
    return () => clearInterval(interval);
  }, [journey, onSaveJourney]);

  // Handle Quick Time Presets
  const applyPreset = (minutesDeadline: number, minutesArrival: number) => {
    const now = new Date();
    const deadline = new Date(now.getTime() + minutesDeadline * 60 * 1000);
    const arrival = new Date(now.getTime() + minutesArrival * 60 * 1000);

    const pad = (n: number) => n.toString().padStart(2, '0');
    const toStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

    setCheckInDeadline(toStr(deadline));
    setArrivalTime(toStr(arrival));
    setFormError(null);
  };

  const handleStartJourney = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedDest = destination.trim();
    if (!trimmedDest || trimmedDest.length < 3) {
      setFormError('Please enter a valid destination (at least 3 characters).');
      return;
    }

    if (!arrivalTime || !checkInDeadline) {
      setFormError('Please select both expected arrival time and check-in deadline.');
      return;
    }

    const nowMs = Date.now();
    const arrivalMs = new Date(arrivalTime).getTime();
    const deadlineMs = new Date(checkInDeadline).getTime();

    if (isNaN(arrivalMs) || isNaN(deadlineMs)) {
      setFormError('Invalid date/time format.');
      return;
    }

    // Validation: deadline must be in future
    if (deadlineMs <= nowMs) {
      setFormError('Check-in deadline must be a future time.');
      return;
    }

    // Validation: check-in deadline should not be later than expected arrival time
    if (deadlineMs > arrivalMs) {
      setFormError('Check-in deadline cannot be later than your expected arrival time.');
      return;
    }

    const newJourney: Journey = {
      id: `journey-${Date.now()}`,
      destination: trimmedDest,
      startLocation: startLocation.trim(),
      notes: notes.trim(),
      arrivalTime: new Date(arrivalTime).toISOString(),
      checkInDeadline: new Date(checkInDeadline).toISOString(),
      status: 'active',
      startedAt: new Date().toISOString(),
    };

    onSaveJourney(newJourney);
  };

  const handleMarkSafe = () => {
    if (!journey) return;
    onSaveJourney({
      ...journey,
      status: 'safe',
      safeAt: new Date().toISOString(),
    });
  };

  const handleEndJourney = () => {
    onSaveJourney(null);
  };

  // Format seconds to HH:MM:SS
  const formatTimeRemaining = (totalSeconds: number | null) => {
    if (totalSeconds === null) return '--:--:--';
    if (totalSeconds <= 0) return '00:00:00';

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const statusConfig: Record<JourneyStatus, { label: string; bg: string; text: string; border: string }> = {
    not_started: {
      label: 'Not Started',
      bg: 'bg-slate-800/80',
      text: 'text-slate-300',
      border: 'border-slate-700',
    },
    active: {
      label: 'Active — Monitoring',
      bg: 'bg-emerald-950/60',
      text: 'text-emerald-400',
      border: 'border-emerald-500/40',
    },
    overdue: {
      label: 'Check-in Overdue!',
      bg: 'bg-red-950/80',
      text: 'text-red-400',
      border: 'border-red-500/80',
    },
    safe: {
      label: 'Checked In Safe',
      bg: 'bg-purple-950/60',
      text: 'text-purple-300',
      border: 'border-purple-500/40',
    },
    cancelled: {
      label: 'Cancelled',
      bg: 'bg-slate-800/80',
      text: 'text-slate-400',
      border: 'border-slate-700',
    },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-900/40 border border-purple-500/40 text-purple-400">
            <Compass className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Safe Journey Tracker
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Set arrival windows, monitor live countdowns, and establish proactive check-in accountability.
        </p>
      </div>

      {/* ACTIVE OR COMPLETED JOURNEY VIEW */}
      {journey && journey.status !== 'not_started' ? (
        <div className="space-y-6">
          
          {/* Main Journey Card */}
          <div className={`glass-card p-6 sm:p-8 rounded-3xl border-2 space-y-6 ${
            journey.status === 'overdue' 
              ? 'border-red-500 shadow-glow-red bg-red-950/20' 
              : journey.status === 'safe'
              ? 'border-purple-500/60 bg-purple-950/20'
              : 'border-emerald-500/40 bg-emerald-950/10'
          }`}>
            
            {/* Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                  Current Journey State
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig[journey.status].bg} ${statusConfig[journey.status].text} ${statusConfig[journey.status].border}`}>
                    {journey.status === 'active' && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                    {journey.status === 'overdue' && <AlertOctagon className="w-3.5 h-3.5 text-red-400" />}
                    {journey.status === 'safe' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                    {statusConfig[journey.status].label}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    ID: {journey.id.slice(-6)}
                  </span>
                </div>
              </div>

              {/* Status Action */}
              <div className="flex items-center gap-2">
                {journey.status === 'active' || journey.status === 'overdue' ? (
                  <>
                    <button
                      onClick={handleMarkSafe}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>I AM SAFE (Check In)</span>
                    </button>
                    <button
                      onClick={handleEndJourney}
                      className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEndJourney}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Plan Another Journey</span>
                  </button>
                )}
              </div>
            </div>

            {/* Overdue Warning Notice */}
            {journey.status === 'overdue' && (
              <div className="p-4 rounded-2xl bg-red-950/70 border border-red-500/50 text-xs text-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-sm text-white block">Check-in Deadline Has Expired!</span>
                    <span>You have not marked yourself as safe within the designated timeframe.</span>
                  </div>
                </div>
                <button
                  onClick={onOpenSOS}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-glow-red"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Launch SOS Dispatch</span>
                </button>
              </div>
            )}

            {/* Live Countdown Clock */}
            {(journey.status === 'active' || journey.status === 'overdue') && (
              <div className="p-6 rounded-2xl bg-navy-950/80 border border-slate-800 text-center space-y-2">
                <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider flex items-center justify-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-400" />
                  Time Remaining Until Check-in Deadline
                </span>
                <div className={`text-4xl sm:text-6xl font-black font-mono tracking-wider ${
                  journey.status === 'overdue' ? 'text-red-500 animate-pulse' : 'text-white'
                }`}>
                  {formatTimeRemaining(timeRemainingSeconds)}
                </div>
                <p className="text-xs text-slate-500">
                  Deadline: {new Date(journey.checkInDeadline).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} • Arrival: {new Date(journey.arrivalTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}

            {/* Safe Confirmation Card */}
            {journey.status === 'safe' && (
              <div className="p-6 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Checked In Safe & Sound!</h3>
                <p className="text-xs text-slate-400">
                  Arrived safely at destination. Safe arrival timestamp recorded: {journey.safeAt ? new Date(journey.safeAt).toLocaleTimeString('en-IN') : 'Confirmed'}.
                </p>
              </div>
            )}

            {/* Journey Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-navy-900/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-semibold">Destination / Route:</span>
                <span className="font-bold text-white text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-pink-400" />
                  {journey.destination}
                </span>
                {journey.startLocation && (
                  <span className="text-slate-400 block pt-0.5">From: {journey.startLocation}</span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-navy-900/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-semibold">Travel Schedule:</span>
                <span className="text-slate-200 block">
                  Check-in by: <strong>{new Date(journey.checkInDeadline).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</strong>
                </span>
                <span className="text-slate-400 block">
                  Expected Arrival: {new Date(journey.arrivalTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
            </div>

            {journey.notes && (
              <div className="p-3.5 rounded-xl bg-navy-900/40 border border-slate-800 text-xs">
                <span className="text-slate-400 font-semibold block mb-1">Transit Notes / Cab Details:</span>
                <p className="text-slate-300 italic">{journey.notes}</p>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* CREATE NEW JOURNEY FORM */
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-purple-900/40 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-pink-400" />
                Schedule a Safe Journey
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Enter your commute details and configure a check-in accountability deadline.
              </p>
            </div>

            {/* Quick Demo Presets */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-semibold uppercase">Quick Demo:</span>
              <button
                type="button"
                onClick={() => applyPreset(15, 20)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium"
              >
                +15 mins
              </button>
              <button
                type="button"
                onClick={() => applyPreset(30, 45)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium"
              >
                +30 mins
              </button>
            </div>
          </div>

          {formError && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleStartJourney} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Destination or Route Description <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metro Yellow Line to Rajiv Chowk, then Auto to Hostel"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Starting Point (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. University Campus / Office Sector 62"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Check-in Deadline <span className="text-pink-400">*</span>
                  <span className="text-slate-500 font-normal ml-1">(Must be in future)</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={checkInDeadline}
                  onChange={(e) => setCheckInDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Expected Final Arrival Time <span className="text-pink-400">*</span>
                  <span className="text-slate-500 font-normal ml-1">(On or after deadline)</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Travel Notes / Vehicle Number (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Uber Sedan DL 1Z A9876, Driver: Ramesh Kumar"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-500">
                Rule: Check-in deadline cannot exceed arrival time.
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-bold text-sm shadow-glow-pink hover:brightness-110 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Safe Journey</span>
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
