import React from 'react';

export const metadata = {
  title: "The Scholar's Real View | Peer-Reviewed English Research Journal | ISSN: 3049-3609",
  description: "The Scholar's Real View is a half-yearly peer-reviewed multidisciplinary English research journal published by RISSR (MERF). Call for original research papers.",
  keywords: [
    "The Scholars Real View journal",
    "peer reviewed English research journal India",
    "multidisciplinary academic journal Jaipur",
    "ISSN 3049-3609",
    "RISSR English journal",
    "half-yearly research journal",
    "fast track research paper publication",
    "social science technology management journal",
    "academic journal paper submission",
    "international research journal India"
  ],
  alternates: {
    canonical: "/journals/scholars-view",
  },
  openGraph: {
    title: "The Scholar's Real View | Peer-Reviewed English Research Journal",
    description: "Half-yearly multidisciplinary English research journal under RISSR (MERF). ISSN: 3049-3609.",
    url: "https://www.mauryaerf.com/journals/scholars-view",
    siteName: "Maurya Education and Research Foundation",
    images: [{ url: "/assets/home/Scholar.png", width: 600, height: 800, alt: "The Scholar's Real View Cover" }],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "The Scholar's Real View | English Research Journal",
    description: "Peer-reviewed half-yearly multidisciplinary international research journal. ISSN: 3049-3609.",
    images: ["/assets/home/Scholar.png"],
  },
};

const scholarsSchema = {
  "@context": "https://schema.org",
  "@type": "Periodical",
  name: "The Scholar's Real View",
  issn: "3049-3609",
  inLanguage: "en",
  url: "https://www.mauryaerf.com/journals/scholars-view",
  description: "Peer-reviewed refereed multidisciplinary half-yearly international journal in the English language.",
  publisher: {
    "@type": "Organization",
    name: "Rajasthan Institute of Social Science Research (RISSR)",
    parentOrganization: {
      "@type": "EducationalOrganization",
      name: "Maurya Education and Research Foundation"
    }
  }
};

export default function ScholarsViewLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(scholarsSchema) }}
      />
      {children}
    </>
  );
}
