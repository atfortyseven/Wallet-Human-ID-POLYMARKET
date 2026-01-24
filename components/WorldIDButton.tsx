"use client";

import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { useState } from "react";

export default function WorldIDButton() {
  const [done, setDone] = useState(false);

  // Mock handler
  const onSuccess = (result: any) => {
    console.log("Verified successfully", result);
    setDone(true);
  };

  const handleVerify = async (proof: any) => {
    console.log("Proof received", proof);
    // Call backend verify here
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4 glass-card">
      <h2 className="text-xl font-bold">World ID Verification</h2>
      {done ? (
        <p className="text-green-400">Verified!</p>
      ) : (
        <IDKitWidget
          app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}` || "app_staging"}
          action={process.env.NEXT_PUBLIC_WLD_ACTION || "login-action"}
          onSuccess={onSuccess}
          handleVerify={handleVerify}
          verification_level={VerificationLevel.Device}
        >
          {({ open }) => (
            <button
              className="px-6 py-3 font-bold bg-white text-black rounded-full hover:bg-gray-200 transition-all"
              onClick={open}
            >
              Ingresar con World ID
            </button>
          )}
        </IDKitWidget>
      )}
    </div>
  );
}
