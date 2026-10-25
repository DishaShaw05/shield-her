import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Phone, 
  Edit3, 
  Trash2, 
  Star, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Search,
  MessageSquare
} from 'lucide-react';
import { Contact } from '../types';

interface TrustedCircleProps {
  contacts: Contact[];
  onSaveContacts: (contacts: Contact[]) => void;
}

export const TrustedCircle: React.FC<TrustedCircleProps> = ({
  contacts,
  onSaveContacts,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRelationship, setFormRelationship] = useState('Sister');
  const [formNotes, setFormNotes] = useState('');
  const [formIsPrimary, setFormIsPrimary] = useState(false);

  // Validation & Feedback state
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const openAddModal = () => {
    setEditingContact(null);
    setFormName('');
    setFormPhone('');
    setFormRelationship('Family');
    setFormNotes('');
    setFormIsPrimary(contacts.length === 0);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setFormName(contact.name);
    setFormPhone(contact.phone);
    setFormRelationship(contact.relationship);
    setFormNotes(contact.notes || '');
    setFormIsPrimary(!!contact.isPrimary);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = formName.trim();
    const trimmedPhone = formPhone.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setFormError('Please enter a valid full name (at least 2 characters).');
      return;
    }

    // Basic phone validation (allowing +, digits, spaces, hyphens; min 7 digits)
    const digitsOnly = trimmedPhone.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      setFormError('Please enter a valid phone number (at least 7 to 15 digits).');
      return;
    }

    let updatedContacts = [...contacts];

    if (editingContact) {
      // Update existing
      updatedContacts = updatedContacts.map(c => {
        if (c.id === editingContact.id) {
          return {
            ...c,
            name: trimmedName,
            phone: trimmedPhone,
            relationship: formRelationship,
            notes: formNotes.trim(),
            isPrimary: formIsPrimary,
          };
        }
        // If this contact was set as primary, un-primary others
        return formIsPrimary ? { ...c, isPrimary: false } : c;
      });
      showSuccess(`Updated contact "${trimmedName}" successfully.`);
    } else {
      // Add new
      const newContact: Contact = {
        id: `contact-${Date.now()}`,
        name: trimmedName,
        phone: trimmedPhone,
        relationship: formRelationship,
        notes: formNotes.trim(),
        isPrimary: formIsPrimary || contacts.length === 0,
        createdAt: new Date().toISOString(),
      };

      if (formIsPrimary) {
        updatedContacts = updatedContacts.map(c => ({ ...c, isPrimary: false }));
      }
      updatedContacts.unshift(newContact);
      showSuccess(`Added "${trimmedName}" to your Trusted Circle.`);
    }

    onSaveContacts(updatedContacts);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const contactToDelete = contacts.find(c => c.id === id);
    const updated = contacts.filter(c => c.id !== id);
    
    // If we deleted the primary contact, assign the first remaining contact as primary
    if (contactToDelete?.isPrimary && updated.length > 0) {
      updated[0].isPrimary = true;
    }

    onSaveContacts(updated);
    setDeleteConfirmId(null);
    showSuccess(`Removed contact from your circle.`);
  };

  const handleTogglePrimary = (id: string) => {
    const updated = contacts.map(c => ({
      ...c,
      isPrimary: c.id === id,
    }));
    onSaveContacts(updated);
    showSuccess('Primary emergency contact updated.');
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.relationship.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-medium text-sm shadow-xl animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-900/40 border border-pink-500/40 text-pink-400">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Trusted Circle
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Designate emergency contacts for instant 1-tap phone dialing and emergency coordinates broadcasting.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm shadow-glow-pink hover:brightness-110 active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Contact</span>
        </button>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-navy-900/70 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>
          <strong>Zero External Leaks:</strong> Contacts are kept strictly in local browser storage. No phone numbers are harvested or sent to external servers.
        </span>
      </div>

      {/* Search Bar if multiple contacts */}
      {contacts.length > 2 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, phone, or relationship..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          />
        </div>
      )}

      {/* Contact Cards List */}
      {filteredContacts.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-slate-800 bg-navy-900/40 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-200">
              {contacts.length === 0 ? 'No Trusted Contacts Added Yet' : 'No Contacts Match Your Search'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Add parents, siblings, roommates, or trusted close friends who can be reached quickly in case of transit delays or emergency situations.
            </p>
          </div>
          {contacts.length === 0 && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 text-white text-xs font-semibold hover:bg-pink-500 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Your First Contact</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => {
            const rawPhone = contact.phone.replace(/\D/g, '');
            const whatsappText = encodeURIComponent(`Hi ${contact.name}, this is a test check-in from my SHIELD HER safety platform.`);
            const whatsappUrl = `https://wa.me/${rawPhone}?text=${whatsappText}`;

            return (
              <div 
                key={contact.id}
                className={`glass-card p-5 rounded-2xl relative transition-all space-y-4 ${
                  contact.isPrimary ? 'border-pink-500/50 bg-purple-950/20' : 'hover:border-slate-700'
                }`}
              >
                {/* Top Row: Name, Relationship & Primary Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white tracking-tight">
                        {contact.name}
                      </h3>
                      {contact.isPrimary && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40">
                          <Star className="w-2.5 h-2.5 fill-pink-400 text-pink-400" />
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium">
                      {contact.relationship}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(contact)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Edit contact"
                      aria-label={`Edit ${contact.name}`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(contact.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                      title="Delete contact"
                      aria-label={`Delete ${contact.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Phone & Notes */}
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 font-mono text-sm text-slate-100">
                    <Phone className="w-3.5 h-3.5 text-pink-400" />
                    <span>{contact.phone}</span>
                  </div>
                  {contact.notes && (
                    <p className="text-slate-400 text-[11px] italic bg-navy-950/50 p-2 rounded-xl border border-slate-800/80">
                      "{contact.notes}"
                    </p>
                  )}
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-pink-600/20 hover:bg-pink-600 text-pink-300 hover:text-white border border-pink-500/40 text-xs font-semibold transition-all group"
                  >
                    <Phone className="w-3.5 h-3.5 group-hover:animate-bounce" />
                    <span>Call Dialer</span>
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>

                  {!contact.isPrimary && (
                    <button
                      onClick={() => handleTogglePrimary(contact.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-pink-300 transition-colors"
                      title="Set as primary emergency contact"
                      aria-label="Set as primary emergency contact"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-navy-900 border border-purple-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-400" />
                {editingContact ? 'Edit Trusted Contact' : 'Add Trusted Contact'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
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
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone Number <span className="text-pink-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Relationship or Role
                </label>
                <select
                  value={formRelationship}
                  onChange={(e) => setFormRelationship(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-pink-500"
                >
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Sister">Sister</option>
                  <option value="Brother">Brother</option>
                  <option value="Roommate">Roommate</option>
                  <option value="Friend">Friend</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Partner">Partner</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Neighbor">Neighbor</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lives nearby, has spare house key"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPrimaryCheck"
                  checked={formIsPrimary}
                  onChange={(e) => setFormIsPrimary(e.target.checked)}
                  className="w-4 h-4 rounded text-pink-600 bg-navy-950 border-slate-700 focus:ring-pink-500 focus:ring-offset-navy-900"
                />
                <label htmlFor="isPrimaryCheck" className="text-xs text-slate-300 cursor-pointer">
                  Designate as Primary Emergency Speed-Dial Contact
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold hover:brightness-110 shadow-glow-pink"
                >
                  {editingContact ? 'Save Changes' : 'Add Contact'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
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
              <h3 className="font-bold text-base text-white">Delete Contact?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to remove this contact from your Trusted Circle? They will no longer appear in emergency speed-dial.
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

    </div>
  );
};
