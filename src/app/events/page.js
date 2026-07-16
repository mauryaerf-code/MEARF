'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Events() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data, error } = await supabase
                    .from('merf_events')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (!error && data) {
                    const mappedEvents = data.map(evt => ({
                        id: evt.id,
                        title: evt.title,
                        type: evt.type,
                        startDate: evt.date,
                        location: evt.location,
                        mode: '',
                        audience: '',
                        description: evt.description || '',
                        registrationlink: evt.registrationlink || ''
                    }));
                    setEvents(mappedEvents);
                    localStorage.setItem('merf_events_cache', JSON.stringify(mappedEvents));
                } else {
                    if (error) console.error("Error fetching events:", error.message);
                    const storedEvents = localStorage.getItem('merf_events_cache');
                    if (storedEvents) {
                        setEvents(JSON.parse(storedEvents));
                    }
                }
            } catch (err) {
                console.error("Failed to query events:", err);
            }
        };
        fetchEvents();
    }, []);



    return (
        <>
            <section className="hero" style={{ padding: '60px 0', backgroundImage: `linear-gradient(135deg, rgba(7, 17, 36, 0.9) 0%, rgba(15, 32, 70, 0.8) 100%), url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop')` }}>
                <div className="container text-center">
                    <h1 style={{ color: 'var(--text-light)', fontSize: '2.75rem', marginBottom: '10px' }}>Extension (Academic Events)</h1>
                    <p style={{ color: 'var(--accent)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 0 }}>Conferences, National Seminars, FDPs, & Workshops</p>
                </div>
            </section>

            <section className="section" id="events-intro">
                <div className="container">
                    <div className="grid grid-3" style={{ gap: '30px' }}>
                        {/* Column 1: Extension */}
                        <div className="card" style={{ padding: '30px', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ fontSize: '2rem', color: 'var(--accent-dark)', marginBottom: '15px' }}><i className="fas fa-seedling"></i></div>
                            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', marginBottom: '15px', fontWeight: '600' }}>Extension</h3>
                            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'grid', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                <li><i className="fas fa-check" style={{ color: 'var(--accent-dark)', marginRight: '8px' }}></i> Foster socially responsible educational practices</li>
                                <li><i className="fas fa-check" style={{ color: 'var(--accent-dark)', marginRight: '8px' }}></i> Promote sustainable development across economic and social dimensions</li>
                                <li><i className="fas fa-check" style={{ color: 'var(--accent-dark)', marginRight: '8px' }}></i> Run Education Programs based on sustainable development</li>
                                <li><i className="fas fa-check" style={{ color: 'var(--accent-dark)', marginRight: '8px' }}></i> FDPs for educators on integrating Indian Knowledge Systems into curriculum as per NEP 2020 & UGC framework</li>
                            </ul>
                        </div>

                        {/* Column 2: Extension Activities */}
                        <div className="card" style={{ padding: '30px', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ fontSize: '2rem', color: 'var(--accent-dark)', marginBottom: '15px' }}><i className="fas fa-chalkboard-teacher"></i></div>
                            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', marginBottom: '15px', fontWeight: '600' }}>Extension Activities</h3>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px', fontStyle: 'italic' }}>Based on Teaching & Training:</p>
                            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'grid', gap: '10px', fontSize: '0.88rem', color: 'var(--text-dark)', fontWeight: '500' }}>
                                <li><i className="fas fa-chevron-right" style={{ color: 'var(--accent-dark)', marginRight: '8px', fontSize: '0.75rem' }}></i> Education Workshops</li>
                                <li><i className="fas fa-chevron-right" style={{ color: 'var(--accent-dark)', marginRight: '8px', fontSize: '0.75rem' }}></i> Community Outreach</li>
                                <li><i className="fas fa-chevron-right" style={{ color: 'var(--accent-dark)', marginRight: '8px', fontSize: '0.75rem' }}></i> Digital Extension</li>
                                <li><i className="fas fa-chevron-right" style={{ color: 'var(--accent-dark)', marginRight: '8px', fontSize: '0.75rem' }}></i> Teacher Training</li>
                                <li><i className="fas fa-chevron-right" style={{ color: 'var(--accent-dark)', marginRight: '8px', fontSize: '0.75rem' }}></i> Student Training</li>
                            </ul>
                        </div>

                        {/* Column 3: Extension (Academic Events) */}
                        <div className="card" style={{ padding: '30px', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ fontSize: '2rem', color: 'var(--accent-dark)', marginBottom: '15px' }}><i className="fas fa-graduation-cap"></i></div>
                            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', marginBottom: '15px', fontWeight: '600' }}>Academic Events</h3>
                            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'grid', gap: '10px', fontSize: '0.88rem', color: 'var(--text-dark)', fontWeight: '500' }}>
                                <li><i className="fas fa-star" style={{ color: 'var(--accent-dark)', marginRight: '8px', fontSize: '0.75rem' }}></i> International Conference</li>
                                <li><i className="fas fa-star" style={{ color: 'var(--accent-dark)', marginRight: '8px', fontSize: '0.75rem' }}></i> National Seminar</li>
                                <li><i className="fas fa-star" style={{ color: 'var(--accent-dark)', marginRight: '8px', fontSize: '0.75rem' }}></i> Faculty Development Programme</li>
                                <li><i className="fas fa-star" style={{ color: 'var(--accent-dark)', marginRight: '8px', fontSize: '0.75rem' }}></i> All Workshop</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" id="active-events-list" style={{ backgroundColor: 'var(--bg-white)', paddingTop: '20px' }}>
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
        </>
    );
}
