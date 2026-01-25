'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import styles from '../styles/GlobalBackground.module.css';

const GlobalBackground = () => {
    const pathname = usePathname();

    // Rutas donde se mostrará el globo
    // Adding /wallet and /news (and /noticias as alt)
    const rutasConGlobo = ['/wallet', '/news', '/noticias'];

    // Check if current path starts with any of the allowed routes to handle sub-paths if necessary, 
    // or exact match. The user logic used '.includes', which is broad. 
    // I'll stick to 'includes' to match their logic, but safe-guard against null pathname.
    console.log("[GlobalBackground] Current path:", pathname);
    const mostrarGlobo = pathname ? rutasConGlobo.some(ruta => pathname.includes(ruta)) : false;
    console.log("[GlobalBackground] Show Globe:", mostrarGlobo);

    if (!mostrarGlobo) {
        return null;
    }

    return (
        <div className={styles.backgroundContainer}>
            <video
                autoPlay
                loop
                muted
                playsInline
                src="/globe-background.mp4"
                className={styles.globeVideo}
            />
        </div>
    );
};

export default GlobalBackground;
