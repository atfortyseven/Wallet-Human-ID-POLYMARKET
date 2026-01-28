export const captureReferral = () => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');

    if (refCode) {
        // Persist for 30 days
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        document.cookie = `humanid_ref=${refCode}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;

        // Also Sync to LocalStorage for immediate UI access
        localStorage.setItem('humanid_ref_active', refCode);
    }
};

export const getReferrer = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('humanid_ref_active');
};
