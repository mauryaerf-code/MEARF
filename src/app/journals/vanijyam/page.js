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
        const email = "editorvanijam@gmail.com";
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
                    padding: 12px 0;
                    gap: 15px;
                    align-items: flex-start;
                }
                .spec-item:last-child {
                    border-bottom: none;
                }
                .spec-label {
                    flex: 0 0 170px;
                    font-weight: 700;
                    color: var(--primary-dark);
                    font-size: 0.92rem;
                }
                .spec-value {
                    flex: 1;
                    color: var(--text-dark);
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                @media (max-width: 991px) {
                    .spec-item {
                        flex-direction: column;
                        gap: 4px;
                        padding: 10px 0;
                    }
                    .spec-label {
                        flex: none;
                        font-size: 0.85rem;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .spec-value {
                        font-size: 0.92rem;
                    }
                    .specs-card-responsive {
                        padding: 25px 20px !important;
                    }
                }
            `}} />

            <section className="hero" style={{ padding: '60px 0', backgroundImage: `linear-gradient(135deg, rgba(7, 17, 36, 0.9) 0%, rgba(15, 32, 70, 0.8) 100%), url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop')` }}>
                <div className="container text-center">
                    <h1 style={{ color: 'var(--text-light)', fontSize: '2.5rem', marginBottom: '10px', lineHeight: '1.3' }}>
                        Vanijyam <br></br>International Journal of Commerce, Management and Business Studies (VIJCMBS)
                    </h1>
                    <p style={{ color: 'var(--accent)', fontSize: '1.1rem', letterSpacing: '0.5px', marginBottom: 0 }}>
                        (An International Peer Reviewed Refered Interdisciplinary Yearly/Annually Journal in MultiLanguage)
                    </p>
                </div>
            </section>

            <section className="section" id="vanijyam-content" style={{ paddingBottom: '40px' }}>
                <div className="container" style={{ maxWidth: '1200px' }}>
                    
                    {/* Top Row: Two Cards Side-by-Side (Left: About, Right: Specifications) */}
                    <div className="grid grid-2" style={{ gap: '30px', alignItems: 'stretch', marginBottom: '40px' }}>
                        
                        {/* Left Card: About the Journal */}
                        <div className="card" style={{ padding: '35px', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '18px', borderBottom: '2.5px solid var(--accent)', paddingBottom: '10px', color: 'var(--primary-dark)', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                                <i className="fas fa-book-open" style={{ marginRight: '10px', color: 'var(--accent-dark)' }}></i>
                                About the Journal
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                                <p style={{ fontSize: '0.98rem', lineHeight: '1.8', color: 'var(--text-dark)', textAlign: 'justify', margin: 0 }}>
                                    <strong>Vanijyam International Journal of Commerce, Management and Business Studies (VIJCMBS)</strong> is committed to publishing high-quality, original research that advances knowledge in Commerce, Management, Economics, Business Studies, Accounting, Finance, Banking, Human Resource Management, Tourism, Marketing, Entrepreneurship and related disciplines.
                                </p>
                                <p style={{ fontSize: '0.98rem', lineHeight: '1.8', color: 'var(--text-dark)', textAlign: 'justify', margin: 0 }}>
                                    As a multilanguage, interdisciplinary journal, we welcome contributions in English, Hindi and other Indian languages. All submissions undergo a peer review process to ensure academic rigor and integrity.
                                </p>
                                <p style={{ fontSize: '0.98rem', lineHeight: '1.8', color: 'var(--primary-dark)', fontWeight: '600', marginTop: 'auto', paddingTop: '10px', marginBottom: 0 }}>
                                    VIJCMBS is published by Maurya Education and Research Foundation - MERF, Jaipur, Rajasthan.
                                </p>
                            </div>
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
                                        <div className="spec-value" style={{ fontWeight: '700', color: 'var(--primary)' }}>Vanijyam International Journal of Commerce Management and Business Studies</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">ISSN:</div>
                                        <div className="spec-value" style={{ letterSpacing: '1px', fontWeight: '600', color: 'var(--text-muted)' }}>......................</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Frequency:</div>
                                        <div className="spec-value">Yearly / Annually</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Publication Format:</div>
                                        <div className="spec-value">Print</div>
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
                                        <div className="spec-value" style={{ fontWeight: '600' }}>2026</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Chief Editor:</div>
                                        <div className="spec-value" style={{ fontWeight: '600' }}>Dr. Vinod Kumar Meena <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', fontWeight: '400' }}>(Assistant Professor, MLSU, Udaipur)</span></div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Name of Publisher:</div>
                                        <div className="spec-value">Maurya Education and Research Foundation, Jaipur, Rajasthan, India</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Author Submission Guidelines */}
                    <div className="card" style={{ padding: '40px', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: '35px' }}>
                        <h3 style={{ fontSize: '1.6rem', marginBottom: '15px', borderBottom: '2.5px solid var(--accent)', paddingBottom: '12px', color: 'var(--primary-dark)', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                            <i className="fas fa-file-signature" style={{ marginRight: '10px', color: 'var(--accent-dark)' }}></i>
                            Author Submission Guidelines
                        </h3>
                        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '25px', fontStyle: 'italic' }}>
                            Authors are requested to review and comply with the following submission guidelines prior to manuscript submission. Adherence to these guidelines ensures a smooth and timely review process.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                            {/* Guideline 1 */}
                            <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '18px' }}>
                                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: '700' }}>
                                    1. Manuscript Format and Style
                                </h4>
                                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)' }}>
                                    <li>Manuscripts must be submitted in MS-Word (.doc/.docx) format only.</li>
                                    <li>Contributors should strictly adhere to the article format prescribed by the journal.</li>
                                    <li>The title of the article must be bold, centred, typed in Title Case, and set in 16-point Times New Roman.</li>
                                    <li>Author details — full name, designation, Affiliation, and Email — should be typed in 14-point Times New Roman.</li>
                                    <li>The body of the research paper must be typed in Times New Roman, with headings in 14-point and body text in 12-point, and paragraph spacing set to 6 pt before and 6 pt after, with 1.5-line spacing.</li>
                                    <li>All tables and figures must be numbered consecutively using roman numerals, with captions placed below each figure and above each table.</li>
                                    <li>Figures and images must be of high resolution (minimum 300 dpi), submitted in JPEG, PNG, or TIFF format, and, where possible, in an editable form (e.g. native chart/graph data).</li>
                                </ul>
                            </div>

                            {/* Guideline 2 */}
                            <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '18px' }}>
                                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: '700' }}>
                                    2. Abstract and Keywords
                                </h4>
                                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)' }}>
                                    <li>Every manuscript must be accompanied by a brief abstract, inclusive of 5 keywords, not exceeding 250 words.</li>
                                    <li>The abstract should concisely present the research background, methodology, major findings, and conclusion.</li>
                                </ul>
                            </div>

                            {/* Guideline 3 */}
                            <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '18px' }}>
                                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: '700' }}>
                                    3. Word Limit
                                </h4>
                                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)' }}>
                                    <li><strong>Short Research articles:</strong> 1500–2500 words, inclusive of endnotes.</li>
                                    <li><strong>Research Article:</strong> Minimum 1500–5000 Words.</li>
                                    <li><strong>Book reviews:</strong> 1500–2500 words, inclusive of endnotes.</li>
                                </ul>
                            </div>

                            {/* Guideline 4 */}
                            <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '18px' }}>
                                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: '700' }}>
                                    4. Endnotes, Citations and References
                                </h4>
                                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)' }}>
                                    <li>Endnotes are mandatory for all research papers; manuscripts submitted without endnotes will not be accepted for publication.</li>
                                    <li>Authors must list all references at the end of the paper, following either the MLA (Modern Language Association) or APA (American Psychological Association) style 7th edition.</li>
                                </ul>
                            </div>

                            {/* Guideline 5 */}
                            <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '18px' }}>
                                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: '700' }}>
                                    5. Originality, Plagiarism and AI-Generated Content
                                </h4>
                                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)' }}>
                                    <li>Every article/research paper must be self-written, original, and unpublished, reflecting the author’s own independent research and analysis.</li>
                                    <li>Plagiarism/similarity content in the submitted manuscript must not exceed 10%, as verified through a standard plagiarism-detection tool.</li>
                                    <li>Content generated using Artificial Intelligence (AI) tools is strongly discouraged and will not be appreciated or accepted for publication; submissions found to be substantially AI-generated are liable to be rejected.</li>
                                </ul>
                            </div>

                            {/* Guideline 6 */}
                            <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '18px' }}>
                                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: '700' }}>
                                    6. Authorship, Corresponding Author and Conflict of Interest
                                </h4>
                                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)' }}>
                                    <li>Where a manuscript has multiple authors, one author must be designated as the corresponding author for all editorial correspondence.</li>
                                    <li>All listed authors must have contributed substantially to the research and must consent to the version of the manuscript submitted.</li>
                                    <li>Authors must disclose any potential conflict of interest connected with the research, its funding, or its findings.</li>
                                </ul>
                            </div>

                            {/* Guideline 7 */}
                            <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '18px' }}>
                                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: '700' }}>
                                    7. Copyright and Declaration
                                </h4>
                                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)' }}>
                                    <li>By submitting a manuscript, authors confirm that the work is not under consideration, and has not been previously published, elsewhere.</li>
                                    <li>Upon acceptance, copyright of the published article vests with the journal / publisher, unless otherwise agreed in writing.</li>
                                    <li>Authors are required to submit a signed declaration/undertaking confirming originality and compliance with these guidelines along with the manuscript.</li>
                                </ul>
                            </div>

                            {/* Guideline 8 */}
                            <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '18px' }}>
                                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: '700' }}>
                                    8. Peer Review and Book Reviews
                                </h4>
                                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)' }}>
                                    <li>All research papers are subject to anonymous (blind) peer review by referees before being considered for publication.</li>
                                    <li>To enable anonymous review, author-identifying details should be placed on a separate cover page and must not appear anywhere in the main body of the manuscript.</li>
                                    <li>Reviews will be considered for publication only for reference book(s) that carry a valid ISBN.</li>
                                </ul>
                            </div>

                            {/* Guideline 9 */}
                            <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '18px' }}>
                                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: '700' }}>
                                    9. Submission Process, Timelines and Publication Fee
                                </h4>
                                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)' }}>
                                    <li>Manuscripts should be submitted as an email attachment to <a href="mailto:editorvanijam@gmail.com" style={{ color: 'var(--accent-dark)', fontWeight: '600' }}>editorvanijam@gmail.com</a> along with a cover letter which should contain the TITLE of the manuscript and the author details.</li>
                                    <li>Acceptance for publication will be communicated by e-mail within 10–15 working days of receipt of the article.</li>
                                    <li>A publication fee, where applicable, is payable only after the manuscript has been formally accepted for publication. The Article Processing Charge (APC) will be conveyed through mail after confirmation, if applicable.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Action Buttons: Submit via Email & Membership Link */}
                        <div style={{ marginTop: '35px', borderTop: '1px solid var(--border-color)', paddingTop: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                <button 
                                    onClick={openGmail} 
                                    className="btn btn-primary" 
                                    style={{ flex: '1', minWidth: '220px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', padding: '14px 20px', fontSize: '1rem', fontWeight: '600' }}
                                >
                                    <i className="far fa-envelope"></i> Submit Manuscript via Email
                                </button>
                               
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 0 }}>
                                Send manuscripts directly to <strong>editorvanijam@gmail.com</strong>.
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
