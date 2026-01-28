'use client';

import { useEffect } from 'react';

export default function RegisterSW() {
    useEffect(() => {
        if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('Void Service Worker Registered: ', registration.scope);
                })
                .catch((error) => {
                    console.error('Service Worker Registration Failed:', error);
                });
        }
    }, []);

    return null;
}
