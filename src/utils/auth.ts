import { User, StoredUserAccount, AuthSession } from '../types';

const STORAGE_KEYS = {
  USERS: 'shield_her_registered_accounts_v1',
  SESSION: 'shield_her_current_session_v1',
};

// Cryptographic SHA-256 Hashing with Salt using Web Crypto API
export async function hashWithSalt(text: string, salt: string): Promise<string> {
  const combined = `${salt}:${text}`;
  
  // Browser Web Crypto API or Node crypto fallback
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(combined);
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Synchronous fallback for test environments without subtle crypto
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(16).padStart(16, '0')}`;
}

export function generateCryptoSalt(): string {
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.getRandomValues) {
    const array = new Uint8Array(16);
    globalThis.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long.' };
  }
  return { valid: true };
}

// Load all registered users from localStorage
export function loadRegisteredUsers(): StoredUserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) return [];
    return JSON.parse(raw) as StoredUserAccount[];
  } catch (err) {
    console.warn('Error reading registered users from storage:', err);
    return [];
  }
}

// Save users list to localStorage
export function saveRegisteredUsers(users: StoredUserAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving registered users to storage:', err);
  }
}

// Ensure default demo account is available for immediate testing if no users exist
export async function initializeDefaultUser(): Promise<void> {
  const existing = loadRegisteredUsers();
  const demoEmail = 'user@shieldher.safe';
  
  const alreadyExists = existing.some((u) => u.email.toLowerCase() === demoEmail.toLowerCase());
  if (!alreadyExists) {
    const salt = generateCryptoSalt();
    const passwordHash = await hashWithSalt('ShieldHer2026!', salt);
    const demoAccount: StoredUserAccount = {
      id: 'demo-user-1',
      name: 'Priya Sharma',
      email: demoEmail,
      passwordHash,
      salt,
      securityQuestion: 'What is your trusted safe word?',
      securityAnswerHash: await hashWithSalt('freedom', salt),
      createdAt: new Date().toISOString(),
    };
    saveRegisteredUsers([...existing, demoAccount]);
  }
}

// Get active session
export function getCurrentSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    if (session && session.user && session.token) {
      return session;
    }
    return null;
  } catch {
    return null;
  }
}

// Save active session
export function setCurrentSession(session: AuthSession | null): void {
  try {
    if (!session) {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } else {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    }
  } catch (err) {
    console.error('Error updating session storage:', err);
  }
}

// Register new user account
export async function registerUser(
  name: string,
  email: string,
  password: string,
  confirmPassword?: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedName || trimmedName.length < 2) {
    return { success: false, error: 'Please enter your full name (at least 2 characters).' };
  }

  if (!validateEmail(trimmedEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  const passCheck = validatePassword(password);
  if (!passCheck.valid) {
    return { success: false, error: passCheck.error };
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match. Please re-enter your password.' };
  }

  const users = loadRegisteredUsers();
  const duplicate = users.find((u) => u.email.toLowerCase() === trimmedEmail);
  if (duplicate) {
    return { success: false, error: 'An account with this email address already exists. Please log in instead.' };
  }

  const salt = generateCryptoSalt();
  const passwordHash = await hashWithSalt(password, salt);
  const newUser: StoredUserAccount = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: trimmedName,
    email: trimmedEmail,
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
  };

  saveRegisteredUsers([...users, newUser]);

  const publicUser: User = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt,
  };

  // Create active session
  const session: AuthSession = {
    user: publicUser,
    token: `token-${Date.now()}-${Math.random().toString(36).substring(2)}`,
    createdAt: new Date().toISOString(),
  };
  setCurrentSession(session);

  return { success: true, user: publicUser };
}

// Login user with email & password verification
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail || !password) {
    return { success: false, error: 'Please provide both your email address and password.' };
  }

  if (!validateEmail(trimmedEmail)) {
    return { success: false, error: 'Please enter a valid email address format.' };
  }

  // Ensure default demo user exists if registering for the first time
  await initializeDefaultUser();

  const users = loadRegisteredUsers();
  const account = users.find((u) => u.email.toLowerCase() === trimmedEmail);

  if (!account) {
    return { success: false, error: 'No account found with this email address. Please sign up first.' };
  }

  const computedHash = await hashWithSalt(password, account.salt);
  if (computedHash !== account.passwordHash) {
    return { success: false, error: 'Incorrect password. Please verify your credentials and try again.' };
  }

  const publicUser: User = {
    id: account.id,
    name: account.name,
    email: account.email,
    createdAt: account.createdAt,
  };

  const session: AuthSession = {
    user: publicUser,
    token: `token-${Date.now()}-${Math.random().toString(36).substring(2)}`,
    createdAt: new Date().toISOString(),
  };
  setCurrentSession(session);

  return { success: true, user: publicUser };
}

// Logout user
export function logoutUser(): void {
  setCurrentSession(null);
}

// Reset password for an existing account
export async function resetPassword(
  email: string,
  newPassword: string,
  confirmNewPassword?: string
): Promise<{ success: boolean; error?: string }> {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail) {
    return { success: false, error: 'Please provide your account email address.' };
  }

  if (!validateEmail(trimmedEmail)) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  const passCheck = validatePassword(newPassword);
  if (!passCheck.valid) {
    return { success: false, error: passCheck.error };
  }

  if (confirmNewPassword !== undefined && newPassword !== confirmNewPassword) {
    return { success: false, error: 'New passwords do not match. Please verify and retry.' };
  }

  const users = loadRegisteredUsers();
  const userIndex = users.findIndex((u) => u.email.toLowerCase() === trimmedEmail);

  if (userIndex === -1) {
    return { success: false, error: 'No account registered with this email address.' };
  }

  const newSalt = generateCryptoSalt();
  const newHash = await hashWithSalt(newPassword, newSalt);

  users[userIndex] = {
    ...users[userIndex],
    salt: newSalt,
    passwordHash: newHash,
  };

  saveRegisteredUsers(users);
  return { success: true };
}
