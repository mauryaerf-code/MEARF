import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "RISSR Academic Journals",
  description: "Browse academic journals managed by the Rajasthan Institute of Social Science Research (RISSR).",
};

export default function JournalsLanding() {
    return (
        <>
            <section className="hero" style={{ padding: '60px 0', backgroundImage: `linear-gradient(135deg, rgba(7, 17, 36, 0.9) 0%, rgba(15, 32, 70, 0.8) 100%), url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop')` }}>
                <div className="container text-center">
                    <h1 style={{ color: 'var(--text-light)', fontSize: '2.75rem', marginBottom: '10px' }}>RISSR Academic Journals</h1>
                    <p style={{ color: 'var(--accent)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 0 }}>Rajasthan Institute of Social Science Research (NITI Aayog Recognized)</p>
                </div>
            </section>

            <section className="section" id="journals-portal-overview">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Peer-Reviewed Journals</h2>
                        <p>We publish two independent peer-reviewed international journals providing platforms for multidisciplinary research work.</p>
                    </div>

                    <div className="grid grid-2" style={{ gap: '40px' }}>
                        {/* Journal 1 Card */}
                        <div className="card card-accent" style={{ padding: '40px', backgroundColor: 'var(--bg-white)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                            <div>
                                <span className="badge badge-accent" style={{ marginBottom: '15px' }}>ISSN: 3048-846X</span>
                                <h3 style={{ fontSize: '1.6rem', marginBottom: '15px', color: 'var(--primary-dark)' }}>1. शोध उन्नयन (Shodh Unnayan)</h3>
                                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>
                                    Peer-reviewed refereed multidisciplinary quarterly international journal in the Hindi language. It publishes original research papers in humanities, education, technology, and social sciences.
                                </p>
                                <div className="journal-meta" style={{ marginTop: '20px' }}>
                                    <div className="meta-row"><span className="meta-label">Frequency:</span><span className="meta-value">Quarterly</span></div>
                                    <div className="meta-row"><span className="meta-label">Language:</span><span className="meta-value">Hindi</span></div>
                                    <div className="meta-row"><span className="meta-label">Format:</span><span className="meta-value">Kruti Dev 010 font</span></div>
                                </div>
                            </div>
                            <div style={{ marginTop: '30px' }}>
                                <Link href="/journals/shodh-unnayan" className="btn btn-accent" style={{ width: '100%', textAlign: 'center' }}>
                                    Guidelines & Submissions
                                </Link>
                            </div>
                        </div>

                        {/* Journal 2 Card */}
                        <div className="card" style={{ padding: '40px', backgroundColor: 'var(--bg-white)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', border: '1px solid var(--border-color)' }}>
                            <div>
                                <span className="badge badge-primary" style={{ marginBottom: '15px' }}>ISSN: 3049-3609</span>
                                <h3 style={{ fontSize: '1.6rem', marginBottom: '15px', color: 'var(--primary-dark)' }}>2. The Scholar's Real View</h3>
                                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>
                                    Peer-reviewed refereed multidisciplinary half-yearly international journal published in the English language. It is dedicated to highlighting original research contributions, book reviews, and academic papers.
                                </p>
                                <div className="journal-meta" style={{ marginTop: '20px' }}>
                                    <div className="meta-row"><span className="meta-label">Frequency:</span><span className="meta-value">Half-Yearly</span></div>
                                    <div className="meta-row"><span className="meta-label">Language:</span><span className="meta-value">English</span></div>
                                    <div className="meta-row"><span className="meta-label">Format:</span><span className="meta-value">MLA or APA referencing</span></div>
                                </div>
                            </div>
                            <div style={{ marginTop: '30px' }}>
                                <Link href="/journals/scholars-view" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                                    Guidelines & Submissions
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
