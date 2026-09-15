import React from 'react';

export const metadata = {
  title: "Reforming Research | International Peer-Reviewed Interdisciplinary Online Journal",
  description: "Reforming Research is an international peer-reviewed refered interdisciplinary quarterly online journal in multi-language published by MERF Jaipur, Rajasthan. Call for papers in Social Sciences, Humanities, Law, Education, Commerce, Technology, and Management.",
  keywords: [
    "Reforming Research",
    "Reforming Research journal",
    "Reforming Research online journal",
    "interdisciplinary quarterly online journal",
    "peer reviewed multi-language online journal",
    "MERF Reforming Research",
    "publish interdisciplinary research paper",
    "online journal social sciences humanities law technology",
    "fast peer review research journal India",
    "Dr Shailendar Maurya Reforming Research",
    "open access online journal India",
    "call for research papers 2026",
    "quarterly online journal submission"
  ],
  alternates: {
    canonical: "/journals/online",
  },
  openGraph: {
    title: "Reforming Research | International Peer-Reviewed Online Journal",
    description: "An international peer-reviewed refered interdisciplinary quarterly online journal in multi-language published by MERF.",
    url: "https://www.mauryaerf.com/journals/online",
    siteName: "Maurya Education and Research Foundation",
    images: [{ url: "/assets/home/online.png", width: 600, height: 800, alt: "Reforming Research Journal" }],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "Reforming Research | Interdisciplinary Online Journal",
    description: "International peer-reviewed refered quarterly online journal by MERF Jaipur.",
    images: ["/assets/home/online.png"],
  },
};

const reformingResearchSchema = {
  "@context": "https://schema.org",
  "@type": "Periodical",
  name: "Reforming Research",
  alternateName: "Reforming Research Online Journal",
  url: "https://www.mauryaerf.com/journals/online",
  description: "An International Peer Reviewed Refered Interdisciplinary Quarterly online Journal in Multi-Language.",
  inLanguage: ["en", "hi"],
  publisher: {
    "@type": "EducationalOrganization",
    name: "Maurya Education and Research Foundation",
    url: "https://www.mauryaerf.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      addressCountry: "IN"
    }
  }
};

export default function OnlineJournalLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reformingResearchSchema) }}
      />
      {children}
    </>
  );
}
