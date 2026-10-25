import React, { useState, useEffect, useCallback } from 'react';
import { 
  Contact, 
  Journey, 
  IncidentRecord, 
  PrivacyCheckItem, 
  ActiveSection, 
  LocationState,
  User 
} from './types';
import { 
  loadContacts, 
  saveContacts, 
  loadJourney, 
  saveJourney, 
  loadIncidents, 
  saveIncidents, 
  loadPrivacyItems, 
  savePrivacyItems, 
  resetPrototypeData,
  DEFAULT_PRIVACY_ITEMS
} from './utils/storage';
import { getCurrentSession, logoutUser } from './utils/auth';

// Components
import { AuthView } from './components/AuthView';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Dashboard } from './components/Dashboard';
import { EmergencyModal } from './components/EmergencyModal';
import { TrustedCircle } from './components/TrustedCircle';
import { SafeJourney } from './components/SafeJourney';
import { DigitalShield } from './components/DigitalShield';
import { EvidenceVault } from './components/EvidenceVault';
import { PrivacyCheckup } from './components/PrivacyCheckup';
import { LocationTool } from './components/LocationTool';
import { SafetyResources } from './components/SafetyResources';

export const App: React.FC = () => {
  // Authentication & Session State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const session = getCurrentSession();
    return session ? session.user : null;
  });

  // Navigation State
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  // Core Data States with user-scoped localStorage persistence
  const [contacts, setContacts] = useState<Contact[]>(() => loadContacts(currentUser?.id));
  const [journey, setJourney] = useState<Journey | null>(() => loadJourney(currentUser?.id));
  const [incidents, setIncidents] = useState<IncidentRecord[]>(() => loadIncidents(currentUser?.id));
  const [privacyItems, setPrivacyItems] = useState<PrivacyCheckItem[]>(() => loadPrivacyItems(currentUser?.id));

  // Reload user data whenever logged-in user changes
  useEffect(() => {
    if (currentUser) {
      setContacts(loadContacts(currentUser.id));
      setJourney(loadJourney(currentUser.id));
      setIncidents(loadIncidents(currentUser.id));
      setPrivacyItems(loadPrivacyItems(currentUser.id));
    }
  }, [currentUser]);

  // Inter-module drafts (e.g. from DigitalShield -> EvidenceVault)
  const [draftVaultText, setDraftVaultText] = useState<string>('');
  const [draftVaultCategory, setDraftVaultCategory] = useState<string>('');

  // Geolocation State
  const [locationState, setLocationState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
    error: null,
    loading: false,
  });

  // Keep contacts synced with user-scoped localStorage
  const handleSaveContacts = useCallback((newContacts: Contact[]) => {
    setContacts(newContacts);
    saveContacts(newContacts, currentUser?.id);
  }, [currentUser?.id]);

  // Keep journey synced with user-scoped localStorage
  const handleSaveJourney = useCallback((newJourney: Journey | null) => {
    setJourney(newJourney);
    saveJourney(newJourney, currentUser?.id);
  }, [currentUser?.id]);

  // Keep incidents synced with user-scoped localStorage
  const handleSaveIncidents = useCallback((newIncidents: IncidentRecord[]) => {
    setIncidents(newIncidents);
    saveIncidents(newIncidents, currentUser?.id);
  }, [currentUser?.id]);

  // Toggle privacy checklist items
  const handleTogglePrivacyItem = useCallback((id: string) => {
    setPrivacyItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      savePrivacyItems(updated, currentUser?.id);
      return updated;
    });
  }, [currentUser?.id]);

  // Reset privacy checklist
  const handleResetPrivacy = useCallback(() => {
    setPrivacyItems(DEFAULT_PRIVACY_ITEMS);
    savePrivacyItems(DEFAULT_PRIVACY_ITEMS, currentUser?.id);
  }, [currentUser?.id]);

  // Global reset for testing
  const handleResetAllData = useCallback(() => {
    if (window.confirm('Reset all SHIELD HER local prototype data to initial sample values?')) {
      resetPrototypeData(currentUser?.id);
      setContacts(loadContacts(currentUser?.id));
      setJourney(null);
      setIncidents(loadIncidents(currentUser?.id));
      setPrivacyItems(loadPrivacyItems(currentUser?.id));
      setActiveSection('dashboard');
    }
  }, [currentUser?.id]);

  // Handle User Logout
  const handleLogout = useCallback(() => {
    logoutUser();
    setCurrentUser(null);
    setActiveSection('dashboard');
  }, []);

  // Request user Geolocation on-demand
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser.',
        loading: false,
      }));
      return;
    }

    setLocationState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let msg = 'Failed to obtain location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'Location permission was denied. Please allow location access in your browser settings to pinpoint GPS.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Location information is currently unavailable from your device sensors.';
            break;
          case error.TIMEOUT:
            msg = 'Location request timed out. Please try again with clear sky visibility.';
            break;
        }
        setLocationState(prev => ({
          ...prev,
          error: msg,
          loading: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Bridge: transfer analyzed message to Evidence Vault
  const handleLogIncidentFromAnalysis = (text: string, category: string) => {
    setDraftVaultText(text);
    setDraftVaultCategory(category);
    setActiveSection('vault');
  };

  // If user is not authenticated, render Login / Register page
  if (!currentUser) {
    return <AuthView onAuthSuccess={(user) => setCurrentUser(user)} />;
  }

  const isJourneyActive = journey?.status === 'active';

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenSOS={() => setIsSOSOpen(true)}
        isJourneyActive={isJourneyActive}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeSection === 'dashboard' && (
          <Dashboard
            onNavigate={setActiveSection}
            onOpenSOS={() => setIsSOSOpen(true)}
            journey={journey}
            contacts={contacts}
            incidents={incidents}
            privacyItems={privacyItems}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}

        {activeSection === 'journey' && (
          <SafeJourney
            journey={journey}
            onSaveJourney={handleSaveJourney}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        )}

        {activeSection === 'circle' && (
          <TrustedCircle
            contacts={contacts}
            onSaveContacts={handleSaveContacts}
          />
        )}

        {activeSection === 'analyzer' && (
          <DigitalShield
            onLogIncidentFromAnalysis={handleLogIncidentFromAnalysis}
          />
        )}

        {activeSection === 'vault' && (
          <EvidenceVault
            incidents={incidents}
            onSaveIncidents={handleSaveIncidents}
            draftText={draftVaultText}
            draftCategory={draftVaultCategory}
          />
        )}

        {activeSection === 'privacy' && (
          <PrivacyCheckup
            items={privacyItems}
            onToggleItem={handleTogglePrivacyItem}
            onResetItems={handleResetPrivacy}
          />
        )}

        {activeSection === 'location' && (
          <LocationTool
            locationState={locationState}
            onRequestLocation={requestLocation}
          />
        )}

        {activeSection === 'resources' && (
          <SafetyResources />
        )}

      </main>

      {/* High Priority Emergency Action Modal */}
      <EmergencyModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        contacts={contacts}
        currentLocation={locationState}
        onNavigateToCircle={() => setActiveSection('circle')}
        onRequestLocation={requestLocation}
      />

      {/* Bottom Footer */}
      <Footer onResetData={handleResetAllData} />

    </div>
  );
};

export default App;
