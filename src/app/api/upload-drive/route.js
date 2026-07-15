import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const folderId = formData.get('folderId');

        if (!file || !folderId) {
            return NextResponse.json({ error: 'File and folderId are required fields.' }, { status: 400 });
        }

        let clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        let privateKey = process.env.GOOGLE_PRIVATE_KEY;

        // Check if api.json exists at project root to read credentials automatically
        try {
            const fs = require('fs');
            const path = require('path');
            const apiJsonPath = path.join(process.cwd(), 'api.json');
            if (fs.existsSync(apiJsonPath)) {
                const apiData = JSON.parse(fs.readFileSync(apiJsonPath, 'utf8'));
                if (apiData.client_email && apiData.private_key) {
                    clientEmail = apiData.client_email;
                    privateKey = apiData.private_key;
                }
            }
        } catch (e) {
            console.warn('Failed to parse api.json credentials:', e.message);
        }

        // Fallback to simulated upload if credentials are not configured
        if (!clientEmail || !privateKey) {
            console.warn('Google Service Account credentials missing. Falling back to simulated Google Drive upload.');
            
            // Generate a simulated file ID using the folderId
            const fileId = `${folderId}_sim_${Math.random().toString(36).substring(2, 12)}`;
            const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
            const driveUrl = isPdf
                ? `https://drive.google.com/file/d/${fileId}/view`
                : `https://drive.google.com/uc?export=view&id=${fileId}`;

            // Return simulated success response
            return NextResponse.json({
                success: true,
                simulated: true,
                fileId: fileId,
                url: driveUrl,
                message: 'Simulated upload successful (Configure GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY for real uploads).'
            });
        }

        let drive;
        let isOAuthConnected = false;

        // 1. Check if we have oauth.json and tokens.json saved locally (Bypasses Service Account storage quota error)
        try {
            const fs = require('fs');
            const path = require('path');
            const oauthJsonPath = path.join(process.cwd(), 'oauth.json');
            const tokensPath = path.join(process.cwd(), 'tokens.json');

            if (fs.existsSync(oauthJsonPath) && fs.existsSync(tokensPath)) {
                const oauthData = JSON.parse(fs.readFileSync(oauthJsonPath, 'utf8'));
                const tokensData = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

                if (oauthData.client_id && oauthData.client_secret && tokensData.refresh_token) {
                    const oauth2Client = new google.auth.OAuth2(
                        oauthData.client_id,
                        oauthData.client_secret,
                        'http://localhost:3000/admin'
                    );
                    oauth2Client.setCredentials({ refresh_token: tokensData.refresh_token });
                    drive = google.drive({ version: 'v3', auth: oauth2Client });
                    isOAuthConnected = true;
                }
            }
        } catch (e) {
            console.warn('Failed to parse local OAuth/tokens.json configuration:', e.message);
        }

        // 2. Check if OAuth2 credentials are provided via environment variables
        if (!isOAuthConnected) {
            const clientId = process.env.GOOGLE_CLIENT_ID;
            const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
            const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

            if (clientId && clientSecret && refreshToken) {
                const oauth2Client = new google.auth.OAuth2(
                    clientId,
                    clientSecret,
                    'https://developers.google.com/oauthplayground'
                );
                oauth2Client.setCredentials({ refresh_token: refreshToken });
                drive = google.drive({ version: 'v3', auth: oauth2Client });
                isOAuthConnected = true;
            }
        }

        // 3. Fallback to Service Account credentials if OAuth not active
        if (!isOAuthConnected) {
            // Authenticate Google Client using Service Account credentials
            const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
            const auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: clientEmail,
                    private_key: formattedPrivateKey
                },
                scopes: ['https://www.googleapis.com/auth/drive']
            });
            drive = google.drive({ version: 'v3', auth });
        }

        // Read file contents as Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Define file metadata and media stream
        const fileMetadata = {
            name: file.name,
            parents: [folderId]
        };
        const media = {
            mimeType: file.type,
            body: Readable.from(buffer)
        };

        // Create file in targeted Google Drive folder
        const driveResponse = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id'
        });

        const fileId = driveResponse.data.id;

        // Set permissions to reader for anyone (Public Link Sharing)
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });

        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        const publicUrl = isPdf
            ? `https://drive.google.com/file/d/${fileId}/view`
            : `https://drive.google.com/uc?export=view&id=${fileId}`;

        return NextResponse.json({
            success: true,
            simulated: false,
            fileId: fileId,
            url: publicUrl
        });

    } catch (error) {
        console.error('Google Drive Upload Error:', error);
        return NextResponse.json({ error: error.message || 'Error occurred during Google Drive upload.' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { fileId } = await request.json();

        if (!fileId) {
            return NextResponse.json({ error: 'fileId is a required parameter.' }, { status: 400 });
        }

        let clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        let privateKey = process.env.GOOGLE_PRIVATE_KEY;

        // Check if api.json exists to load service account credentials automatically
        try {
            const fs = require('fs');
            const path = require('path');
            const apiJsonPath = path.join(process.cwd(), 'api.json');
            if (fs.existsSync(apiJsonPath)) {
                const apiData = JSON.parse(fs.readFileSync(apiJsonPath, 'utf8'));
                if (apiData.client_email && apiData.private_key) {
                    clientEmail = apiData.client_email;
                    privateKey = apiData.private_key;
                }
            }
        } catch (e) {
            console.warn('Failed to parse api.json credentials:', e.message);
        }

        const hasServiceAccount = clientEmail && privateKey;
        const fs = require('fs');
        const path = require('path');
        const oauthJsonPath = path.join(process.cwd(), 'oauth.json');
        const tokensPath = path.join(process.cwd(), 'tokens.json');
        const hasLocalOAuth = fs.existsSync(oauthJsonPath) && fs.existsSync(tokensPath);
        const hasEnvOAuth = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN;

        if (!hasServiceAccount && !hasLocalOAuth && !hasEnvOAuth) {
            console.warn('Google Credentials missing. Simulating delete.');
            return NextResponse.json({ success: true, simulated: true, message: 'Simulated delete successful.' });
        }

        let drive;
        let isOAuthConnected = false;

        // 1. Check local OAuth config first
        if (hasLocalOAuth) {
            try {
                const oauthData = JSON.parse(fs.readFileSync(oauthJsonPath, 'utf8'));
                const tokensData = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

                if (oauthData.client_id && oauthData.client_secret && tokensData.refresh_token) {
                    const oauth2Client = new google.auth.OAuth2(
                        oauthData.client_id,
                        oauthData.client_secret,
                        'http://localhost:3000/admin'
                    );
                    oauth2Client.setCredentials({ refresh_token: tokensData.refresh_token });
                    drive = google.drive({ version: 'v3', auth: oauth2Client });
                    isOAuthConnected = true;
                }
            } catch (e) {
                console.warn('Failed to parse local OAuth/tokens.json config:', e.message);
            }
        }

        // 2. Check environment OAuth next
        if (!isOAuthConnected && hasEnvOAuth) {
            const oauth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                'https://developers.google.com/oauthplayground'
            );
            oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
            drive = google.drive({ version: 'v3', auth: oauth2Client });
            isOAuthConnected = true;
        }

        // 3. Fallback to Service Account
        if (!isOAuthConnected && hasServiceAccount) {
            const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
            const auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: clientEmail,
                    private_key: formattedPrivateKey
                },
                scopes: ['https://www.googleapis.com/auth/drive']
            });
            drive = google.drive({ version: 'v3', auth });
        }

        // Perform Google Drive delete operation
        await drive.files.delete({
            fileId: fileId
        });

        return NextResponse.json({ success: true, message: `File ${fileId} successfully deleted from Google Drive.` });

    } catch (error) {
        console.error('Google Drive Delete Error:', error);
        return NextResponse.json({ error: error.message || 'Error occurred during Google Drive deletion.' }, { status: 500 });
    }
}

