"use client";

import CrystallineDashboard from "@/components/crystalline/CrystallineDashboard";

export const dynamic = 'force-dynamic';

export default function MercadosPage() {
    // Forzamos que se muestre el tab de NEWS por defecto
    // Nota: CrystallineDashboard ya tiene state interno, pero como es un componente cliente,
    // al montarse inicia en su estado default ("NEWS").
    // Si necesitáramos control externo, deberíamos pasarle props.
    return <CrystallineDashboard />;
}
