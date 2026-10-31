import { NextResponse } from 'next/server';

// In-memory cache for instant subsequent chunks and page requests
const pdfCache = new Map();
const MAX_CACHE_ITEMS = 8;

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const url = searchParams.get('url');

    let fileId = id;
    if (!fileId && url) {
        const match = url.match(/(?:id=|\/d\/|d=)([a-zA-Z0-9_-]{25,})/);
        if (match && match[1]) fileId = match[1];
    }

    if (!fileId && !url) {
        return new NextResponse('Missing PDF id or url', { status: 400 });
    }

    const cacheKey = fileId || url;
    const clientRange = request.headers.get('range');

    // 1. Fast path: Serve from memory cache if available (0ms latency)
    if (pdfCache.has(cacheKey)) {
        const cached = pdfCache.get(cacheKey);
        cached.lastAccessed = Date.now();
        const buffer = cached.buffer;
        const totalSize = buffer.byteLength;

        if (clientRange) {
            const parts = clientRange.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10) || 0;
            const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
            const chunk = buffer.subarray(start, end + 1);

            return new NextResponse(chunk, {
                status: 206,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Range': `bytes ${start}-${end}/${totalSize}`,
                    'Content-Length': String(chunk.byteLength),
                    'Accept-Ranges': 'bytes',
                    'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
                }
            });
        }

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Length': String(totalSize),
                'Accept-Ranges': 'bytes',
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
            }
        });
    }

    // 2. Fetch from source: Direct drive.usercontent endpoint bypasses redirect hops
    try {
        let targetUrl = '';
        if (fileId) {
            targetUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download`;
        } else {
            targetUrl = url;
        }

        const fetchHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        };

        let driveRes = await fetch(targetUrl, {
            headers: fetchHeaders,
            redirect: 'follow'
        });

        // Fallback to uc endpoint if usercontent returns an error
        if (!driveRes.ok && driveRes.status !== 206 && fileId) {
            driveRes = await fetch(`https://drive.google.com/uc?export=download&id=${fileId}`, {
                headers: fetchHeaders,
                redirect: 'follow'
            });
        }

        // Handle Google virus scan confirm token if needed
        const contentType = driveRes.headers.get('content-type') || '';
        if (contentType.includes('text/html') && fileId) {
            const htmlText = await driveRes.text();
            const confirmMatch = htmlText.match(/confirm=([0-9A-Za-z_-]+)/) || htmlText.match(/name="confirm" value="([^"]+)"/);
            if (confirmMatch) {
                const confirmToken = confirmMatch[1];
                driveRes = await fetch(`https://drive.google.com/uc?export=download&id=${fileId}&confirm=${confirmToken}`, {
                    headers: fetchHeaders,
                    redirect: 'follow'
                });
            }
        }

        if (!driveRes.ok && driveRes.status !== 206) {
            return new NextResponse('Failed to load PDF from source', { status: driveRes.status });
        }

        const arrayBuffer = await driveRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Maintain LRU cache
        if (pdfCache.size >= MAX_CACHE_ITEMS) {
            let oldestKey = null;
            let oldestTime = Infinity;
            for (const [k, v] of pdfCache.entries()) {
                if (v.lastAccessed < oldestTime) {
                    oldestTime = v.lastAccessed;
                    oldestKey = k;
                }
            }
            if (oldestKey) pdfCache.delete(oldestKey);
        }

        pdfCache.set(cacheKey, {
            buffer,
            contentType: 'application/pdf',
            lastAccessed: Date.now()
        });

        const totalSize = buffer.byteLength;

        if (clientRange) {
            const parts = clientRange.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10) || 0;
            const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
            const chunk = buffer.subarray(start, end + 1);

            return new NextResponse(chunk, {
                status: 206,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Range': `bytes ${start}-${end}/${totalSize}`,
                    'Content-Length': String(chunk.byteLength),
                    'Accept-Ranges': 'bytes',
                    'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
                }
            });
        }

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Length': String(totalSize),
                'Accept-Ranges': 'bytes',
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
            }
        });
    } catch (err) {
        return new NextResponse(`PDF proxy error: ${err.message}`, { status: 500 });
    }
}
