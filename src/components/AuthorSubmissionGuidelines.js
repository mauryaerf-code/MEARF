'use client';

import React from 'react';

export default function AuthorSubmissionGuidelines({
    journalName = 'Reforming Research',
    publisherName = 'Maurya Education and Research Foundation (MERF)',
    email = 'drshailendar@mauryaerf.com'
}) {
    const openGmail = () => {
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`, '_blank');
    };

    return (
        <div className="card" style={{ padding: '40px', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: '35px' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '15px', borderBottom: '2.5px solid var(--accent)', paddingBottom: '12px', color: 'var(--primary-dark)', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                <i className="fas fa-file-signature" style={{ marginRight: '10px', color: 'var(--accent-dark)' }}></i>
                Author Submission Guidelines
            </h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '25px', fontStyle: 'italic' }}>
                Authors are requested to review and comply with the following submission guidelines prior to manuscript submission. Adherence to these guidelines ensures a smooth and timely review process.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {/* Guideline 1 */}
                <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '18px' }}>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: '700' }}>
                        1. Manuscript Format and Style
                    </h4>
                    <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)' }}>
                        <li>Manuscripts must be submitted in MS-Word (.doc/.docx) format only.</li>
                        <li>Contributors should strictly adhere to the article format prescribed by the journal.</li>
                        <li>The title of the article must be bold, centred, typed in Title Case, and set in 16-point Times New Roman.</li>
                        <li>Author details — full name, designation, Affiliation, and Email — should be typed in 14-point Times New Roman.</li>
                        <li>The body of the research paper must be typed in Times New Roman, with headings in 14-point and body text in 12-point, and paragraph spacing set to 6 pt before and 6 pt after, with 1.5-line spacing.</li>
                        <li>All tables and figures must be numbered consecutively using roman numerals, with captions placed below each figure and above each table.</li>
                        <li>Figures and images must be of high resolution (minimum 300 dpi), submitted in JPEG, PNG, or TIFF format, and, where possible, in an editable form (e.g. native chart/graph data).</li>
                    </ul>
                </div>

                {/* Guideline 2 */}
                <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '18px' }}>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: '700' }}>
                        2. Abstract and Keywords
                    </h4>
                    <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)' }}>
                        <li>Every manuscript must be accompanied by a brief abstract, inclusive of 5 keywords, not exceeding 250 words.</li>
                        <li>The abstract should concisely present the research background, methodology, major findings, and conclusion.</li>
                    </ul>
                </div>

                {/* Guideline 3 */}
                <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '18px' }}>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: '700' }}>
                        3. Word Limit
                    </h4>
                    <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)' }}>
                        <li><strong>Short Research articles:</strong> 1500–2500 words, inclusive of endnotes.</li>
                        <li><strong>Research Article:</strong> Minimum 1500–5000 Words.</li>
                        <li><strong>Book reviews:</strong> 1500–2500 words, inclusive of endnotes.</li>
                    </ul>
                </div>

                {/* Guideline 4 */}
                <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '18px' }}>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: '700' }}>
                        4. Endnotes, Citations and References
                    </h4>
                    <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)' }}>
                        <li>Endnotes are mandatory for all research papers; manuscripts submitted without endnotes will not be accepted for publication.</li>
                        <li>Authors must list all references at the end of the paper, following either the MLA (Modern Language Association) or APA (American Psychological Association) style 7th edition.</li>
                    </ul>
                </div>

                {/* Guideline 5 */}
                <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '18px' }}>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: '700' }}>
                        5. Originality, Plagiarism and AI-Generated Content
                    </h4>
                    <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)' }}>
                        <li>Every article/research paper must be self-written, original, and unpublished, reflecting the author’s own independent research and analysis.</li>
                        <li>Plagiarism/similarity content in the submitted manuscript must not exceed 10%, as verified through a standard plagiarism-detection tool.</li>
                        <li>Content generated using Artificial Intelligence (AI) tools is strongly discouraged and will not be appreciated or accepted for publication; submissions found to be substantially AI-generated are liable to be rejected.</li>
                    </ul>
                </div>

                {/* Guideline 6 */}
                <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '18px' }}>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: '700' }}>
                        6. Authorship, Corresponding Author and Conflict of Interest
                    </h4>
                    <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)' }}>
                        <li>Where a manuscript has multiple authors, one author must be designated as the corresponding author for all editorial correspondence.</li>
                        <li>All listed authors must have contributed substantially to the research and must consent to the version of the manuscript submitted.</li>
                        <li>Authors must disclose any potential conflict of interest connected with the research, its funding, or its findings.</li>
                    </ul>
                </div>

                {/* Guideline 7 */}
                <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '18px' }}>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: '700' }}>
                        7. Copyright and Declaration
                    </h4>
                    <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)' }}>
                        <li>By submitting a manuscript, authors confirm that the work is not under consideration, and has not been previously published, elsewhere.</li>
                        <li>Upon acceptance, copyright of the published article vests with {journalName} / {publisherName}, unless otherwise agreed in writing.</li>
                        <li>Authors are required to submit a signed declaration/undertaking confirming originality and compliance with these guidelines along with the manuscript.</li>
                    </ul>
                </div>

                {/* Guideline 8 */}
                <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '18px' }}>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: '700' }}>
                        8. Peer Review and Book Reviews
                    </h4>
                    <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)' }}>
                        <li>All research papers are subject to anonymous (blind) peer review by referees before being considered for publication.</li>
                        <li>To enable anonymous review, author-identifying details should be placed on a separate cover page and must not appear anywhere in the main body of the manuscript.</li>
                        <li>Reviews will be considered for publication only for reference book(s) that carry a valid ISBN.</li>
                    </ul>
                </div>

                {/* Guideline 9 */}
                <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '18px' }}>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: '700' }}>
                        9. Submission Process, Timelines and Publication Fee
                    </h4>
                    <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dark)' }}>
                        <li>Manuscripts should be submitted as an email attachment to <a href={`mailto:${email}`} style={{ color: 'var(--accent-dark)', fontWeight: '600' }}>{email}</a> along with a cover letter which should contain the TITLE of the manuscript and the author details.</li>
                        <li>Acceptance for publication will be communicated by e-mail within 10–15 working days of receipt of the article.</li>
                        <li>A publication fee, where applicable, is payable only after the manuscript has been formally accepted for publication. The Article Processing Charge (APC) will be conveyed through mail after confirmation, if applicable.</li>
                    </ul>
                </div>
            </div>

            <div style={{ marginTop: '35px', borderTop: '1px solid var(--border-color)', paddingTop: '25px' }}>
                <button
                    onClick={openGmail}
                    className="btn btn-accent"
                    style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', padding: '14px 20px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}
                >
                    <i className="far fa-envelope"></i> Submit Manuscript via Email
                </button>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '12px', textAlign: 'center', marginBottom: 0 }}>
                    Send your manuscript and cover letter to <strong>{email}</strong>.
                </p>
            </div>
        </div>
    );
}
