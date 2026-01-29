import { z } from 'zod';

/**
 * Validation schema for World ID proof
 */
export const worldIdProofSchema = z.object({
    proof: z.object({
        nullifier_hash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid nullifier hash format'),
        merkle_root: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid merkle root format'),
        proof: z.string().min(1, 'Proof is required'),
        verification_level: z.enum(['orb', 'device'], {
            message: 'Verification level must be orb or device',
        }),
    }),
    walletAddress: z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address format')
        .optional(),
});

export type WorldIdProofInput = z.infer<typeof worldIdProofSchema>;

/**
 * Validation schema for wallet address
 */
export const walletAddressSchema = z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum wallet address');

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeString(input: string): string {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}
