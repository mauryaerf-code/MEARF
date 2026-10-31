import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const url = searchParams.get('url');

    let fileId = id;
    if (!fileId && url) {
        const match = url.match(/(?:id=|\/d\/|d=)([a-zA-Z0-9_-]{25,})/);
        if (match && match[1]) fileId = match[1];
    }

    if (!fileId) {
        return new NextResponse('Missing image id', { status: 400 });
    }

    try {
        // Attempt 1: Google CDN direct content URL
        let response = await fetch(`https://lh3.googleusercontent.com/d/${fileId}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        // Attempt 2: Google Drive thumbnail endpoint
        if (!response.ok) {
            response = await fetch(`https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
        }

        // Attempt 3: Google Drive uc export endpoint
        if (!response.ok) {
            response = await fetch(`https://drive.google.com/uc?export=view&id=${fileId}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
        }

        if (!response.ok) {
            return new NextResponse('Failed to load image from Drive', { status: response.status });
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const buffer = await response.arrayBuffer();

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800'
            }
        });
    } catch (err) {
        return new NextResponse(`Proxy error: ${err.message}`, { status: 500 });
    }
}
