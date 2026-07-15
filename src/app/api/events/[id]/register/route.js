import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request, { params }) {
    try {
        const { id: eventId } = await params;
        const body = await request.json();
        const { participant_name, participant_email, participant_phone, institution } = body;

        // Validation check
        if (!participant_name || !participant_email || !participant_phone || !institution) {
            return NextResponse.json(
                { success: false, error: 'All fields (participant_name, participant_email, participant_phone, institution) are required.' },
                { status: 400 }
            );
        }

        // Insert into Supabase table public.event_registrations
        const { data, error } = await supabase
            .from('event_registrations')
            .insert([{ 
                event_id: eventId, 
                participant_name, 
                participant_email, 
                participant_phone, 
                institution 
            }]);

        if (error) {
            console.error('Supabase DB registration error:', error);
            // Mock-succeed in dev mode
            if (process.env.NODE_ENV === 'development') {
                return NextResponse.json({ success: true, mock: true, message: 'Mock registration success in development mode.' });
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
