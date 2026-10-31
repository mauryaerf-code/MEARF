'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import EditorialBoard from '@/components/EditorialBoard';
import AuthorSubmissionGuidelines from '@/components/AuthorSubmissionGuidelines';
import HindiSubmissionGuidelines from '@/components/HindiSubmissionGuidelines';
import { getPdfViewerUrl } from '@/lib/pdfHelper';

const getDirectDriveImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/') || url.startsWith('data:')) return url;
    const match = url.match(/(?:id=|\/d\/|d=)([a-zA-Z0-9_-]{25,})/);
    if (match && match[1]) {
        return `/api/proxy-image?id=${match[1]}`;
    }
    return url;
};

const getDirectDriveUrl = (url) => {
    if (!url) return '';
    const regExp = /(?:id=|\/d\/|d=)([a-zA-Z0-9_-]{25,})/;
    const match = url.match(regExp);
    if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/view`;
    }
    return url;
};

const getDownloadDriveUrl = (url) => {
    if (!url) return '';
    const regExp = /(?:id=|\/d\/|d=)([a-zA-Z0-9_-]{25,})/;
    const match = url.match(regExp);
    if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return url;
};

const DEFAULT_SHODH_ARTICLES = [];

export default function ShodhUnnayan() {
    const [articles, setArticles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSearch, setActiveSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [expandedLabels, setExpandedLabels] = useState({});

    const toggleLabel = (id) => {
        setExpandedLabels(prev => ({
            ...prev,
            [id]: prev[id] === undefined ? false : !prev[id]
        }));
    };

    const pageSize = 10;

        const fetchArticles = async (currentPage, searchVal) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('merf_issues')
                .select('*')
                .eq('journal', 'Shodh Unnayan')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Failed to query Shodh Unnayan issues from database:", error.message);
                setArticles([]);
                setTotalCount(0);
                return;
            }

            const supaData = (data || []).map(art => {
                const dbLabel = (art.label && String(art.label).trim()) || 
                                (art.issue && String(art.issue).trim()) || 
                                (art.Author && String(art.Author).trim()) || 
                                (art.author && String(art.author).trim()) || 
                                'Published Issues';
                const dbTitle = (art.title && String(art.title).trim()) ? String(art.title).trim() : '';
                const dbIssueNo = (art.issue && String(art.issue).trim()) ? String(art.issue).trim() : '';
                const dbAuthor = (art.Author && String(art.Author).trim()) || 
                                 (art.author && String(art.author).trim()) || 
                                 (art.volume && String(art.volume).trim()) || '';
                const dbYear = (art.year && String(art.year).trim()) ? String(art.year).trim() : '';

                return {
                    id: art.id,
                    year: dbYear,
                    issueNo: dbIssueNo,
                    author: dbAuthor,
                    label: dbLabel,
                    image: art.image || '',
                    title: dbTitle,
                    createdAt: art.created_at || '',
                    pdfUrl: art.url || art.pdfurl || art.pdfUrl || ''
                };
            });

            let filtered = supaData;
            if (searchVal.trim()) {
                const q = searchVal.trim().toLowerCase();
                filtered = supaData.filter(item =>
                    (item.title || '').toLowerCase().includes(q) ||
                    (item.issueNo || '').toLowerCase().includes(q) ||
                    (item.author || '').toLowerCase().includes(q) ||
                    (item.year || '').toLowerCase().includes(q) ||
                    (item.label || '').toLowerCase().includes(q)
                );
            }

            const fromRange = (currentPage - 1) * pageSize;
            const toRange = fromRange + pageSize;

            setArticles(filtered.slice(fromRange, toRange));
            setTotalCount(filtered.length);
        } catch (err) {
            console.error("Failed to query journal articles:", err);
            setArticles([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles(page, activeSearch);
    }, [page, activeSearch]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        setActiveSearch(searchQuery);
    };

    
        // Group articles by Issue Label with Cover Image - Newest on Top
    const groupedIssues = useMemo(() => {
        const map = new Map();
        articles.forEach(item => {
            const labelKey = (item.label && item.label.trim())
                ? item.label.trim()
                : (item.issueNo || item.author || 'Published Issues');

            if (!map.has(labelKey)) {
                map.set(labelKey, {
                    id: labelKey,
                    label: labelKey,
                    image: item.image || '',
                    year: item.year || '',
                    latestCreatedAt: item.createdAt || '',
                    items: []
                });
            }
            const grp = map.get(labelKey);
            if (!grp.image && item.image) grp.image = item.image;
            if (!grp.year && item.year) grp.year = item.year;
            if (item.createdAt && (!grp.latestCreatedAt || new Date(item.createdAt) > new Date(grp.latestCreatedAt))) {
                grp.latestCreatedAt = item.createdAt;
            }
            grp.items.push(item);
        });

        const groups = Array.from(map.values());
        // Sort so newest label is on top
        groups.sort((a, b) => new Date(b.latestCreatedAt || 0) - new Date(a.latestCreatedAt || 0));
        return groups;
    }, [articles]);

    const handleClearSearch = () => {
        setSearchQuery('');
        setPage(1);
        setActiveSearch('');
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        const section = document.getElementById('articles-books-section');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    };

    const openGmail = () => {
        const email = "drshailendar@mauryaerf.com";
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            window.location.href = `mailto:${email}`;
        } else {
            window.open(
                `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
                "_blank"
            );
        }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <>
            <section className="hero" style={{ padding: '60px 0', backgroundImage: `linear-gradient(135deg, rgba(7, 17, 36, 0.9) 0%, rgba(15, 32, 70, 0.8) 100%), url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop')` }}>
                <div className="container text-center">
                    <h1 style={{ color: 'var(--text-light)', fontSize: '2.75rem', marginBottom: '10px' }}>शोध उन्नयन (Shodh Unnayan)</h1>
                    <p style={{ color: 'var(--accent)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 0 }}>Peer Reviewed Referred Multi disciplining quarterly International Journal in Hindi language</p>
                    <p style={{ color: 'var(--accent)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 0 }}>Published by Rajasthan Institute of Social Science Research (RISSR)</p>
                </div>
            </section>

            <section className="section" id="shodh-unnayan-content">
                <div className="container">
                    <div className="grid grid-2" style={{ gap: '50px', marginBottom: '35px' }}>
                        <div className="card" style={{ padding: '35px', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                                <div style={{ flex: '0 0 100px', maxWidth: '100px' }}>
                                    <img src="/assets/home/Shodh Unnayan.png" alt="Shodh Unnayan Journal Cover" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)' }} />
                                </div>
                                <div style={{ flex: '1', minWidth: '180px' }}>
                                    <span className="badge badge-accent" style={{ marginBottom: '10px' }}>ISSN: 3048-846X</span>
                                    <h2 style={{ fontSize: '2rem', marginBottom: '0', fontFamily: 'var(--font-heading)' }}>Shodh Unnayan (शोध उन्नयन)</h2>
                                </div>
                            </div>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--primary-light)' }}>
                                Peer-reviewed refereed multidisciplinary quarterly international journal in the Hindi language. Managed under RISSR.
                            </p>
                            <p>
                                यह शोध पत्रिका हिंदी भाषा में विभिन्न विषयों पर मौलिक और शोधपूर्ण आलेखों को प्रकाशित करती है। सभी शोध आलेख विशेषज्ञों द्वारा डबल-ब्लाइंड समीक्षा (Peer-Reviewed) के पश्चात ही स्वीकार किए जाते हैं।
                            </p>
                            
                            </div>

                        {/* Right Card: Journal Specifications */}
                        <div className="card specs-card-responsive" style={{ padding: '35px', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', borderBottom: '2.5px solid var(--accent)', paddingBottom: '10px', color: 'var(--primary-dark)', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                                    <i className="fas fa-list-check" style={{ marginRight: '10px', color: 'var(--accent-dark)' }}></i>
                                    Journal Specifications
                                </h3>
                                
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div className="spec-item">
                                        <div className="spec-label">Title of Research Journal:</div>
                                        <div className="spec-value" style={{ fontWeight: '700', color: 'var(--primary)' }}>Shodh Unnayan</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">ISSN:</div>
                                        <div className="spec-value">
                                            <span className="badge badge-accent" style={{ fontSize: '0.85rem', padding: '3px 10px', fontWeight: '700' }}>3048-846X</span>
                                        </div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Frequency:</div>
                                        <div className="spec-value">Quarterly</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Publication Format:</div>
                                        <div className="spec-value">offline/ Print</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Subjects:</div>
                                        <div className="spec-value">Interdisciplinary</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Language:</div>
                                        <div className="spec-value" style={{ fontWeight: '600' }}>Hindi Languages</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Starting Year:</div>
                                        <div className="spec-value" style={{ fontWeight: '600' }}>2024</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Chief Editor:</div>
                                        <div className="spec-value" style={{ fontWeight: '600' }}>Dr. Shailendar Maurya</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Name of Publisher:</div>
                                        <div className="spec-value">Rajasthan Institute of Social Science Research (RISSR) Jaipur, Rajasthan, India</div>
                                    </div>

                                    <div className="spec-item">
                                        <div className="spec-label">Chief Editor Contact:</div>
                                        <div className="spec-value" style={{ fontWeight: '600', color: 'var(--accent-dark)' }}>
                                            <i className="fas fa-phone-alt" style={{ marginRight: '6px' }}></i>+91-9636635216
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid var(--border-color)' }}>
                                <button 
                                    onClick={openGmail} 
                                    className="btn btn-accent" 
                                    style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                                >
                                    <i className="fas fa-paper-plane"></i> Submit Manuscript / Online Inquiry
                                </button>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center', marginBottom: 0 }}>
                                    Opens Gmail addressed to <strong>drshailendar@mauryaerf.com</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Author Submission Guidelines */}
                    <AuthorSubmissionGuidelines 
                        journalName="Shodh Unnayan"
                        publisherName="Rajasthan Institute of Social Science Research (RISSR)"
                        email="drshailendar@mauryaerf.com"
                    />

                    {/* Hindi Submission Guidelines */}
                    <HindiSubmissionGuidelines />

                    {/* Member of Editorial Board */}
                    <EditorialBoard journalName="Shodh Unnayan" />
                </div>
            </section>

            {/* Dynamic Articles and Books Section */}
            <section className="section" id="articles-books-section" style={{ backgroundColor: 'var(--bg-light)', borderTop: '1px solid var(--border-color)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Published Issues (प्रकाशित अंक)</h2>
                        <p>Browse publications and scholarly contributions associated with Shodh Unnayan Journal.</p>
                    </div>

                    {/* Search Bar capsule */}
                    <form onSubmit={handleSearchSubmit}>
                        <div className="search-bar-container">
                            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '15px', color: 'var(--text-muted)' }}>
                                <i className="fas fa-search"></i>
                            </div>
                            <input 
                                type="text" 
                                className="search-input"
                                placeholder="Search by volume, issue or year..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button 
                                    type="button"
                                    onClick={handleClearSearch}
                                    style={{
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        padding: '0 10px',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                            <button type="submit" className="btn btn-primary search-btn">
                                Search
                            </button>
                        </div>
                    </form>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2.5rem', color: 'var(--accent-dark)' }}></i>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '25px' }}>
                                {groupedIssues.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>No issues found matching your search.</p>
                                    </div>
                                ) : (
                                    groupedIssues.map((group, gIndex) => {
                                        const isExpanded = expandedLabels[group.id] !== undefined ? expandedLabels[group.id] : (gIndex === 0);
                                        return (
                                            <div key={group.id} className="journal-issue-card">
                                                {/* ROW 1: Cover Image First */}
                                                <div className="journal-cover-showcase">
                                                    <div style={{ textAlign: 'center' }}>
                                                        <img 
                                                            src={getDirectDriveImageUrl(group.image) || '/assets/home/Shodh Unnayan.png'} 
                                                            alt={`${group.label} Cover`} 
                                                            className="journal-cover-img" referrerPolicy="no-referrer"
                                                            onError={(e) => { e.currentTarget.src = '/assets/home/Shodh Unnayan.png'; }}
                                                        />
                                                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                            <span className="badge badge-accent" style={{ fontSize: '0.74rem', padding: '3px 10px', fontWeight: '700' }}>
                                                                <i className="fas fa-book-open" style={{ marginRight: '5px' }}></i> Issue Cover
                                                            </span>
                                                            {group.year && (
                                                                <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.74rem', padding: '3px 8px' }}>
                                                                    {group.year}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* ROW 2: In New Row: Label Title + Down Drop Accordion Toggle */}
                                                <div 
                                                    onClick={() => toggleLabel(group.id)}
                                                    className={`journal-dropdown-header ${isExpanded ? 'is-expanded' : ''}`}
                                                >
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                                            <span className="badge" style={{ backgroundColor: 'var(--primary)', color: '#ffffff', fontSize: '0.74rem', padding: '3px 9px', fontWeight: '600' }}>
                                                                <i className="fas fa-bookmark" style={{ marginRight: '5px' }}></i> Issue Label
                                                            </span>
                                                        </div>
                                                        <h3 className="journal-dropdown-title">
                                                            {group.label}
                                                        </h3>
                                                        <p className="journal-dropdown-hint">
                                                            {isExpanded ? 'Click to collapse articles' : 'Click to drop down and view published articles'}
                                                        </p>
                                                    </div>

                                                    {/* Down Drop Toggle Indicator */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                                                        <span className="journal-dropdown-btn-text">
                                                            {isExpanded ? 'Hide' : 'View Articles'}
                                                        </span>
                                                        <div 
                                                            className="journal-toggle-circle"
                                                            style={{ 
                                                                backgroundColor: isExpanded ? 'var(--primary)' : '#f1f5f9', 
                                                                color: isExpanded ? '#ffffff' : 'var(--text-dark)'
                                                            }}
                                                        >
                                                            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`} style={{ fontSize: '0.88rem' }}></i>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* ROW 3: Inside Down Drop Div - Responsive Table Structure */}
                                                {isExpanded && (
                                                    <div className="journal-table-wrapper">
                                                        <div className="journal-articles-list">
                                                                {group.items.map((art, aIdx) => (
                                                                    <div key={art.id || aIdx} className="journal-article-item">
                                                                        <div className="journal-article-main">
                                                                            <div className="journal-article-title">{art.title || '-'}</div>
                                                                            <div className="journal-article-author">{art.author || '-'}</div>
                                                                        </div>
                                                                        <div className="journal-article-action">
                                                                            {(art.pdfUrl || art.pdfurl) ? (
                                                                                <a 
                                                                                    href={getPdfViewerUrl(art.pdfUrl || art.pdfurl, { title: art.title, author: art.author, journal: 'शोध उन्नयन (Shodh Unnayan)', from: '/journals/shodh-unnayan' })} 
                                                                                    className="btn btn-primary btn-sm"
                                                                                    style={{ padding: '6px 14px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', borderRadius: '4px' }}
                                                                                >
                                                                                    <i className="far fa-file-pdf"></i> Read PDF
                                                                                </a>
                                                                            ) : (
                                                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>No PDF</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                    </div>
                                                )}

                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            
                            {articles.length === 0 && (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>No issues found matching your search.</p>
                            )}

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '45px' }}>
                                    <button 
                                        disabled={page === 1} 
                                        onClick={() => handlePageChange(page - 1)}
                                        className="btn btn-outline btn-sm"
                                        style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                    >
                                        <i className="fas fa-angle-left"></i> Prev
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => handlePageChange(p)}
                                            className={`btn btn-sm ${page === p ? 'btn-primary' : 'btn-outline'}`}
                                            style={{ width: '32px', height: '32px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', border: '1px solid var(--border-color)' }}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button 
                                        disabled={page === totalPages} 
                                        onClick={() => handlePageChange(page + 1)}
                                        className="btn btn-outline btn-sm"
                                        style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                    >
                                        Next <i className="fas fa-angle-right"></i>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

        </>
    );
}
