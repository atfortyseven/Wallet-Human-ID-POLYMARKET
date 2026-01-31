import { Resend } from 'resend';

// Provide a dummy key for build-time safety if env is missing
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

/**
 * Send verification code email with retry logic
 */
export async function sendVerificationEmail(email: string, code: string): Promise<void> {
  const MAX_RETRIES = 3;
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await resend.emails.send({
        from: 'HumanDefi <noreply@humanidfi.com>',
        to: email,
        subject: 'Your HumanDefi Verification Code',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5dc;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #000000;">HumanDefi</h1>
                        <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">Decentralized Identity Protocol</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 20px 40px;">
                        <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #000000;">Verification Code</h2>
                        <p style="margin: 0 0 20px; font-size: 16px; color: #333333; line-height: 1.5;">
                          Your verification code is:
                        </p>
                        <div style="background-color: #f3f4f6; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0;">
                          <div style="font-size: 48px; font-weight: 700; letter-spacing: 8px; color: #2563eb; font-family: 'Courier New', monospace;">
                            ${code}
                          </div>
                        </div>
                        <p style="margin: 20px 0 0; font-size: 14px; color: #666666; line-height: 1.5;">
                          This code will expire in <strong>5 minutes</strong>. If you didn't request this code, please ignore this email.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; font-size: 12px; color: #999999;">
                          © ${new Date().getFullYear()} HumanDefi. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      });
      
      console.log(`[Email] ✓ Verification code sent to ${email} (attempt ${attempt})`, result.data ? { id: result.data.id } : {});
      return; // Success!
      
    } catch (error: any) {
      lastError = error;
      console.error(`[Email] ✗ Attempt ${attempt}/${MAX_RETRIES} failed for ${email}:`, error?.message || error);
      
      // Don't retry on certain errors (invalid email, etc)
      if (error?.message?.includes('Invalid') || error?.message?.includes('not found') || error?.statusCode === 422) {
        throw new Error(`Email sending failed: ${error?.message || 'Invalid email address'}`);
      }
      
      // Wait before retry (exponential backoff: 1s, 2s, 3s)
      if (attempt < MAX_RETRIES) {
        const backoffMs = 1000 * attempt;
        console.log(`[Email] Retrying in ${backoffMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
    }
  }
  
  throw new Error(`Email sending failed after ${MAX_RETRIES} attempts: ${lastError?.message || 'Unknown error'}`);
}

/**
 * Send welcome email to new subscribers
 */
export async function sendWelcomeEmail(email: string, name?: string): Promise<void> {
  try {
    await resend.emails.send({
      from: 'HumanDefi <noreply@humanidfi.com>',
      to: email,
      subject: 'Welcome to the Human Upgrade',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; color: #ffffff;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #111111; border: 1px solid #333; border-radius: 16px; box-shadow: 0 0 20px rgba(0, 242, 234, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #222;">
                      <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -1px;">Human<span style="color: #00f2ea;">ID</span>.fi</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px; font-size: 22px; font-weight: 600; color: #ffffff;">Welcome ${name ? `, ${name}` : 'Human'},</h2>
                      <p style="margin: 0 0 20px; font-size: 16px; color: #aaaaaa; line-height: 1.6;">
                        You have successfully subscribed to the HumanDefi intelligence feed. You will now receive:
                      </p>
                      <ul style="color: #cccccc; line-height: 1.8; margin-bottom: 30px;">
                        <li>🚀 Early access to protocol upgrades</li>
                        <li>📊 Monthly yield & governance reports</li>
                        <li>🔒 Security alerts and best practices</li>
                      </ul>
                      
                      <div style="text-align: center; margin: 40px 0;">
                        <a href="https://humanidfi.com" style="background-color: #00f2ea; color: #000000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Access Dashboard</a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px; text-align: center; border-top: 1px solid #222; background-color: #0a0a0a; border-radius: 0 0 16px 16px;">
                      <p style="margin: 0; font-size: 12px; color: #555555;">
                        You received this because you subscribed at humanidfi.com.<br>
                        <a href="#" style="color: #777; text-decoration: underline;">Unsubscribe</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw, just log
  }
}

/**
 * Send support message to admin
 */
export async function sendSupportEmail(message: string, section: string, senderEmail?: string): Promise<void> {
  const adminEmail = 'josejordan20222@gmail.com';
  
  try {
    const result = await resend.emails.send({
      from: 'HumanDefi Support <noreply@humanidfi.com>',
      to: adminEmail,
      replyTo: senderEmail || 'noreply@humanidfi.com',
      subject: `[Support - ${section.toUpperCase()}] New Message from The Void`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .meta { color: #666; font-size: 0.9em; margin-bottom: 20px; }
            .message { background: #f9f9f9; padding: 20px; border-left: 4px solid #333; font-size: 1.1em; white-space: pre-wrap; }
            .footer { margin-top: 30px; font-size: 0.8em; color: #888; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Support Message</h2>
            </div>
            
            <div class="meta">
              <p><strong>Category:</strong> ${section.toUpperCase()}</p>
              <p><strong>From:</strong> ${senderEmail || 'Anonymous User'}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <div class="message">
              ${message}
            </div>

            <div class="footer">
              <p>Sent via HumanDefi Support Interface</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log(`[Email] Support message forwarded to ${adminEmail}`, result.data ? { id: result.data.id } : {});
    
  } catch (error: any) {
    console.error(`[Email] Failed to forward support message:`, error?.message || error);
    throw new Error(`Support email failed: ${error?.message || 'Unknown error'}`);
  }
}
