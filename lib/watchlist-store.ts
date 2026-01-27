import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WatchlistState {
    favorites: string[];
    addFavorite: (id: string) => void;
    removeFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
    persist(
        (set, get) => ({
            favorites: [],
            addFavorite: (id) => set((state) => ({
                favorites: [...state.favorites, id]
            })),
            removeFavorite: (id) => set((state) => ({
                favorites: state.favorites.filter((fav) => fav !== id)
            })),
            isFavorite: (id) => get().favorites.includes(id),
        }),
        {
            name: 'watchlist-storage', // nombre para localStorage
        }
    )
);
