'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
    const [counts, setCounts] = useState({ journals: 0, year: 0, conferences: 0, programs: 0 });

    useEffect(() => {
        // Animate counters
        const targets = { journals: 2, year: 2022, conferences: 50, programs: 6 };
        const duration = 1000; // 1 second
        const steps = 30;
        const stepTime = duration / steps;
        
        let step = 0;
        const timer = setInterval(() => {
            step++;
            setCounts({
                journals: Math.min(targets.journals, Math.round((targets.journals / steps) * step)),
                year: Math.min(targets.year, Math.round((targets.year / steps) * step)),
                conferences: Math.min(targets.conferences, Math.round((targets.conferences / steps) * step)),
                programs: Math.min(targets.programs, Math.round((targets.programs / steps) * step)),
            });
            if (step >= steps) clearInterval(timer);
        }, stepTime);

        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <section className="hero" id="home-hero-banner" style={{ backgroundImage: `linear-gradient(135deg, rgba(7, 17, 36, 0.95) 0%, rgba(15, 32, 70, 0.85) 100%), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop')` }}>
                <div className="container">
                    <div className="hero-content">
                        <h1 style={{ fontSize: '3.25rem', fontWeight: '800', color: 'var(--text-light)', marginBottom: '15px', lineHeight: '1.2' }}>
                            <span style={{ color: 'var(--accent)' }}>Maurya Education</span> and Research Foundation
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-light-muted)', fontWeight: '600', marginBottom: '25px', letterSpacing: '0.5px' }}>
                            Promoting Research, Academic Excellence & Social Welfare
                        </p>
                        <div className="hero-btns">
                            <Link href="/journals" className="btn btn-accent" id="hero-btn-journals">
                                Explore Journals
                            </Link>
                            <Link href="/social-welfare" className="btn btn-outline-white" id="hero-btn-social">
                                Our Social Impact
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stats-section" id="stats-section-counter">
                <div className="container">
                    <div className="grid grid-4">
                        <div className="stat-item" id="stat-journals">
                            <div className="stat-number">{counts.journals}</div>
                            <div className="stat-label">ISSN Academic Journals</div>
                        </div>
                        <div className="stat-item" id="stat-publications">
                            <div className="stat-number">{counts.year}</div>
                            <div className="stat-label">Publishing Since</div>
                        </div>
                        <div className="stat-item" id="stat-conferences">
                            <div className="stat-number">{counts.conferences}+</div>
                            <div className="stat-label">Conferences & Seminars</div>
                        </div>
                        <div className="stat-item" id="stat-programs">
                            <div className="stat-number">{counts.programs}</div>
                            <div className="stat-label">Core Social Initiatives</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" id="about-summary-section">
                <div className="container">
                    <div className="grid grid-2">
                        <div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Welcome to Maurya Education and Research Foundation</h2>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '25px' }}>
                                <strong>MERF</strong> is registered , committed to enhancing higher education quality, promoting research culture, and fostering academic collaboration worldwide.
                            </p>
                            <p>
                                We operate independently and collaborate closely with students, researchers, academicians, and educational institutions across India. From organizing national and international conferences to publishing ISBN-registered books and ISSN-registered academic journals, we support academic growth in every dimension.
                            </p>
                            <div style={{ marginTop: '30px' }}>
                                <Link href="/about" className="btn btn-primary" id="about-readmore-btn">
                                    Read More About Us
                                </Link>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="card card-accent" style={{ width: '100%', maxWidth: '500px', padding: '40px', backgroundColor: 'var(--primary)', color: 'var(--text-light)' }}>
                                <h3 style={{ color: 'var(--accent)', fontSize: '1.6rem', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>Our Vision</h3>
                                <p style={{ color: 'var(--text-light-muted)', lineHeight: '1.8', fontSize: '1.05rem', fontStyle: 'italic', marginBottom: '30px' }}>
                                    "To integrate intellectual ideas globally and promote innovation, research culture, and academic excellence, improving educational practices and encouraging the practical application of research outcomes for societal development."
                                </p>
                                <h3 style={{ color: 'var(--accent)', fontSize: '1.6rem', marginBottom: '15px', fontFamily: 'var(--font-heading)' }}>Our Core Pillars</h3>
                                <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'grid', gap: '10px' }}>
                                    <li><i className="fas fa-check-circle" style={{ color: 'var(--accent)', marginRight: '10px' }}></i> Academic Research (RISSR)</li>
                                    <li><i className="fas fa-check-circle" style={{ color: 'var(--accent)', marginRight: '10px' }}></i> Book & Journal Publishing</li>
                                    <li><i className="fas fa-check-circle" style={{ color: 'var(--accent)', marginRight: '10px' }}></i> Conferences & Training</li>
                                    <li><i className="fas fa-check-circle" style={{ color: 'var(--accent)', marginRight: '10px' }}></i> Women Empowerment (SVBSPS)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" id="organization-wings-section" style={{ backgroundColor: 'var(--bg-white)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Our Organizational Wings</h2>
                        <p>Discover the departments and initiatives managed under the Maurya Education and Research Foundation umbrella.</p>
                    </div>
                    
                    <div className="grid grid-3">
                        <div className="card" id="wing-card-rissr">
                            <div className="card-icon"><i className="fas fa-graduation-cap"></i></div>
                            <h3 className="card-title">Research & Journals (RISSR)</h3>
                            <p>Managed under the Rajasthan Institute of Social Science Research. Recognized by NITI Aayog, Government of India. Publishes two peer-reviewed academic journals with ISSN registration.</p>
                            <Link href="/journals" className="btn btn-outline btn-sm" style={{ marginTop: '15px' }}>
                                Explore Journals
                            </Link>
                        </div>

                        <div className="card" id="wing-card-publications">
                            <div className="card-icon"><i className="fas fa-book"></i></div>
                            <h3 className="card-title">Maurya Publications</h3>
                            <p>Established in 2022. Serving as an ideal platform for authors to get books and monographs published with ISBN registration. Publishing services in English and Hindi.</p>
                            <Link href="/publications" className="btn btn-outline btn-sm" style={{ marginTop: '15px' }}>
                                Book Publishing
                            </Link>
                        </div>

                        <div className="card" id="wing-card-svbsps">
                            <div className="card-icon"><i className="fas fa-hands-helping"></i></div>
                            <h3 className="card-title">Social Welfare (SVBSPS)</h3>
                            <p>Under the Swami Vivekanand Balika Shiksha Prachar Samiti. Focused on girl child education, vocational training, health awareness, and environmental sustainability.</p>
                            <Link href="/social-welfare" className="btn btn-outline btn-sm" style={{ marginTop: '15px' }}>
                                Social Initiatives
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" id="featured-journals-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Peer-Reviewed ISSN Journals</h2>
                        <p>Read research papers and submit original, unpublished manuscripts to our recognized multidisciplinary journals.</p>
                    </div>

                    <div className="grid grid-2">
                        <div className="card" id="journal-shodh-unnayan-card" style={{ padding: '30px' }}>
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                <div style={{ flex: '0 0 120px', maxWidth: '120px' }}>
                                    <img src="/assets/home/Shodh Unnayan.png" alt="Shodh Unnayan Journal Cover" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }} />
                                </div>
                                <div style={{ flex: '1', minWidth: '200px' }}>
                                    <span className="badge badge-accent" style={{ marginBottom: '10px' }}>Hindi Quarterly</span>
                                    <h3 className="card-title" style={{ marginTop: '5px' }}>Shodh Unnayan</h3>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>Peer-reviewed refereed multidisciplinary quarterly international journal published in the Hindi language, showcasing original research papers.</p>
                                    
                                    <div className="journal-meta" style={{ marginBottom: '20px' }}>
                                        <div className="meta-row">
                                            <span className="meta-label">ISSN:</span>
                                            <span className="meta-value">3048-846X</span>
                                        </div>
                                        <div className="meta-row">
                                            <span className="meta-label">Chief Editor:</span>
                                            <span className="meta-value">Dr. Shailendar Maurya</span>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Link href="/journals/shodh-unnayan" className="btn btn-primary btn-sm">
                                            Author Guidelines
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card" id="journal-scholars-view-card" style={{ padding: '30px' }}>
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                <div style={{ flex: '0 0 120px', maxWidth: '120px' }}>
                                    <img src="/assets/home/Scholar.png" alt="The Scholar's Real View Cover" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }} />
                                </div>
                                <div style={{ flex: '1', minWidth: '200px' }}>
                                    <span className="badge badge-primary" style={{ marginBottom: '10px' }}>English Half-Yearly</span>
                                    <h3 className="card-title" style={{ marginTop: '5px' }}>The Scholar's Real View</h3>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>Peer-reviewed refereed multidisciplinary half-yearly international journal published in the English language, encouraging quality academic discussion.</p>
                                    
                                    <div className="journal-meta" style={{ marginBottom: '20px' }}>
                                        <div className="meta-row">
                                            <span className="meta-label">ISSN:</span>
                                            <span className="meta-value">3049-3609</span>
                                        </div>
                                        <div className="meta-row">
                                            <span className="meta-label">Chief Editor:</span>
                                            <span className="meta-value">Dr. Shailendar Maurya</span>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Link href="/journals/scholars-view" className="btn btn-primary btn-sm">
                                            Author Guidelines
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section-alt" id="motto-callout-section">
                <div className="container text-center">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', fontFamily: 'var(--font-heading)', color: 'var(--accent-light)' }}>
                        "Arise, Awake and Stop Not till the Goal is Reached"
                    </h2>
                    <p style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 40px auto', color: 'var(--text-light-muted)' }}>
                        Our social wing, SVBSPS, works relentlessly towards girl child education, vocational skill development, health and environmental preservation across communities.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                        <Link href="/social-welfare" className="btn btn-accent" id="motto-btn-initiatives">
                            Our 6 Social Initiatives
                        </Link>
                        <Link href="/contact" className="btn btn-outline-white" id="motto-btn-volunteer">
                            Get Involved
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
