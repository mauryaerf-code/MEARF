import { NextResponse } from 'next/server';

// In-memory LRU cache
const pdfCache = new Map();
const MAX_CACHE_ITEMS = 10;

const BASE_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
};

// --- Helpers ---

function errorJson(message, status = 500) {
    return new NextResponse(JSON.stringify({ error: message }), {
        status,
        headers: { ...BASE_HEADERS, 'Content-Type': 'application/json' },
    });
}

function setCacheEntry(key, buffer) {
    if (pdfCache.size >= MAX_CACHE_ITEMS) {
        let oldestKey = null, oldestTime = Infinity;
        for (const [k, v] of pdfCache.entries()) {
            if (v.lastAccessed < oldestTime) { oldestTime = v.lastAccessed; oldestKey = k; }
        }
        if (oldestKey) pdfCache.delete(oldestKey);
    }
    pdfCache.set(key, { buffer, lastAccessed: Date.now() });
}

// Retry fetch with exponential backoff (up to maxRetries attempts)
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
    let lastErr;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const res = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) });
            if (res.ok || res.status === 206) return res;
            lastErr = new Error(`HTTP ${res.status}`);
        } catch (err) {
            lastErr = err;
        }
        if (attempt < maxRetries - 1) {
            await new Promise(r => setTimeout(r, 300 * (attempt + 1)));
        }
    }
    throw lastErr;
}

// Validate that buffer starts with PDF magic bytes (%PDF)
function isPdfBuffer(buffer) {
    return (
        buffer.length > 4 &&
        buffer[0] === 0x25 && // %
        buffer[1] === 0x50 && // P
        buffer[2] === 0x44 && // D
        buffer[3] === 0x46    // F
    );
}

// Build a range sub-response
function rangeResponse(buffer, clientRange, headers) {
    const totalSize = buffer.byteLength;
    const parts = clientRange.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10) || 0;
    const end = parts[1] ? Math.min(parseInt(parts[1], 10), totalSize - 1) : totalSize - 1;
    const chunk = buffer.subarray(start, end + 1);
    return new NextResponse(chunk, {
        status: 206,
        headers: {
            ...headers,
            'Content-Range': `bytes ${start}-${end}/${totalSize}`,
            'Content-Length': String(chunk.byteLength),
            'Accept-Ranges': 'bytes',
        },
    });
}

// --- Route Handlers ---

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: { ...BASE_HEADERS, 'Access-Control-Allow-Headers': 'Range, Content-Type, Accept' },
    });
}

// Lightweight availability check used by the client before mounting the iframe
export async function HEAD(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const url = searchParams.get('url');

    let fileId = id;
    if (!fileId && url) {
        const m = url.match(/(?:id=|\/d\/|d=)([a-zA-Z0-9_-]{25,})/);
        if (m) fileId = m[1];
    }

    if (!fileId && !url) return new NextResponse(null, { status: 400, headers: BASE_HEADERS });

    // If already cached, respond immediately
    const cacheKey = fileId || url;
    if (pdfCache.has(cacheKey)) {
        return new NextResponse(null, { status: 200, headers: BASE_HEADERS });
    }

    // Quick HEAD probe to Google Drive
    const targetUrl = fileId
        ? `https://drive.usercontent.google.com/download?id=${fileId}&export=download`
        : url;

    try {
        const res = await fetch(targetUrl, {
            method: 'HEAD',
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: AbortSignal.timeout(8000),
            redirect: 'follow',
        });
        return new NextResponse(null, { status: res.ok ? 200 : 503, headers: BASE_HEADERS });
    } catch {
        return new NextResponse(null, { status: 503, headers: BASE_HEADERS });
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const url = searchParams.get('url');
    const isDownload = searchParams.get('download') === '1';
    const filename = (searchParams.get('filename') || 'research-paper.pdf').replace(/[^a-zA-Z0-9_.-]/g, '_');

    let fileId = id;
    if (!fileId && url) {
        const m = url.match(/(?:id=|\/d\/|d=)([a-zA-Z0-9_-]{25,})/);
        if (m) fileId = m[1];
    }

    if (!fileId && !url) return errorJson('Missing PDF id or url', 400);

    const cacheKey = fileId || url;
    const clientRange = request.headers.get('range');

    const pdfHeaders = {
        ...BASE_HEADERS,
        'Content-Type': 'application/pdf',
        'Content-Disposition': isDownload ? `attachment; filename="${filename}"` : `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    };

    // 1. Serve from cache (0ms latency)
    if (pdfCache.has(cacheKey)) {
        const cached = pdfCache.get(cacheKey);
        cached.lastAccessed = Date.now();
        const { buffer } = cached;
        if (clientRange) return rangeResponse(buffer, clientRange, pdfHeaders);
        return new NextResponse(buffer, {
            status: 200,
            headers: { ...pdfHeaders, 'Content-Length': String(buffer.byteLength), 'Accept-Ranges': 'bytes' },
        });
    }

    // 2. Fetch from Google Drive with retry across multiple endpoints
    try {
        const fetchHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/pdf,application/octet-stream,*/*',
        };

        const endpoints = fileId
            ? [
                `https://drive.usercontent.google.com/download?id=${fileId}&export=download`,
                `https://drive.google.com/uc?export=download&id=${fileId}`,
              ]
            : [url];

        let driveRes = null;
        for (const endpoint of endpoints) {
            try {
                driveRes = await fetchWithRetry(endpoint, { headers: fetchHeaders, redirect: 'follow' });
                if (driveRes && (driveRes.ok || driveRes.status === 206)) break;
            } catch { /* try next endpoint */ }
        }

        if (!driveRes || (!driveRes.ok && driveRes.status !== 206)) {
            return errorJson('Document source is temporarily unavailable. Please try again in a moment.', 503);
        }

        // Handle Google virus-scan confirm token
        const ct = driveRes.headers.get('content-type') || '';
        if (ct.includes('text/html') && fileId) {
            const html = await driveRes.text();
            const confirmMatch =
                html.match(/confirm=([0-9A-Za-z_-]+)/) ||
                html.match(/name="confirm" value="([^"]+)"/);

            if (confirmMatch) {
                try {
                    driveRes = await fetchWithRetry(
                        `https://drive.google.com/uc?export=download&id=${fileId}&confirm=${confirmMatch[1]}`,
                        { headers: fetchHeaders, redirect: 'follow' }
                    );
                } catch {
                    return errorJson('Unable to confirm document access. Please try again.', 503);
                }
            } else {
                // Got HTML without confirm token = file private or deleted
                return errorJson('This document is not publicly accessible. Please check file sharing settings.', 403);
            }
        }

        const arrayBuffer = await driveRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Validate it's actually a PDF (magic bytes check)
        if (!isPdfBuffer(buffer)) {
            return errorJson('The document could not be loaded. It may have been moved or deleted.', 422);
        }

        setCacheEntry(cacheKey, buffer);

        if (clientRange) return rangeResponse(buffer, clientRange, pdfHeaders);
        return new NextResponse(buffer, {
            status: 200,
            headers: { ...pdfHeaders, 'Content-Length': String(buffer.byteLength), 'Accept-Ranges': 'bytes' },
        });

    } catch (err) {
        const isTimeout = err?.name === 'TimeoutError' || err?.message?.includes('timeout');
        return errorJson(
            isTimeout
                ? 'Request timed out while loading the document. Please try again.'
                : 'Server is temporarily busy. Please try again in a moment.',
            503
        );
    }
}
