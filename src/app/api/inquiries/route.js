import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Validation check
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { success: false, error: 'All fields (name, email, subject, message) are required.' },
                { status: 400 }
            );
        }

        // Insert into Supabase table public.inquiries
        const { data, error } = await supabase
            .from('inquiries')
            .insert([{ name, email, subject, message }]);

        if (error) {
            console.error('Supabase DB insertion error:', error);
            // Even if DB is not configured, we mock-succeed during local offline development/testing
            if (process.env.NODE_ENV === 'development') {
                return NextResponse.json({ success: true, mock: true, message: 'Mock success in development mode.' });
            }
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data }, { status: 201 });
    } catch (err) {
        console.error('API Server Error:', err);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
