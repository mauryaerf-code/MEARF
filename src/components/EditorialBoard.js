'use client';

import React from 'react';

export const EDITORIAL_BOARD_MEMBERS = [
    {
        name: 'Dr. Dolly Mogra',
        designation: 'Incharge Head, Department of Fashion Technology and Designing',
        institution: 'UCSSH, Mohanlal Sukhadia University, Udaipur',
        email: 'fashiontechnology@mlsu.ac.in',
        profileUrl: 'https://share.google/oZ9JzfNFeJdqAgkXe',
    },
    {
        name: 'Dr. Vikas Choudhary',
        designation: 'Assistant Professor, Department of Prakrit',
        institution: 'Shri Lal Bahadur Shastri National Sanskrit University (Central University), New Delhi',
        email: 'vikas_choudhary@slbsrsv.ac.in',
        profileUrl: 'https://www.slbsrsv.ac.in/faculties-and-departments/faculty-sahitya-and-sanskriti/department-prakrit',
    },
    {
        name: 'Dr. Brijesh Kumar Mishra',
        designation: 'Assistant Professor, Department of Political Science / Department of Humanities',
        institution: 'Shri Lal Bahadur Shastri National Sanskrit University (Central University), New Delhi',
        email: 'brajesh@slbsrsv.ac.in',
        profileUrl: 'https://www.slbsrsv.ac.in/faculties-and-departments/faculty-adhunik-vidya/department-humanities',
    },
    {
        name: 'Dr. Pragesh Kumar Mishra',
        designation: 'Assistant Professor, Department of Psychology',
        institution: 'Indira Gandhi National Tribal University, Amarkantak (MP) - 484887',
        email: 'pragyesh.mishra@igntu.ac.in',
        profileUrl: 'https://igntu.ac.in/departments/Psychology',
    },
    {
        name: 'Dr. Harish Kumar',
        designation: 'Assistant Professor, School of Tourism, Travel and Hospitality Management',
        institution: 'Central University of Himachal Pradesh (HP)',
        email: 'gautamharish.mta@hpcu.ac.in',
        profileUrl: 'https://www.cuhimachal.ac.in/index.php/Home/faculty_details/dept_tourism_travel',
    },
    {
        name: 'Dr. Indi Akurugoda',
        designation: 'Senior Lecturer Grade 1, Department of Public Policy',
        institution: 'University of Ruhuna, Wellamadama, Matara, Sri Lanka',
        email: 'irakurugoda@hss.ruh.ac.lk',
        profileUrl: 'https://hss.ruh.ac.lk/staff/ariyarathne',
    },
    {
        name: 'Dr. Nisanka Sajeewani Ariyarathne',
        designation: 'Senior Lecturer Grade 1, Department of Public Policy',
        institution: 'University of Ruhuna, Wellamadama, Matara, Sri Lanka',
        email: 'ariyarathnen@hss.ruh.ac.lk',
        profileUrl: 'https://hss.ruh.ac.lk/staff/ariyarathne',
    },
];

