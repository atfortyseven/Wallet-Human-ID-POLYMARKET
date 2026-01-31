import { headers } from 'next/headers';

/**
 * IP Geolocation Utility
 * Uses ipapi.co for free IP geolocation (150 requests/day on free tier)
 * Fallback to IP-API.com (45 requests/minute)
 */

export interface GeoLocation {
  country: string;
  city: string;
  latitude: number;
  longitude: number;
}

/**
 * Get client IP address from request headers
 */
export async function getClientIP(): Promise<string> {
  const headersList = await headers();
  
  // Try various headers in order of preference
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = headersList.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  const cfConnectingIP = headersList.get('cf-connecting-ip'); // Cloudflare
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to localhost (for development)
  return '127.0.0.1';
}

/**
 * Get location from IP address using ipapi.co
 */
async function getLocationFromIPAPI(ip: string): Promise<GeoLocation | null> {
  try {
    // Skip localhost/private IPs
    if (ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return {
        country: 'Local',
        city: 'Development',
        latitude: 0,
        longitude: 0
      };
    }

    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        'User-Agent': 'HumanDeFi/1.0'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('ipapi.co request failed');
    }

    const data = await response.json();
    
    // Check for rate limit error
    if (data.error) {
      console.warn('ipapi.co error:', data.reason);
      return null;
    }

    return {
      country: data.country_name || 'Unknown',
      city: data.city || 'Unknown',
      latitude: data.latitude || 0,
      longitude: data.longitude || 0
    };
  } catch (error) {
    console.error('Error fetching location from ipapi.co:', error);
    return null;
  }
}

/**
 * Get location from IP address using ip-api.com (fallback)
 */
async function getLocationFromIPAPIFallback(ip: string): Promise<GeoLocation | null> {
  try {
    // Skip localhost/private IPs
    if (ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return {
        country: 'Local',
        city: 'Development',
        latitude: 0,
        longitude: 0
      };
    }

    const response = await fetch(`http://ip-api.com/json/${ip}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('ip-api.com request failed');
    }

    const data = await response.json();

    if (data.status === 'fail') {
      console.warn('ip-api.com error:', data.message);
      return null;
    }

    return {
      country: data.country || 'Unknown',
      city: data.city || 'Unknown',
      latitude: data.lat || 0,
      longitude: data.lon || 0
    };
  } catch (error) {
    console.error('Error fetching location from ip-api.com:', error);
    return null;
  }
}

/**
 * Get location from IP address with automatic fallback
 */
export async function getLocationFromIP(ip: string): Promise<GeoLocation> {
  // Try primary service
  let location = await getLocationFromIPAPI(ip);
  
  // Fallback to secondary service if primary fails
  if (!location) {
    location = await getLocationFromIPAPIFallback(ip);
  }
  
  // Ultimate fallback
  if (!location) {
    return {
      country: 'Unknown',
      city: 'Unknown',
      latitude: 0,
      longitude: 0
    };
  }
  
  return location;
}

/**
 * Parse User-Agent string to extract device, browser, and OS information
 */
export interface DeviceInfo {
  deviceType: string;
  browser: string;
  os: string;
}

export function parseUserAgent(userAgent: string): DeviceInfo {
  const ua = userAgent.toLowerCase();
  
  // Detect device type
  let deviceType = 'desktop';
  if (/mobile|android|iphone|ipad|ipod/.test(ua)) {
    if (/ipad|tablet/.test(ua)) {
      deviceType = 'tablet';
    } else {
      deviceType = 'mobile';
    }
  }
  
  // Detect browser
  let browser = 'Unknown';
  if (ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('opr/') || ua.includes('opera')) browser = 'Opera';
  else if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari')) browser = 'Safari';
  
  // Extract browser version (optional enhancement)
  const match = ua.match(new RegExp(`${browser.toLowerCase()}\\/([\\d.]+)`));
  if (match) {
    browser += ` ${match[1].split('.')[0]}`;
  }
  
  // Detect OS
  let os = 'Unknown';
  if (ua.includes('win')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  return {
    deviceType,
    browser,
    os
  };
}
