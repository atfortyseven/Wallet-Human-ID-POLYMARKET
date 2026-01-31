"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface CSRFHook {
  token: string | null;
  loading: boolean;
  error: Error | null;
  refreshToken: () => Promise<void>;
}

export function useCSRFToken(): CSRFHook {
  const { user } = useUser();
  const session = { user };
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchToken = async () => {
    if (!session?.user?.id) {
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/auth/csrf');
      
      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
      }

      const data = await response.json();
      setToken(data.token);
      setError(null);
    } catch (err) {
      setError(err as Error);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, [session?.user?.id]);

  return {
    token,
    loading,
    error,
    refreshToken: fetchToken,
  };
}

// ============================================
// Secure Fetch Wrapper
// ============================================

interface SecureFetchOptions extends RequestInit {
  skipCSRF?: boolean;
}

export async function secureFetch(
  url: string,
  options: SecureFetchOptions = {}
): Promise<Response> {
  const { skipCSRF, ...fetchOptions } = options;

  // Get CSRF token for mutations
  if (!skipCSRF && fetchOptions.method && fetchOptions.method !== 'GET') {
    const csrfResponse = await fetch('/api/auth/csrf');
    const { token } = await csrfResponse.json();

    fetchOptions.headers = {
      ...fetchOptions.headers,
      'X-CSRF-Token': token,
      'Content-Type': 'application/json',
    };
  }

  // Add security headers
  fetchOptions.headers = {
    ...fetchOptions.headers,
    'X-Requested-With': 'XMLHttpRequest',
  };

  const response = await fetch(url, fetchOptions);

  // Handle rate limiting
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    throw new Error(
      `Rate limit exceeded. Retry after ${retryAfter || 60} seconds.`
    );
  }

  // Handle unauthorized
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  // Handle premium required
  if (response.status === 403) {
    const data = await response.json();
    if (data.requiresUpgrade) {
      // Trigger upgrade modal
      window.dispatchEvent(new CustomEvent('show-pricing-modal'));
    }
    throw new Error(data.error || 'Forbidden');
  }

  return response;
}

// ============================================
// Premium Feature Guard Hook
// ============================================

interface PremiumGuard {
  isPremium: boolean;
  loading: boolean;
  requireUpgrade: () => void;
}

export function usePremiumGuard(): PremiumGuard {
  const { user } = useUser();
  const session = { user };
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPremium = async () => {
      if (!session?.user?.id) {
        setIsPremium(false);
        setLoading(false);
        return;
      }

      try {
        const response = await secureFetch('/api/premium/subscription-status');
        const data = await response.json();
        setIsPremium(data.valid && data.tier !== 'FREE');
      } catch (error) {
        console.error('Premium check failed:', error);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    };

    checkPremium();
  }, [session?.user?.id]);

  const requireUpgrade = () => {
    window.dispatchEvent(new CustomEvent('show-pricing-modal'));
  };

  return { isPremium, loading, requireUpgrade };
}

// ============================================
// Input Sanitization Hook
// ============================================

export function useSanitizedInput(initialValue: string = ''): [
  string,
  (value: string) => void,
  boolean
] {
  const [value, setValue] = useState(initialValue);
  const [isSafe, setIsSafe] = useState(true);

  const sanitize = (input: string): string => {
    // Remove dangerous patterns
    const dangerous = /<script|javascript:|on\w+=/gi;
    const hasDangerous = dangerous.test(input);
    
    setIsSafe(!hasDangerous);

    if (hasDangerous) {
      console.warn('[SECURITY] Dangerous input detected and blocked');
      return '';
    }

    // Sanitize HTML entities
    return input
      .replace(/[<>'"]/g, '')
      .trim()
      .slice(0, 1000);
  };

  const setValueSafe = (newValue: string) => {
    const sanitized = sanitize(newValue);
    setValue(sanitized);
  };

  return [value, setValueSafe, isSafe];
}

// ============================================
// Activity Monitor (Detect Suspicious Behavior)
// ============================================

let activityLog: { action: string; timestamp: number }[] = [];

export function logUserActivity(action: string) {
  const now = Date.now();
  
  // Add to log
  activityLog.push({ action, timestamp: now });
  
  // Keep only last 5 minutes
  activityLog = activityLog.filter(log => now - log.timestamp < 300000);
  
  // Check for suspicious patterns
  if (activityLog.length > 100) {
    console.error('[SECURITY] Suspicious activity volume detected');
    fetch('/api/security/report-suspicious', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'HIGH_VOLUME_ACTIVITY',
        count: activityLog.length,
      }),
    });
  }
  
  // Check for rapid repeated actions
  const recentSameActions = activityLog.filter(
    log => log.action === action && now - log.timestamp < 10000
  );
  
  if (recentSameActions.length > 20) {
    console.error('[SECURITY] Rapid repeated action detected:', action);
    fetch('/api/security/report-suspicious', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'RAPID_REPEATED_ACTION',
        action,
        count: recentSameActions.length,
      }),
    });
  }
}

// ============================================
// Auto-Logout on Inactivity
// ============================================

export function useAutoLogout(timeoutMinutes: number = 30) {
  const { user } = useUser();
  const session = { user };

  useEffect(() => {
    if (!session) return;

    let timeout: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log('[SECURITY] Auto-logout due to inactivity');
        window.location.href = '/api/auth/signout';
      }, timeoutMinutes * 60 * 1000);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimeout);
    });

    resetTimeout();

    return () => {
      clearTimeout(timeout);
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout);
      });
    };
  }, [session, timeoutMinutes]);
}

// ============================================
// Clipboard Security (Prevent Data Leaks)
// ============================================

export function useSecureClipboard() {
  const copyToClipboard = async (text: string, logAction: boolean = true) => {
    try {
      await navigator.clipboard.writeText(text);
      
      if (logAction) {
        logUserActivity('CLIPBOARD_COPY');
        
        // Log sensitive data copies
        if (text.startsWith('0x') || text.includes('private')) {
          fetch('/api/security/log-sensitive-copy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'CLIPBOARD_COPY' }),
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      return false;
    }
  };

  return { copyToClipboard };
}
