"use client";

import { useState, useEffect } from "react";

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await fetch("/api/auth/session");
            if (res.ok) {
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

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setIsAuthenticated(false);
            window.location.href = "/"; // Redirect to home
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const resetAuth = () => {
        setIsAuthenticated(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return { isAuthenticated, isLoading, login: checkAuth, logout, resetAuth };
}
