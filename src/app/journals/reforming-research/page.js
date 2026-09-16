'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const getDirectDriveUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    const regExp = /(?:id=|\/d\/|d=)([a-zA-Z0-9_-]{25,})/;
    const match = url.match(regExp);
    if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/view`;
    }
    return url;
};

export default function OnlineJournal() {
    const [groupedIssues, setGroupedIssues] = useState([]);
    const [expandedLabelId, setExpandedLabelId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOnlinePublications = async () => {
        try {
            setLoading(true);
            
            // 1. Fetch all labels
            const { data: labels, error: labelsError } = await supabase
                .from('merf_online_labels')
                .select('*')
                .order('created_at', { ascending: false });
                
            if (labelsError) {
                console.error("Error fetching online labels:", labelsError.message);
            }
            
            // 2. Fetch all articles
            const { data: articles, error: articlesError } = await supabase
                .from('merf_online_articles')
                .select('*')
                .order('created_at', { ascending: true });
                
            if (articlesError) {
                console.error("Error fetching online articles:", articlesError.message);
            }

            if (labels) {
                const grouped = labels.map(lbl => ({
                    ...lbl,
                    articles: articles ? articles.filter(art => art.label_id === lbl.id) : []
                }));
                setGroupedIssues(grouped);
                
                // Expand the first label by default if available
                if (grouped.length > 0) {
                    setExpandedLabelId(grouped[0].id);
                }
            }
        } catch (err) {
            console.error("Failed to query online journal data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOnlinePublications();
    }, []);

    const toggleAccordion = (labelId) => {
        setExpandedLabelId(expandedLabelId === labelId ? null : labelId);
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

    return (
        <>


            <section className="hero" style={{ padding: '60px 0', backgroundImage: `linear-gradient(135deg, rgba(7, 17, 36, 0.9) 0%, rgba(15, 32, 70, 0.8) 100%), url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop')` }}>
                <div className="container text-center">
                    <h1 style={{ color: 'var(--text-light)', fontSize: '2.75rem', marginBottom: '10px' }}>Reforming Research</h1>
                    <p style={{ color: 'var(--accent)', fontSize: '1.1rem', letterSpacing: '0.5px', marginBottom: 0 }}>
                        (An International Peer Reviewed Refered Interdisciplinary Quarterly online Journal in Multi-Language)
                    </p>
                </div>
            </section>

            <section className="section" id="online-journal-overview" style={{ paddingBottom: '40px' }}>
                <div className="container" style={{ maxWidth: '1200px' }}>
                    
                    {/* Top Row: Two Cards Side-by-Side (Left: About, Right: Specifications) */}
                    <div className="grid grid-2" style={{ gap: '30px', alignItems: 'stretch', marginBottom: '40px' }}>
                        
                        {/* Left Card: About the Journal with Cover Image & Badge */}
                        <div className="card" style={{ padding: '35px', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                                <div style={{ flex: '0 0 100px', maxWidth: '100px' }}>
                                    <img src="/assets/home/online.png" alt="Reforming Research Journal Cover" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)' }} />
                                </div>
                                <div style={{ flex: '1', minWidth: '180px' }}>
                                    <span className="badge badge-accent" style={{ marginBottom: '10px' }}>Online Multi-Language Quarterly</span>
                                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0', fontFamily: 'var(--font-heading)', color: 'var(--primary-dark)' }}>Reforming Research</h2>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                                <p style={{ fontSize: '0.98rem', lineHeight: '1.8', color: 'var(--text-dark)', textAlign: 'justify', margin: 0 }}>
                                    <strong>Reforming Research</strong>, an online academic platform dedicated to advancing knowledge and innovation across disciplines. In today’s rapidly evolving world, research must go beyond boundaries of language, region and discipline.
                                </p>
                                <p style={{ fontSize: '0.98rem', lineHeight: '1.8', color: 'var(--text-dark)', textAlign: 'justify', margin: 0 }}>
                                    <strong>Reforming Research</strong> aims to provide a global forum for scholars to share original, critical and solution-oriented research in the fields of Social Sciences, Humanity, Law, Education, Economics, Commerce, Management, Technology, Tourism and Allied Areas.
                                </p>
                                <p style={{ fontSize: '0.98rem', lineHeight: '1.8', color: 'var(--text-dark)', textAlign: 'justify', margin: 0 }}>
                                    As a Quarterly, Online, Multi-Language, Interdisciplinary Journal, we welcome contributions in English, Hindi and other Indian languages. Every manuscript undergoes a peer review process to uphold academic excellence, integrity and relevance.
                                </p>
                                <p style={{ fontSize: '0.98rem', lineHeight: '1.8', color: 'var(--primary-dark)', fontWeight: '600', marginTop: 'auto', paddingTop: '10px', marginBottom: 0 }}>
                                    Reforming Research is published by Maurya Education and Research Foundation (MERF) Jaipur, Rajasthan.
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
                                        <div className="spec-value" style={{ fontWeight: '700', color: 'var(--primary)' }}>Reforming Research</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">ISSN:</div>
                                        <div className="spec-value" style={{ letterSpacing: '1px', fontWeight: '600', color: 'var(--text-muted)' }}>......................</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Frequency:</div>
                                        <div className="spec-value">Quarterly</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Publication Format:</div>
                                        <div className="spec-value">Online</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Subjects:</div>
                                        <div className="spec-value">Interdisciplinary</div>
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
                                        <div className="spec-value" style={{ fontWeight: '600' }}>Dr. Shailendar Maurya</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Name of Publisher:</div>
                                        <div className="spec-value">Maurya Education and Research Foundation, Jaipur, Rajasthan, India</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="spec-label">Contact / Phone:</div>
                                        <div className="spec-value" style={{ fontWeight: '600', color: 'var(--accent-dark)' }}>
                                            <i className="fas fa-phone-alt" style={{ marginRight: '6px' }}></i>+91-9636635216
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
                                    <li>Upon acceptance, copyright of the published article vests with Reforming Research / Maurya Education and Research Foundation (MERF), unless otherwise agreed in writing.</li>
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
                                    <li>Manuscripts should be submitted as an email attachment to <a href="mailto:drshailendar@mauryaerf.com" style={{ color: 'var(--accent-dark)', fontWeight: '600' }}>drshailendar@mauryaerf.com</a> along with a cover letter which should contain the TITLE of the manuscript and the author details.</li>
                                    <li>Acceptance for publication will be communicated by e-mail within 10–15 working days of receipt of the article.</li>
                                    <li>A publication fee, where applicable, is payable only after the manuscript has been formally accepted for publication. The Article Processing Charge (APC) will be conveyed through mail after confirmation, if applicable.</li>
                                </ul>
                            </div>
                        </div>

                        <div style={{ marginTop: '35px', borderTop: '1px solid var(--border-color)', paddingTop: '25px' }}>
                            <button 
                                onClick={openGmail} 
                                className="btn btn-accent" 
                                style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', padding: '14px 20px', fontSize: '1rem', fontWeight: '600' }}
                            >
                                <i className="far fa-envelope"></i> Submit Manuscript via Email
                            </button>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '12px', textAlign: 'center', marginBottom: 0 }}>
                                Send your manuscript and cover letter to <strong>drshailendar@mauryaerf.com</strong>.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Accordion Articles Section */}
            <section className="section" id="online-articles-section" style={{ backgroundColor: 'var(--bg-light)', borderTop: '1px solid var(--border-color)' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div className="section-header">
                        <h2>Articles Issue</h2>
                        <p>Select a periodical issue below to view and read published research articles.</p>
                    </div>

                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '30px' }}><i className="fas fa-spinner fa-spin"></i> Loading issues database...</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                            {groupedIssues.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>No online issues registered yet. Check back soon for the 2026 maiden issue!</p>
                                </div>
                            ) : (
                                groupedIssues.map((issue) => (
                                    <div key={issue.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-white)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                                        {/* Accordion Header */}
                                        <button 
                                            onClick={() => toggleAccordion(issue.id)}
                                            style={{
                                                width: '100%',
                                                padding: '18px 24px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                background: expandedLabelId === issue.id ? 'rgba(7, 17, 36, 0.03)' : 'none',
                                                border: 'none',
                                                outline: 'none',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                transition: 'background 0.2s ease'
                                            }}
                                        >
                                            <span style={{ fontSize: '1.08rem', fontWeight: '600', color: 'var(--primary-dark)' }}>
                                                <i className="far fa-folder-open" style={{ marginRight: '10px', color: 'var(--accent-dark)' }}></i>
                                                {issue.name}
                                            </span>
                                            <span style={{ color: 'var(--text-muted)' }}>
                                                {expandedLabelId === issue.id ? (
                                                    <i className="fas fa-chevron-up" style={{ fontSize: '0.85rem' }}></i>
                                                ) : (
                                                    <i className="fas fa-chevron-down" style={{ fontSize: '0.85rem' }}></i>
                                                )}
                                            </span>
                                        </button>
                                        
                                        {/* Accordion Content */}
                                        {expandedLabelId === issue.id && (
                                            <div style={{ padding: '10px 24px 24px 24px', borderTop: '1px solid rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {issue.articles.length === 0 ? (
                                                    <p style={{ margin: 0, padding: '10px 0', fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                                        No articles uploaded under this issue label yet.
                                                    </p>
                                                ) : (
                                                    issue.articles.map((art) => (
                                                        <div 
                                                            key={art.id} 
                                                            style={{ 
                                                                display: 'flex', 
                                                                justifyContent: 'space-between', 
                                                                alignItems: 'center', 
                                                                padding: '12px 16px', 
                                                                borderRadius: '6px', 
                                                                backgroundColor: 'var(--bg-light)', 
                                                                border: '1px solid rgba(0,0,0,0.03)',
                                                                gap: '15px'
                                                            }}
                                                        >
                                                            <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-dark)', lineHeight: '1.4' }}>
                                                                {art.title}
                                                            </span>
                                                            <a 
                                                                href={getDirectDriveUrl(art.pdfurl)} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="btn btn-outline btn-xs"
                                                                style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
                                                            >
                                                                <i className="far fa-file-pdf"></i> Read Article
                                                            </a>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
