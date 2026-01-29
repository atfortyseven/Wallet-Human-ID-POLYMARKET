"use client";

import { useFavorites } from "@/hooks/useFavorites";
import { NewsCard } from "@/components/crystalline/NewsCard";

export const dynamic = 'force-dynamic';

export default function FavoritesPage() {
    const { favorites, isLoading } = useFavorites();

    if (isLoading) {
        return <div className="p-8 text-center">Cargando...</div>;
    }

    if (!favorites || favorites.length === 0) {
        return (
            <div className="p-10 text-center text-gray-500">
                <p>No tienes favoritos guardados.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Mis Favoritos</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((item) => (
                    // Al haber arreglado NewsCard en el paso 2, esto ya es seguro
                    <NewsCard key={item.id} {...item} />
                ))}
            </div>
        </div>
    );
}
