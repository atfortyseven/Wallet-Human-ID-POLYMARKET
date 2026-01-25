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
            <img
                src="/background.gif" // Using the GIF file as requested (mapping 'globe-background.gif' request to actual file 'background.gif')
                alt="Globe Background"
                className={styles.globeVideo} // Reusing the class for styling
            />
        </div>
    );
};

export default GlobalBackground;
