import { Contact, Journey, IncidentRecord, PrivacyCheckItem } from '../types';

const BASE_KEYS = {
  CONTACTS: 'contacts_v1',
  JOURNEY: 'journey_v1',
  INCIDENTS: 'incidents_v1',
  PRIVACY: 'privacy_v1',
};

function getStorageKey(baseKey: string, userId?: string): string {
  if (userId) {
    return `shield_her_user_${userId}_${baseKey}`;
  }
  return `shield_her_${baseKey}`;
}

const DEFAULT_CONTACTS: Contact[] = [
  {
    id: 'contact-1',
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
    relationship: 'Sister',
    isPrimary: true,
    notes: 'Lives 10 mins away, works near cyber hub',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'contact-2',
    name: 'Sunita Sharma',
    phone: '+91 98111 22334',
    relationship: 'Mother',
    isPrimary: false,
    notes: 'Home landline/mobile',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'contact-3',
    name: 'Neha Kapoor',
    phone: '+91 99887 76655',
    relationship: 'Roommate / Colleague',
    isPrimary: false,
    notes: 'Shared apartment, knows my daily commute',
    createdAt: new Date().toISOString(),
  }
];

const DEFAULT_INCIDENTS: IncidentRecord[] = [
  {
    id: 'inc-1',
    category: 'Online Harassment',
    date: '2026-10-22',
    time: '21:15',
    description: 'Received repeated abusive and harassing direct messages on Instagram from an anonymous account claiming to know my office address.',
    evidenceRef: 'Screenshots saved in local folder: IG_stalker_messages_01.png to 04.png. Account handle @anon_shadow99 reported to platform.',
    tags: ['Instagram', 'DMs', 'Stalking'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];

export const DEFAULT_PRIVACY_ITEMS: PrivacyCheckItem[] = [
  {
    id: 'p1',
    title: 'Use unique passwords for important accounts',
    description: 'Avoid password reuse across personal email, banking, and social networks. Use a password manager or strong 14+ character passphrases.',
    category: 'account',
    completed: true,
    actionHint: 'Check haveibeenpwned.com to verify if your email was breached.',
  },
  {
    id: 'p2',
    title: 'Enable multi-factor authentication (MFA / 2FA)',
    description: 'Use authenticator apps (like Google Authenticator or Aegis) rather than SMS where possible to protect against SIM-swap attacks.',
    category: 'account',
    completed: true,
    actionHint: 'Activate in WhatsApp (Two-Step Verification PIN) and Instagram.',
  },
  {
    id: 'p3',
    title: 'Review social media privacy settings',
    description: 'Set personal profiles to Private. Restrict who can view your followers, tag you in photos, or message you without request.',
    category: 'social',
    completed: false,
    actionHint: 'Disable "Allow search engines to link to your profile" on Facebook & LinkedIn.',
  },
  {
    id: 'p4',
    title: 'Check app permissions (Camera, Mic & Contacts)',
    description: 'Audit mobile applications that have background access to your microphone, location, photo gallery, or contacts list.',
    category: 'device',
    completed: true,
    actionHint: 'On Android: Settings > Privacy > Permission Manager. On iOS: Settings > Privacy & Security.',
  },
  {
    id: 'p5',
    title: 'Review live-location sharing services',
    description: 'Verify which apps or contacts currently have access to your live location in Google Maps, WhatsApp, Snapchat (Snap Map), or Apple Find My.',
    category: 'location',
    completed: false,
    actionHint: 'Turn off "Ghost Mode" off or restrict Snap Map to "Only Me".',
  },
  {
    id: 'p6',
    title: 'Check active account login sessions',
    description: 'Log out of unrecognized web sessions, old college computers, or previous phones across Google, Instagram, Telegram, and Apple ID.',
    category: 'account',
    completed: false,
    actionHint: 'Go to Instagram Settings > Accounts Center > Password and Security > Where you are logged in.',
  },
  {
    id: 'p7',
    title: 'Secure the device with a strong screen lock & biometric PIN',
    description: 'Ensure an alphanumeric PIN or biometric lock (fingerprint/FaceID) is active. Disable notification previews on the lock screen.',
    category: 'device',
    completed: true,
    actionHint: 'Prevent OTPs from showing up on locked phone screens.',
  },
  {
    id: 'p8',
    title: 'Keep device software and security patches updated',
    description: 'Install operating system and browser security updates promptly to patch zero-day vulnerabilities and spyware exploits.',
    category: 'device',
    completed: false,
    actionHint: 'Turn on automatic updates in Android or iOS settings.',
  },
  {
    id: 'p9',
    title: 'Learn how to block, restrict, and report abusive accounts',
    description: 'Know how to capture metadata (profile URLs, user IDs, timestamps) before blocking abusers, ensuring admissible evidence for cyber cell.',
    category: 'social',
    completed: true,
    actionHint: 'Always screenshot full screens with time and URL before blocking.',
  },
];

// Helper to safely read from localStorage
export function getStoredData<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
}

// Helper to safely write to localStorage
export function setStoredData<T>(key: string, data: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
    return false;
  }
}

