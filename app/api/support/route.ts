import { NextRequest, NextResponse } from 'next/server';
import { sendSupportEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, section, email } = body;

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Send email (fire and forget functionality or await depending on preference for error handling)
        // Here we await to ensure it's sent before returning success
        await sendSupportEmail(message, section || 'general', email);

        return NextResponse.json({ success: true, message: 'Message forwarded successfully' });

    } catch (error: any) {
        console.error('[API] Support route error:', error);
        return NextResponse.json(
            { error: 'Failed to process support request' }, 
            { status: 500 }
        );
    }
}
