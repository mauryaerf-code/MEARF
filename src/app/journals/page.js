import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "Research Journals (Published by RISSR & MERF)",
  description: "Explore peer-reviewed multidisciplinary academic journals published by Rajasthan Institute of Social Science Research (RISSR) under MERF. Call for research papers.",
  keywords: [
    "Research Journals (Published by RISSR & MERF)",
    "Research Journals Published by RISSR & MERF",
    "Research Journals",
    "RISSR Academic Journals",
    "MERF Research Journals",
    "Rajasthan Institute of Social Science Research",
    "Maurya Education and Research Foundation journals",
    "peer reviewed journals Jaipur Rajasthan",
    "multidisciplinary research journal India",
    "call for research papers 2026",
    "publish research paper Jaipur",
    "refereed journal publications India",
    "Shodh Unnayan",
    "The Scholars Real View",
    "Vanijyam VIJCMBS",
    "Reforming Research online journal",
    "academic research journals India",
    "Dr Shailendar Maurya journals"
  ],
  alternates: {
    canonical: "/journals",
  },
  openGraph: {
    title: "Research Journals (Published by RISSR & MERF)",
    description: "Submit and read peer-reviewed research papers in social sciences, humanities, commerce, and multidisciplinary studies.",
    url: "https://www.mauryaerf.com/journals",
    siteName: "Maurya Education and Research Foundation",
    images: [{ url: "/assets/logo.jpeg", width: 800, height: 800, alt: "Research Journals RISSR MERF" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Research Journals (Published by RISSR & MERF)",
    description: "Browse academic research journals published by RISSR (MERF) in Jaipur, Rajasthan.",
    images: ["/assets/logo.jpeg"],
  },
};

const journalsSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Research Journals (Published by RISSR & MERF)",
  url: "https://www.mauryaerf.com/journals",
  description: "Collection of peer-reviewed international academic journals by Rajasthan Institute of Social Science Research (RISSR).",
  publisher: {
    "@type": "EducationalOrganization",
    name: "Maurya Education and Research Foundation",
    url: "https://www.mauryaerf.com"
  }
};

