'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import styles from '../styles/GlobalBackground.module.css';

const GlobalBackground = () => {
    const pathname = usePathname();

    // Rutas donde se mostrará el globo
    const rutasConGlobo = ['/wallet', '/news', '/noticias'];

    const mostrarGlobo = pathname ? rutasConGlobo.some(ruta => pathname.includes(ruta)) : false;

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
