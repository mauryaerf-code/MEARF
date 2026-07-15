import React from 'react';

export const metadata = {
  title: "About Us",
  description: "Learn about MERF, our founder Dr. Shailendar Maurya, and our governing boards and advisory committees.",
};

export default function About() {
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
                    <div className="grid grid-2">
                        <div>
                            <h2 style={{ fontSize: '1.85rem', marginBottom: '20px' }}>Who We Are</h2>
                            <p style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                                <strong>Maurya Education and Research Foundation</strong>, commonly known as <strong>MERF</strong>, is an academic and research-oriented organization dedicated to promoting education, research, innovation, and academic collaboration across India. 
                            </p>
                            <p>
                                Registered under MSME, Government of India, the organization focuses on improving the quality of education and research. MERF works closely with students, researchers, academicians, and educational institutions to encourage multidisciplinary research and knowledge sharing.
                            </p>
                            <p>
                                MERF is registered as a <strong>Section 8 Not-For-Profit Company</strong> under the Ministry of Corporate Affairs, Government of India. The organization operates independently, reflecting its commitment to self-supported academic and research development initiatives.
                            </p>
                            <p>
                                Over the years, MERF has successfully organized national and international conferences in collaboration with several reputed universities and institutions, including MLSU University, Udaipur, along with many other esteemed organizations across the country.
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div className="card" style={{ marginBottom: '20px', backgroundColor: 'var(--bg-white)' }}>
                                <h3 style={{ color: 'var(--primary)', fontSize: '1.35rem', marginBottom: '10px' }}><i className="fas fa-medal" style={{ color: 'var(--accent)', marginRight: '10px' }}></i> Vision Statement</h3>
                                <p style={{ fontSize: '0.95rem', marginBottom: 0 }}>
                                    To integrate intellectual ideas globally and promote innovation, research culture, and academic excellence. We strive to improve educational practices and encourage the practical application of research outcomes for sustainable societal development.
                                </p>
                            </div>
                            <div className="card" style={{ backgroundColor: 'var(--bg-white)' }}>
                                <h3 style={{ color: 'var(--primary)', fontSize: '1.35rem', marginBottom: '10px' }}><i className="fas fa-bullseye" style={{ color: 'var(--accent)', marginRight: '10px' }}></i> Mission Statement</h3>
                                <p style={{ fontSize: '0.95rem', marginBottom: 0 }}>
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
            </section>

            <section className="section" id="advisory-board">
                <div className="container">
                    <div className="section-header">
                        <h2>Governing Body & Advisory Boards</h2>
                        <p>Our foundation and publication initiatives are guided by eminent academicians and professionals from across India.</p>
                    </div>

                    <div className="grid grid-4 text-center">
                        <div className="card" style={{ padding: '25px' }}>
                            <div className="card-icon"><i className="fas fa-user-shield"></i></div>
                            <h3 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>Advisory Board</h3>
                            <p style={{ fontSize: '0.85rem', marginBottom: 0 }}>Comprising senior professors and administrators overseeing the strategic direction of MERF and RISSR.</p>
                        </div>

                        <div className="card" style={{ padding: '25px' }}>
                            <div className="card-icon"><i className="fas fa-user-edit"></i></div>
                            <h3 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>Editorial Board</h3>
                            <p style={{ fontSize: '0.85rem', marginBottom: 0 }}>Eminent subject-matter editors managing reviews and quality curation for Shodh Unnayan & The Scholar's Real View.</p>
                        </div>

                        <div className="card" style={{ padding: '25px' }}>
                            <div className="card-icon"><i className="fas fa-user-check"></i></div>
                            <h3 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>Review Committee</h3>
                            <p style={{ fontSize: '0.85rem', marginBottom: 0 }}>Double-blind peer-review experts ensuring scientific integrity and original content publication.</p>
                        </div>

                        <div className="card" style={{ padding: '25px' }}>
                            <div className="card-icon"><i className="fas fa-user-friends"></i></div>
                            <h3 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>Experts Committee</h3>
                            <p style={{ fontSize: '0.85rem', marginBottom: 0 }}>Field specialists guiding FDP curriculums, teacher training, and university collaborative projects.</p>
                        </div>
                    </div>
                    

                </div>
            </section>
        </>
    );
}
