'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ContactForm() {
    const searchParams = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    // Populate subject from query string if available
    useEffect(() => {
        const subjectParam = searchParams.get('subject');
        if (subjectParam) {
            setFormData(prev => ({
                ...prev,
                subject: decodeURIComponent(subjectParam)
            }));
        }
    }, [searchParams]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const recipient = "1.rajveersinghcse@gmail.com";
        const subjectLine = encodeURIComponent(formData.subject || "General Inquiry - MERF");
        const bodyText = encodeURIComponent(
            `Name: ${formData.name}\n` +
            `Email: ${formData.email}\n\n` +
            `Message:\n${formData.message}`
        );
        
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subjectLine}&body=${bodyText}`;

        // Open Gmail Web Compose in a new tab
        window.open(gmailUrl, '_blank');

        setIsSubmitting(false);
        setFormSubmitted(true);
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
        setTimeout(() => setFormSubmitted(false), 5000);
    };

    return (
        <div className="card" style={{ padding: '40px', backgroundColor: 'var(--bg-white)' }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '10px' }}>Send Us a Message</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '25px' }}>Fill out the form below and our coordinators will follow up with you shortly.</p>
            
            {formSubmitted && (
                <div className="alert alert-success">
                    <i className="fas fa-check-circle"></i> Thank you! Your message has been sent successfully. We will get in touch soon.
                </div>
            )}

            <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name *</label>
                    <input 
                        type="text" 
                        id="name" 
                        className="form-control" 
                        required 
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address *</label>
                    <input 
                        type="email" 
                        id="email" 
                        className="form-control" 
                        required 
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="subject" className="form-label">Subject / Purpose *</label>
                    <input 
                        type="text" 
                        id="subject" 
                        className="form-control" 
                        required 
                        placeholder="Subject of interest"
                        value={formData.subject}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message" className="form-label">Your Message *</label>
                    <textarea 
                        id="message" 
                        className="form-control" 
                        required 
                        placeholder="Write your message details here..."
                        value={formData.message}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                <div style={{ marginTop: '25px' }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Submit Message'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function Contact() {
    return (
        <>
            <section className="hero" style={{ padding: '60px 0', backgroundImage: `linear-gradient(135deg, rgba(7, 17, 36, 0.9) 0%, rgba(15, 32, 70, 0.8) 100%), url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop')` }}>
                <div className="container text-center">
                    <h1 style={{ color: 'var(--text-light)', fontSize: '2.75rem', marginBottom: '10px' }}>Contact Us</h1>
                    <p style={{ color: 'var(--accent)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 0 }}>Connect with our editors, organizers, and welfare coordinators</p>
                </div>
            </section>

            <section className="section" id="contact-info-form-section">
                <div className="container">
                    <div className="grid grid-3" style={{ marginBottom: '60px', gap: '30px' }}>
                        <div className="card text-center" style={{ padding: '30px' }}>
                            <div style={{ fontSize: '2.5rem', color: 'var(--accent-dark)', marginBottom: '15px' }}><i className="fas fa-phone-alt"></i></div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Call Representative</h3>
                            <p style={{ fontSize: '0.95rem', marginBottom: 0, fontWeight: 700, color: 'var(--primary)' }}>+91-9636635216</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '5px' }}>Available Monday to Saturday (9:30 AM to 6:00 PM)</p>
                        </div>

                        <div className="card text-center" style={{ padding: '30px' }}>
                            <div style={{ fontSize: '2.5rem', color: 'var(--accent-dark)', marginBottom: '15px' }}><i className="fas fa-envelope"></i></div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Email Correspondence</h3>
                            <div style={{ fontSize: '0.85rem', marginBottom: '5px', color: 'var(--text-muted)' }}>
                                Journal Submissions & NGO Inquiries:<br />
                                <a href="mailto:shodhunnayan@gmail.com"><strong>shodhunnayan@gmail.com</strong></a><br />
                                <a href="mailto:editorthescholarview@gmail.com"><strong>editorthescholarview@gmail.com</strong></a>
                            </div>
                        </div>

                        <div className="card text-center" style={{ padding: '30px' }}>
                            <div style={{ fontSize: '2.5rem', color: 'var(--accent-dark)', marginBottom: '15px' }}><i className="fas fa-map-marker-alt"></i></div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Office Address</h3>
                            <p style={{ fontSize: '0.85rem', marginBottom: 0, color: 'var(--primary)', fontWeight: 'bold', lineHeight: '1.5' }}>
                                Maurya Publications & Distributors<br />
                                10 A, Saini Colony Rd, First, Kartarpur,<br />
                                Gopal Pura Mode, Jaipur, Rajasthan 302006
                            </p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '5px' }}>Registered Section 8 NGO | Registered MSME</p>
                        </div>
                    </div>

                    <div className="grid grid-2" style={{ gap: '50px' }}>
                        <div>
                            <h2 style={{ fontSize: '1.6rem', marginBottom: '20px' }}>Our Location</h2>
                            <div style={{ width: '100%', height: '350px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden', backgroundColor: 'var(--bg-white)', position: 'relative', boxShadow: 'var(--shadow-md)' }}>
                                <iframe 
                                    src="https://maps.google.com/maps?q=Maurya%20Publications%20%26%20Distributors%20Jaipur%2C%2010%20A%2C%20Saini%20Colony%20Rd%2C%20Saini%20Colony%20I%2C%20First%2C%20Kartarpur%2C%20Gopal%20Pura%20Mode%2C%20Jaipur%2C%20Rajasthan%20302006&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen="" 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Office Map"
                                ></iframe>
                            </div>
                        </div>

                        <div>
                            {/* Suspense boundary required for useSearchParams */}
                            <Suspense fallback={<div>Loading form...</div>}>
                                <ContactForm />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
