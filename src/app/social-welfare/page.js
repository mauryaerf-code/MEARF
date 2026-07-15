import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "Social Welfare & Community Impact (SVBSPS)",
  description: "Learn about Swami Vivekanand Balika Shiksha Prachar Samiti (SVBSPS), the social wing of MERF implementing 6 impact initiatives.",
};

export default function SocialWelfare() {
    return (
        <>
            <section className="hero" style={{ padding: '60px 0', backgroundImage: `linear-gradient(135deg, rgba(7, 17, 36, 0.9) 0%, rgba(15, 32, 70, 0.8) 100%), url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop')` }}>
                <div className="container text-center">
                    <h1 style={{ color: 'var(--text-light)', fontSize: '2.75rem', marginBottom: '10px' }}>Swami Vivekanand Balika Shiksha Prachar Samiti</h1>
                    <p style={{ color: 'var(--accent)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 0 }}>SVBSPS - The Social Welfare Wing of MERF</p>
                </div>
            </section>

            <section className="section" id="svbsps-intro">
                <div className="container">
                    <div className="card card-accent" style={{ padding: '40px', backgroundColor: 'var(--bg-white)', border: '2px solid var(--accent)', textAlign: 'center', maxWidth: '900px', margin: '0 auto 50px auto' }}>
                        <span className="badge badge-accent" style={{ marginBottom: '15px' }}>Registered Society (Act No- 28, 1958)</span>
                        <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', color: 'var(--primary-dark)', marginBottom: '15px' }}>Inspired by Swami Vivekananda’s Ideal:</h2>
                        <h3 style={{ fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--accent-dark)', marginBottom: '20px', lineHeight: '1.4' }}>
                            “Educate, Educate, Educate — till every woman in the land is enlightened”
                        </h3>
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px' }}>
                            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-dark)', fontWeight: '500', fontStyle: 'italic', margin: 0 }}>
                                “The Samiti undertakes community development through women-centric education, health awareness, skill training and value inculcation, thereby translating Swami Vivekananda’s vision of Man-Making & Nation-Building Education into grassroots action.”
                            </p>
                        </div>
                    </div>

                    <div className="social-welfare-grid">
                        <div>
                            <h2 style={{ fontSize: '1.85rem', marginBottom: '20px', color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)' }}>About SVBSPS</h2>
                            
                            <p style={{ fontFamily: '"Inter", "Outfit", sans-serif', fontSize: '1.05rem', lineHeight: '1.85', color: '#2c3e50', marginBottom: '20px', textAlign: 'justify', letterSpacing: '0.1px' }}>
                                As members of a civilized society we have some social and moral responsibilities but generally we remain indifferent towards them. As responsible and aware citizens there are some people who are fulfilling their social responsibilities very well. Only the good efforts of such people move the society towards development. Among the major areas of social responsibilities, girl education and women development is an important responsibility which can be encouraged more and more to provide an ideal form to the society.
                            </p>
 
                            <p style={{ fontFamily: '"Inter", "Outfit", sans-serif', fontSize: '1.05rem', lineHeight: '1.85', color: '#2c3e50', marginBottom: '20px', textAlign: 'justify', letterSpacing: '0.1px' }}>
                                <strong>Swami Vivekananda Balika Shiksha Prachar Samiti (SVBSPS)</strong> is one such organization which has been continuously striving for girl’s education and women's development for the last 22 years. The informal establishment of the institution took place on <strong>11 May 2002</strong> and the formal formation of the institution took place on <strong>8 September 2004</strong> through registration under the Rajasthan Institutions Registration Act 1958 (Rajasthan Act No- 28, 1958). Even before its formal formation, it has been continuously working for the promotion of girls education through free classes, organizing classes in slums under adult education, camps and workshops. The organization has been organizing academic programs like seminars, lectures, workshops, webinars etc. from time to time for the promotion of education, especially for women and girls.
                            </p>
 
                            <p style={{ fontFamily: '"Inter", "Outfit", sans-serif', fontSize: '1.05rem', lineHeight: '1.85', color: '#2c3e50', marginBottom: 0, textAlign: 'justify', letterSpacing: '0.1px' }}>
                                The main objective of the committee is to promote education in areas, communities and classes deprived of education and to introduce them to development plans and programs for the overall development of women and girls. Also, through various competitions, efforts are made to develop understanding on social issues among the students and youth so that the youth can become participants in the development of the society by getting involved in social responsibilities.
                            </p>
                        </div>
                        
                        <div className="community-card" style={{ position: 'sticky', top: '100px' }}>
                            <div className="card" style={{ padding: '30px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-white)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '15px', borderBottom: '2px solid var(--accent)', paddingBottom: '8px' }}>
                                    <i className="fas fa-network-wired"></i> Community Development Model
                                </h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    <li>
                                        <strong>Name of Society:</strong><br />
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Swami Vivekanand Balika Shiksha Prachar Samiti, Jaipur, Rajasthan</span>
                                    </li>
                                    <li>
                                        <strong>Registration:</strong><br />
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Registered under Rajasthan Institutions Registration Act, 1958 (Rajasthan Act No- 28, 1958) & Societies Registration Act, 1860</span>
                                    </li>
                                    <li>
                                        <strong>Core Areas:</strong><br />
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Research, Education, Social Welfare, Community Development</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" id="svbsps-programs" style={{ backgroundColor: 'var(--bg-white)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>6 Core Social Programs & Impact</h2>
                        <p>Detailed look at the key action plans implemented by SVBSPS to achieve sustainable community development.</p>
                    </div>

                    <div className="grid grid-3">
                        <div className="card program-card" id="prog-card-education">
                            <div className="program-icon"><i className="fas fa-user-graduate"></i></div>
                            <h3>A. Girl Child Education</h3>
                            <p style={{ fontSize: '0.875rem' }}>
                                Providing free and subsidized schooling for underprivileged girls, running bridge courses for school dropouts, and supporting hostel facilities for rural students. Focuses on <em>"Sa Vidya Ya Vimuktaye"</em>—education for self-reliance.
                            </p>
                        </div>

                        <div className="card program-card" id="prog-card-skills">
                            <div className="program-icon"><i className="fas fa-tools"></i></div>
                            <h3>B. Skill Development</h3>
                            <p style={{ fontSize: '0.875rem' }}>
                                Running vocational training programs to help women earn livelihoods. Includes stitching, computer literacy, local handicrafts, spoken English coaching, and digital banking training.
                            </p>
                        </div>

                        <div className="card program-card" id="prog-card-health">
                            <div className="program-icon"><i className="fas fa-heartbeat"></i></div>
                            <h3>C. Health & Hygiene</h3>
                            <p style={{ fontSize: '0.875rem' }}>
                                Conducting free health check-up camps, menstrual hygiene awareness drives, anemia detection checks, and yoga & nutrition workshops. Free distribution of sanitary kits in rural villages.
                            </p>
                        </div>

                        <div className="card program-card" id="prog-card-legal">
                            <div className="program-icon"><i className="fas fa-gavel"></i></div>
                            <h3>D. Legal & Social Awareness</h3>
                            <p style={{ fontSize: '0.875rem' }}>
                                Conducting educational workshops on women's rights, the POCSO Act, domestic violence laws, and cyber safety. Running a local legal aid cell in collaboration with the District Legal Services Authority.
                            </p>
                        </div>

                        <div className="card program-card" id="prog-card-environment">
                            <div className="program-icon"><i className="fas fa-leaf"></i></div>
                            <h3>E. Environment & Sustainability</h3>
                            <p style={{ fontSize: '0.875rem' }}>
                                Leading local tree plantation drives, plastic-free community campaigns, and water conservation projects led by student volunteers. Actively executing the <strong>“Each Girl, One Tree”</strong> initiative.
                            </p>
                        </div>

                        <div className="card program-card" id="prog-card-culture">
                            <div className="program-icon"><i className="fas fa-praying-hands"></i></div>
                            <h3>F. Cultural Preservation</h3>
                            <p style={{ fontSize: '0.875rem' }}>
                                Providing training in regional folk arts, Vedic chanting, and essential Bhartiya value systems. Organizing the annual <strong>Balika Sanskar Shivir</strong> based on Swami Vivekananda's teachings.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" id="svbsps-cta">
                <div className="container text-center" style={{ maxWidth: '800px' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Support Our Community Vision</h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '35px' }}>
                        Our activities are self-supported and driven by the dedicated efforts of our members and volunteers. Join us in making a difference in the lives of rural girls and women.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                        <Link href="/contact?subject=Inquiry: Become a Member of SVBSPS" className="btn btn-primary">
                            Become a Member
                        </Link>
                        <Link href="/contact?subject=Inquiry: SVBSPS Programs" className="btn btn-outline">
                            Collaborate with Us
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
