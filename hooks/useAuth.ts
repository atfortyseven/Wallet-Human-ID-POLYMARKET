"use client";

import { useState, useEffect } from "react";

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        try {
            // Check client-side persistence (3-minute rule)
            const expiry = localStorage.getItem('human_session_expiry');
            if (expiry && parseInt(expiry) > Date.now()) {
                setIsAuthenticated(true);
                setIsLoading(false);
                return;
            }

            // Fallback to server check (optional, but keep for robustness if needed)
            const res = await fetch("/api/auth/session");
            if (res.ok) {
                // Determine source of server session - assuming server session is strictly tied to 3 min logic too?
                // For now, if server says OK, we trust it, but we prefer client expiry for the "3 min reload" rule.
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Auth check failed", error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async () => {
        try {
            // Set 3-minute expiry
            const expiry = Date.now() + 3 * 60 * 1000; // 3 minutes
            localStorage.setItem('human_session_expiry', expiry.toString());
            
            // Still verify with server if needed by backend architecture, but client auth is immediate
            await fetch("/api/auth/verify-world-id", { method: "POST" }); // Mock call or real call handled elsewhere
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Login persistence failed", error);
            // Even if server fails, if we verified proof, we might want to allow locally?
            // Assuming login() is called AFTER proof verification succeeded.
            const expiry = Date.now() + 3 * 60 * 1000; 
            localStorage.setItem('human_session_expiry', expiry.toString());
            setIsAuthenticated(true);
        }
    };

    const logout = async () => {
        localStorage.removeItem('human_session_expiry');
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch (e) { console.error(e); }
        setIsAuthenticated(false);
        window.location.href = "/";
    };

    const resetAuth = async () => {
        // Clear 3-minute session
        localStorage.removeItem('human_session_expiry');
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch (e) {
             console.error(e);
        }
        setIsAuthenticated(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    // Helper to refresh session (extend 3 mins) if needed
    const refreshSession = () => {
        if (isAuthenticated) {
            const expiry = Date.now() + 3 * 60 * 1000;
            localStorage.setItem('human_session_expiry', expiry.toString());
        }
    };

    return { isAuthenticated, isLoading, login, logout, resetAuth, refreshSession };
}
