/**
 * World ID Verification Utilities (Server-Side)
 * 
 * Replaces @worldcoin/idkit import to avoid React dependencies in API routes.
 * Uses direct REST API calls to Worldcoin Developer Portal.
 */

interface IVerifyResponse {
    success: boolean;
    code?: string;
    detail?: string;
    attribute?: string;
}

interface IVerifyRequest {
    proof: string;
    merkle_root: string;
    nullifier_hash: string;
    verification_level: string;
    signal?: string;
}

/**
 * Verifies a World ID proof using the Worldcoin API
 * @param proof The proof data object
 * @param app_id The app ID (e.g., app_...)
 * @param action The action ID
 * @returns Verification response
 */
export async function verifyWorldIDProof(
    proof: IVerifyRequest,
    app_id: string,
    action: string
): Promise<IVerifyResponse> {

    // Ensure we aren't using the default accidentally if env is missing in some context
    const finalAppId = app_id || "app_d2014c58bb084dcb09e1f3c1c1144287";

    try {
        const response = await fetch(
            `https://developer.worldcoin.org/api/v1/verify/${finalAppId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...proof,
                    action,
                }),
            }
        );

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`World ID API Error (${response.status}):`, errorBody);
            let errorData;
            try {
                errorData = JSON.parse(errorBody);
            } catch {
                errorData = {};
            }
            return {
                success: false,
                code: errorData.code || 'server_error',
                detail: errorData.detail || `Failed to verify proof. Status: ${response.status}. Body: ${errorBody.substring(0, 100)}`,
            };
        }

        const data = await response.json();
        return {
            success: true,
            ...data,
        };
    } catch (error) {
        console.error('World ID verification error:', error);
        return {
            success: false,
            code: 'network_error',
            detail: 'Failed to contact Worldcoin API',
        };
    }
}
