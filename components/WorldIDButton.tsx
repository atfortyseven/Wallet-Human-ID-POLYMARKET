"use client";

import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { useState } from "react";

interface WorldIDButtonProps {
  onVerificationSuccess?: (result: any) => void;
}

export default function WorldIDButton({ onVerificationSuccess }: WorldIDButtonProps) {
  const [done, setDone] = useState(false);

  const onSuccess = (result: any) => {
    console.log("Verified successfully", result);
    setDone(true);
    if (onVerificationSuccess) {
      onVerificationSuccess(result);
    }
  };

  const handleVerify = async (proof: any) => {
    console.log("Proof received", proof);
    // Call backend verify here
  };

  return (
    <>
      {done ? (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
          <p className="text-emerald-400 font-medium text-sm">✓ Identity Verified</p>
        </div>
      ) : (
        <IDKitWidget
          app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}` || "app_staging"}
          action={process.env.NEXT_PUBLIC_WLD_ACTION || "login-action"}
          onSuccess={onSuccess}
          handleVerify={handleVerify}
          verification_level={VerificationLevel.Device}
        >
          {({ open }: { open: () => void }) => (
            <button
              className="w-full bg-white text-black hover:bg-gray-200 active:scale-[0.98] transition-all font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-white/10"
              onClick={open}
            >
              Ingresar con World ID
            </button>
          )}
        </IDKitWidget>
      )}
    </>
  );
}
