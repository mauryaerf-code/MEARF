import React from 'react';

export const metadata = {
  title: "Shodh Unnayan (शोध उन्नयन) | Peer-Reviewed Hindi Research Journal | ISSN: 3048-846X",
  description: "Shodh Unnayan is a quarterly peer-reviewed multidisciplinary Hindi research journal published by RISSR (MERF). Submit original Hindi research papers for publication.",
  keywords: [
    "Shodh Unnayan journal",
    "शोध उन्नयन शोध पत्रिका",
    "peer reviewed Hindi research journal",
    "multidisciplinary Hindi journal India",
    "publish Hindi research paper",
    "ISSN 3048-846X",
    "RISSR Hindi journal",
    "quarterly research journal Jaipur",
    "UGC CARE guideline Hindi journal",
    "social science research Hindi journal",
    "Hindi research paper submission"
  ],
  alternates: {
    canonical: "/journals/shodh-unnayan",
  },
  openGraph: {
    title: "Shodh Unnayan (शोध उन्नयन) | Peer-Reviewed Hindi Research Journal",
    description: "Quarterly multidisciplinary Hindi research journal under RISSR (MERF). ISSN: 3048-846X.",
    url: "https://www.mauryaerf.com/journals/shodh-unnayan",
    siteName: "Maurya Education and Research Foundation",
    images: [{ url: "/assets/home/Shodh Unnayan.png", width: 600, height: 800, alt: "Shodh Unnayan Journal Cover" }],
    locale: "hi_IN",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "Shodh Unnayan (शोध उन्नयन) | Peer-Reviewed Hindi Journal",
    description: "Peer-reviewed multidisciplinary quarterly Hindi research journal. ISSN: 3048-846X.",
    images: ["/assets/home/Shodh Unnayan.png"],
  },
};

const shodhSchema = {
  "@context": "https://schema.org",
  "@type": "Periodical",
  name: "Shodh Unnayan (शोध उन्नयन)",
  issn: "3048-846X",
  inLanguage: "hi",
  url: "https://www.mauryaerf.com/journals/shodh-unnayan",
  description: "Peer-reviewed refereed multidisciplinary quarterly international journal in the Hindi language.",
  publisher: {
    "@type": "Organization",
    name: "Rajasthan Institute of Social Science Research (RISSR)",
    parentOrganization: {
      "@type": "EducationalOrganization",
      name: "Maurya Education and Research Foundation"
    }
  }
};

export default function ShodhUnnayanLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shodhSchema) }}
      />
      {children}
    </>
  );
}
