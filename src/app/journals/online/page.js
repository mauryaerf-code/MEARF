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
        document.title = "Online | Maurya Education and Research Foundation";
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

            <section className="hero" style={{ padding: '60px 0', backgroundImage: `linear-gradient(135deg, rgba(7, 17, 36, 0.9) 0%, rgba(15, 32, 70, 0.8) 100%), url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop')` }}>
                <div className="container text-center">
                    <h1 style={{ color: 'var(--text-light)', fontSize: '2.75rem', marginBottom: '10px' }}>Online</h1>
                    <p style={{ color: 'var(--accent)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 0 }}>Rajasthan Institute of Social Science Research (RISSR)</p>
                </div>
            </section>

            <section className="section" id="online-journal-overview" style={{ paddingBottom: '40px' }}>
                <div className="container" style={{ maxWidth: '850px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <p style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--primary-light)', fontStyle: 'italic', margin: 0 }}>
                            "An International Peer Reviewed Refered Quarterly online Journal in Multi-Language"
                        </p>
                    </div>

                    <div className="card specs-card-responsive" style={{ padding: '40px', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
                        <div>
                            <h3 style={{ fontSize: '1.6rem', marginBottom: '25px', borderBottom: '2.5px solid var(--accent)', paddingBottom: '12px', color: 'var(--primary-dark)', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                                <i className="fas fa-list-check" style={{ marginRight: '10px', color: 'var(--accent-dark)' }}></i>
                                Journal Specifications
                            </h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '15px' }}>
                                <div className="spec-item">
                                    <div className="spec-label">Title of Research Journal:</div>
                                    <div className="spec-value" style={{ fontWeight: '600', color: 'var(--primary)' }}>Online Journal (Multi-Language)</div>
                                </div>
                                <div className="spec-item">
                                    <div className="spec-label">ISSN:</div>
                                    <div className="spec-value"><span className="badge badge-accent" style={{ margin: 0, padding: '3px 10px' }}>To Be Allotted</span></div>
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
                                    <div className="spec-value" style={{ fontWeight: '500' }}>2026</div>
                                </div>
                                <div className="spec-item">
                                    <div className="spec-label">Chief Editor:</div>
                                    <div className="spec-value" style={{ fontWeight: '500' }}>Dr. Shailendar Maurya</div>
                                </div>
                                <div className="spec-item">
                                    <div className="spec-label">Name of Publisher:</div>
                                    <div className="spec-value">Maurya Education and Research Foundation, Jaipur, Rajasthan, India</div>
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '40px', borderTop: '1px solid var(--border-color)', paddingTop: '30px' }}>
                            <button 
                                onClick={openGmail} 
                                className="btn btn-accent" 
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
                                                                href={getEmbeddableDriveUrl(art.pdfurl)} 
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
