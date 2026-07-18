'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const getEmbeddableDriveUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    const regExp = /(?:id=|\/d\/|d=)([a-zA-Z0-9_-]{25,})/;
    const match = url.match(regExp);
    if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/view?usp=drivesdk`;
    }
    return url;
};

const DEFAULT_SCHOLAR_ARTICLES = [
    { id: "sca-1", volume: "Volume 1", issue: "Issue 1 (January - June)", year: "2026", pdfUrl: "https://drive.google.com/file/d/1_mock_iks_english/view" },
    { id: "sca-2", volume: "Volume 1", issue: "Issue 2 (July - December)", year: "2025", pdfUrl: "https://drive.google.com/file/d/1_mock_girl_education/view" }
];

export default function ScholarsRealView() {
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
                .eq('journal', "The Scholar's Real View"); // Matches string stored by Admin panel
            
            if (searchVal.trim()) {
                const q = `%${searchVal.trim()}%`;
                // Backwards compatible: search across new columns (volume, issue) and old columns (title, author)
                queryBuilder = queryBuilder.or(`volume.ilike.${q},issue.ilike.${q},title.ilike.${q},author.ilike.${q}`);
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
                // Fallback to local storage cache
                const storedArticles = localStorage.getItem('merf_scholar_articles');
                let all = [];
                if (storedArticles && !searchVal.trim()) {
                    all = JSON.parse(storedArticles);
                } else if (!searchVal.trim()) {
                    all = DEFAULT_SCHOLAR_ARTICLES;
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
        document.title = "The Scholar's Real View | Maurya Education and Research Foundation";
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
        const email = "editorthescholarview@gmail.com";
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
            <section className="hero" style={{ padding: '60px 0', backgroundImage: `linear-gradient(135deg, rgba(7, 17, 36, 0.9) 0%, rgba(15, 32, 70, 0.8) 100%), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop')` }}>
                <div className="container text-center">
                    <h1 style={{ color: 'var(--text-light)', fontSize: '2.75rem', marginBottom: '10px' }}>The Scholar's Real View</h1>
                    <p style={{ color: 'var(--accent)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 0 }}>Rajasthan Institute of Social Science Research (RISSR)</p>
                </div>
            </section>

            <section className="section" id="scholars-view-content">
                <div className="container">
                    <div className="grid grid-2" style={{ gap: '50px' }}>
                        <div>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                                <div style={{ flex: '0 0 100px', maxWidth: '100px' }}>
                                    <img src="/assets/home/Scholar.png" alt="The Scholar's Real View Cover" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)' }} />
                                </div>
                                <div style={{ flex: '1', minWidth: '180px' }}>
                                    <span className="badge badge-primary" style={{ marginBottom: '10px' }}>ISSN: 3049-3609</span>
                                    <h2 style={{ fontSize: '2rem', marginBottom: '0', fontFamily: 'var(--font-heading)' }}>The Scholar's Real View</h2>
                                </div>
                            </div>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--primary-light)' }}>
                                Peer-reviewed refereed multidisciplinary half-yearly international journal in the English language. Managed under RISSR.
                            </p>
                            <p>
                                This international journal is dedicated to highlighting original research contributions, book reviews, and academic papers across social sciences, technology, management, and humanities.
                            </p>
                            
                            <div style={{ backgroundColor: 'var(--bg-white)', padding: '25px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginTop: '30px' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: 'var(--accent-dark)' }}><i className="fas fa-file-alt"></i> Author Submission Guidelines:</h3>
                                <ul style={{ paddingLeft: '10px', fontSize: '0.95rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                                    <li style={{ marginBottom: '6px' }}>Accepted in <strong>MS-Word (.doc/.docx)</strong> format only.</li>
                                    <li style={{ marginBottom: '6px' }}>Typed in <strong>Times New Roman</strong> font. Title (Bold, Center, size 16); Author details (size 14); Main body text (size 12); Line spacing (1.5).</li>
                                    <li style={{ marginBottom: '6px' }}>Must include a brief abstract (max 200 words) with key terms.</li>
                                    <li style={{ marginBottom: '6px' }}>Length: <strong>2000-2500 words</strong> for research articles, <strong>1500-2500 words</strong> for book reviews.</li>
                                    <li style={{ marginBottom: '6px' }}>Endnotes & References must conform to <strong>MLA or APA format</strong>.</li>
                                    <li style={{ marginBottom: '6px' }}>Research papers must be original, self-written, and unpublished.</li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <div className="card" style={{ padding: '40px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '25px', borderBottom: '2px solid var(--primary)', paddingBottom: '10px' }}>Journal Specifications</h3>
                                    <div className="journal-meta">
                                        <div className="meta-row"><span className="meta-label">Frequency:</span><span className="meta-value">Half-Yearly (2 issues/year)</span></div>
                                        <div className="meta-row"><span className="meta-label">Language:</span><span className="meta-value">English</span></div>
                                        <div className="meta-row"><span className="meta-label">Chief Editor:</span><span className="meta-value">Dr. Shailendar Maurya</span></div>
                                        <div className="meta-row"><span className="meta-label">Publisher:</span><span className="meta-value">RISSR, Jaipur</span></div>
                                        <div className="meta-row"><span className="meta-label">Format Style:</span><span className="meta-value">MLA or APA referencing</span></div>
                                        <div className="meta-row"><span className="meta-label">Review Period:</span><span className="meta-value">10-15 Working Days</span></div>
                                    </div>
                                    <div style={{ marginTop: '35px' }}>
                                        <h4 style={{ marginBottom: '10px', fontSize: '1.1rem', color: 'var(--primary)' }}>Chief Editor Contact:</h4>
                                        <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                                            <i className="fas fa-phone-alt"></i> +91-9636635216
                                        </p>
                                    </div>
                                </div>
                                <div style={{ marginTop: '40px' }}>
                                    <button 
                                        onClick={openGmail} 
                                        className="btn btn-primary" 
                                        style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none' }}
                                    >
                                        <i className="far fa-envelope"></i> Online Submission Inquiry
                                    </button>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center' }}>
                                        Clicking this button will open Gmail Compose in a new tab addressed to <strong>editorthescholarview@gmail.com</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Articles and Books Section */}
            <section className="section" id="articles-books-section" style={{ backgroundColor: 'var(--bg-light)', borderTop: '1px solid var(--border-color)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Published Issues</h2>
                        <p>Browse publications and scholarly contributions associated with The Scholar's Real View Journal.</p>
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
                                                        <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-dark)', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
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
