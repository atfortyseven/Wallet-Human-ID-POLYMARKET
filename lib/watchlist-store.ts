import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedItem {
    id: string; // URL for news, ID for markets/traders
    type: 'news' | 'market' | 'trader';
    title: string;
    meta?: string; // Image URL or extra data
    timestap: number;
}

interface WatchlistState {
    items: SavedItem[];
    toggleItem: (item: Omit<SavedItem, 'timestap'>) => void;
    isSaved: (id: string) => boolean;
}

export const useWatchlist = create<WatchlistState>()(
    persist(
        (set, get) => ({
            items: [],
            toggleItem: (newItem) => {
                const { items } = get();
                const exists = items.find((i) => i.id === newItem.id);

                if (exists) {
                    set({ items: items.filter((i) => i.id !== newItem.id) });
                } else {
                    set({ items: [...items, { ...newItem, timestap: Date.now() }] });
                }
            },
            isSaved: (id) => !!get().items.find((i) => i.id === id),
        }),
        {
            name: 'polymarket-watchlist',
        }
    )
);
