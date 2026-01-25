"use client";

import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";
import { useRouter } from "next/navigation";

export default function VerifyWorldID() {
  const router = useRouter();

  // 1. LEER VARIABLES DE ENTORNO
  const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
  const action = process.env.NEXT_PUBLIC_WLD_ACTION;

  // 2. LOGS DE SEGURIDAD PARA DEBUG
  console.log("--- World ID Config Check ---");
  console.log("App ID cargado:", app_id ? "SÍ ✅" : "NO ❌");
  console.log("Action ID cargado:", action ? `SÍ (${action}) ✅` : "NO ❌");

  const handleVerify = async (proof: ISuccessResult) => {
    console.log("Prueba recibida de IDKit:", proof);
    // Aquí podrías enviar la prueba a tu backend si fuera necesario
  };

  const onSuccess = (result: ISuccessResult) => {
    console.log("Verificación Exitosa 🎉:", result);
    // REDIRECCIÓN A MERCADOS (Ruta válida)
    router.push("/mercados");
  };

  const onError = (error: any) => {
    console.error("ERROR DE VERIFICACIÓN ❌:", error);

    // Alerta detallada para el usuario
    alert(
      `Error de Worldcoin: ${error.code || "Unknown"}\n` +
      `Detalle: ${error.message || "La verificación fue declinada o cancelada."}\n\n` +
      `Consejo: Revisa si tu App en el Developer Portal de Worldcoin está en modo PRODUCCIÓN.`
    );
  };

  if (!app_id || !action) {
    return (
      <div className="p-4 bg-red-500/20 border border-red-500 text-white rounded-lg">
        Error de Configuración: Faltan variables de entorno (APP_ID o ACTION).
      </div>
    );
  }

  return (
    <IDKitWidget
      app_id={app_id}
      action={action}
      onSuccess={onSuccess}
      handleVerify={handleVerify}
      onError={onError}
      // CAMBIA ESTO: 'device' para simulador, 'orb' para usuarios reales con la App
      verification_level={VerificationLevel.Device}
    >
      {({ open }: { open: () => void }) => (
        <button
          onClick={open}
          className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all shadow-xl"
        >
          Verificar Humanidad con World ID
        </button>
      )}
    </IDKitWidget>
  );
}
