/**
 * WebAuthn/Passkeys Authentication Implementation
 * 
 * Implements passwordless authentication using FIDO2/WebAuthn
 * Supports:
 * - Platform authenticators (Face ID, Touch ID, Windows Hello)
 * - Hardware security keys (YubiKey, Ledger)
 * - Passkeys with cloud sync
 */

import { 
  startRegistration, 
  startAuthentication,
  type RegistrationResponseJSON,
  type AuthenticationResponseJSON
} from '@simplewebauthn/browser'

export interface PasskeyCredential {
  id: string
  publicKey: string
  counter: number
  deviceType: 'platform' | 'cross-platform'
  transports?: AuthenticatorTransport[]
  createdAt: Date
  lastUsedAt?: Date
  nickname?: string
}

export interface PasskeyRegistrationOptions {
  challenge: string
  rp: {
    name: string
    id: string
  }
  user: {
    id: string
    name: string
    displayName: string
  }
  pubKeyCredParams: {
    type: 'public-key'
    alg: number
  }[]
  authenticatorSelection?: {
    authenticatorAttachment?: 'platform' | 'cross-platform'
    requireResidentKey?: boolean
    residentKey?: 'discouraged' | 'preferred' | 'required'
    userVerification?: 'required' | 'preferred' | 'discouraged'
  }
  timeout?: number
  attestation?: 'none' | 'indirect' | 'direct'
}

/**
 * Check if WebAuthn is supported in current browser
 */
export function isWebAuthnSupported(): boolean {
  return (
    window?.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential === 'function'
  )
}

/**
 * Check if platform authenticator is available (Face ID, Touch ID, etc.)
 */
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isWebAuthnSupported()) return false
  
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  } catch {
    return false
  }
}

/**
 * Register a new passkey
 */
export async function registerPasskey(
  userId: string,
  userName: string,
  userDisplayName: string,
  preferPlatformAuthenticator = true
): Promise<RegistrationResponseJSON> {
  if (!isWebAuthnSupported()) {
    throw new Error('WebAuthn is not supported in this browser')
  }
  
  // Request registration options from server
  const optionsResponse = await fetch('/api/auth/passkey/register/options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      userName,
      userDisplayName,
      authenticatorAttachment: preferPlatformAuthenticator ? 'platform' : undefined
    })
  })
  
  if (!optionsResponse.ok) {
    throw new Error('Failed to get registration options')
  }
  
  const options = await optionsResponse.json()
  
  // Start WebAuthn registration ceremony
  try {
    const registrationResponse = await startRegistration(options)
    
    // Verify registration with server
    const verificationResponse = await fetch('/api/auth/passkey/register/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        response: registrationResponse
      })
    })
    
    if (!verificationResponse.ok) {
      throw new Error('Passkey registration failed verification')
    }
    
    return registrationResponse
  } catch (error: any) {
    // Handle specific WebAuthn errors
    if (error.name === 'NotAllowedError') {
      throw new Error('Passkey registration was cancelled')
    } else if (error.name === 'InvalidStateError') {
      throw new Error('This passkey is already registered')
    }
    throw error
  }
}

/**
 * Authenticate with passkey
 */
export async function authenticateWithPasskey(
  userId?: string
): Promise<AuthenticationResponseJSON> {
  if (!isWebAuthnSupported()) {
    throw new Error('WebAuthn is not supported in this browser')
  }
  
  // Request authentication options from server
  const optionsResponse = await fetch('/api/auth/passkey/authenticate/options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  })
  
  if (!optionsResponse.ok) {
    throw new Error('Failed to get authentication options')
  }
  
  const options = await optionsResponse.json()
  
  // Start WebAuthn authentication ceremony
  try {
    const authenticationResponse = await startAuthentication(options)
    
    // Verify authentication with server
    const verificationResponse = await fetch('/api/auth/passkey/authenticate/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        response: authenticationResponse
      })
    })
    
    if (!verificationResponse.ok) {
      throw new Error('Passkey authentication failed verification')
    }
    
    const { verified, session } = await verificationResponse.json()
    
    if (!verified) {
      throw new Error('Passkey verification failed')
    }
    
    return authenticationResponse
  } catch (error: any) {
    // Handle specific WebAuthn errors
    if (error.name === 'NotAllowedError') {
      throw new Error('Passkey authentication was cancelled')
    }
    throw error
  }
}

/**
 * List user's registered passkeys
 */
export async function listPasskeys(userId: string): Promise<PasskeyCredential[]> {
  const response = await fetch(`/api/auth/passkey/list?userId=${userId}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch passkeys')
  }
  
  return response.json()
}

/**
 * Delete a passkey
 */
export async function deletePasskey(userId: string, credentialId: string): Promise<void> {
  const response = await fetch('/api/auth/passkey/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, credentialId })
  })
  
  if (!response.ok) {
    throw new Error('Failed to delete passkey')
  }
}

/**
 * Update passkey nickname
 */
export async function updatePasskeyNickname(
  userId: string,
  credentialId: string,
  nickname: string
): Promise<void> {
  const response = await fetch('/api/auth/passkey/update', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, credentialId, nickname })
  })
  
  if (!response.ok) {
    throw new Error('Failed to update passkey')
  }
}