export default function EditorialBoard({ journalName = 'Reforming Research' }) {
    return (
        <div className="eb-section-card">
            <style>{`
                .eb-section-card {
                    padding: 36px 40px;
                    background-color: var(--bg-white);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md);
                    margin-bottom: 35px;
                    position: relative;
                    overflow: hidden;
                }
                .eb-section-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, var(--accent) 0%, var(--primary) 100%);
                }
                .eb-header {
                    margin-bottom: 22px;
                    border-bottom: 2.5px solid var(--accent);
                    padding-bottom: 14px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .eb-title {
                    font-size: 1.65rem;
                    color: var(--primary-dark);
                    font-weight: 700;
                    font-family: var(--font-heading);
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .eb-badge-count {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(15, 32, 66, 0.08) 100%);
                    color: var(--primary-dark);
                    border: 1px solid rgba(212, 175, 55, 0.35);
                    border-radius: 9999px;
                    padding: 4px 12px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    letter-spacing: 0.3px;
                }
                .eb-description {
                    font-size: 0.98rem;
                    color: var(--text-muted);
                    margin-bottom: 26px;
                    line-height: 1.6;
                }
                .eb-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 22px;
                }
                .eb-member-card {
                    background: #ffffff;
                    border: 1px solid var(--border-color);
                    border-radius: 14px;
                    box-shadow: 0 2px 8px rgba(15, 32, 66, 0.04);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 22px;
                    transition: all 0.28s ease;
                    position: relative;
                    overflow: hidden;
                }
                .eb-member-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px -4px rgba(15, 32, 66, 0.12), 0 4px 8px -2px rgba(15, 32, 66, 0.06);
                    border-color: var(--accent);
                }
                .eb-member-card::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, var(--accent) 0%, var(--primary-light) 100%);
                    opacity: 0;
                    transition: opacity 0.25s ease;
                }
                .eb-member-card:hover::after {
                    opacity: 1;
                }
                .eb-profile-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 14px;
                    margin-bottom: 16px;
                }
                .eb-avatar-circle {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
                    color: var(--accent);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.15rem;
                    flex-shrink: 0;
                    border: 2px solid rgba(212, 175, 55, 0.35);
                    box-shadow: 0 3px 8px rgba(7, 17, 36, 0.15);
                }
                .eb-profile-info {
                    flex: 1;
                    min-width: 0;
                }
                .eb-name {
                    font-family: var(--font-heading);
                    font-size: 1.18rem;
                    font-weight: 700;
                    color: var(--primary-dark);
                    margin: 0 0 5px 0;
                    line-height: 1.3;
                    overflow-wrap: break-word;
                }
                .eb-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 0.72rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: var(--accent-dark);
                    background: rgba(212, 175, 55, 0.12);
                    border: 1px solid rgba(212, 175, 55, 0.25);
                    padding: 2.5px 9px;
                    border-radius: 9999px;
                }
                .eb-info-list {
                    display: flex;
                    flex-direction: column;
                    gap: 11px;
                    margin-bottom: 18px;
                }
                .eb-info-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    font-size: 0.88rem;
                    line-height: 1.5;
                }
                .eb-info-icon {
                    width: 26px;
                    height: 26px;
                    border-radius: 6px;
                    background: rgba(15, 32, 66, 0.05);
                    color: var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.78rem;
                    flex-shrink: 0;
                    margin-top: 1px;
                }
                .eb-info-text {
                    flex: 1;
                    min-width: 0;
                    overflow-wrap: anywhere;
                    word-break: break-word;
                }
                .eb-designation-text {
                    font-weight: 600;
                    color: var(--primary);
                }
                .eb-institution-text {
                    color: var(--text-muted);
                }
                .eb-email-link {
                    color: var(--primary-dark);
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.2s ease;
                }
                .eb-email-link:hover {
                    color: var(--accent-dark);
                    text-decoration: underline;
                }
                .eb-footer-actions {
                    border-top: 1px solid var(--border-color);
                    padding-top: 14px;
                    margin-top: auto;
                }
                .eb-profile-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    padding: 9px 16px;
                    border-radius: var(--radius-md);
                    font-size: 0.84rem;
                    font-weight: 600;
                    color: var(--primary);
                    background: #ffffff;
                    border: 1.5px solid var(--primary);
                    text-decoration: none;
                    transition: all 0.22s ease;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
                }
                .eb-profile-btn:hover {
                    background: var(--primary);
                    color: #ffffff;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 10px rgba(15, 32, 66, 0.18);
                }
                @media (max-width: 1080px) {
                    .eb-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 18px;
                    }
                }
                @media (max-width: 768px) {
                    .eb-section-card {
                        padding: 26px 18px;
                        margin-bottom: 25px;
                    }
                    .eb-title {
                        font-size: 1.35rem;
                    }
                    .eb-grid {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                    .eb-member-card {
                        padding: 18px;
                    }
                }
                @media (max-width: 480px) {
                    .eb-section-card {
                        padding: 20px 14px;
                    }
                    .eb-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 8px;
                    }
                    .eb-avatar-circle {
                        width: 42px;
                        height: 42px;
                        font-size: 1.05rem;
                    }
                    .eb-name {
                        font-size: 1.08rem;
                    }
                }
            `}</style>

            <div className="eb-header">
                <h3 className="eb-title">
                    <i className="fas fa-users-viewfinder" style={{ color: 'var(--accent-dark)' }}></i>
                    Member of Editorial Board
                </h3>
                <span className="eb-badge-count">
                    <i className="fas fa-certificate" style={{ color: 'var(--accent-dark)', fontSize: '0.75rem' }}></i>
                    {EDITORIAL_BOARD_MEMBERS.length} Eminent Scholars
                </span>
            </div>

            <p className="eb-description">
                Distinguished academic scholars and peer researchers serving on the editorial board of <strong>{journalName}</strong>.
            </p>

            <div className="eb-grid">
                {EDITORIAL_BOARD_MEMBERS.map((member, index) => (
                    <div key={index} className="eb-member-card">
                        <div>
                            <div className="eb-profile-header">
                                <div className="eb-avatar-circle">
                                    <i className="fas fa-user-graduate"></i>
                                </div>
                                <div className="eb-profile-info">
                                    <h4 className="eb-name">{member.name}</h4>
                                    <span className="eb-tag">
                                        <i className="fas fa-award" style={{ fontSize: '0.65rem' }}></i>
                                        Editorial Board
                                    </span>
                                </div>
                            </div>

                            <div className="eb-info-list">
                                <div className="eb-info-row">
                                    <div className="eb-info-icon">
                                        <i className="fas fa-briefcase"></i>
                                    </div>
                                    <div className="eb-info-text eb-designation-text">
                                        {member.designation}
                                    </div>
                                </div>

                                <div className="eb-info-row">
                                    <div className="eb-info-icon">
                                        <i className="fas fa-building-columns"></i>
                                    </div>
                                    <div className="eb-info-text eb-institution-text">
                                        {member.institution}
                                    </div>
                                </div>

                                <div className="eb-info-row">
                                    <div className="eb-info-icon">
                                        <i className="fas fa-envelope"></i>
                                    </div>
                                    <div className="eb-info-text">
                                        <a href={`mailto:${member.email}`} className="eb-email-link">
                                            {member.email}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {member.profileUrl && (
                            <div className="eb-footer-actions">
                                <a
                                    href={member.profileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="eb-profile-btn"
                                >
                                    <span>View Academic Profile</span>
                                    <i className="fas fa-arrow-up-right-from-square" style={{ fontSize: '0.75rem' }}></i>
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
