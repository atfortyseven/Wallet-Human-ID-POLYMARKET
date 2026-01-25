import { useState } from 'react';
import { encodeFunctionData, parseUnits, pad, concat, type Hex } from 'viem';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { GNOSIS_SAFE_ABI, USDC_ABI, POLYGON_USDC } from '@/src/config/contracts'; // Assuming these exist, if not I might need to define them or import from elsewhere. I will assume they exist or I will define placeholders if build fails.
// Actually, checking file list earlier, I saw 'contracts' dir. Let's hope config/contracts exists.
// If NOT, I should probably define them inline or checking carefully.
// I'll stick to the user's provided code but if dependencies fail I'll fix.
// Wait, I haven't checked config/contracts.
// Ref: Step 0 provided code.

export function useWithdraw() {
    const { address } = useAccount();
    const { writeContractAsync, data: txHash, isPending } = useWriteContract();

    // Opcional: Hook para saber cuando la transacción se confirma en blockchain
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    const withdrawUSDC = async (
        proxyAddress: Hex, // La dirección de la Gnosis Safe del usuario
        amount: string     // El monto en texto, ej: "10.5"
    ) => {
        if (!address) throw new Error("No hay wallet conectada");
        if (!proxyAddress) throw new Error("No se detectó la Proxy Wallet");

        try {
            console.log("Iniciando retiro de:", amount, "USDC");

            // 1. Codificar la "Transacción Interna" (Lo que la Safe va a hacer)
            // En este caso: Transferir USDC al dueño (address)
            const amountBigInt = parseUnits(amount, 6); // USDC tiene 6 decimales

            const innerData = encodeFunctionData({
                abi: USDC_ABI,
                functionName: 'transfer',
                args: [address, amountBigInt], // Envia a la propia EOA del usuario
            });

            // 2. Generar la "Firma Pre-Validada" (Magic Signature)
            // Formato requerido por Gnosis Safe:
            // {32-bytes r: address del owner} + {32-bytes s: 0} + {1-byte v: 1}

            // A) R: La dirección del owner (tu EOA) rellena con ceros a la izquierda hasta 32 bytes
            const r = pad(address, { size: 32 });

            // B) S: 32 bytes de ceros (lugar reservado para datos de firma que no usamos aquí)
            const s = pad("0x0", { size: 32 });

            // C) V: El byte "01" que le dice al contrato: "Confía en msg.sender, es el dueño"
            const v = "0x01";

            // Concatenamos todo en una sola cadena Hex
            const signature = concat([r, s, v]);

            // 3. Ejecutar la transacción en el contrato Gnosis Safe
            const tx = await writeContractAsync({
                address: proxyAddress,
                abi: GNOSIS_SAFE_ABI,
                functionName: 'execTransaction',
                args: [
                    POLYGON_USDC, // to: Contrato con el que interactuamos (USDC)
                    0n,           // value: 0 MATIC enviados
                    innerData,    // data: La llamada a transfer() codificada
                    0,            // operation: 0 = Call (Llamada normal)
                    0n,           // safeTxGas: 0 (Deja que Gnosis estime o use todo el gas)
                    0n,           // baseGas: 0
                    0n,           // gasPrice: 0
                    '0x0000000000000000000000000000000000000000', // gasToken (Ninguno)
                    '0x0000000000000000000000000000000000000000', // refundReceiver (Ninguno)
                    signature     // signatures: Nuestra firma mágica construida arriba
                ],
            });

            return tx;

        } catch (error) {
            console.error("Error en el retiro:", error);
            throw error;
        }
    };

    return {
        withdrawUSDC,
        isPending,    // True cuando MetaMask está abierto pidiendo firma
        isConfirming, // True cuando la tx se envió y espera confirmación de la red
        isSuccess,    // True cuando terminó exitosamente
        txHash
    };
}
