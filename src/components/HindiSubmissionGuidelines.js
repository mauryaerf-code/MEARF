import React from 'react';

export default function HindiSubmissionGuidelines() {
    return (
        <div className="card" style={{ padding: '35px 40px', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: '35px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '18px', borderBottom: '2.5px solid var(--accent)', paddingBottom: '12px', color: 'var(--primary-dark)', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                <i className="fas fa-file-alt" style={{ marginRight: '10px', color: 'var(--accent-dark)' }}></i>
                आलेख भेजने सम्बन्धी आवश्यक निर्देश:
            </h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '20px', fontStyle: 'italic' }}>
                शोधार्थियों एवं लेखकों से निवेदन है कि अपने शोध आलेख भेजने से पूर्व निम्नलिखित निर्देशों का अवलोकन एवं अनुपालन सुनिश्चित करें:
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.98rem', lineHeight: '1.9', color: 'var(--text-dark)', margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>आलेख <strong>एमएस वर्ड (MS Word)</strong> (.doc/.docx) फाइल फॉर्मेट में होना चाहिए।</li>
                <li style={{ marginBottom: '8px' }}>आलेख की फ़ॉन्ट <strong>कृतिदेव-10 (Kruti Dev 010)</strong> में ही स्वीकार्य है।</li>
                <li style={{ marginBottom: '8px' }}>शीर्षक/उप-शीर्षक की फ़ॉन्ट साइज <strong>16</strong> तथा अन्य विवरणों की फ़ॉन्ट साइज <strong>14</strong> होनी चाहिए।</li>
                <li style={{ marginBottom: '8px' }}>आलेख में कम से कम 10 संदर्भ सूची (References) होना अनिवार्य है।</li>
                <li style={{ marginBottom: '8px' }}>शब्द सीमा: न्यूनतम <strong>2,000 शब्द</strong>, अधिकतम <strong>2,500 शब्द</strong>।</li>
                <li style={{ marginBottom: '8px' }}>आलेख के साथ 150 शब्दों का शोध-सार (Abstract) तथा कम से कम 10 मूल शब्द (Keywords) भेजें।</li>
                <li style={{ marginBottom: '8px' }}>आलेख में लेखक का नाम, पद, संस्थान का नाम, ईमेल और मोबाइल नंबर अंत में अवश्य लिखें।</li>
            </ul>
        </div>
    );
}
