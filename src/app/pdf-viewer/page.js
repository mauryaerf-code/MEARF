'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getEmbedDriveUrl } from '@/lib/pdfHelper';

function PdfViewerInner() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const fileUrl = searchParams.get('file') || searchParams.get('url') || '';
    const title = searchParams.get('title') || 'Research Paper Preview';
    const author = searchParams.get('author') || '';
    const journal = searchParams.get('journal') || 'Academic Journal';
    const fromUrl = searchParams.get('from') || '';

    const [isLoading, setIsLoading] = useState(true);
    const embedUrl = getEmbedDriveUrl(fileUrl);

    useEffect(() => {
        // Fast safety timer: hide loader after 1.2s so mobile users are never stuck on spinner
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, [fileUrl]);

    const handleBack = () => {
        if (fromUrl) {
            router.push(fromUrl);
            return;
        }
        if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
        } else {
            router.push('/journals');
        }
    };

    if (!fileUrl) {
        return (
            <div className="section pdf-viewer-empty-state">
                <div className="container" style={{ textAlign: 'center', maxWidth: '580px', padding: '40px 20px' }}>
                    <div className="pdf-empty-icon">
                        <i className="far fa-file-pdf"></i>
                    </div>
                    <h2 style={{ marginBottom: '12px', color: 'var(--primary-dark)', fontSize: '1.6rem' }}>No Document Selected</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '25px', lineHeight: '1.7', fontSize: '0.95rem' }}>
                        No research paper link was provided. Please choose a publication from one of our indexed academic journals.
                    </p>
                    <button type="button" onClick={handleBack} className="btn btn-primary" style={{ padding: '10px 22px' }}>
                        <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> Return to Journal
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pdf-viewer-page">
            {/* Speed optimization: Preconnect to Google Drive edge servers */}
            <link rel="preconnect" href="https://drive.google.com" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="https://drive.google.com" />

            {/* Top Toolbar / Header */}
            <div className="pdf-viewer-toolbar">
                <div className="pdf-toolbar-inner">
                    
                    {/* Left: Back button & Journal Badge */}
                    <div className="pdf-toolbar-left">
                        <button 
                            type="button" 
                            onClick={handleBack} 
                            className="btn btn-outline btn-sm pdf-btn-back"
                            title="Go back to journal"
                            aria-label="Go back to journal"
                        >
                            <i className="fas fa-arrow-left"></i>
                            <span className="pdf-btn-label">Back</span>
                        </button>
                        <span className="badge badge-primary pdf-badge-journal" style={{ textTransform: 'none' }}>
                            <i className="fas fa-bookmark" style={{ marginRight: '5px', fontSize: '0.75rem' }}></i>
                            {journal}
                        </span>
                    </div>

                    {/* Center / Right: Paper Title & Author in Single Row */}
                    <div className="pdf-toolbar-center">
                        <span className="pdf-viewer-doc-title" title={title}>
                            {title}
                        </span>
                        {author && (
                            <span className="pdf-viewer-doc-author" title={author}>
                                <span className="pdf-doc-sep">•</span>
                                <i className="far fa-user" style={{ marginRight: '3px' }}></i>
                                {author}
                            </span>
                        )}
                    </div>

                </div>
            </div>

            {/* Embedded Viewer Canvas */}
            <div className="pdf-viewer-canvas">
                {isLoading && (
                    <div className="pdf-viewer-loader">
                        <div className="pdf-spinner"></div>
                        <p style={{ marginTop: '14px', color: '#fff', fontSize: '0.88rem', fontWeight: '500' }}>
                            Loading research document...
                        </p>
                    </div>
                )}

                <iframe
                    src={embedUrl}
                    title={title}
                    className="pdf-iframe"
                    onLoad={() => setIsLoading(false)}
                    loading="eager"
                    allow="autoplay"
                />
            </div>
        </div>
    );
}

export default function PdfViewerPage() {
    return (
        <Suspense fallback={
            <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="pdf-spinner" style={{ borderColor: 'var(--primary) transparent var(--primary) transparent' }}></div>
                    <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading reader...</p>
                </div>
            </div>
        }>
            <PdfViewerInner />
        </Suspense>
    );
}
