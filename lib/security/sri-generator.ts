/**
 * Subresource Integrity (SRI) Generator
 * 
 * Generates and verifies integrity hashes for external resources
 * to prevent CDN tampering and supply chain attacks
 */

import crypto from 'crypto';

export type HashAlgorithm = 'sha256' | 'sha384' | 'sha512';

export interface SRIHash {
  algorithm: HashAlgorithm;
  hash: string;
  integrity: string; // Full integrity attribute value
}

/**
 * Generates SRI hash for a given content
 * 
 * @param content - The content to hash (script/stylesheet)
 * @param algorithm - Hash algorithm (default: sha384, recommended by W3C)
 */
export function generateSRIHash(
  content: string | Buffer,
  algorithm: HashAlgorithm = 'sha384'
): SRIHash {
  const hash = crypto
    .createHash(algorithm)
    .update(content)
    .digest('base64');
    
  return {
    algorithm,
    hash,
    integrity: `${algorithm}-${hash}`
  };
}

/**
 * Generates multiple SRI hashes for fallback
 */
export function generateMultipleSRIHashes(
  content: string | Buffer
): string {
  const sha256 = generateSRIHash(content, 'sha256');
  const sha384 = generateSRIHash(content, 'sha384');
  const sha512 = generateSRIHash(content, 'sha512');
  
  return `${sha384.integrity} ${sha512.integrity}`;
}

/**
 * Fetches a resource and generates its SRI hash
 */
export async function fetchAndGenerateSRI(
  url: string,
  algorithm: HashAlgorithm = 'sha384'
): Promise<SRIHash> {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  
  const content = await response.text();
  return generateSRIHash(content, algorithm);
}

/**
 * Verifies content against SRI hash
 */
export function verifySRI(
  content: string | Buffer,
  expectedIntegrity: string
): boolean {
  const [algorithm, expectedHash] = expectedIntegrity.split('-') as [HashAlgorithm, string];
  
  if (!algorithm || !expectedHash) {
    return false;
  }
  
  const computed = generateSRIHash(content, algorithm);
  return computed.hash === expectedHash;
}

/**
 * Common CDN resources with pre-generated SRI hashes
 */
export const KNOWN_SRI_HASHES = {
  // Lottie Player
  'https://cdn.jsdelivr.net/npm/@dotlottie/player-component@latest/dist/dotlottie-player.mjs': {
    sha384: 'sha384-...' // Update with actual hash
  }
} as const;

/**
 * Generates script tag with SRI
 */
export function createSecureScriptTag(
  src: string,
  integrity?: string,
  crossorigin: 'anonymous' | 'use-credentials' = 'anonymous'
): string {
  const integrityAttr = integrity ? ` integrity="${integrity}"` : '';
  return `<script src="${src}"${integrityAttr} crossorigin="${crossorigin}"></script>`;
}

/**
 * Generates link tag with SRI for stylesheets
 */
export function createSecureLinkTag(
  href: string,
  integrity?: string,
  crossorigin: 'anonymous' | 'use-credentials' = 'anonymous'
): string {
  const integrityAttr = integrity ? ` integrity="${integrity}"` : '';
  return `<link rel="stylesheet" href="${href}"${integrityAttr} crossorigin="${crossorigin}">`;
}
