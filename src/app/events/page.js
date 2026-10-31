'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Convert Google Drive image link to direct CDN preview URL
const getEmbeddableDriveUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('blob:')) return url;
    const match = url.match(/(?:id=|\/d\/|d=)([a-zA-Z0-9_-]{25,})/);
    if (match && match[1]) {
        return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
    return url;
};

// Convert Google Drive link to document/PDF preview URL
const getDrivePdfViewUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('data:') || !url.includes('drive.google.com')) return url;
    const match = url.match(/(?:id=|\/d\/|d=)([a-zA-Z0-9_-]{25,})/);
    if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/view`;
    }
    return url;
};

// Format ISO date (YYYY-MM-DD) into readable format (e.g., 10 Nov 2026)
const formatSingleDate = (str) => {
    if (!str) return '';
    const trimmed = str.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        const [y, m, d] = trimmed.split('-');
        const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
        if (!isNaN(dateObj.getTime())) {
            return dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        }
    }
    return trimmed;
};

// Format date or date range ("2026-11-10 to 2026-11-12")
const formatEventDate = (dateStr) => {
    if (!dateStr) return 'Date TBA';
    const parts = dateStr.split(/\s+to\s+|\s+-\s+/i);
    if (parts.length === 2) {
        return `${formatSingleDate(parts[0])} – ${formatSingleDate(parts[1])}`;
    }
    return formatSingleDate(dateStr);
};

// Category icon helper
const getEventTypeIcon = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('conference')) return 'fas fa-globe';
    if (t.includes('seminar')) return 'fas fa-landmark';
    if (t.includes('faculty') || t.includes('fdp')) return 'fas fa-chalkboard-teacher';
    if (t.includes('workshop')) return 'fas fa-tools';
    return 'fas fa-calendar-check';
};

// Parse raw event record and clean description / fallback <!--META:{...}-->
const parseEventRecord = (evt) => {
    let cleanDesc = evt.description || '';
    let imageUrl = evt.imageurl || evt.image || evt.imageUrl || '';
    let detailsUrl = evt.details || evt.detailslink || evt.details_url || '';

    // Check and parse fallback <!--META:{...}--> block inside description
    const metaMatch = cleanDesc.match(/<!--META:(\{.*?\})-->/s);
    if (metaMatch) {
        try {
            const meta = JSON.parse(metaMatch[1]);
            if (meta.image && !imageUrl) imageUrl = meta.image;
            if (meta.details && !detailsUrl) detailsUrl = meta.details;
            cleanDesc = cleanDesc.replace(/<!--META:\{.*?\}-->/s, '').trim();
        } catch (e) {
            console.warn('Error parsing event meta block:', e);
        }
    }

    return {
        id: evt.id,
        title: evt.title || 'Untitled Academic Event',
        date: evt.date || '',
        formattedDate: formatEventDate(evt.date),
        type: evt.type || 'Academic Event',
        location: evt.location || evt.venue || 'To Be Announced',
        description: cleanDesc,
        registrationlink: evt.registrationlink || evt.registration_link || evt.link || '',
        imageurl: imageUrl,
        details: detailsUrl,
        created_at: evt.created_at || ''
    };
};

// Auto-formatter helper: Parses inline links, emails, and phone numbers into interactive elements
const formatInlineText = (text) => {
    if (!text) return '';
    const tokenRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(?:\+91[\-\s]?)?[6-9]\d{4}[\-\s]?\d{5})/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }
        let val = match[0];
        let trailingPunct = '';
        const punctMatch = val.match(/[.,;:)]+$/);
        if (punctMatch && val.startsWith('http')) {
            trailingPunct = punctMatch[0];
            val = val.slice(0, -trailingPunct.length);
        }

        if (val.startsWith('http')) {
            parts.push(
                <a
                    key={`url-${match.index}`}
                    href={val}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: 600, wordBreak: 'break-all' }}
                >
                    {val}
                </a>
            );
        } else if (val.includes('@')) {
            parts.push(
                <a
                    key={`email-${match.index}`}
                    href={`mailto:${val}`}
                    style={{ color: 'var(--accent-dark)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                    <i className="far fa-envelope" style={{ fontSize: '0.85em' }}></i> {val}
                </a>
            );
        } else {
            parts.push(
                <a
                    key={`phone-${match.index}`}
                    href={`tel:${val.replace(/[\s\-]/g, '')}`}
                    style={{ color: 'var(--accent-dark)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                    <i className="fas fa-phone-alt" style={{ fontSize: '0.85em' }}></i> {val}
                </a>
            );
        }
        if (trailingPunct) {
            parts.push(trailingPunct);
        }
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }
    return parts.length > 0 ? parts : text;
};

// Clean, professional text formatter for unstructured event description
const renderAutoFormattedText = (rawText) => {
    if (!rawText || !rawText.trim()) {
        return (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0, fontSize: '0.92rem' }}>
                Detailed schedule, guidelines, and resource materials will be provided upon registration.
            </p>
        );
    }

    // 1. Intelligent Pre-segmentation:
    // Identifies bullets, tracks, section headings, and table rows crammed together without newlines
    let text = rawText
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<p[^>]*>/gi, '')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');

    // Clean dangling ordinals before bullets (e.g. "th •", "st •", "nd •")
    text = text.replace(/\b(?:th|st|nd|rd)\s+•/gi, '\n• ');

    // Clean duplicate repeated headings (e.g. "REGISTRATION FEES REGISTRATION FEES")
    text = text.replace(/(REGISTRATION\s+FEES)\s+\1/gi, '$1');

    // Force newlines before bullets (•, ▪, ▫, ✓, ✔)
    text = text.replace(/([^\n])\s*([•▪▫✓✔])/g, '$1\n$2');
    text = text.replace(/([^\n])\s*(?:•\s*No\s+TA\/DA)/gi, '$1\n• No TA/DA');

    // Force newlines before Tracks (e.g. "Track 1:", "Track 2:")
    text = text.replace(/([^\n])\s*(Track\s+\d+[:\s])/gi, '$1\n\n$2');

    // Force newlines before Section Headings using alternation
    const combinedHeadingRegex = /([^\n])\s*\b(SUBMISSION\s+GUIDELINES|GENERAL\s+INSTRUCTIONS|TERMS\s+(?:AND|&)\s+CONDITIONS|CALL\s+FOR\s+PAPERS|IMPORTANT\s+DATES|DATES\s+TO\s+REMEMBER|REGISTRATION\s+DETAILS|REGISTRATION\s+PROCESS|REGISTRATION\s+FEES?|FEE\s+STRUCTURE|PAYMENT\s+DETAILS|ORGANIZING\s+COMMITTEE|ADVISORY\s+BOARD|RESOURCE\s+PERSONS?|KEYNOTE\s+SPEAKERS?|CHIEF\s+GUESTS?|WHO\s+CAN\s+(?:ATTEND|PARTICIPATE)|ABOUT\s+THE\s+(?:EVENT|CONFERENCE|SEMINAR|WORKSHOP|INSTITUTION|COLLEGE)|KEY\s+TOPICS|ELIGIBILITY|GUIDELINES|SPEAKERS?|PATRONS?|CONTACT\s+(?:DETAILS|PERSONS?|INFO)?|FOR\s+QUERIES)(?::|\b)/gi;
    text = text.replace(combinedHeadingRegex, '$1\n\n$2\n');

    // Force newlines for fee table rows
    text = text.replace(/(Category\s+Academician[^\n]*)/gi, '\n$1\n');
    text = text.replace(/((?:Indian|International)\s*\((?:offline|online)\))/gi, '\n$1');

    // Fix accidental word split in Resource Person
    text = text.replace(/participant\s+or\s*\n\s*Resource\s+Person/gi, 'participant or Resource Person');

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const elements = [];
    let listBuffer = [];
    let listType = 'bullet';
    let feeBuffer = [];

    // Helper to format item content with bold Key if Key: Value pattern
    const renderItemContent = (str) => {
        const colonIdx = str.indexOf(':');
        if (colonIdx > 1 && colonIdx < 40 && !/^\d{1,2}$/.test(str.substring(0, colonIdx)) && !str.toLowerCase().startsWith('http')) {
            const key = str.substring(0, colonIdx).trim();
            const val = str.substring(colonIdx + 1).trim();
            const words = key.split(/\s+/);
            if (words.length <= 6 && !/\b(will|is|are|was|were|can|should|could|must|have|has)\b/i.test(key) && val.length > 0) {
                return (
                    <>
                        <strong style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>{key}: </strong>
                        <span>{formatInlineText(val)}</span>
                    </>
                );
            }
        }
        return formatInlineText(str);
    };

    const flushList = (key) => {
        if (listBuffer.length > 0) {
            elements.push(
                <ul
                    key={key}
                    style={{
                        margin: '8px 0 16px 0',
                        paddingLeft: listType === 'number' ? '22px' : '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        color: '#334155'
                    }}
                >
                    {listBuffer.map((item, i) => (
                        <li key={i} style={{ fontSize: '0.92rem', lineHeight: '1.7', listStyleType: listType === 'number' ? 'decimal' : 'disc' }}>
                            {renderItemContent(item)}
                        </li>
                    ))}
                </ul>
            );
            listBuffer = [];
        }
    };

    const flushFee = (key) => {
        if (feeBuffer.length > 0) {
            elements.push(
                <div
                    key={key}
                    style={{
                        margin: '12px 0 16px 0',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        overflowX: 'auto'
                    }}
                >
                    {feeBuffer.map((fLine, fIdx) => (
                        <div
                            key={fIdx}
                            style={{
                                fontSize: '0.88rem',
                                lineHeight: '1.55',
                                color: fIdx === 0 ? 'var(--primary-dark)' : '#334155',
                                fontWeight: fIdx === 0 ? 700 : 500,
                                borderBottom: fIdx === 0 ? '1px solid #cbd5e1' : 'none',
                                paddingBottom: fIdx === 0 ? '6px' : '2px',
                                whiteSpace: 'pre-wrap'
                            }}
                        >
                            {fLine}
                        </div>
                    ))}
                </div>
            );
            feeBuffer = [];
        }
    };

    const flushAll = (keyPrefix) => {
        flushList(`${keyPrefix}-list`);
        flushFee(`${keyPrefix}-fee`);
    };

    const headingKeywords = /^(about\s+(the\s+)?(event|conference|seminar|workshop|institution|college|department|university|foundation)|theme(s)?|sub-theme(s)?|tracks?|track\s+\d+|key\s+topics|important\s+dates|dates\s+to\s+remember|timeline|schedule|eligibility|who\s+(can|should)\s+(attend|participate|join)|registration(\s+(fee(s)?|details|process|link|info))?|how\s+to\s+register|fee\s+structure|payment(\s+(details|modes?|info|instructions?))?|guidelines?|rules?|instructions?|terms(\s+(&|and)\s+conditions)?|call\s+for\s+papers?|paper\s+submission|submission\s+guidelines?|publication(\s+opportunity|\s+proceedings)?|speakers?|resource\s+persons?|chief\s+guests?|keynote\s+speakers?|patrons?|organizing\s+committee|convenor|coordinators?|advisory\s+board|contact(\s+(us|details|persons?|info))?|queries?|awards?|prizes?|certificates?|venue|mode\s+of\s+event|general\s+instructions?)/i;

    const isHeading = (trimmed) => {
        if (!trimmed) return false;
        if (/^#{1,4}\s+/.test(trimmed)) return true;
        if (/^Track\s+\d+[:\s]/i.test(trimmed)) return true;
        if (trimmed.endsWith(':') && trimmed.length < 65 && headingKeywords.test(trimmed.replace(/:$/, '').trim())) {
            return true;
        }
        if (trimmed.length < 45 && headingKeywords.test(trimmed)) {
            return true;
        }
        if (trimmed.length >= 4 && trimmed.length <= 45 && trimmed === trimmed.toUpperCase() && /^[A-Z0-9\s&—\-:()]+$/.test(trimmed) && !/^\d+$/.test(trimmed)) {
            return true;
        }
        return false;
    };

    const isListItem = (trimmed) => {
        return /^([•\-\*–—▪▫✓✔]|\d+[\.\)]|\([0-9a-zA-Z]\))\s+/.test(trimmed);
    };

    const isFeeRow = (trimmed) => {
        return /^(Category\s+Academician|(?:Indian|International)\s*\()/i.test(trimmed) || (trimmed.includes('₹') && (trimmed.includes('offline') || trimmed.includes('online')));
    };

    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i];

        // 1. Heading
        if (isHeading(trimmed)) {
            flushAll(`head-pre-${i}`);
            const cleanHeading = trimmed.replace(/^#{1,4}\s+/, '').replace(/:$/, '').trim();
            elements.push(
                <h5
                    key={`heading-${i}`}
                    style={{
                        margin: '22px 0 10px 0',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'var(--primary-dark)',
                        fontFamily: 'var(--font-heading)',
                        borderBottom: '1px solid #e2e8f0',
                        paddingBottom: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <i className="fas fa-bookmark" style={{ color: 'var(--accent-dark)', fontSize: '0.85rem' }}></i>
                    {cleanHeading}
                </h5>
            );
            continue;
        }

        // 2. Fee table row
        if (isFeeRow(trimmed)) {
            flushList(`fee-pre-list-${i}`);
            feeBuffer.push(trimmed);
            continue;
        }

        flushFee(`post-fee-${i}`);

        // 3. List item
        if (isListItem(trimmed)) {
            const match = trimmed.match(/^([•\-\*–—▪▫✓✔]|\d+[\.\)]|\([0-9a-zA-Z]\))\s+(.*)$/);
            const bullet = match ? match[1] : '•';
            const itemText = match ? match[2] : trimmed;
            const isNumbered = /^\d+[\.\)]/.test(bullet);

            if (listBuffer.length > 0 && ((isNumbered && listType !== 'number') || (!isNumbered && listType !== 'bullet'))) {
                flushList(`list-switch-${i}`);
            }
            listType = isNumbered ? 'number' : 'bullet';
            listBuffer.push(itemText);
            continue;
        }

        // Flush list before non-list elements
        flushList(`p-pre-list-${i}`);

        // 4. Paragraph Check ("or if it is para also ok so visiter understand it easilly")
        // If line is longer prose (>90 chars) or contains complete sentences with punctuation
        const isParagraph = trimmed.length > 90 || /[.?!]\s+[A-Z]/.test(trimmed);

        if (isParagraph) {
            elements.push(
                <p key={`para-${i}`} style={{ margin: '0 0 14px 0', fontSize: '0.94rem', lineHeight: '1.75', color: '#334155' }}>
                    {formatInlineText(trimmed)}
                </p>
            );
        } else {
            // Line-by-line single item
            elements.push(
                <div key={`line-${i}`} style={{ margin: '5px 0', fontSize: '0.92rem', lineHeight: '1.6', color: '#334155' }}>
                    {renderItemContent(trimmed)}
                </div>
            );
        }
    }

    flushAll('final');

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {elements}
        </div>
    );
};

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeLightboxImage, setActiveLightboxImage] = useState(null);
    const [activeDetailEvent, setActiveDetailEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                let { data, error } = await supabase
                    .from('merf_events')
                    .select('*')
                    .order('date', { ascending: false });

                if (error) {
                    const fallback = await supabase.from('merf_events').select('*');
                    data = fallback.data;
                    error = fallback.error;
                }

                if (!error && data) {
                    const mappedEvents = data.map(parseEventRecord);
                    setEvents(mappedEvents);
                    try {
                        localStorage.setItem('merf_events_cache', JSON.stringify(mappedEvents));
                    } catch (e) {
                        console.warn('Local storage cache failed:', e);
                    }
                } else {
                    if (error) console.error("Error fetching events:", error.message);
                    const storedEvents = localStorage.getItem('merf_events_cache');
                    if (storedEvents) {
                        try {
                            setEvents(JSON.parse(storedEvents));
                        } catch (e) {
                            console.warn('Cache parse error:', e);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to query events:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <>
            <section className="hero" style={{ padding: '60px 0', backgroundImage: `linear-gradient(135deg, rgba(7, 17, 36, 0.9) 0%, rgba(15, 32, 70, 0.8) 100%), url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop')` }}>
                <div className="container text-center">
                    <h1 style={{ color: 'var(--text-light)', fontSize: '2.75rem', marginBottom: '10px' }}>Extension (Academic Events)</h1>
                    <p style={{ color: 'var(--accent)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 0 }}>Conferences, National Seminars, FDPs, & Workshops</p>
                </div>
            </section>

            <section className="section" id="events-intro">
                <div className="container">
                    <div className="grid grid-3" style={{ gap: '30px' }}>
                        {/* Column 1: Extension */}
                        <div className="card" style={{ padding: '30px', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ fontSize: '2rem', color: 'var(--accent-dark)', marginBottom: '15px' }}><i className="fas fa-seedling"></i></div>
                            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', marginBottom: '15px', fontWeight: '600' }}>Extension</h3>
                            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'grid', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                <li><i className="fas fa-check" style={{ color: 'var(--accent-dark)', marginRight: '8px' }}></i> Foster socially responsible educational practices</li>
                                <li><i className="fas fa-check" style={{ color: 'var(--accent-dark)', marginRight: '8px' }}></i> Promote sustainable development across economic and social dimensions</li>
                                <li><i className="fas fa-check" style={{ color: 'var(--accent-dark)', marginRight: '8px' }}></i> Run Education Programs based on sustainable development</li>
                                <li><i className="fas fa-check" style={{ color: 'var(--accent-dark)', marginRight: '8px' }}></i> FDPs for educators on integrating Indian Knowledge Systems into curriculum as per NEP 2020 & UGC framework</li>
                            </ul>
                        </div>

                        {/* Column 2: Extension Activities */}
                        <div className="card" style={{ padding: '30px', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ fontSize: '2rem', color: 'var(--accent-dark)', marginBottom: '15px' }}><i className="fas fa-chalkboard-teacher"></i></div>
                            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', marginBottom: '15px', fontWeight: '600' }}>Extension Activities</h3>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px', fontStyle: 'italic' }}>Based on Teaching & Training:</p>
                            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'grid', gap: '10px', fontSize: '0.88rem', color: 'var(--text-dark)', fontWeight: '500' }}>
                                <li><i className="fas fa-chevron-right" style={{ color: 'var(--accent-dark)', marginRight: '8px', fontSize: '0.75rem' }}></i> Education Workshops</li>
                                <li><i className="fas fa-chevron-right" style={{ color: 'var(--accent-dark)', marginRight: '8px', fontSize: '0.75rem' }}></i> Community Outreach</li>
                                <li><i className="fas fa-chevron-right" style={{ color: 'var(--accent-dark)', marginRight: '8px', fontSize: '0.75rem' }}></i> Digital Extension</li>
                                <li><i className="fas fa-chevron-right" style={{ color: 'var(--accent-dark)', marginRight: '8px', fontSize: '0.75rem' }}></i> Teacher Training</li>
                                <li><i className="fas fa-chevron-right" style={{ color: 'var(--accent-dark)', marginRight: '8px', fontSize: '0.75rem' }}></i> Student Training</li>
                            </ul>
                        </div>

                        {/* Column 3: Extension (Academic Events) */}
                        <div className="card" style={{ padding: '30px', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ fontSize: '2rem', color: 'var(--accent-dark)', marginBottom: '15px' }}><i className="fas fa-graduation-cap"></i></div>
                            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', marginBottom: '15px', fontWeight: '600' }}>Academic Events</h3>
                            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'grid', gap: '10px', fontSize: '0.88rem', color: 'var(--text-dark)', fontWeight: '500' }}>
                                <li><i className="fas fa-star" style={{ color: 'var(--accent-dark)', marginRight: '8px', fontSize: '0.75rem' }}></i> International Conference</li>
                                <li><i className="fas fa-star" style={{ color: 'var(--accent-dark)', marginRight: '8px', fontSize: '0.75rem' }}></i> National Seminar</li>
                                <li><i className="fas fa-star" style={{ color: 'var(--accent-dark)', marginRight: '8px', fontSize: '0.75rem' }}></i> Faculty Development Programme</li>
                                <li><i className="fas fa-star" style={{ color: 'var(--accent-dark)', marginRight: '8px', fontSize: '0.75rem' }}></i> All Workshop</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" id="active-events-list" style={{ backgroundColor: 'var(--bg-white)', paddingTop: '20px' }}>
                <div className="container" style={{ paddingLeft: '17px', paddingRight: '17px' }}>
                    <div className="section-header" style={{ marginBottom: '35px' }}>
                        <h2>Upcoming & Active Events</h2>
                        <p>Register online to secure a seat at our upcoming workshops, seminars, and training programs.</p>
                    </div>

                    {/* Events Grid */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--accent-dark)', marginBottom: '15px', display: 'block' }}></i>
                            <p style={{ fontSize: '0.95rem' }}>Loading scheduled seminars & events catalog...</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(323px, 1fr))', gap: '22px' }}>
                            {events.map((evt) => (
                                <div
                                    className="catalog-card"
                                    key={evt.id}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        alignItems: 'stretch',
                                        textAlign: 'left',
                                        padding: '20px 17px'
                                    }}
                                >
                                    <div>
                                        {/* Poster Image / Banner with Category Badge on Top-Left Corner */}
                                        {evt.imageurl ? (
                                            <div
                                                onClick={() => evt.imageurl && setActiveLightboxImage(getEmbeddableDriveUrl(evt.imageurl))}
                                                className="event-poster-container"
                                                style={{ cursor: evt.imageurl ? 'zoom-in' : 'default' }}
                                                title={evt.imageurl ? "Click to view full poster" : ""}
                                            >
                                                {evt.imageurl ? (
                                                    <img
                                                        src={getEmbeddableDriveUrl(evt.imageurl)}
                                                        alt={`${evt.title} Poster`}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'contain',
                                                            padding: '8px',
                                                            display: 'block'
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '15px' }}>
                                                        <i className="fas fa-calendar-alt" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block', color: 'var(--accent)' }}></i>
                                                        Event Poster
                                                    </div>
                                                )}

                                                {/* Category Label on Upper Image Top-Left Corner */}
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: '8px',
                                                        left: '8px',
                                                        backgroundColor: 'rgba(7, 17, 36, 0.88)',
                                                        backdropFilter: 'blur(8px)',
                                                        WebkitBackdropFilter: 'blur(8px)',
                                                        color: 'var(--accent)',
                                                        padding: '3px 10px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.72rem',
                                                        fontWeight: 700,
                                                        letterSpacing: '0.3px',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '5px',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                                                        border: '1px solid rgba(235, 179, 56, 0.4)',
                                                        zIndex: 2,
                                                        lineHeight: 1
                                                    }}
                                                >
                                                    <i className={getEventTypeIcon(evt.type)}></i>
                                                    <span>{evt.type}</span>
                                                </div>

                                                {/* Magnifier zoom hint overlay (matching publication book cards) */}
                                                {evt.imageurl && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: '8px',
                                                            right: '8px',
                                                            backgroundColor: 'rgba(7, 17, 36, 0.85)',
                                                            backdropFilter: 'blur(4px)',
                                                            color: '#ffffff',
                                                            width: '28px',
                                                            height: '28px',
                                                            borderRadius: '50%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.8rem',
                                                            zIndex: 2,
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                                                            border: '1px solid rgba(255,255,255,0.15)'
                                                        }}
                                                    >
                                                        <i className="fas fa-search-plus" style={{ color: 'var(--accent)' }}></i>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: '110px',
                                                    borderRadius: 'var(--radius-md)',
                                                    background: 'linear-gradient(135deg, #071124 0%, #10264b 60%, #17386d 100%)',
                                                    position: 'relative',
                                                    padding: '12px 14px',
                                                    marginBottom: '15px',
                                                    border: '1px solid rgba(255,255,255,0.08)',
                                                    overflow: 'hidden',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                {/* Category Label on Upper Banner Top-Left Corner */}
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: '10px',
                                                        left: '10px',
                                                        backgroundColor: 'rgba(7, 17, 36, 0.88)',
                                                        backdropFilter: 'blur(6px)',
                                                        WebkitBackdropFilter: 'blur(6px)',
                                                        color: 'var(--accent)',
                                                        padding: '5px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.74rem',
                                                        fontWeight: 700,
                                                        letterSpacing: '0.3px',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        border: '1px solid rgba(235, 179, 56, 0.4)',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                                                        zIndex: 2
                                                    }}
                                                >
                                                    <i className={getEventTypeIcon(evt.type)}></i>
                                                    <span>{evt.type}</span>
                                                </div>

                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        right: '12px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        color: 'rgba(255,255,255,0.06)',
                                                        fontSize: '4.5rem',
                                                        pointerEvents: 'none'
                                                    }}
                                                >
                                                    <i className="fas fa-graduation-cap"></i>
                                                </div>

                                                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>
                                                        MERF Extension Program
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Unified Meta Row: Location (Left Corner) & Date (Right Corner) */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                gap: '12px',
                                                marginBottom: '14px',
                                                paddingBottom: '12px',
                                                borderBottom: '1px solid rgba(0,0,0,0.06)'
                                            }}
                                        >
                                            {/* Location on Left Corner - Full text wrapping naturally without truncation */}
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: '7px',
                                                    color: 'var(--text-muted)',
                                                    fontSize: '0.84rem',
                                                    lineHeight: '1.45',
                                                    flex: '1',
                                                    minWidth: 0
                                                }}
                                            >
                                                <i className="fas fa-map-marker-alt" style={{ color: 'var(--accent-dark)', marginTop: '3px', flexShrink: 0, fontSize: '0.85rem' }}></i>
                                                <span
                                                    style={{
                                                        fontWeight: 500,
                                                        color: 'var(--text-dark)',
                                                        wordBreak: 'break-word'
                                                    }}
                                                >
                                                    {evt.location}
                                                </span>
                                            </div>

                                            {/* Date on Right Corner */}
                                            <div
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    color: 'var(--primary-dark)',
                                                    backgroundColor: 'rgba(7, 17, 36, 0.05)',
                                                    padding: '5px 10px',
                                                    borderRadius: '12px',
                                                    flexShrink: 0,
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                <i className="far fa-calendar-alt" style={{ color: 'var(--accent-dark)' }}></i>
                                                <span>{evt.formattedDate}</span>
                                            </div>
                                        </div>

                                        {/* Event Title */}
                                        <h3
                                            style={{
                                                fontSize: '1.14rem',
                                                color: 'var(--primary-dark)',
                                                marginBottom: '12px',
                                                lineHeight: '1.4',
                                                fontWeight: 600,
                                                wordBreak: 'break-word'
                                            }}
                                        >
                                            {evt.title}
                                        </h3>

                                        {/* Event Description - Complete wording displayed responsively */}
                                        <div style={{ marginBottom: '18px' }}>
                                            <p
                                                style={{
                                                    fontSize: '0.84rem',
                                                    color: 'var(--text-muted)',
                                                    lineHeight: '1.6',
                                                    marginBottom: '0',
                                                    whiteSpace: 'pre-line',
                                                    wordBreak: 'break-word'
                                                }}
                                            >
                                                {evt.description || "Join our upcoming academic event organized by MERF. Review the schedule, register online, or explore details below."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons: Read & Register Online */}
                                    <div
                                        style={{
                                            width: '100%',
                                            marginTop: 'auto',
                                            paddingTop: '15px',
                                            borderTop: '1px solid rgba(0,0,0,0.06)',
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '10px'
                                        }}
                                    >
                                        {/* Read Button */}
                                        {evt.details && (/^(https?:\/\/|www\.)/i.test(evt.details) || evt.details.includes('drive.google.com')) ? (
                                            <a
                                                href={getDrivePdfViewUrl(evt.details)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-outline btn-sm"
                                                style={{
                                                    width: '100%',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px',
                                                    fontSize: '0.82rem',
                                                    padding: '8px 10px'
                                                }}
                                                title="Read Brochure / Document (PDF)"
                                            >
                                                <i className="fas fa-book-open"></i> Read
                                            </a>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setActiveDetailEvent(evt)}
                                                className="btn btn-outline btn-sm"
                                                style={{
                                                    width: '100%',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px',
                                                    fontSize: '0.82rem',
                                                    padding: '8px 10px',
                                                    cursor: 'pointer'
                                                }}
                                                title="Read Event Details"
                                            >
                                                <i className="fas fa-book-open"></i> Read
                                            </button>
                                        )}

                                        {/* Register Button */}
                                        {evt.registrationlink ? (
                                            <a
                                                href={evt.registrationlink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-primary btn-sm"
                                                style={{
                                                    width: '100%',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px',
                                                    fontSize: '0.82rem',
                                                    padding: '8px 10px'
                                                }}
                                            >
                                                <i className="fas fa-arrow-up-right-from-square"></i> Register
                                            </a>
                                        ) : (
                                            <Link
                                                href={`/contact?subject=${encodeURIComponent(`Register: ${evt.title}`)}`}
                                                className="btn btn-primary btn-sm"
                                                style={{
                                                    width: '100%',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px',
                                                    fontSize: '0.82rem',
                                                    padding: '8px 10px'
                                                }}
                                            >
                                                <i className="fas fa-envelope"></i> Register
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && events.length === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                            No active events found. Check back later!
                        </p>
                    )}
                </div>
            </section>

            {/* Poster Lightbox Modal (For outer card zoom only) */}
            {activeLightboxImage && (
                <div
                    onClick={() => setActiveLightboxImage(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(7, 17, 36, 0.92)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'zoom-out',
                        padding: '20px'
                    }}
                >
                    <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} onClick={(e) => e.stopPropagation()}>
                        <img
                            src={activeLightboxImage}
                            alt="Expanded Event Poster View"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '85vh',
                                borderRadius: '8px',
                                boxShadow: '0 12px 35px rgba(0,0,0,0.6)',
                                border: '3px solid #ffffff',
                                display: 'block'
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setActiveLightboxImage(null)}
                            style={{
                                position: 'absolute',
                                top: '-15px',
                                right: '-15px',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--accent-dark)',
                                color: '#ffffff',
                                border: '2px solid #ffffff',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                            }}
                            aria-label="Close Poster Lightbox"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* Event Details "Read" Modal - Fully Responsive Across Devices */}
            {activeDetailEvent && (
                <div
                    onClick={() => setActiveDetailEvent(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(7, 17, 36, 0.8)',
                        backdropFilter: 'blur(6px)',
                        WebkitBackdropFilter: 'blur(6px)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="event-modal-dialog"
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '16px',
                            maxWidth: '720px',
                            width: '92%',
                            maxHeight: '88vh',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.08)',
                            position: 'relative'
                        }}
                    >
                        {/* Accessible Close Button */}
                        <button
                            type="button"
                            className="event-modal-close-btn"
                            onClick={() => setActiveDetailEvent(null)}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                zIndex: 20,
                                border: 'none',
                                backgroundColor: '#f1f5f9',
                                color: '#475569',
                                cursor: 'pointer',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                fontSize: '1.1rem',
                                flexShrink: 0,
                                transition: 'background-color 0.15s, color 0.15s',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                            aria-label="Close"
                            title="Close"
                        >
                            <i className="fas fa-times"></i>
                        </button>

                        {/* Scrollable Content Body */}
                        <div className="event-modal-body" style={{ padding: '24px 28px', overflowY: 'auto', flex: 1, backgroundColor: '#ffffff' }}>
                            {/* Shifted Title & Badges */}
                            <div className="event-modal-header-content" style={{ marginBottom: '20px', paddingRight: '40px' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                    <span
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '4px 11px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            backgroundColor: 'rgba(235, 179, 56, 0.15)',
                                            color: '#b45309',
                                            border: '1px solid rgba(235, 179, 56, 0.3)'
                                        }}
                                    >
                                        <i className={getEventTypeIcon(activeDetailEvent.type)}></i>
                                        {activeDetailEvent.type}
                                    </span>
                                    <span
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            padding: '3px 9px',
                                            borderRadius: '15px',
                                            fontSize: '0.72rem',
                                            fontWeight: 600,
                                            backgroundColor: '#f1f5f9',
                                            color: '#475569'
                                        }}
                                    >
                                        <i className="far fa-calendar-alt" style={{ color: 'var(--accent-dark)' }}></i>
                                        {activeDetailEvent.formattedDate}
                                    </span>
                                    <span
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            padding: '3px 9px',
                                            borderRadius: '15px',
                                            fontSize: '0.72rem',
                                            fontWeight: 600,
                                            backgroundColor: '#f1f5f9',
                                            color: '#475569'
                                        }}
                                    >
                                        <i className="fas fa-map-marker-alt" style={{ color: 'var(--accent-dark)' }}></i>
                                        {activeDetailEvent.location}
                                    </span>
                                </div>

                                <h3
                                    className="event-modal-title"
                                    style={{
                                        fontSize: '1.35rem',
                                        color: 'var(--primary-dark)',
                                        margin: 0,
                                        lineHeight: '1.35',
                                        fontWeight: 700,
                                        fontFamily: 'var(--font-heading)',
                                        wordBreak: 'break-word'
                                    }}
                                >
                                    {activeDetailEvent.title}
                                </h3>
                            </div>

                            <div style={{ color: '#334155', minWidth: 0 }}>
                                {renderAutoFormattedText(activeDetailEvent.details || activeDetailEvent.description)}
                            </div>

                            {/* End of Window Action: Register Button */}
                            <div
                                style={{
                                    marginTop: '28px',
                                    paddingTop: '20px',
                                    borderTop: '1px solid #e2e8f0',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center'
                                }}
                            >
                                {activeDetailEvent.registrationlink ? (
                                    <a
                                        href={activeDetailEvent.registrationlink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary btn-sm"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            fontSize: '0.88rem',
                                            padding: '10px 24px',
                                            fontWeight: 600,
                                            borderRadius: '6px'
                                        }}
                                    >
                                        <i className="fas fa-arrow-up-right-from-square"></i> Register
                                    </a>
                                ) : (
                                    <Link
                                        href={`/contact?subject=${encodeURIComponent(`Register: ${activeDetailEvent.title}`)}`}
                                        className="btn btn-primary btn-sm"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            fontSize: '0.88rem',
                                            padding: '10px 24px',
                                            fontWeight: 600,
                                            borderRadius: '6px'
                                        }}
                                    >
                                        <i className="fas fa-envelope"></i> Register
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