// Contacts CRUD (User-Scoped)
export function loadContacts(userId?: string): Contact[] {
  const key = getStorageKey(BASE_KEYS.CONTACTS, userId);
  return getStoredData<Contact[]>(key, DEFAULT_CONTACTS);
}

export function saveContacts(contacts: Contact[], userId?: string): boolean {
  const key = getStorageKey(BASE_KEYS.CONTACTS, userId);
  return setStoredData(key, contacts);
}

// Journey CRUD (User-Scoped)
export function loadJourney(userId?: string): Journey | null {
  const key = getStorageKey(BASE_KEYS.JOURNEY, userId);
  return getStoredData<Journey | null>(key, null);
}

export function saveJourney(journey: Journey | null, userId?: string): boolean {
  const key = getStorageKey(BASE_KEYS.JOURNEY, userId);
  return setStoredData(key, journey);
}

// Incidents CRUD (User-Scoped)
export function loadIncidents(userId?: string): IncidentRecord[] {
  const key = getStorageKey(BASE_KEYS.INCIDENTS, userId);
  return getStoredData<IncidentRecord[]>(key, DEFAULT_INCIDENTS);
}

export function saveIncidents(incidents: IncidentRecord[], userId?: string): boolean {
  const key = getStorageKey(BASE_KEYS.INCIDENTS, userId);
  return setStoredData(key, incidents);
}

// Privacy Checklist CRUD (User-Scoped)
export function loadPrivacyItems(userId?: string): PrivacyCheckItem[] {
  const key = getStorageKey(BASE_KEYS.PRIVACY, userId);
  return getStoredData<PrivacyCheckItem[]>(key, DEFAULT_PRIVACY_ITEMS);
}

export function savePrivacyItems(items: PrivacyCheckItem[], userId?: string): boolean {
  const key = getStorageKey(BASE_KEYS.PRIVACY, userId);
  return setStoredData(key, items);
}

// Reset prototype data
export function resetPrototypeData(userId?: string): void {
  const contactsKey = getStorageKey(BASE_KEYS.CONTACTS, userId);
  const journeyKey = getStorageKey(BASE_KEYS.JOURNEY, userId);
  const incidentsKey = getStorageKey(BASE_KEYS.INCIDENTS, userId);
  const privacyKey = getStorageKey(BASE_KEYS.PRIVACY, userId);

  localStorage.setItem(contactsKey, JSON.stringify(DEFAULT_CONTACTS));
  localStorage.removeItem(journeyKey);
  localStorage.setItem(incidentsKey, JSON.stringify(DEFAULT_INCIDENTS));
  localStorage.setItem(privacyKey, JSON.stringify(DEFAULT_PRIVACY_ITEMS));
}
