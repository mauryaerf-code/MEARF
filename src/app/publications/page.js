'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

const DEFAULT_BOOKS = [
    { id: "bk-1", title: "Research Methodology in Social Sciences", authors: "Dr. Shailendar Maurya", isbn: "978-81-9556-XX-X", year: 2025, coverUrl: "" },
    { id: "bk-2", title: "Modern Education & IKS under NEP 2020", authors: "Prof. Ram Gopal", isbn: "978-81-9556-XX-Y", year: 2026, coverUrl: "" },
    { id: "bk-3", title: "Women Centric Skill Dev in Rajasthan", authors: "Dr. S. Maurya", isbn: "978-81-9556-XX-Z", year: 2026, coverUrl: "" },
    { id: "bk-4", title: "Sustainable Development Perspectives", authors: "Dr. Shailendar Maurya", isbn: "978-81-9556-XX-A", year: 2024, coverUrl: "" }
];

export default function Publications() {
    const router = useRouter();
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSearch, setActiveSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeLightboxImage, setActiveLightboxImage] = useState(null);

    const pageSize = 10;

    const fetchBooks = async (currentPage, searchVal) => {
        try {
            setLoading(true);
            let queryBuilder = supabase
                .from('merf_books')
                .select('*', { count: 'exact' });
            
            if (searchVal.trim()) {
                const q = `%${searchVal.trim()}%`;
                queryBuilder = queryBuilder.or(`title.ilike.${q},author.ilike.${q},isbn.ilike.${q}`);
            }

            const fromRange = (currentPage - 1) * pageSize;
            const toRange = fromRange + pageSize - 1;

            const { data, count, error } = await queryBuilder
                .order('id', { ascending: false })
                .range(fromRange, toRange);

            if (!error && data) {
                const mappedBooks = data.map(b => ({
                    id: b.id,
                    title: b.title,
                    authors: b.author || b.authors,
                    isbn: b.isbn,
                    year: parseInt(b.year, 10) || b.year,
                    coverUrl: b.coverurl || b.coverUrl || b.coverURL
                }));
                setBooks(mappedBooks);
                setTotalCount(count || 0);
            } else {
                if (error) console.error("Error fetching books:", error.message);
                // Fallback to local storage cache
                const storedBooks = localStorage.getItem('merf_books');
                if (storedBooks && !searchVal.trim()) {
                    const all = JSON.parse(storedBooks);
                    setBooks(all.slice(fromRange, toRange + 1));
                    setTotalCount(all.length);
                } else if (!searchVal.trim()) {
                    setBooks(DEFAULT_BOOKS.slice(fromRange, toRange + 1));
                    setTotalCount(DEFAULT_BOOKS.length);
                } else {
                    setBooks([]);
                    setTotalCount(0);
                }
            }
        } catch (err) {
            console.error("Failed to query publications:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks(page, activeSearch);
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
        const section = document.getElementById('book-showcase-catalog');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <>
            <section className="hero" style={{ padding: '60px 0', backgroundImage: `linear-gradient(135deg, rgba(7, 17, 36, 0.9) 0%, rgba(15, 32, 70, 0.8) 100%), url('https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1200&auto=format&fit=crop')` }}>
                <div className="container text-center">
                    <h1 style={{ color: 'var(--text-light)', fontSize: '2.75rem', marginBottom: '10px' }}>Maurya Publications & Distributors</h1>
                    <p style={{ color: 'var(--accent)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 0 }}>Academic Book Publishing with ISBN Allotment</p>
                </div>
            </section>

            <section className="section" id="pub-about-section">
                <div className="container">
                    <div className="grid grid-2">
                        <div>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                                <div style={{ flex: '0 0 100px', maxWidth: '100px' }}>
                                    <img src="/assets/Publicationss/image.png" alt="Publications Cover Image" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)' }} />
                                </div>
                                <div style={{ flex: '1', minWidth: '200px' }}>
                                    <h2 style={{ fontSize: '1.85rem', marginBottom: '0' }}>Platform for Budding & Established Authors</h2>
                                </div>
                            </div>
                            <p style={{ fontSize: '1.02rem', fontFamily: '"Outfit", "Inter", sans-serif', lineHeight: '1.8', color: 'var(--text-dark)', textAlign: 'justify', marginBottom: '15px' }}>
                                <strong>Maurya Publications & Distributors</strong> serves as an ideal platform for both the established as well as budding authors for getting their books published at an earliest date.
                            </p>
                            <p style={{ fontSize: '1.02rem', fontFamily: '"Outfit", "Inter", sans-serif', lineHeight: '1.8', color: 'var(--text-dark)', textAlign: 'justify', marginBottom: '15px' }}>
                                Since inception (in <strong>2022</strong>) we believe in providing high quality books at reasonable prices. We strongly believe in being in close contact with all our authors on the production, promotion and distribution of their books. Maintaining high academic and production standards is our priority.
                            </p>
                            <p style={{ fontSize: '1.02rem', fontFamily: '"Outfit", "Inter", sans-serif', lineHeight: '1.8', color: 'var(--text-dark)', textAlign: 'justify', marginBottom: 0 }}>
                                Manuscripts received would be thoroughly assessed for their viability across the globe. We intend to inform the authors ASAP on the acceptance or rejection of their works. Moreover, <strong>ISBN</strong> is allotted to all our publications. Our books are at the forefront of knowledge and often break new ground in research. As an independent publisher, we are more willing to take risks by publishing in emerging disciplines.
                            </p>
                            
                            <div style={{ marginTop: '30px' }}>
                                <button 
                                    onClick={() => router.push('/journals')} 
                                    className="btn btn-primary" 
                                    id="email-ms-btn"
                                    style={{ border: 'none' }}
                                >
                                    Submit Book Proposal
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className="card card-accent" style={{ padding: '35px', backgroundColor: 'var(--bg-white)' }}>
                                <h3 style={{ fontSize: '1.35rem', marginBottom: '20px', color: 'var(--primary-dark)', borderBottom: '2px solid var(--accent)', paddingBottom: '10px' }}>Format & Style Guidelines</h3>
                                <p style={{ fontSize: '0.95rem', marginBottom: '20px' }}>All books and monographs must follow these styles prior to final draft review:</p>
                                
                                <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'grid', gap: '12px', fontSize: '0.9rem' }}>
                                    <li><i className="fas fa-check" style={{ color: 'var(--accent-dark)', marginRight: '10px' }}></i> <strong>Paper Size:</strong> A4 standard size</li>
                                    <li><i className="fas fa-check" style={{ color: 'var(--accent-dark)', marginRight: '10px' }}></i> <strong>Font Specification:</strong> Font size 12 with 1.5 line spacing</li>
                                    <li><i className="fas fa-check" style={{ color: 'var(--accent-dark)', marginRight: '10px' }}></i> <strong>Layout:</strong> Double or single column layout</li>
                                    <li><i className="fas fa-check" style={{ color: 'var(--accent-dark)', marginRight: '10px' }}></i> <strong>Margins:</strong> At least 1 inch margin on all sides</li>
                                    <li><i className="fas fa-check" style={{ color: 'var(--accent-dark)', marginRight: '10px' }}></i> <strong>Draft Submission:</strong> Submit a single Word document containing the entire text, cover pages, references, and annexures.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" id="pub-submission-requirements" style={{ backgroundColor: 'var(--bg-white)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Manuscript Elements Checklists</h2>
                        <p>Ensure your submitted manuscript file contains these required components for rapid verification.</p>
                    </div>

                    <div className="grid grid-3">
                        <div className="card" style={{ padding: '25px' }}>
                            <div style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '15px' }}><i className="fas fa-id-card"></i></div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>1. Cover Page Details</h3>
                            <ul style={{ listStylePosition: 'inside', paddingLeft: '5px', fontSize: '0.85rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>
                                <li>Title of the Book</li>
                                <li>Author name(s) & designations</li>
                                <li>Full mailing address(es)</li>
                                <li>Active phone numbers</li>
                                <li>Author email address(es)</li>
                            </ul>
                        </div>

                        <div className="card" style={{ padding: '25px' }}>
                            <div style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '15px' }}><i className="fas fa-user-tie"></i></div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>2. Author Profile</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: 0 }}>
                                Provide a separate profile file of the author(s) containing around <strong>10 to 15 lines</strong> of professional biography along with a recent <strong>passport-size photograph</strong> of each contributor.
                            </p>
                        </div>

                        <div className="card" style={{ padding: '25px' }}>
                            <div style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '15px' }}><i className="fas fa-table"></i></div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>3. Figures & Tables</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: 0 }}>
                                Each figure and table must be numbered and titled consecutively. The position of figures/tables must be indicated in the text on a separate line (e.g., <em>"◆ Table 1 about here"</em>).
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" id="book-showcase-catalog">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Published Books</h2>
                        <p>Browse through selected books and monographs published with ISBN registration under Maurya Publications.</p>
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
                                placeholder="Search by title, author, or ISBN..." 
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
                            {/* Published Books Grid Showcase */}
                            <div className="catalog-grid">
                                {books.map((bk) => (
                                    <div className="catalog-card" key={bk.id}>
                                        {/* Image Container with dynamic sizing and Lightbox pointer */}
                                        <div 
                                            onClick={() => bk.coverUrl && setActiveLightboxImage(getEmbeddableDriveUrl(bk.coverUrl))}
                                            className="catalog-cover-container"
                                            style={{ cursor: bk.coverUrl ? 'zoom-in' : 'default' }}
                                        >
                                            {bk.coverUrl ? (
                                                <img src={getEmbeddableDriveUrl(bk.coverUrl)} alt="Book Cover" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} />
                                            ) : (
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '15px' }}>
                                                    <i className="fas fa-book" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block', color: 'var(--accent)' }}></i>
                                                    No Cover Available
                                                </div>
                                            )}
                                            {/* Hover magnifier hint overlay */}
                                            {bk.coverUrl && (
                                                <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(7, 17, 36, 0.75)', color: '#ffffff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                                                    <i className="fas fa-search-plus"></i>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <h4 style={{ fontSize: '0.95rem', marginBottom: '6px', lineHeight: '1.4', fontWeight: 600, color: 'var(--primary-dark)' }}>{bk.title}</h4>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '5px' }}>By {bk.authors}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--accent-dark)', fontWeight: 'bold', marginBottom: '5px' }}>ISBN: {bk.isbn}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 0 }}>Published: {bk.year}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {books.length === 0 && (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No books found matching your search.</p>
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
