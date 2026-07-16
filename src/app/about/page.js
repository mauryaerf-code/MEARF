'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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

export default function About() {
    const [members, setMembers] = useState([]);
    const [activePhoto, setActivePhoto] = useState(null);

    useEffect(() => {
        document.title = "About Us | Maurya Education and Research Foundation";
        
        const fetchMembers = async () => {
            try {
                const { data, error } = await supabase
                    .from('merf_members')
                    .select('*')
                    .order('order_index', { ascending: true });
                if (!error && data) {
                    setMembers(data);
                }
            } catch (err) {
                console.error("Failed to fetch board members:", err);
            }
        };
        fetchMembers();
    }, []);

    return (
        <>
            <section className="hero" style={{ padding: '60px 0', backgroundImage: `linear-gradient(135deg, rgba(7, 17, 36, 0.9) 0%, rgba(15, 32, 70, 0.8) 100%), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop')` }}>
                <div className="container text-center">
                    <h1 style={{ color: 'var(--text-light)', fontSize: '2.75rem', marginBottom: '10px' }}>About Our Foundation</h1>
                    <p style={{ color: 'var(--accent)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 0 }}>Our Journey, Vision, and Governing Leadership</p>
                </div>
            </section>

            <section className="section" id="about-detailed-info">
                <div className="container">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        {/* Who We Are (Full Width) */}
                        <div>
                            <h2 style={{ fontSize: '1.85rem', marginBottom: '20px' }}>Who We Are</h2>
                            <p style={{ fontSize: '1.02rem', fontFamily: '"Outfit", "Inter", sans-serif', lineHeight: '1.8', color: 'var(--text-dark)', textAlign: 'justify', marginBottom: '15px' }}>
                                <strong>Maurya Education and Research Foundation</strong> is a Non-Government Organisation Recognized by NITI Aayog, Government of India, commonly known as <strong>MERF</strong>, is an academic and research oriented organization dedicated to promoting education, research, innovation and academic collaboration across India.
                            </p>
                            <p style={{ fontSize: '1.02rem', fontFamily: '"Outfit", "Inter", sans-serif', lineHeight: '1.8', color: 'var(--text-dark)', textAlign: 'justify', marginBottom: '15px' }}>
                                Registered under MSME, the Government of India, the organization focuses on improving the quality of education and research. MERF works closely with students, researchers, academicians and educational institutions to encourage multidisciplinary research and knowledge sharing. It organizes national and international conferences, Seminars & Workshops (FDPs & SDPs) in collaboration with universities and academic institutions throughout India. Creating platforms for academic interaction, professional development and research dissemination. The organization also supports publication activities through ISBN-registered book, souvenir & proceding publication services and ISSN-registered academic journals.
                            </p>
                            <p style={{ fontSize: '1.02rem', fontFamily: '"Outfit", "Inter", sans-serif', lineHeight: '1.8', color: 'var(--text-dark)', textAlign: 'justify', marginBottom: '15px' }}>
                                MERF working as an academic, research and educational development organization. It is committed to enhancing higher education quality, innovation and research collaboration worldwide. The organization actively conducts and supports conferences, workshops, seminars, symposiums, webinars, FDPs and short-term training programs in association with universities, colleges and research institutions. MERF promotes socially responsible educational practices, sustainable academic development and interdisciplinary research activities while collaborating with several reputed universities and institutions across India.
                            </p>
                            <p style={{ fontSize: '1.02rem', fontFamily: '"Outfit", "Inter", sans-serif', lineHeight: '1.8', color: 'var(--text-dark)', textAlign: 'justify', marginBottom: '15px' }}>
                                MERF members are faculty, researchers, graduate students and other distinguished professionals with rich and diverse expertise in education research. The organization operates independently and does not take any financial support from any government body, reflecting its commitment to self-supported academic and research development initiatives. In collaboration with several reputed universities and institutions across India, MERF regularly organizes national and international conferences with the active support of its members. These initiatives aim to foster socially responsible educational practices and promote sustainable development across economic and social dimensions in India.
                            </p>
                            <p style={{ fontSize: '1.02rem', fontFamily: '"Outfit", "Inter", sans-serif', lineHeight: '1.8', color: 'var(--text-dark)', textAlign: 'justify', marginBottom: 0 }}>
                                Over the years, MERF has successfully organized international conferences in collaboration with several reputed universities and institutions, including MLSU University, Udaipur, along with many other esteemed academic and research organizations across the country.
                            </p>
                        </div>
                        {/* Vision & Mission (Side-by-Side) */}
                        <div className="grid grid-2" style={{ gap: '30px' }}>
                            <div className="card" style={{ backgroundColor: 'var(--bg-white)', padding: '30px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                                <h3 style={{ color: 'var(--primary)', fontSize: '1.35rem', marginBottom: '10px' }}><i className="fas fa-medal" style={{ color: 'var(--accent)', marginRight: '10px' }}></i> Vision Statement</h3>
                                <p style={{ fontSize: '0.95rem', marginBottom: 0, lineHeight: '1.6' }}>
                                    To integrate intellectual ideas globally and promote innovation, research culture, and academic excellence. We strive to improve educational practices and encourage the practical application of research outcomes for sustainable societal development.
                                </p>
                            </div>
                            <div className="card" style={{ backgroundColor: 'var(--bg-white)', padding: '30px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                                <h3 style={{ color: 'var(--primary)', fontSize: '1.35rem', marginBottom: '10px' }}><i className="fas fa-bullseye" style={{ color: 'var(--accent)', marginRight: '10px' }}></i> Mission Statement</h3>
                                <p style={{ fontSize: '0.95rem', marginBottom: 0, lineHeight: '1.6' }}>
                                    To provide platforms for academic interaction, professional development, and research dissemination through journals, books, conferences, and workshops, while promoting socially responsible and sustainable community development programs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" id="founder-profile-section" style={{ backgroundColor: 'var(--bg-white)' }}>
                <div className="container">
                    <div className="grid grid-2" style={{ alignItems: 'center' }}>
                        <div className="text-center" style={{ padding: '20px' }}>
                            <div style={{ width: '250px', height: '250px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 20px auto', border: '5px solid var(--accent)', boxShadow: 'var(--shadow-lg)' }}>
                                <img src="/assets/Person/face.png" alt="Dr. Shailendar Maurya" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} />
                            </div>
                            <h3 style={{ fontSize: '1.6rem', color: 'var(--primary-dark)', marginBottom: '5px' }}>Dr. Shailendar Maurya</h3>
                            <p style={{ color: 'var(--accent-dark)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>Founder & Chief Editor</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><i className="fas fa-phone-alt"></i> +91-9636635216</p>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.85rem', marginBottom: '20px', position: 'relative', paddingBottom: '10px' }}>Message from the Founder</h2>
                            <p style={{ fontSize: '1.05rem', fontStyle: 'italic', lineHeight: '1.8', color: 'var(--primary-light)', marginBottom: '20px' }}>
                                "Welcome to the Maurya Education and Research Foundation. Our foundation is built on the principles of empowering scholars, supporting quality publication activities, and addressing community development at the grassroots level. We believe that integrating global intellectual ideas is the pathway to building a modern, sustainable nation."
                            </p>
                            <p>
                                As the Chief Editor of our peer-reviewed journals, <em>Shodh Unnayan</em> and <em>The Scholar's Real View</em>, I invite researchers, academicians, and graduate students from all fields to contribute their original research works. We are also committed to assisting budding authors through <em>Maurya Publications & Distributors</em> to publish books and monographs with ISBN registration.
                            </p>
                            <p>
                                Through our social wing, <em>Swami Vivekanand Balika Shiksha Prachar Samiti (SVBSPS)</em>, we translate our core value systems into practical community impact—ensuring that education, women's empowerment, health, and environmental sustainability go hand-in-hand.
                            </p>
                        </div>
                    </div>
                </div>
            </section>            <section className="section" id="advisory-board">
                <div className="container">
                    <div className="section-header">
                        <h2>Governing Body & Advisory Boards</h2>
                        <p>Our foundation and publication initiatives are guided by academic and professional experts from across India.</p>
                    </div>

                    {members.length > 0 ? (
                        <div style={{ marginTop: '20px' }}>
                            <style>{`
                                .members-grid {
                                    display: grid;
                                    gap: 20px;
                                    grid-template-columns: repeat(3, 1fr);
                                    margin: 25px auto 0 auto;
                                    max-width: 1150px;
                                }
                                .member-card {
                                    display: flex !important;
                                    flex-direction: row !important;
                                    align-items: flex-start !important;
                                    gap: 15px !important;
                                    padding: 15px !important;
                                    border-radius: 12px !important;
                                    border: 1px solid var(--border-color) !important;
                                    background-color: #ffffff !important;
                                    box-shadow: var(--shadow-sm) !important;
                                    width: 100% !important;
                                    overflow: hidden !important;
                                }
                                .member-card-photo {
                                    width: 68px !important;
                                    height: 68px !important;
                                    border-radius: 50% !important;
                                    overflow: hidden !important;
                                    border: 2px solid var(--accent) !important;
                                    flex-shrink: 0 !important;
                                    box-shadow: var(--shadow-sm) !important;
                                    cursor: zoom-in;
                                    transition: transform 0.2s ease;
                                }
                                .member-card-photo:hover {
                                    transform: scale(1.05);
                                }
                                .member-card-details {
                                    display: flex !important;
                                    flex-direction: column !important;
                                    text-align: left !important;
                                    overflow: hidden !important;
                                    width: 100% !important;
                                    gap: 10px !important; /* Spacious space between labels */
                                }
                                @media (max-width: 991px) {
                                    .members-grid {
                                        grid-template-columns: repeat(2, 1fr);
                                    }
                                }
                                @media (max-width: 767px) {
                                    .members-grid {
                                        grid-template-columns: repeat(2, 1fr);
                                        gap: 10px;
                                    }
                                    .member-card {
                                        padding: 12px 10px !important;
                                        gap: 10px !important;
                                    }
                                    .member-card-photo {
                                        width: 50px !important;
                                        height: 50px !important;
                                        border-width: 1.5px !important;
                                    }
                                    .member-card-details {
                                        gap: 6px !important;
                                    }
                                }
                            `}</style>
                            <div className="members-grid">
                                {members.map(member => (
                                    <div className="member-card card" key={member.id}>
                                        {/* Left Side: Photo */}
                                        <div className="member-card-photo" onClick={() => member.imageurl && setActivePhoto(getEmbeddableDriveUrl(member.imageurl))}>
                                            {member.imageurl ? (
                                                <img src={getEmbeddableDriveUrl(member.imageurl)} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-light)', color: 'var(--text-muted)' }}>
                                                    <i className="fas fa-user" style={{ fontSize: '1.4rem' }}></i>
                                                </div>
                                            )}
                                        </div>
                                        {/* Right Side: Details with labels */}
                                        <div className="member-card-details">
                                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                <span style={{ fontSize: '0.55rem', textTransform: 'uppercase', color: 'var(--accent-dark)', fontWeight: 'bold', letterSpacing: '0.3px', lineHeight: '1.1' }}>Full Name</span>
                                                <span style={{ fontSize: '0.92rem', fontWeight: '600', color: 'var(--primary-dark)', lineHeight: '1.2' }} title={member.name}>{member.name}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                <span style={{ fontSize: '0.55rem', textTransform: 'uppercase', color: 'var(--accent-dark)', fontWeight: 'bold', letterSpacing: '0.3px', lineHeight: '1.1' }}>Designation / Role</span>
                                                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '500', lineHeight: '1.2' }} title={member.designation}>{member.designation}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                <span style={{ fontSize: '0.55rem', textTransform: 'uppercase', color: 'var(--accent-dark)', fontWeight: 'bold', letterSpacing: '0.3px', lineHeight: '1.1' }}>Institutional Affiliation</span>
                                                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: '1.2' }} title={member.affiliation}>{member.affiliation}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1px', width: '100%', alignItems: 'inherit' }}>
                                                <span style={{ fontSize: '0.55rem', textTransform: 'uppercase', color: 'var(--accent-dark)', fontWeight: 'bold', letterSpacing: '0.3px', lineHeight: '1.1', marginBottom: '2.5px' }}>Board Category</span>
                                                <span className="badge badge-accent" style={{ fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.3px', padding: '2px 6px', width: 'fit-content' }}>{member.board_type}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* The 4 Category Description Cards */
                        <div className="grid grid-4 text-center" style={{ marginBottom: '50px', marginTop: '25px' }}>
                            <div className="card" style={{ padding: '25px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                                <div className="card-icon"><i className="fas fa-user-shield"></i></div>
                                <h3 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>Advisory Board</h3>
                                <p style={{ fontSize: '0.85rem', marginBottom: 0 }}>Comprising senior professors and administrators overseeing the strategic direction of MERF and RISSR.</p>
                            </div>

                            <div className="card" style={{ padding: '25px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                                <div className="card-icon"><i className="fas fa-user-edit"></i></div>
                                <h3 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>Editorial Board</h3>
                                <p style={{ fontSize: '0.85rem', marginBottom: 0 }}>Eminent subject-matter editors managing reviews and quality curation for Shodh Unnayan & The Scholar's Real View.</p>
                            </div>

                            <div className="card" style={{ padding: '25px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                                <div className="card-icon"><i className="fas fa-user-check"></i></div>
                                <h3 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>Review Committee</h3>
                                <p style={{ fontSize: '0.85rem', marginBottom: 0 }}>Double-blind peer-review experts ensuring scientific integrity and original content publication.</p>
                            </div>

                            <div className="card" style={{ padding: '25px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                                <div className="card-icon"><i className="fas fa-user-friends"></i></div>
                                <h3 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>Experts Committee</h3>
                                <p style={{ fontSize: '0.85rem', marginBottom: 0 }}>Field specialists guiding FDP curriculums, teacher training, and university collaborative projects.</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Photo Lightbox Zoom Overlay Modal */}
            {activePhoto && (
                <div 
                    onClick={() => setActivePhoto(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 99999,
                        cursor: 'zoom-out'
                    }}
                >
                    <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setActivePhoto(null); }}
                            style={{
                                position: 'absolute',
                                top: '-40px',
                                right: '0',
                                background: 'none',
                                border: 'none',
                                color: '#ffffff',
                                fontSize: '2.5rem',
                                cursor: 'pointer',
                                lineHeight: '1'
                            }}
                        >
                            &times;
                        </button>
                        <img 
                            src={activePhoto} 
                            alt="Zoomed Profile" 
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '80vh', 
                                borderRadius: '8px', 
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                objectFit: 'contain'
                            }} 
                        />
                    </div>
                </div>
            )}
        </>
    );
}
