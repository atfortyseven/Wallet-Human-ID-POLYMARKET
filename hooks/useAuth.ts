"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session, status } = useSession();

    const checkAuth = useCallback(async () => {
        try {
            // Check NextAuth session (Google login)
            if (status === 'authenticated') {
                setIsAuthenticated(true);
                setIsLoading(false);
                return;
            }
            
            // Check server-side session via cookies (Email login with dual-token system)
            const response = await fetch('/api/auth/verify-session', {
                method: 'GET',
                credentials: 'include', // Important: includes httpOnly cookies
            });

            if (response.ok) {
                const data = await response.json();
                setIsAuthenticated(data.authenticated);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Auth check failed", error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, [status]);

    // Automatic token refresh every 15 minutes
    const refreshToken = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            await fetch('/api/auth/refresh', {
                method: 'POST',
                credentials: 'include',
            });
            console.log('Token refreshed successfully');
        } catch (error) {
            console.error('Token refresh failed:', error);
            // If refresh fails, re-check authentication
            checkAuth();
        }
    }, [isAuthenticated, checkAuth]);

    const login = async () => {
        // No need to set localStorage anymore
        // Server handles session via httpOnly cookies
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { 
                method: "POST",
                credentials: 'include',
            });
        } catch (e) { 
            console.error(e); 
        }
        setIsAuthenticated(false);
        window.location.href = "/";
    };

    const resetAuth = async () => {
        try {
            await fetch("/api/auth/logout", { 
                method: "POST",
                credentials: 'include',
            });
        } catch (e) {
             console.error(e);
        }
        setIsAuthenticated(false);
    };

    useEffect(() => {
        // Only run checkAuth when session status is determined
        if (status !== 'loading') {
            checkAuth();
        }
    }, [status, session, checkAuth]);

    // Auto-refresh token every 15 minutes
    useEffect(() => {
        if (!isAuthenticated) return;

        const interval = setInterval(refreshToken, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, [isAuthenticated, refreshToken]);

    return { isAuthenticated, isLoading, login, logout, resetAuth };
}
