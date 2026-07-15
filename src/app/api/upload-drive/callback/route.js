import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
    try {
        const { code } = await request.json();
        if (!code) {
            return NextResponse.json({ error: 'Authorization code is required.' }, { status: 400 });
        }

        // Read Client credentials from oauth.json
        const oauthJsonPath = path.join(process.cwd(), 'oauth.json');
        if (!fs.existsSync(oauthJsonPath)) {
            return NextResponse.json({ error: 'oauth.json file is missing on the server.' }, { status: 500 });
        }

        const oauthData = JSON.parse(fs.readFileSync(oauthJsonPath, 'utf8'));
        const { client_id, client_secret } = oauthData;

        if (!client_id || !client_secret) {
            return NextResponse.json({ error: 'client_id and client_secret must be set in oauth.json.' }, { status: 500 });
        }

        // Initialize OAuth client
        const oauth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            'http://localhost:3000/admin'
        );

        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        
        // Ensure we preserve the refresh_token if Google does not return it on re-consent
        if (!tokens.refresh_token) {
            const tokensPath = path.join(process.cwd(), 'tokens.json');
            if (fs.existsSync(tokensPath)) {
                try {
                    const existing = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
                    if (existing.refresh_token) {
                        tokens.refresh_token = existing.refresh_token;
                    }
                } catch (e) {
                    console.warn('Failed to parse existing tokens.json:', e.message);
                }
            }
        }

        if (!tokens.refresh_token) {
            return NextResponse.json({ 
                error: 'No refresh token was returned. Please go to your Google Account settings, remove access to this app, and authorize again to get a new refresh token.' 
            }, { status: 400 });
        }

        // Write tokens to tokens.json
        const tokensPath = path.join(process.cwd(), 'tokens.json');
        fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2), 'utf8');

        return NextResponse.json({ success: true, message: 'Google Drive authorization successful!' });

    } catch (error) {
        console.error('Google OAuth Exchange Error:', error);
        return NextResponse.json({ error: error.message || 'Error occurred during Google OAuth exchange.' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const tokensPath = path.join(process.cwd(), 'tokens.json');
        if (fs.existsSync(tokensPath)) {
            const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
            if (tokens.refresh_token) {
                return NextResponse.json({ authorized: true });
            }
        }
        return NextResponse.json({ authorized: false });
    } catch (e) {
        return NextResponse.json({ authorized: false });
    }
}
