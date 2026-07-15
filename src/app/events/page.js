'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const DEFAULT_EVENTS = [
    {
        id: "evt-1",
        title: "Integrating Indian Knowledge Systems into Higher Education Curriculums",
        type: "National Seminar",
        startDate: "2026-08-12",
        location: "Jaipur, Rajasthan (Hybrid)",
        mode: "hybrid",
        audience: "Higher Education Educators & Principals"
    },
    {
        id: "evt-2",
        title: "6-Day Faculty Development Programme on Modern Research Methodologies",
        type: "FDP",
        startDate: "2026-09-20",
        location: "Online",
        mode: "online",
        audience: "Assistant Professors, Ph.D. Scholars & Researchers"
    }
];

export default function Events() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('merf_events')
                .select('*')
                .order('created_at', { ascending: false });
            if (!error && data && data.length > 0) {
                const mappedEvents = data.map(evt => ({
                    id: evt.id,
                    title: evt.title,
                    type: evt.type,
                    startDate: evt.date,
                    location: evt.location,
                    mode: 'hybrid',
                    audience: 'Academic Educators & Researchers',
                    description: evt.description || '',
                    registrationlink: evt.registrationlink || ''
                }));
                setEvents(mappedEvents);
            } else {
                const storedEvents = localStorage.getItem('merf_events');
                if (storedEvents) {
                    setEvents(JSON.parse(storedEvents));
                } else {
                    setEvents(DEFAULT_EVENTS);
                    localStorage.setItem('merf_events', JSON.stringify(DEFAULT_EVENTS));
                }
            }
        };
        fetchEvents();
    }, []);



    return (
        <>
            <section className="hero" style={{ padding: '60px 0', backgroundImage: `linear-gradient(135deg, rgba(7, 17, 36, 0.9) 0%, rgba(15, 32, 70, 0.8) 100%), url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop')` }}>
                <div className="container text-center">
                    <h1 style={{ color: 'var(--text-light)', fontSize: '2.75rem', marginBottom: '10px' }}>Extension & Academic Events</h1>
                    <p style={{ color: 'var(--accent)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 0 }}>Conferences, National Seminars, FDPs, & Workshops</p>
                </div>
            </section>

            <section className="section" id="events-intro">
                <div className="container">
                    <div className="grid grid-2">
                        <div>
                            <h2 style={{ fontSize: '1.85rem', marginBottom: '20px' }}>Collaborative Academic Interaction</h2>
                            <p style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                                A core mission of <strong>MERF</strong> is creating platforms for academic interaction, professional development, and research dissemination through collaboration with universities and academic institutions throughout India.
                            </p>
                            <p>
                                We regularly organize <strong>Faculty Development Programmes (FDPs)</strong> and <strong>Short-term Development Programmes (SDPs)</strong> to help educators upgrade their teaching methodologies, with a particular focus on integrating the <strong>Indian Knowledge System (IKS)</strong> into secondary and higher-education curriculums under the <strong>NEP 2020</strong> and UGC frameworks.
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="card card-accent" style={{ width: '100%', maxWidth: '450px', backgroundColor: 'var(--bg-white)' }}>
                                <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-dark)', marginBottom: '15px' }}>Focus Areas of Extensions:</h3>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '10px', fontSize: '0.9rem' }}>
                                    <li><i className="fas fa-check" style={{ color: 'var(--accent-dark)', marginRight: '10px' }}></i> International & National Conferences</li>
                                    <li><i className="fas fa-check" style={{ color: 'var(--accent-dark)', marginRight: '10px' }}></i> Curriculum Integration Workshops</li>
                                    <li><i className="fas fa-check" style={{ color: 'var(--accent-dark)', marginRight: '10px' }}></i> NEP 2020 FDPs for Higher Education</li>
                                    <li><i className="fas fa-check" style={{ color: 'var(--accent-dark)', marginRight: '10px' }}></i> Teacher and Student Training Programs</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" id="active-events-list" style={{ backgroundColor: 'var(--bg-white)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Upcoming & Active Events</h2>
                        <p>Register online to secure a seat at our upcoming workshops, seminars, and training programs.</p>
                    </div>

                    {/* Dynamic Event Container aligned with book catalog styling */}
                    <div className="catalog-grid">
                        {events.map((evt) => (
                            <div className="catalog-card" key={evt.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ width: '100%' }}>
                                    <div className="flex-between" style={{ marginBottom: '15px', flexWrap: 'wrap', gap: '5px' }}>
                                        <span className="badge badge-accent" style={{ fontSize: '0.75rem' }}>{evt.type}</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                                            <i className="far fa-calendar-alt"></i> {evt.startDate}
                                        </span>
                                    </div>
                                    


                                    <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '10px', lineHeight: '1.4', fontWeight: 600, minHeight: '44px', display: '-webkit-box', WebKitLineClamp: 2, WebKitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {evt.title}
                                    </h3>
                                    
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px', display: '-webkit-box', WebKitLineClamp: 3, WebKitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '50px' }}>
                                        {evt.description || "Join our upcoming academic event organized by MERF. Review the details below and reserve your seat."}
                                    </p>
                                    
                                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '10px', marginTop: '10px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <div style={{ marginBottom: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            <i className="fas fa-map-marker-alt" style={{ color: 'var(--accent-dark)', marginRight: '6px', width: '12px' }}></i> {evt.location}
                                        </div>
                                        {evt.audience && (
                                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                <i className="fas fa-users" style={{ color: 'var(--accent-dark)', marginRight: '6px', width: '12px' }}></i> {evt.audience}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div style={{ width: '100%', marginTop: '20px' }}>
                                    {evt.registrationlink ? (
                                        <a href={evt.registrationlink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                            Register Online
                                        </a>
                                    ) : (
                                        <Link href={`/contact?subject=${encodeURIComponent(`Register: ${evt.title}`)}`} className="btn btn-primary btn-sm" style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                            Register / Inquire
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {events.length === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No active events found. Check back later!</p>
                    )}
                </div>
            </section>

            <section className="section" id="past-events-archive">
                <div className="container">
                    <div className="section-header">
                        <h2>Concluded Academic Events</h2>
                        <p>A look at some of the prestigious conferences and seminars successfully organized by MERF over recent years.</p>
                    </div>

                    <div className="grid grid-3">
                        <div className="card" style={{ padding: '25px', backgroundColor: 'var(--bg-white)' }}>
                            <span className="badge badge-primary" style={{ marginBottom: '10px' }}>Concluded 2025</span>
                            <h4 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>International Conference on Multidisciplinary Research</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Organized in collaboration with MLSU University, Udaipur, with over 150 papers presented across management, arts, and sciences.</p>
                        </div>

                        <div className="card" style={{ padding: '25px', backgroundColor: 'var(--bg-white)' }}>
                            <span className="badge badge-primary" style={{ marginBottom: '10px' }}>Concluded 2025</span>
                            <h4 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>National Symposium on Women in Contemporary Social Sciences</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Addressing policy changes, girl child educational rights, and MSME support schemes. Concluded in Jaipur.</p>
                        </div>

                        <div className="card" style={{ padding: '25px', backgroundColor: 'var(--bg-white)' }}>
                            <span className="badge badge-primary" style={{ marginBottom: '10px' }}>Concluded 2024</span>
                            <h4 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>Special Workshop on NEP 2020 Implementation Goals</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Guiding secondary school educators on credit systems and multidisciplinary student courses. Over 200 teachers trained.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
