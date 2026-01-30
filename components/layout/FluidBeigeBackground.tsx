import React from 'react';

export default function FluidBeigeBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#F5F5DC]">
      <div className="absolute inset-0 opacity-80 mix-blend-multiply filter blur-3xl">
        {/* Organic Blobs with CSS Animation */}
        <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-[#E3DCD2] rounded-full animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] right-[20%] w-[35vw] h-[35vw] bg-[#F3E5AB] rounded-full animate-blob animation-delay-4000" />
        <div className="absolute bottom-[20%] left-[30%] w-[45vw] h-[45vw] bg-[#EADDcF] rounded-full animate-blob" />
      </div>
      
      {/* Noise Texture for Texture/Premium feel */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
    </div>
  );
}
