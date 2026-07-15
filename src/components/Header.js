'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    // Close menu when clicking link
    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1050) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isActive = (path) => pathname === path ? 'active' : '';

    return (
        <>
            <div className="top-bar" id="top-bar-utility">
                <div className="container-fluid flex-between flex-wrap">
                    <div>
                        <i className="fas fa-phone-alt"></i> <a href="tel:+919636635216">+91-9636635216</a>
                    </div>
                    <div className="top-bar-links">
                        <span><i className="fas fa-certificate"></i> Registered MSME</span>
                        <span><i className="fas fa-university"></i> Section 8 Not-For-Profit</span>
                    </div>
                </div>
            </div>

            <header className="main-header" id="main-header-nav">
                <div className="container-fluid navbar">
                    <Link href="/" className="logo-container" id="brand-logo-link">
                        <img src="/assets/logo.png" alt="MERF Logo" className="logo-img" id="logo-graphic" style={{ height: '60px', width: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div className="logo-text">
                            <h1>MERF</h1>
                            <p>Maurya Education and Research Foundation</p>
                        </div>
                    </Link>
                    
                    <button 
                        className="menu-toggle" 
                        id="mobile-menu-btn" 
                        aria-label="Toggle Menu"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
                    </button>
                    
                    <nav className="nav-menu-wrapper">
                        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="nav-list">
                            <li>
                                <Link href="/" className={`nav-link ${isActive('/')}`} onClick={handleLinkClick}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className={`nav-link ${isActive('/about')}`} onClick={handleLinkClick}>
                                    About Us
                                </Link>
                            </li>
                            <li className="nav-item-dropdown">
                                <Link href="/journals" className={`nav-link ${isActive('/journals')}`} onClick={handleLinkClick}>
                                    RISSR Journals <i className="fas fa-chevron-down" style={{ fontSize: '0.75rem' }}></i>
                                </Link>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link href="/journals/shodh-unnayan" className="dropdown-link-with-img" onClick={handleLinkClick}>
                                            <img src="/assets/home/Shodh Unnayan.png" alt="Shodh Unnayan Journal Cover" />
                                            <div className="dropdown-link-text">
                                                <span className="dropdown-link-title">Shodh Unnayan</span>
                                                <span className="dropdown-link-subtitle">Hindi (Quarterly)</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/journals/scholars-view" className="dropdown-link-with-img" onClick={handleLinkClick}>
                                            <img src="/assets/home/Scholar.png" alt="The Scholar's Real View Cover" />
                                            <div className="dropdown-link-text">
                                                <span className="dropdown-link-title">The Scholar's Real View</span>
                                                <span className="dropdown-link-subtitle">English (Half-Yearly)</span>
                                            </div>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <Link href="/publications" className={`nav-link ${isActive('/publications')}`} onClick={handleLinkClick}>
                                    Publications
                                </Link>
                            </li>
                            <li>
                                <Link href="/events" className={`nav-link ${isActive('/events')}`} onClick={handleLinkClick}>
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link href="/social-welfare" className={`nav-link ${isActive('/social-welfare')}`} onClick={handleLinkClick}>
                                    Social Welfare
                                </Link>
                            </li>
                            <li>
                                <Link href="/gallery" className={`nav-link ${isActive('/gallery')}`} onClick={handleLinkClick}>
                                    Gallery
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className={`nav-link ${isActive('/contact')}`} onClick={handleLinkClick}>
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    );
}
