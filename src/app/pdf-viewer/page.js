'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getProxyPdfUrl } from '@/lib/pdfHelper';

// ─── Error / Busy page shown instead of "Content Blocked" ────────────────────
function PdfErrorPage({ errorCode, onRetry, onBack, retryIn, journal }) {
    const isBusy = errorCode === 503 || errorCode === 0; // 0 = network/timeout
    const isForbidden = errorCode === 403;

    return (
        <div className="pdf-error-page">
            <div className="pdf-error-card">
                {/* Icon */}
                <div className={`pdf-error-icon-wrap ${isBusy ? 'pdf-error-icon-busy' : 'pdf-error-icon-warn'}`}>
                    <i className={`fas ${isBusy ? 'fa-server' : isForbidden ? 'fa-lock' : 'fa-exclamation-triangle'}`}></i>
                </div>

                {/* Title */}
                <h2 className="pdf-error-title">
                    {isBusy ? 'Server is Temporarily Busy' : isForbidden ? 'Access Restricted' : 'Unable to Load Document'}
                </h2>

                {/* Description */}
                <p className="pdf-error-desc">
                    {isBusy
                        ? "Our server is currently processing multiple requests. Your document will be available shortly — please wait a moment and try again."
                        : isForbidden
                        ? "This document's access permissions may have changed. Please contact the journal administrator."
                        : "The document could not be loaded at this time. This may be a temporary network issue."}
                </p>

                {/* Journal badge */}
                {journal && (
                    <div className="pdf-error-journal-badge">
                        <i className="fas fa-bookmark"></i> {journal}
                    </div>
                )}

                {/* Auto-retry countdown */}
                {retryIn > 0 && (
                    <div className="pdf-error-countdown">
                        <div className="pdf-error-countdown-ring">
                            <span>{retryIn}</span>
                        </div>
                        <span className="pdf-error-countdown-label">Auto-retrying in {retryIn}s</span>
                    </div>
                )}

                {/* Actions */}
                <div className="pdf-error-actions">
                    {retryIn === 0 && (
                        <button type="button" onClick={onRetry} className="pdf-error-btn pdf-error-btn-primary">
                            <i className="fas fa-redo-alt"></i> Try Again
                        </button>
                    )}
                    <button type="button" onClick={onBack} className="pdf-error-btn pdf-error-btn-secondary">
                        <i className="fas fa-arrow-left"></i> Back to Journal
                    </button>
                </div>

                {/* Status info */}
                <p className="pdf-error-status-line">
                    <i className="fas fa-info-circle"></i>
                    {isBusy
                        ? 'Error code: 503 — Temporary server load. No action needed from you.'
                        : `Error code: ${errorCode || 'Network Error'}`}
                </p>
            </div>
        </div>
    );
}

