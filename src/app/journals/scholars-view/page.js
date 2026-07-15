'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const getEmbeddableDriveUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    const regExp = /(?:id=|\/d\/|d=)([a-zA-Z0-9_-]{25,})/;
    const match = url.match(regExp);
    if (match && match[1]) {
        return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
    return url;
};

const DEFAULT_SCHOLAR_ARTICLES = [
    { id: "sca-1", title: "Indian Knowledge Systems (IKS): Integration Challenges", author: "Dr. Rajesh Sharma", type: "Article", year: "2026", coverUrl: "/assets/home/Scholar.png", pdfUrl: "https://drive.google.com/file/d/1_mock_iks_english/view" },
    { id: "sca-2", title: "Empirical Studies on Girl Education in Secondary Schools", author: "Rita Sen", type: "Article", year: "2025", coverUrl: "/assets/home/Scholar.png", pdfUrl: "https://drive.google.com/file/d/1_mock_girl_education/view" }
];

export default function ScholarsRealView() {
    const [articles, setArticles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSearch, setActiveSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeLightboxImage, setActiveLightboxImage] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    const pageSize = 10;

    const fetchArticles = async (currentPage, searchVal, typeFilter) => {
        try {
            setLoading(true);
            let queryBuilder = supabase
                .from('merf_journal_articles')
                .select('*', { count: 'exact' })
                .eq('journal', "The Scholar's Real View"); // Matches string stored by Admin panel
            
            if (typeFilter && typeFilter !== 'all') {
                queryBuilder = queryBuilder.eq('type', typeFilter);
            }
            
            if (searchVal.trim()) {
                const q = `%${searchVal.trim()}%`;
                queryBuilder = queryBuilder.or(`title.ilike.${q},author.ilike.${q}`);
            }

            const fromRange = (currentPage - 1) * pageSize;
            const toRange = fromRange + pageSize - 1;

            const { data, count, error } = await queryBuilder
                .order('id', { ascending: false })
                .range(fromRange, toRange);

            if (!error && data) {
                const mapped = data.map(art => ({
                    id: art.id,
                    title: art.title,
                    author: art.author,
                    type: art.type,
                    year: art.year,
                    coverUrl: art.coverurl || art.coverUrl || art.coverURL,
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
                
                if (typeFilter && typeFilter !== 'all') {
                    all = all.filter(item => item.type === typeFilter);
                }

                setArticles(all.slice(fromRange, toRange + 1));
                setTotalCount(all.length);
            }
        } catch (err) {
            console.error("Failed to query journal articles:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "The Scholar's Real View | Maurya Education and Research Foundation";
        fetchArticles(page, activeSearch, activeTab);
    }, [page, activeSearch, activeTab]);

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

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        const section = document.getElementById('articles-books-section');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    };

    const openGmail = () => {
        const email = "editorthescholarview@gmail.com";
        window.open(
            `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
            "_blank"
        );
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
                        <h2>Articles & Books</h2>
                        <p>Browse publications and scholarly contributions associated with The Scholar's Real View Journal.</p>
                    </div>

                    {/* Tab Filter buttons group */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
                        <button 
                            onClick={() => handleTabChange('all')}
                            className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
                            style={{ border: activeTab === 'all' ? 'none' : '1px solid var(--border-color)', borderRadius: '30px', padding: '8px 24px', fontSize: '0.9rem', cursor: 'pointer' }}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => handleTabChange('Article')}
                            className={`btn ${activeTab === 'Article' ? 'btn-primary' : 'btn-outline'}`}
                            style={{ border: activeTab === 'Article' ? 'none' : '1px solid var(--border-color)', borderRadius: '30px', padding: '8px 24px', fontSize: '0.9rem', cursor: 'pointer' }}
                        >
                            Articles
                        </button>
                        <button 
                            onClick={() => handleTabChange('Book')}
                            className={`btn ${activeTab === 'Book' ? 'btn-primary' : 'btn-outline'}`}
                            style={{ border: activeTab === 'Book' ? 'none' : '1px solid var(--border-color)', borderRadius: '30px', padding: '8px 24px', fontSize: '0.9rem', cursor: 'pointer' }}
                        >
                            Books
                        </button>
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
                                placeholder="Search by title or author..." 
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
                            <div className="catalog-grid">
                                {articles.map((item) => (
                                    <div className="catalog-card" key={item.id}>
                                        {/* Image Container with dynamic sizing and Lightbox pointer */}
                                        <div 
                                            onClick={() => item.coverUrl && setActiveLightboxImage(getEmbeddableDriveUrl(item.coverUrl))}
                                            className="catalog-cover-container"
                                            style={{ cursor: item.coverUrl ? 'zoom-in' : 'default' }}
                                        >
                                            {item.coverUrl ? (
                                                <img src={getEmbeddableDriveUrl(item.coverUrl)} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} />
                                            ) : (
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '15px' }}>
                                                    <i className="fas fa-scroll" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block', color: 'var(--accent)' }}></i>
                                                    No Cover Available
                                                </div>
                                            )}
                                            {item.coverUrl && (
                                                <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(7, 17, 36, 0.75)', color: '#ffffff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                                                    <i className="fas fa-search-plus"></i>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <span className="badge badge-primary" style={{ fontSize: '0.7rem', display: 'inline-block', margin: '0 auto 10px auto' }}>
                                                {item.type}
                                            </span>
                                            <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-dark)', marginBottom: '8px', lineHeight: '1.4', fontWeight: 600 }}>
                                                {item.title}
                                            </h3>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                                                <strong>Author:</strong> {item.author}
                                            </p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
                                                <strong>Year:</strong> {item.year}
                                            </p>
                                        </div>
                                        {item.pdfUrl && (
                                            <a 
                                                href={item.pdfUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="btn btn-outline btn-sm"
                                                style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.8rem' }}
                                            >
                                                <i className="fab fa-google-drive"></i> Read PDF
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            {articles.length === 0 && (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>No articles or books found matching your search.</p>
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

            {/* Lightbox Modal overlay */}
            {activeLightboxImage && (
                <div 
                    onClick={() => setActiveLightboxImage(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(7, 17, 36, 0.9)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'zoom-out'
                    }}
                >
                    <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} onClick={(e) => e.stopPropagation()}>
                        <img 
                            src={activeLightboxImage} 
                            alt="Expanded Cover View" 
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '85vh', 
                                borderRadius: '8px', 
                                boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
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
                                width: '35px',
                                height: '35px',
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
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
