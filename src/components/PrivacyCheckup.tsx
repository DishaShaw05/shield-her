import React, { useState } from 'react';
import { 
  CheckSquare, 
  RotateCcw, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  Globe, 
  MapPin, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { PrivacyCheckItem } from '../types';

interface PrivacyCheckupProps {
  items: PrivacyCheckItem[];
  onToggleItem: (id: string) => void;
  onResetItems: () => void;
}

export const PrivacyCheckup: React.FC<PrivacyCheckupProps> = ({
  items,
  onToggleItem,
  onResetItems,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const completedCount = items.filter(i => i.completed).length;
  const totalCount = items.length;
  const progressPercent = Math.round((completedCount / (totalCount || 1)) * 100);

  const filteredItems = items.filter(item => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'account':
        return <Lock className="w-3.5 h-3.5 text-purple-400" />;
      case 'device':
        return <Smartphone className="w-3.5 h-3.5 text-pink-400" />;
      case 'social':
        return <Globe className="w-3.5 h-3.5 text-indigo-400" />;
      case 'location':
        return <MapPin className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <CheckSquare className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-900/40 border border-violet-500/40 text-violet-400">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Privacy Checkup
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            An interactive 9-point security audit to fortify your digital footprint against stalkers, credential leaks, and unauthorized tracking.
          </p>
        </div>

        <button
          onClick={onResetItems}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-all"
          title="Reset all checklist items to default"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Checklist</span>
        </button>
      </div>

      {/* PROGRESS SCORE CARD */}
      <div className="glass-card p-6 rounded-3xl border border-violet-900/40 relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Personal Digital Resilience Score
            </span>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                {progressPercent}%
              </h2>
              <span className="text-xs sm:text-sm text-slate-400">
                ({completedCount} of {totalCount} safety practices verified)
              </span>
            </div>
          </div>

          {progressPercent === 100 ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Full Digital Hygiene Shield Active!</span>
            </div>
          ) : (
            <div className="text-xs text-slate-400 font-medium">
              Complete {totalCount - completedCount} more tasks to achieve maximum protection.
            </div>
          )}
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-slate-900/80 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 transition-all duration-500 shadow-glow-purple"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {[
          { id: 'all', label: 'All Items (9)' },
          { id: 'account', label: 'Account Security' },
          { id: 'device', label: 'Device Hygiene' },
          { id: 'social', label: 'Social & Anti-Harassment' },
          { id: 'location', label: 'Location Privacy' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
              filterCategory === tab.id
                ? 'bg-purple-900/60 text-white border border-purple-500/50 shadow-sm'
                : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CHECKLIST ITEMS */}
      <div className="space-y-3">
        {filteredItems.map((item, index) => {
          const isExpanded = expandedId === item.id;

          return (
            <div 
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                item.completed
                  ? 'bg-navy-900/40 border-purple-900/30 text-slate-300'
                  : 'bg-navy-900/90 border-slate-800 hover:border-slate-700 text-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                
                {/* Custom Accessible Checkbox */}
                <div className="flex items-start gap-3.5 flex-1">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={item.completed}
                    onClick={() => onToggleItem(item.id)}
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 flex-shrink-0 ${
                      item.completed
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-glow-pink'
                        : 'bg-navy-950 border-2 border-slate-600 hover:border-pink-500 text-transparent'
                    }`}
                    aria-label={`Mark task "${item.title}" as ${item.completed ? 'incomplete' : 'complete'}`}
                  >
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                  </button>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-500 font-semibold">
                        #{index + 1}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 border ${
                        item.completed ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-purple-950/60 text-purple-300 border-purple-500/30'
                      }`}>
                        {getCategoryIcon(item.category)}
                        {item.category}
                      </span>
                    </div>

                    <h3 
                      onClick={() => onToggleItem(item.id)}
                      className={`text-sm sm:text-base font-bold cursor-pointer select-none transition-colors ${
                        item.completed ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Action Hint / Expandable Guidance */}
                    {item.actionHint && (
                      <div className="mt-2 text-xs text-purple-300 bg-navy-950/70 p-2.5 rounded-xl border border-purple-950 flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-pink-400 flex-shrink-0 mt-0.5" />
                        <span><strong>Actionable Step:</strong> {item.actionHint}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status indicator */}
                <div className="hidden sm:block flex-shrink-0">
                  {item.completed ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">
                      Pending
                    </span>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