// ─── Main viewer ─────────────────────────────────────────────────────────────
function PdfViewerInner() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const fileUrl  = searchParams.get('file')    || searchParams.get('url') || '';
    const title    = searchParams.get('title')   || 'Research Paper Preview';
    const author   = searchParams.get('author')  || '';
    const journal  = searchParams.get('journal') || 'Academic Journal';
    const fromUrl  = searchParams.get('from')    || '';

    // status: 'checking' | 'loading' | 'ready' | 'error'
    const [status,     setStatus]     = useState('checking');
    const [errorCode,  setErrorCode]  = useState(0);
    const [retryIn,    setRetryIn]    = useState(0);
    const [attempt,    setAttempt]    = useState(0);

    const timeoutRef      = useRef(null);
    const countdownRef    = useRef(null);

    const proxyBase = getProxyPdfUrl(fileUrl);
    // #toolbar=0&navpanes=0 hides Chrome's built-in PDF viewer toolbar
    const iframeSrc = proxyBase + '#toolbar=0&navpanes=0';

    const clearTimers = useCallback(() => {
        clearTimeout(timeoutRef.current);
        clearInterval(countdownRef.current);
    }, []);

    const startAutoRetry = useCallback((seconds) => {
        setRetryIn(seconds);
        countdownRef.current = setInterval(() => {
            setRetryIn(prev => {
                if (prev <= 1) {
                    clearInterval(countdownRef.current);
                    setAttempt(a => a + 1); // triggers re-check via useEffect
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    // Pre-flight HEAD check before mounting the iframe
    const checkAvailability = useCallback(async () => {
        if (!fileUrl) return;
        setStatus('checking');
        setRetryIn(0);
        clearTimers();

        try {
            const res = await fetch(proxyBase, {
                method: 'HEAD',
                cache: 'no-store',
                signal: AbortSignal.timeout(10000),
            });

            if (res.ok) {
                setStatus('loading');
                // Safety timeout: if iframe doesn't fire onLoad in 25s, consider it ready anyway
                timeoutRef.current = setTimeout(() => setStatus('ready'), 25000);
            } else {
                setErrorCode(res.status);
                setStatus('error');
                // Auto-retry on 503 (server busy) after 8s
                if (res.status === 503) startAutoRetry(8);
            }
        } catch (err) {
            const isTimeout = err?.name === 'TimeoutError';
            setErrorCode(isTimeout ? 408 : 0);
            setStatus('error');
            startAutoRetry(10);
        }
    }, [fileUrl, proxyBase, clearTimers, startAutoRetry]);

    useEffect(() => {
        checkAvailability();
        return clearTimers;
    }, [attempt, checkAvailability, clearTimers]);

    const handleIframeLoad = () => {
        clearTimers();
        setStatus('ready');
    };

    const handleRetry = () => {
        clearTimers();
        setRetryIn(0);
        setAttempt(a => a + 1);
    };

    const handleBack = () => {
        if (fromUrl) router.push(fromUrl);
        else if (typeof window !== 'undefined' && window.history.length > 1) router.back();
        else router.push('/journals');
    };

    // ── Empty state ──
    if (!fileUrl) {
        return (
            <div className="section pdf-viewer-empty-state">
                <div className="container" style={{ textAlign: 'center', maxWidth: '580px', padding: '40px 20px' }}>
                    <div className="pdf-empty-icon"><i className="far fa-file-pdf"></i></div>
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

    // ── Error state → custom page ──
    if (status === 'error') {
        return (
            <div className="pdf-viewer-page">
                <div className="pdf-viewer-toolbar">
                    <div className="pdf-toolbar-inner">
                        <div className="pdf-toolbar-left">
                            <button type="button" onClick={handleBack} className="btn btn-outline btn-sm pdf-btn-back" aria-label="Go back">
                                <i className="fas fa-arrow-left"></i>
                                <span className="pdf-btn-label">Back</span>
                            </button>
                            <span className="badge badge-primary pdf-badge-journal" style={{ textTransform: 'none' }}>
                                <i className="fas fa-bookmark" style={{ marginRight: '5px', fontSize: '0.75rem' }}></i>
                                {journal}
                            </span>
                        </div>
                        <div className="pdf-toolbar-center">
                            <span className="pdf-viewer-doc-title" title={title}>{title}</span>
                        </div>
                    </div>
                </div>
                <PdfErrorPage
                    errorCode={errorCode}
                    onRetry={handleRetry}
                    onBack={handleBack}
                    retryIn={retryIn}
                    journal={journal}
                />
            </div>
        );
    }

    // ── Normal viewer ──
    return (
        <div className="pdf-viewer-page">
            {/* Toolbar */}
            <div className="pdf-viewer-toolbar">
                <div className="pdf-toolbar-inner">
                    <div className="pdf-toolbar-left">
                        <button type="button" onClick={handleBack} className="btn btn-outline btn-sm pdf-btn-back" aria-label="Go back to journal">
                            <i className="fas fa-arrow-left"></i>
                            <span className="pdf-btn-label">Back</span>
                        </button>
                        <span className="badge badge-primary pdf-badge-journal" style={{ textTransform: 'none' }}>
                            <i className="fas fa-bookmark" style={{ marginRight: '5px', fontSize: '0.75rem' }}></i>
                            {journal}
                        </span>
                    </div>
                    <div className="pdf-toolbar-center">
                        <span className="pdf-viewer-doc-title" title={title}>{title}</span>
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

            {/* Canvas */}
            <div className="pdf-viewer-canvas">
                {/* Spinner shown during 'checking' and 'loading' */}
                {(status === 'checking' || status === 'loading') && (
                    <div className="pdf-viewer-loader">
                        <div className="pdf-spinner"></div>
                        <p style={{ marginTop: '14px', color: '#fff', fontSize: '0.88rem', fontWeight: '500' }}>
                            {status === 'checking' ? 'Verifying document availability...' : 'Loading research document...'}
                        </p>
                    </div>
                )}

                {/* Mount iframe only after check passes */}
                {(status === 'loading' || status === 'ready') && (
                    <iframe
                        key={attempt}
                        src={iframeSrc}
                        title={title}
                        className="pdf-iframe"
                        onLoad={handleIframeLoad}
                        loading="eager"
                    />
                )}
            </div>
        </div>
    );
}

// ─── Page export ──────────────────────────────────────────────────────────────
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
