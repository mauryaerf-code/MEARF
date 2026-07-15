'use client';

import React, { useState, useEffect } from 'react';

const GALLERY_IMAGES = [
    { id: "gal-1", src: "/assets/ne&gal/gallary/gal01.png", alt: "Gallery Image 1", title: "Academic Event Session 1", category: "Gallery" },
    { id: "gal-2", src: "/assets/ne&gal/gallary/gal02.png", alt: "Gallery Image 2", title: "Academic Event Session 2", category: "Gallery" },
    { id: "gal-3", src: "/assets/ne&gal/gallary/gal03.png", alt: "Gallery Image 3", title: "Welfare Campaign Activity", category: "Gallery" },
    { id: "gal-4", src: "/assets/ne&gal/gallary/gal04.png", alt: "Gallery Image 4", title: "Tree Plantation Initiative", category: "Gallery" },
    { id: "gal-5", src: "/assets/ne&gal/gallary/gal05.png", alt: "Gallery Image 5", title: "National Conference Launch", category: "Gallery" },
    { id: "gal-6", src: "/assets/ne&gal/gallary/gal06.png", alt: "Gallery Image 6", title: "Student Award Ceremony", category: "Gallery" },
    { id: "gal-7", src: "/assets/ne&gal/gallary/gal07.png", alt: "Gallery Image 7", title: "Advisory Board Meet", category: "Gallery" },
    { id: "gal-8", src: "/assets/ne&gal/gallary/gal08.png", alt: "Gallery Image 8", title: "Teacher Training Program", category: "Gallery" },
];

const NEWS_IMAGES = [
    { id: "news-1", src: "/assets/ne&gal/news/new01.png", alt: "News 1", title: "Press Coverage - Dainik Bhaskar", category: "News" },
    { id: "news-2", src: "/assets/ne&gal/news/new02.png", alt: "News 2", title: "Conference Highlights - Patrika", category: "News" },
    { id: "news-3", src: "/assets/ne&gal/news/new03.png", alt: "News 3", title: "NGO Project Release Announcement", category: "News" },
    { id: "news-4", src: "/assets/ne&gal/news/new04.png", alt: "News 4", title: "Dr. Maurya's Interview Highlights", category: "News" },
    { id: "news-5", src: "/assets/ne&gal/news/new05.png", alt: "News 5", title: "National Seminar Press Briefing", category: "News" },
];

export default function Gallery() {
    const [activeImage, setActiveImage] = useState(null);

    const openLightbox = (img) => {
        setActiveImage(img);
    };

    const closeLightbox = () => {
        setActiveImage(null);
    };

    // Close lightbox on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeLightbox();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <section className="hero" style={{ padding: '60px 0', backgroundImage: `linear-gradient(135deg, rgba(7, 17, 36, 0.9) 0%, rgba(15, 32, 70, 0.8) 100%), url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop')` }}>
                <div className="container text-center">
                    <h1 style={{ color: 'var(--text-light)', fontSize: '2.75rem', marginBottom: '10px' }}>News & Photo Gallery</h1>
                    <p style={{ color: 'var(--accent)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 0 }}>Certifications, Award Ceremonies, and Press Coverage</p>
                </div>
            </section>

            <section className="section" id="gallery-grid-section">
                <div className="container">
                    
                    {/* Section 1: Activity Gallery */}
                    <div style={{ marginBottom: '60px' }}>
                        <div className="section-header" style={{ marginBottom: '30px', textAlign: 'left', maxWidth: '100%' }}>
                            <h2 style={{ fontSize: '1.85rem' }}>Our Activity Gallery</h2>
                            <p style={{ margin: '5px 0 0 0' }}>Scroll horizontally to view photos of our recent academic events, seminars, and social welfare programs.</p>
                        </div>
                        
                        <div className="scroll-container">
                            {GALLERY_IMAGES.map(img => (
                                <div 
                                    className="gallery-item" 
                                    key={img.id} 
                                    style={{ flex: '0 0 380px', height: '400px' }}
                                    onClick={() => openLightbox(img)}
                                >
                                    <img src={img.src} alt={img.alt} className="gallery-img" />
                                    <div className="gallery-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span className="gallery-category" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{img.category}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '40px 0' }} />

                    {/* Section 2: Press & News Coverage */}
                    <div>
                        <div className="section-header" style={{ marginBottom: '30px', textAlign: 'left', maxWidth: '100%' }}>
                            <h2 style={{ fontSize: '1.85rem' }}>Press & News Coverage</h2>
                            <p style={{ margin: '5px 0 0 0' }}>Scroll horizontally to view newspaper clips, press releases, and media announcements.</p>
                        </div>
                        
                        <div className="scroll-container">
                            {NEWS_IMAGES.map(img => (
                                <div 
                                    className="gallery-item" 
                                    key={img.id} 
                                    style={{ flex: '0 0 380px', height: '400px' }}
                                    onClick={() => openLightbox(img)}
                                >
                                    <img src={img.src} alt={img.alt} className="gallery-img" />
                                    <div className="gallery-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span className="gallery-category" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{img.category}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* Lightbox Modal */}
            <div 
                className={`modal ${activeImage ? 'active' : ''}`} 
                id="lightbox-modal"
                onClick={(e) => {
                    if (e.target.id === 'lightbox-modal' || e.target.className === 'modal-close') {
                        closeLightbox();
                    }
                }}
            >
                <button className="modal-close" aria-label="Close Gallery" onClick={closeLightbox}>&times;</button>
                {activeImage && (
                    <>
                        <div className="modal-content">
                            <img src={activeImage.src} alt={activeImage.alt} />
                        </div>
                        <div className="modal-caption" style={{ textAlign: 'center' }}>
                            <span style={{ color: '#d4af37', fontSize: '1.2rem', fontWeight: 'bold' }}>{activeImage.category}</span>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
