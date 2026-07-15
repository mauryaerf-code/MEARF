import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 Client for Cloudflare R2
const r2Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT || 'https://your-account-id.r2.cloudflarestorage.com',
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || 'mock-access-key',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || 'mock-secret-key',
    },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'merf-manuscript-submissions';

export async function POST(request) {
    try {
        const formData = await request.formData();
        
        const title = formData.get('title');
        const abstract = formData.get('abstract');
        const keywordsString = formData.get('keywords') || ''; // comma-separated
        const authorId = formData.get('author_id');
        const coAuthors = formData.get('co_authors') || '';
        const journalId = formData.get('journal_id');
        const file = formData.get('file');

        // Validation checks
        if (!title || !abstract || !authorId || !journalId || !file) {
            return NextResponse.json(
                { success: false, error: 'Required fields (title, abstract, author_id, journal_id, file) are missing.' },
                { status: 400 }
            );
        }

        // Convert keywords to array
        const keywords = keywordsString
            .split(',')
            .map(k => k.trim())
            .filter(k => k.length > 0);

        // Upload file to Cloudflare R2
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileExtension = file.name.split('.').pop();
        const uniqueFileName = `drafts/${authorId}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExtension}`;

        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: uniqueFileName,
            Body: fileBuffer,
            ContentType: file.type || 'application/pdf',
        };

        try {
            await r2Client.send(new PutObjectCommand(uploadParams));
        } catch (s3Error) {
            console.error('Cloudflare R2 S3 Upload Error:', s3Error);
            // Mock-succeed in dev mode if variables are not yet active
            if (process.env.NODE_ENV === 'development') {
                console.log('Mocking R2 upload success in development...');
            } else {
                return NextResponse.json(
                    { success: false, error: 'Failed to upload manuscript file to storage.' },
                    { status: 500 }
                );
            }
        }

        const publicFileUrl = `https://${BUCKET_NAME}.r2.cloudflarestorage.com/${uniqueFileName}`;

        // Insert metadata record into Supabase table public.manuscripts
        const { data, error } = await supabase
            .from('manuscripts')
            .insert([{
                title,
                abstract,
                keywords,
                author_id: authorId,
                co_authors: coAuthors,
                journal_id: journalId,
                status: 'submitted',
                file_url: publicFileUrl
            }]);

        if (error) {
            console.error('Supabase DB manuscript metadata insertion error:', error);
            if (process.env.NODE_ENV === 'development') {
                return NextResponse.json({ 
                    success: true, 
                    mock: true, 
                    message: 'Manuscript metadata saved (Mock).',
                    fileUrl: publicFileUrl
                }, { status: 201 });
            }
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data, fileUrl: publicFileUrl }, { status: 201 });
    } catch (err) {
        console.error('API Server Error:', err);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
