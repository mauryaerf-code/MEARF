'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import EditorialBoard from '@/components/EditorialBoard';
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
    if (url.startsWith('/') || url.startsWith('data:') || !url.includes('drive.google.com')) return url;
    const regExp = /(?:id=|\/d\/|d=)([a-zA-Z0-9_-]{25,})/;
    const match = url.match(regExp);
    if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/view`;
    }
    return url;
};

const getDownloadDriveUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/') || url.startsWith('data:') || !url.includes('drive.google.com')) return url;
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
    const [expandedLabels, setExpandedLabels] = useState({});

    const toggleLabel = (id) => {
        setExpandedLabels(prev => ({
            ...prev,
            [id]: prev[id] === undefined ? false : !prev[id]
        }));
    };

    const pageSize = 20;

        const fetchArticles = async (currentPage, searchVal) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('merf_issues')
                .select('*')
                .eq('journal', 'Vanijyam')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Failed to query Vanijyam issues from database:", error.message);
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


            <section className="hero" style={{ padding: '60px 0', backgroundImage: `linear-gradient(135deg, rgba(7, 17, 36, 0.9) 0%, rgba(15, 32, 70, 0.8) 100%), url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop')` }}>
                <div className="container text-center">
                    <h1 style={{ color: 'var(--text-light)', fontSize: '2.5rem', marginBottom: '14px', lineHeight: '1.35' }}>
                        Vanijyam <br />
                        <span style={{ fontSize: '0.7em', fontWeight: '500', display: 'inline-block', marginTop: '6px' }}>
                            International Journal of Commerce, Management and Business Studies (VIJCMBS)
                        </span>
                    </h1>
                    <p style={{ color: 'var(--accent)', fontSize: '1.1rem', letterSpacing: '0.5px', marginBottom: 0 }}>
                        (An International Peer Reviewed Refered Annually Journal in Multi-Language)
                    </p>
                </div>
            </section>

            <section className="section" id="vanijyam-content" style={{ paddingBottom: '40px' }}>
                <div className="container" style={{ maxWidth: '1200px' }}>

                    {/* Top Row: Two Cards Side-by-Side (Left: About, Right: Specifications) */}
                    <div className="grid grid-2" style={{ gap: '30px', alignItems: 'stretch', marginBottom: '40px' }}>

                        {/* Left Card: About the Journal with Cover Image & Badge */}
                        <div className="card" style={{ padding: '35px', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                                <div style={{ flex: '0 0 100px', maxWidth: '100px' }}>
                                    <img src="/assets/home/vanijyam.png" alt="Vanijyam Journal Cover" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)' }} />
                                </div>
                                <div style={{ flex: '1', minWidth: '180px' }}>
                                    <span className="badge badge-primary" style={{ marginBottom: '10px' }}>ISSN: 2839-5980</span>
                                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0', fontFamily: 'var(--font-heading)' }}>Vanijyam (VIJCMBS)</h2>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                                <p style={{ fontSize: '0.98rem', lineHeight: '1.8', color: 'var(--text-dark)', textAlign: 'justify', margin: 0 }}>
                                    <strong>Vanijyam <br>
                                    </br>International Journal of Commerce, Management and Business Studies (VIJCMBS)</strong> is committed to publishing high-quality, original research that advances knowledge in Commerce, Management, Economics, Business Studies, Accounting, Finance, Banking, Human Resource Management, Tourism, Marketing, Entrepreneurship and related disciplines.
                                </p>
                                <p style={{ fontSize: '0.98rem', lineHeight: '1.8', color: 'var(--text-dark)', textAlign: 'justify', margin: 0 }}>
                                    As a multilanguage, interdisciplinary journal, we welcome contributions in English, Hindi, and other Indian languages. All submissions undergo a peer review process to ensure academic rigor and integrity.
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
                                        <div className="spec-value">
                                            <span className="badge badge-primary" style={{ fontSize: '0.85rem', padding: '3px 10px', fontWeight: '700' }}>2839-5980</span>
                                        </div>
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
                                        <div className="spec-value">Multiple Languages (Hindi & English)</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Starting Year:</div>
                                        <div className="spec-value" style={{ fontWeight: '600' }}>2026</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Chief Editor:</div>
                                        <div className="spec-value" style={{ fontWeight: '600' }}>Dr. Shailendar Maurya</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Associate Editor:</div>
                                        <div className="spec-value" style={{ fontWeight: '600' }}>
                                            Dr. Vinod Kumar Meena <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', fontWeight: '400' }}>(Assistant Professor, MLSU, Udaipur)</span>
                                        </div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Name of Publisher:</div>
                                        <div className="spec-value">Maurya Education and Research Foundation, Jaipur, Rajasthan, India</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Contact / Phone:</div>
                                        <div className="spec-value" style={{ fontWeight: '600', color: 'var(--accent-dark)' }}>
                                            <div><i className="fas fa-phone-alt" style={{ marginRight: '6px' }}></i>+91-9460931698</div>
                                            <div style={{ marginTop: '4px' }}><i className="fas fa-phone-alt" style={{ marginRight: '6px' }}></i>+91-9636635216</div>
                                        </div>
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
                                    <li>Upon acceptance, copyright of the published article vests with Vanijyam (VIJCMBS) / Maurya Education and Research Foundation (MERF), unless otherwise agreed in writing.</li>
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

                    {/* Member of Editorial Board */}
                    <EditorialBoard journalName="Vanijyam" />

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
                                                            src={getDirectDriveImageUrl(group.image) || '/assets/home/vanijyam.png'} 
                                                            alt={group.label ? `${group.label} Cover` : 'Vanijyam Cover'} 
                                                            className="journal-cover-img" referrerPolicy="no-referrer"
                                                            onError={(e) => { e.currentTarget.src = '/assets/home/vanijyam.png'; }}
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
                                                                                    href={getPdfViewerUrl(art.pdfUrl || art.pdfurl, { title: art.title, author: art.author, journal: 'Vanijyam (VIJCMBS)', from: '/journals/vanijyam' })} 
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
