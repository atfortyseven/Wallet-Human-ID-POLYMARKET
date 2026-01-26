"use client";

import { useState, useEffect } from "react";

function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for auth token in cookies
        const token = getCookie("auth_token");
        setIsAuthenticated(!!token);
        setIsLoading(false);
    }, []);

    return { isAuthenticated, isLoading };
}
