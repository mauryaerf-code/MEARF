import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="main-footer" id="portal-footer">
            <div className="container footer-grid">
                <div className="footer-col" id="footer-col-about">
                    <h3>About MERF</h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '20px', color: '#f8f9fa', fontWeight: '500' }}>
                        <strong style={{ color: 'var(--accent)', fontWeight: '700' }}>Maurya Education and Research Foundation</strong> We dedicate our efforts to academic excellence, research publishing, book distribution, and community empowerment programs.
                    </p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <a href="#" style={{ fontSize: '1.25rem', color: 'var(--accent)' }} aria-label="Facebook"><i className="fab fa-facebook"></i></a>
                        <a href="#" style={{ fontSize: '1.25rem', color: 'var(--accent)' }} aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                        <a href="#" style={{ fontSize: '1.25rem', color: 'var(--accent)' }} aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
                    </div>
                </div>

                <div className="footer-col" id="footer-col-links">
                    <h3>Quick Links</h3>
                    <ul className="footer-links">
                        <li><Link href="/about">About the Founder</Link></li>
                        <li><Link href="/about#advisory-board">Governing Advisory Board</Link></li>
                        <li><Link href="/journals">Submit a Research Paper</Link></li>
                        <li><Link href="/publications">Book Guidelines</Link></li>
                        <li><Link href="/social-welfare">SVBSPS Social Wing</Link></li>
                        <li><Link href="/gallery">News & Gallery</Link></li>
                    </ul>
                </div>

                <div className="footer-col" id="footer-col-contact">
                    <h3>Contact Us</h3>
                    <ul className="footer-contact-info">
                        <li>
                            <i className="fas fa-map-marker-alt"></i>
                            <span>Jaipur, Rajasthan, India</span>
                        </li>
                        <li>
                            <i className="fas fa-phone-alt"></i>
                            <span>+91-9636635216</span>
                        </li>
                        <li>
                            <i className="fas fa-envelope"></i>
                            <span>
                                drshailendar@mauryaerf.com<br />
                                editorthescholarview@gmail.com
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="container footer-bottom">
                <p>&copy; {new Date().getFullYear()} Maurya Education and Research Foundation (MERF). All Rights Reserved.</p>
                
            </div>
        </footer>
    );
}
