"use client";

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { SettingsModal } from '@/components/ui/SettingsModal';

const SettingsMenu = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <>
            <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white transition-all border border-neutral-800"
            >
                <Menu size={20} />
            </button>

            {/* The Monster Modal 🧠 */}
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </>
    );
};

export default SettingsMenu;
