import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Eye, 
  Download, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Calendar, 
  Clock, 
  Tag, 
  Paperclip, 
  ShieldAlert, 
  Lock
} from 'lucide-react';
import { IncidentRecord, IncidentCategory } from '../types';

interface EvidenceVaultProps {
  incidents: IncidentRecord[];
  onSaveIncidents: (records: IncidentRecord[]) => void;
  draftText?: string;
  draftCategory?: string;
}

export const EvidenceVault: React.FC<EvidenceVaultProps> = ({
  incidents,
  onSaveIncidents,
  draftText,
  draftCategory,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(!!draftText);
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  // Search & Category Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Form Fields
  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0];
  const defaultTime = now.toTimeString().slice(0, 5);

  const [formCategory, setFormCategory] = useState<IncidentCategory>(
    (draftCategory as IncidentCategory) || 'Online Harassment'
  );
  const [formDate, setFormDate] = useState(defaultDate);
  const [formTime, setFormTime] = useState(defaultTime);
  const [formDescription, setFormDescription] = useState(draftText || '');
  const [formEvidenceRef, setFormEvidenceRef] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const categories: IncidentCategory[] = [
    'Online Harassment',
    'Impersonation',
    'Threats or Blackmail',
    'Unsafe Situation',
    'Privacy Breach',
    'Other'
  ];

  const handleOpenAdd = () => {
    setFormCategory('Online Harassment');
    setFormDate(defaultDate);
    setFormTime(defaultTime);
    setFormDescription('');
    setFormEvidenceRef('');
    setFormTags('');
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedDesc = formDescription.trim();
    if (!trimmedDesc || trimmedDesc.length < 5) {
      setFormError('Please enter a detailed description (at least 5 characters).');
      return;
    }

    if (!formDate || !formTime) {
      setFormError('Please provide both incident date and time.');
      return;
    }

    const tagsArray = formTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newRecord: IncidentRecord = {
      id: `inc-${Date.now()}`,
      category: formCategory,
      date: formDate,
      time: formTime,
      description: trimmedDesc,
      evidenceRef: formEvidenceRef.trim() || undefined,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
      createdAt: new Date().toISOString(),
    };

    onSaveIncidents([newRecord, ...incidents]);
    setIsAddModalOpen(false);
    showToast('Incident note recorded successfully.');
  };

  const handleDelete = (id: string) => {
    const updated = incidents.filter(i => i.id !== id);
    onSaveIncidents(updated);
    setDeleteConfirmId(null);
    if (selectedIncident?.id === id) setSelectedIncident(null);
    showToast('Record deleted.');
  };

  const handleClearAll = () => {
    onSaveIncidents([]);
    setShowClearAllModal(false);
    setSelectedIncident(null);
    showToast('All vault records have been purged.');
  };

  // Export records as formatted police complaint document
  const handleExportRecords = () => {
    if (incidents.length === 0) return;

    let content = `====================================================\n`;
    content += `SHIELD HER — INCIDENT EVIDENCE VAULT EXPORT\n`;
    content += `Generated: ${new Date().toLocaleString('en-IN')}\n`;
    content += `Total Incidents Documented: ${incidents.length}\n`;
    content += `Notice: Recorded locally by user. Store securely.\n`;
    content += `====================================================\n\n`;

    incidents.forEach((inc, idx) => {
      content += `INCIDENT #${idx + 1} [ID: ${inc.id}]\n`;
      content += `Category: ${inc.category}\n`;
      content += `Date & Time: ${inc.date} at ${inc.time}\n`;
      content += `Logged At: ${new Date(inc.createdAt).toLocaleString('en-IN')}\n`;
      if (inc.tags && inc.tags.length > 0) {
        content += `Tags: ${inc.tags.join(', ')}\n`;
      }
      if (inc.evidenceRef) {
        content += `Evidence Reference: ${inc.evidenceRef}\n`;
      }
      content += `Description:\n${inc.description}\n`;
      content += `----------------------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ShieldHer_Evidence_Export_${defaultDate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Exported incidents text file.');
  };

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inc.evidenceRef && inc.evidenceRef.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inc.tags && inc.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory = filterCategory === 'All' || inc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-900/40 border border-indigo-500/40 text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Evidence Vault
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Private, timestamped incident logging for online harassment, stalking, extortion, and physical encounters.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {incidents.length > 0 && (
            <button
              onClick={handleExportRecords}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-navy-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all"
              title="Download text file of all incidents for cyber cell filing"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-glow-purple hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Incident</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      {incidents.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by keywords, tags, or evidence notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-navy-900 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Categories ({incidents.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {incidents.length > 1 && (
              <button
                onClick={() => setShowClearAllModal(true)}
                className="px-3 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-950/70 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-semibold transition-colors"
                title="Purge all records from local storage"
              >
                Clear All
              </button>
            )}
          </div>

        </div>
      )}

      {/* Incident Records Grid / Empty State */}
      {filteredIncidents.length === 0 ? (
        <div className="text-center py-14 px-4 rounded-3xl border border-dashed border-slate-800 bg-navy-900/40 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-200">
              {incidents.length === 0 ? 'No Incident Records in Vault' : 'No Incidents Match Filter'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Maintain contemporaneous records of harassment, abusive messages, stalker usernames, or suspicious physical incidents. Courts and cyber cells prioritize early documentation.
            </p>
          </div>
          {incidents.length === 0 && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 shadow-glow-purple"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Your First Incident</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIncidents.map((incident) => (
            <div 
              key={incident.id}
              className="glass-card p-5 rounded-2xl relative transition-all space-y-3.5 hover:border-purple-500/40 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header: Category & Date */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                    {incident.category}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedIncident(incident)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="View full description"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(incident.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    {incident.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-pink-400" />
                    {incident.time}
                  </span>
                </div>

                {/* Description Preview */}
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {incident.description}
                </p>

                {/* Evidence Note */}
                {incident.evidenceRef && (
                  <div className="p-2 rounded-xl bg-navy-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-1.5">
                    <Paperclip className="w-3 h-3 text-pink-400 flex-shrink-0 mt-0.5" />
                    <span className="truncate">{incident.evidenceRef}</span>
                  </div>
                )}
              </div>

              {/* Tags & Action */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {incident.tags?.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                      #{t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedIncident(incident)}
                  className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 ml-auto"
                >
                  <span>Full View</span>
                  <span>→</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* RECORD FULL DETAILS MODAL */}
      {selectedIncident && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-navy-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                  {selectedIncident.category}
                </span>
                <h2 className="text-xl font-bold text-white mt-2">
                  Incident Evidence Record
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Occurred: {selectedIncident.date} at {selectedIncident.time} • Recorded: {new Date(selectedIncident.createdAt).toLocaleString('en-IN')}
                </p>
              </div>

              <button
                onClick={() => setSelectedIncident(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Full Detailed Description:
                </span>
                <div className="p-4 rounded-2xl bg-navy-950 border border-slate-800 text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                  {selectedIncident.description}
                </div>
              </div>

              {selectedIncident.evidenceRef && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Evidence File / Screenshot References:
                  </span>
                  <div className="p-3.5 rounded-2xl bg-navy-950 border border-slate-800 text-slate-300 font-mono text-xs">
                    {selectedIncident.evidenceRef}
                  </div>
                </div>
              )}

              {selectedIncident.tags && selectedIncident.tags.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Tags:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedIncident.tags.map((t, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => handleDelete(selectedIncident.id)}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete This Record</span>
              </button>

              <button
                onClick={() => setSelectedIncident(null)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADD NEW INCIDENT MODAL */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl bg-navy-900 border border-purple-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Log Incident in Evidence Vault
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category <span className="text-pink-400">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as IncidentCategory)}
                    className="w-full px-3 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Date <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Time <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Incident Description <span className="text-pink-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Record what happened, exact handles/usernames, phrases used, vehicle numbers, or locations..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Evidence Reference / Attachment Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Screenshot saved in phone gallery as IMG_20261024_01.png; backup copy sent to sister"
                  value={formEvidenceRef}
                  onChange={(e) => setFormEvidenceRef(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. WhatsApp, Stalker, Office Commute, Instagram DM"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:brightness-110 shadow-glow-purple"
                >
                  Save Incident Note
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm bg-navy-900 border border-red-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-white">Delete Incident Record?</h3>
              <p className="text-xs text-slate-400">
                This record will be permanently deleted from local browser storage.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-glow-red"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM CLEAR ALL MODAL */}
      {showClearAllModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm bg-navy-900 border border-red-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-white">Purge All Incident Logs?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to delete all {incidents.length} records? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowClearAllModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-glow-red"
              >
                Yes, Purge All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