export default function JournalsLanding() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(journalsSchema) }}
            />
            <section className="hero" style={{ padding: '60px 0', backgroundImage: `linear-gradient(135deg, rgba(7, 17, 36, 0.9) 0%, rgba(15, 32, 70, 0.8) 100%), url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop')` }}>
                <div className="container text-center">
                    <h1 style={{ color: 'var(--text-light)', fontSize: '2.75rem', marginBottom: '10px' }}>Research Journals</h1>
                    <p style={{ color: 'var(--accent)', fontSize: '1.1rem', letterSpacing: '0.5px', marginBottom: 0 }}>(Published by RISSR &amp; MERF)</p>
                </div>
            </section>

            <section className="section" id="about-rissr-section" style={{ backgroundColor: 'var(--bg-white)', paddingBottom: '20px' }}>
                <div className="container">
                    <div className="card" style={{ padding: '30px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                        <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-dark)', marginBottom: '15px' }}>About RISSR</h2>
                        <p style={{ fontSize: '1.02rem', fontFamily: '"Outfit", "Inter", sans-serif', lineHeight: '1.8', color: 'var(--text-dark)', textAlign: 'justify', margin: 0 }}>
                            <strong>Rajasthan Institute of Social Science Research (RISSR)</strong> is the academic research wing of Maurya Education and Research Foundation (MERF), recognized by NITI Aayog, Government of India. RISSR operates the unified peer-review infrastructure, editorial guidelines, and academic dissemination for four independent international journals: <em>Reforming Research (Online Journal)</em>, <em>शोध उन्नयन (Shodh Unnayan)</em>, <em>The Scholar's Real View</em>, and <em>Vanijyam (VIJCMBS)</em>. It provides a leading forum for sharing original, critical, and solution-oriented research contributions across Social Sciences, Humanities, Law, Education, Commerce, Management, Technology, and Allied disciplines.
                        </p>
                    </div>
                </div>
            </section>

            <section className="section" id="journals-portal-overview" style={{ paddingTop: '20px' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Our Peer-Reviewed Journals</h2>
                        <p>We publish four independent peer-reviewed international journals providing platforms for multidisciplinary research work.</p>
                    </div>

                    <div className="grid grid-2" style={{ gap: '30px' }}>
                        {/* Journal 1 Card: Reforming Research */}
                        <div className="card" style={{ padding: '30px', backgroundColor: 'var(--bg-white)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                            <div>
                                <span className="badge badge-accent" style={{ marginBottom: '15px' }}>ISSN: ..............</span>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '15px', color: 'var(--primary-dark)' }}>1. Reforming Research (Online Journal)</h3>
                                <p style={{ fontSize: '0.88rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>
                                    An International Peer Reviewed Refered Interdisciplinary Quarterly Online Journal in Multi-Language. Global platform showcasing critical and solution-oriented research across Social Sciences, Humanity, Law, Education, Commerce, and Technology.
                                </p>
                                <div className="journal-meta" style={{ marginTop: '20px' }}>
                                    <div className="meta-row"><span className="meta-label">Frequency:</span><span className="meta-value">Quarterly</span></div>
                                    <div className="meta-row"><span className="meta-label">Language:</span><span className="meta-value">Multiple Languages</span></div>
                                    <div className="meta-row"><span className="meta-label">Format:</span><span className="meta-value">Online Publication</span></div>
                                    <div className="meta-row"><span className="meta-label">Chief Editor:</span><span className="meta-value">Dr. Shailendar Maurya</span></div>
                                </div>
                            </div>
                            <div style={{ marginTop: '30px' }}>
                                <Link href="/journals/reforming-research" className="btn btn-accent btn-sm" style={{ width: '100%', textAlign: 'center' }}>
                                    Guidelines & Submissions
                                </Link>
                            </div>
                        </div>

                        {/* Journal 2 Card: Shodh Unnayan */}
                        <div className="card card-accent" style={{ padding: '30px', backgroundColor: 'var(--bg-white)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                            <div>
                                <span className="badge badge-accent" style={{ marginBottom: '15px' }}>ISSN: 3048-846X</span>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '15px', color: 'var(--primary-dark)' }}>2. शोध उन्नयन (Shodh Unnayan)</h3>
                                <p style={{ fontSize: '0.88rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>
                                    Peer-reviewed refereed multidisciplinary quarterly international journal in the Hindi language. It publishes original research papers in humanities, education, technology, and social sciences.
                                </p>
                                <div className="journal-meta" style={{ marginTop: '20px' }}>
                                    <div className="meta-row"><span className="meta-label">Frequency:</span><span className="meta-value">Quarterly</span></div>
                                    <div className="meta-row"><span className="meta-label">Language:</span><span className="meta-value">Hindi</span></div>
                                    <div className="meta-row"><span className="meta-label">Format:</span><span className="meta-value">Kruti Dev 010 font</span></div>
                                </div>
                            </div>
                            <div style={{ marginTop: '30px' }}>
                                <Link href="/journals/shodh-unnayan" className="btn btn-accent btn-sm" style={{ width: '100%', textAlign: 'center' }}>
                                    Guidelines & Submissions
                                </Link>
                             </div>
                        </div>

                        {/* Journal 3 Card: The Scholar's Real View */}
                        <div className="card" style={{ padding: '30px', backgroundColor: 'var(--bg-white)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                            <div>
                                <span className="badge badge-primary" style={{ marginBottom: '15px' }}>ISSN: 3049-3609</span>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '15px', color: 'var(--primary-dark)' }}>3. The Scholar's Real View</h3>
                                <p style={{ fontSize: '0.88rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>
                                    Peer-reviewed refereed multidisciplinary half-yearly international journal published in the English language. It is dedicated to highlighting original research contributions, book reviews, and academic papers.
                                </p>
                                <div className="journal-meta" style={{ marginTop: '20px' }}>
                                    <div className="meta-row"><span className="meta-label">Frequency:</span><span className="meta-value">Half-Yearly</span></div>
                                    <div className="meta-row"><span className="meta-label">Language:</span><span className="meta-value">English</span></div>
                                    <div className="meta-row"><span className="meta-label">Format:</span><span className="meta-value">MLA or APA referencing</span></div>
                                </div>
                            </div>
                            <div style={{ marginTop: '30px' }}>
                                <Link href="/journals/scholars-real-view" className="btn btn-primary btn-sm" style={{ width: '100%', textAlign: 'center' }}>
                                    Guidelines & Submissions
                                </Link>
                            </div>
                        </div>

                        {/* Journal 4 Card: Vanijyam (VIJCMBS) */}
                        <div className="card" style={{ padding: '30px', backgroundColor: 'var(--bg-white)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                            <div>
                                <span className="badge badge-primary" style={{ marginBottom: '15px' }}>ISSN: ..........</span>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '15px', color: 'var(--primary-dark)' }}>4. Vanijyam (VIJCMBS)</h3>
                                <p style={{ fontSize: '0.88rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>
                                    Vanijyam International Journal of Commerce, Management and Business Studies (VIJCMBS). An International Peer Reviewed Refered Annually Journal in Multi-Language covering commerce, management, and economics.
                                </p>
                                <div className="journal-meta" style={{ marginTop: '20px' }}>
                                    <div className="meta-row"><span className="meta-label">Frequency:</span><span className="meta-value">Yearly / Annually</span></div>
                                    <div className="meta-row"><span className="meta-label">Language:</span><span className="meta-value">Multiple Languages</span></div>
                                    <div className="meta-row"><span className="meta-label">Format:</span><span className="meta-value">Print Publication</span></div>
                                    <div className="meta-row"><span className="meta-label">Chief Editor:</span><span className="meta-value">Dr. Vinod Kumar Meena</span></div>
                                </div>
                            </div>
                            <div style={{ marginTop: '30px' }}>
                                <Link href="/journals/vanijyam" className="btn btn-primary btn-sm" style={{ width: '100%', textAlign: 'center' }}>
                                    Guidelines & Submissions
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dedicated Manuscript Submission Portal Section */}
            <section className="section" id="manuscript-submission" style={{ backgroundColor: 'var(--bg-white)', borderTop: '1px solid var(--border-color)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Manuscript Submission Portal</h2>
                        <p>All four journals operate under RISSR's rigorous, double-blind peer-review system. Submit your original research manuscript directly to the respective journal's editorial office.</p>
                    </div>

                    <div className="grid grid-4" style={{ gap: '20px' }}>
                        {/* 1. Reforming Research */}
                        <div className="card" style={{ padding: '25px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h4 style={{ color: 'var(--primary-dark)', fontSize: '1.15rem', marginBottom: '8px' }}>1. Reforming Research</h4>
                                <span className="badge badge-accent" style={{ marginBottom: '12px' }}>Online Quarterly</span>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '15px' }}>
                                    Multi-language interdisciplinary online journal. Scope: Social Sciences, Humanities, Law, Education, Commerce, Tech.
                                </p>
                                <p style={{ fontSize: '0.82rem', marginBottom: '5px' }}>
                                    <strong>Submission Email:</strong><br />
                                    <a href="mailto:drshailendar@mauryaerf.com?subject=Manuscript Submission - Reforming Research" style={{ color: 'var(--primary)', wordBreak: 'break-all' }}>
                                        drshailendar@mauryaerf.com
                                    </a>
                                </p>
                            </div>
                            <Link href="/journals/reforming-research" className="btn btn-outline btn-sm" style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>
                                View Guidelines
                            </Link>
                        </div>

                        {/* 2. Shodh Unnayan */}
                        <div className="card" style={{ padding: '25px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h4 style={{ color: 'var(--primary-dark)', fontSize: '1.15rem', marginBottom: '8px' }}>2. शोध उन्नयन</h4>
                                <span className="badge badge-accent" style={{ marginBottom: '12px' }}>Hindi Quarterly</span>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '15px' }}>
                                    Hindi multidisciplinary peer-reviewed quarterly journal. Format: Kruti Dev 010 / DevLys 010, font size 14.
                                </p>
                                <p style={{ fontSize: '0.82rem', marginBottom: '5px' }}>
                                    <strong>Submission Email:</strong><br />
                                    <a href="mailto:drshailendar@mauryaerf.com?subject=Manuscript Submission - Shodh Unnayan" style={{ color: 'var(--primary)', wordBreak: 'break-all' }}>
                                        drshailendar@mauryaerf.com
                                    </a>
                                </p>
                            </div>
                            <Link href="/journals/shodh-unnayan" className="btn btn-outline btn-sm" style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>
                                View Guidelines
                            </Link>
                        </div>

                        {/* 3. The Scholar's Real View */}
                        <div className="card" style={{ padding: '25px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h4 style={{ color: 'var(--primary-dark)', fontSize: '1.15rem', marginBottom: '8px' }}>3. The Scholar's Real View</h4>
                                <span className="badge badge-primary" style={{ marginBottom: '12px' }}>English Half-Yearly</span>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '15px' }}>
                                    English multidisciplinary refereed journal. Format: Times New Roman, APA / MLA referencing.
                                </p>
                                <p style={{ fontSize: '0.82rem', marginBottom: '5px' }}>
                                    <strong>Submission Email:</strong><br />
                                    <a href="mailto:editorthescholarview@gmail.com?subject=Manuscript Submission - The Scholar's Real View" style={{ color: 'var(--primary)', wordBreak: 'break-all' }}>
                                        editorthescholarview@gmail.com
                                    </a>
                                </p>
                            </div>
                            <Link href="/journals/scholars-real-view" className="btn btn-outline btn-sm" style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>
                                View Guidelines
                            </Link>
                        </div>

                        {/* 4. Vanijyam */}
                        <div className="card" style={{ padding: '25px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h4 style={{ color: 'var(--primary-dark)', fontSize: '1.15rem', marginBottom: '8px' }}>4. Vanijyam (VIJCMBS)</h4>
                                <span className="badge badge-primary" style={{ marginBottom: '12px' }}>Multi-Language Annually</span>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '15px' }}>
                                    Commerce, management, business studies, economics, finance & banking journal.
                                </p>
                                <p style={{ fontSize: '0.82rem', marginBottom: '5px' }}>
                                    <strong>Submission Email:</strong><br />
                                    <a href="mailto:editorvanijam@gmail.com?subject=Manuscript Submission - Vanijyam" style={{ color: 'var(--primary)', wordBreak: 'break-all' }}>
                                        editorvanijam@gmail.com
                                    </a>
                                </p>
                            </div>
                            <Link href="/journals/vanijyam" className="btn btn-outline btn-sm" style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>
                                View Guidelines
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
