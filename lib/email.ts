import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send verification code email
 */
export async function sendVerificationEmail(email: string, code: string): Promise<void> {
  try {
    await resend.emails.send({
      from: 'HumanDefi <noreply@humanid.fi>',
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
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
}
