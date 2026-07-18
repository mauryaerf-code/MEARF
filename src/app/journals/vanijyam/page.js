'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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

const DEFAULT_VANIJYAM_ARTICLES = [];

export default function VanijyamJournal() {
    const [articles, setArticles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSearch, setActiveSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const pageSize = 10;

    const fetchArticles = async (currentPage, searchVal) => {
        try {
            setLoading(true);
            let queryBuilder = supabase
                .from('merf_issues')
                .select('*', { count: 'exact' })
                .eq('journal', "Vanijyam");

            if (searchVal.trim()) {
                const q = `%${searchVal.trim()}%`;
                queryBuilder = queryBuilder.or(`volume.ilike.${q},issue.ilike.${q},year.ilike.${q}`);
            }

            const fromRange = (currentPage - 1) * pageSize;
            const toRange = fromRange + pageSize - 1;

            const { data, count, error } = await queryBuilder
                .order('id', { ascending: false })
                .range(fromRange, toRange);

            if (!error && data) {
                const mapped = data.map(art => ({
                    id: art.id,
                    year: art.year,
                    volume: art.volume || '',
                    issue: art.issue || '',
                    pdfUrl: art.pdfurl || art.pdfUrl
                }));
                setArticles(mapped);
                setTotalCount(count || 0);
            } else {
                if (error) console.error("Error fetching articles:", error.message);
                const storedArticles = localStorage.getItem('merf_vanijyam_articles');
                let all = [];
                if (storedArticles && !searchVal.trim()) {
                    all = JSON.parse(storedArticles);
                } else if (!searchVal.trim()) {
                    all = DEFAULT_VANIJYAM_ARTICLES;
                }

                const mapped = all.map(item => ({
                    id: item.id,
                    year: item.year,
                    volume: item.volume || '',
                    issue: item.issue || '',
                    pdfUrl: item.pdfUrl
                }));

                setArticles(mapped.slice(fromRange, toRange + 1));
                setTotalCount(mapped.length);
            }
        } catch (err) {
            console.error("Failed to query journal articles:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Vanijyam (VIJCMBS) | Maurya Education and Research Foundation";
        fetchArticles(page, activeSearch);
    }, [page, activeSearch]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        setActiveSearch(searchQuery);
    };

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
            <style dangerouslySetInnerHTML={{ __html: `
                .spec-item {
                    display: flex;
                    flex-direction: row;
                    border-bottom: 1px solid var(--border-color);
                    padding: 14px 0;
                    gap: 20px;
                    align-items: flex-start;
                }
                .spec-item:last-child {
                    border-bottom: none;
                }
                .spec-label {
                    flex: 0 0 220px;
                    font-weight: 700;
                    color: var(--primary-dark);
                    font-size: 0.95rem;
                }
                .spec-value {
                    flex: 1;
                    color: var(--text-dark);
                    font-size: 0.98rem;
                    line-height: 1.5;
                }
                @media (max-width: 680px) {
                    .spec-item {
                        flex-direction: column;
                        gap: 5px;
                        padding: 12px 0;
                    }
                    .spec-label {
                        flex: none;
                        font-size: 0.85rem;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .spec-value {
                        font-size: 0.95rem;
                    }
                    .specs-card-responsive {
                        padding: 25px 20px !important;
                    }
                }
            `}} />

            <section className="hero" style={{ padding: '60px 0', backgroundImage: `linear-gradient(135deg, rgba(7, 17, 36, 0.9) 0%, rgba(15, 32, 70, 0.8) 100%), url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop')` }}>
                <div className="container text-center">
                    <h1 style={{ color: 'var(--text-light)', fontSize: '2.75rem', marginBottom: '10px' }}>Vanijyam</h1>
                    <p style={{ color: 'var(--accent)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 0 }}>Maurya Education And Research Foundation (MERF)</p>
                </div>
            </section>

            <section className="section" id="vanijyam-content">
                <div className="container" style={{ maxWidth: '850px' }}>
                    <div className="card specs-card-responsive" style={{ padding: '40px', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
                        <div>
                            <h3 style={{ fontSize: '1.6rem', marginBottom: '25px', borderBottom: '2.5px solid var(--accent)', paddingBottom: '12px', color: 'var(--primary-dark)', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                                <i className="fas fa-list-check" style={{ marginRight: '10px', color: 'var(--accent-dark)' }}></i>
                                Journal Specifications
                            </h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '15px' }}>
                                <div className="spec-item">
                                    <div className="spec-label">Title of Journal:</div>
                                    <div className="spec-value" style={{ fontWeight: '600', color: 'var(--primary)' }}>Vanijyam International Journal of Commerce Management and Business Studies (VIJCMBS)</div>
                                </div>
                                <div className="spec-item">
                                    <div className="spec-label">ISSN:</div>
                                    <div className="spec-value"><span className="badge badge-primary" style={{ margin: 0, padding: '3px 10px' }}>Applied / To Be Allotted</span></div>
                                </div>
                                <div className="spec-item">
                                    <div className="spec-label">Frequency:</div>
                                    <div className="spec-value">Yearly / Annually</div>
                                </div>
                                <div className="spec-item">
                                    <div className="spec-label">Publication Format:</div>
                                    <div className="spec-value">Print Publication</div>
                                </div>
                                <div className="spec-item">
                                    <div className="spec-label">Subjects:</div>
                                    <div className="spec-value">Commerce, Management, Economics, Business Studies, Accounting, Finance, Banking, Human Resource Management, Tourism, Marketing, Entrepreneurship</div>
                                </div>
                                <div className="spec-item">
                                    <div className="spec-label">Language:</div>
                                    <div className="spec-value">Multiple Languages</div>
                                </div>
                                <div className="spec-item">
                                    <div className="spec-label">Starting Year:</div>
                                    <div className="spec-value" style={{ fontWeight: '500' }}>2026</div>
                                </div>
                                <div className="spec-item">
                                    <div className="spec-label">Chief Editor:</div>
                                    <div className="spec-value" style={{ fontWeight: '500' }}>Dr. Vinod Kumar Meena <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>(Assistant Professor, MLSU, Udaipur)</span></div>
                                </div>
                                <div className="spec-item">
                                    <div className="spec-label">Name of Publisher:</div>
                                    <div className="spec-value">Maurya Education and Research Foundation</div>
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '40px', borderTop: '1px solid var(--border-color)', paddingTop: '30px' }}>
                            <button 
                                onClick={openGmail} 
                                className="btn btn-primary" 
                                style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', padding: '14px 20px', fontSize: '1rem', fontWeight: '600' }}
                            >
                                <i className="far fa-envelope"></i> Online Submission Inquiry
                            </button>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px', textAlign: 'center', marginBottom: 0 }}>
                                Clicking this button will open your email client addressed to <strong>drshailendar@mauryaerf.com</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Articles Section */}
            <section className="section" id="articles-books-section" style={{ backgroundColor: 'var(--bg-light)', borderTop: '1px solid var(--border-color)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Published Issues</h2>
                        <p>Browse published annual issues of Vanijyam Journal.</p>
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
                            {articles.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>No issues published yet. Check back soon for the 2026 maiden issue!</p>
                                </div>
                            ) : (
                                <div className="table-responsive" style={{ marginTop: '20px' }}>
                                    <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                                        <thead style={{ backgroundColor: 'var(--primary)', color: '#ffffff' }}>
                                            <tr>
                                                <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600' }}>No.</th>
                                                <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600' }}>Year</th>
                                                <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600' }}>Volume</th>
                                                <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600' }}>Issue</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {articles.map((item, index) => (
                                                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                    <td style={{ padding: '12px 15px', color: 'var(--text-muted)' }}>{(page - 1) * pageSize + index + 1}</td>
                                                    <td style={{ padding: '12px 15px', fontWeight: '500' }}>{item.year}</td>
                                                    <td style={{ padding: '12px 15px' }}>{item.volume}</td>
                                                    <td style={{ padding: '12px 15px' }}>
                                                        {item.pdfUrl ? (
                                                            <a href={getDirectDriveUrl(item.pdfUrl)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-dark)', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                                <i className="far fa-file-pdf"></i> {item.issue}
                                                            </a>
                                                        ) : (
                                                            item.issue
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px' }}>
                                    <button 
                                        className="btn btn-outline btn-sm" 
                                        disabled={page === 1} 
                                        onClick={() => handlePageChange(page - 1)}
                                    >
                                        Previous
                                    </button>
                                    <span style={{ display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '0.9rem' }}>
                                        Page {page} of {totalPages}
                                    </span>
                                    <button 
                                        className="btn btn-outline btn-sm" 
                                        disabled={page === totalPages} 
                                        onClick={() => handlePageChange(page + 1)}
                                    >
                                        Next
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
