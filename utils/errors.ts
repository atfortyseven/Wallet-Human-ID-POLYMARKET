export function getFriendlyError(error: any): string {
    const msg = error?.message || String(error);

    if (msg.includes("User rejected")) return "Cancelaste la operación.";
    if (msg.includes("insufficient funds")) return "No tienes saldo suficiente para el gas.";
    if (msg.includes("exceeds balance")) return "Monto excede tu saldo disponible.";
    if (msg.includes("GS026")) return "Fallo en validación del Safe.";

    return "Ocurrió un error inesperado. Intenta nuevamente.";
}
