import React from 'react';

export const metadata = {
  title: "Reforming Research | International Peer-Reviewed Online Journal",
  description: "Reforming Research is an international peer-reviewed refered interdisciplinary quarterly online journal in multi-language published under RISSR (MERF) Jaipur, Rajasthan. Call for papers in Social Sciences, Humanities, Law, Education, Commerce, Technology, and Management.",
  keywords: [
    "Reforming Research",
    "Reforming Research International Peer-Reviewed Online Journal",
    "Reforming Research online journal",
    "Reforming Research journal",
    "International Peer-Reviewed Online Journal",
    "interdisciplinary quarterly online journal",
    "peer reviewed multi-language online journal",
    "MERF Reforming Research",
    "RISSR Reforming Research",
    "Dr Shailendar Maurya Reforming Research",
    "publish interdisciplinary research paper",
    "online journal social sciences humanities law technology",
    "fast peer review research journal India",
    "call for research papers 2026",
    "open access online journal India",
    "quarterly online journal submission"
  ],
  alternates: {
    canonical: "/journals/reforming-research",
  },
  openGraph: {
    title: "Reforming Research | International Peer-Reviewed Online Journal",
    description: "An international peer-reviewed refered interdisciplinary quarterly online journal in multi-language published under RISSR (MERF).",
    url: "https://www.mauryaerf.com/journals/reforming-research",
    siteName: "Maurya Education and Research Foundation",
    images: [{ url: "/assets/home/online.png", width: 600, height: 800, alt: "Reforming Research Journal" }],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "Reforming Research | Interdisciplinary Online Journal",
    description: "International peer-reviewed refered quarterly online journal by RISSR (MERF) Jaipur.",
    images: ["/assets/home/online.png"],
  },
};

const reformingResearchSchema = {
  "@context": "https://schema.org",
  "@type": "Periodical",
  name: "Reforming Research",
  alternateName: "Reforming Research Online Journal",
  url: "https://www.mauryaerf.com/journals/reforming-research",
  description: "An International Peer Reviewed Refered Interdisciplinary Quarterly online Journal in Multi-Language.",
  inLanguage: ["en", "hi"],
  editor: {
    "@type": "Person",
    name: "Dr. Shailendar Maurya",
    jobTitle: "Founder & Chief Editor",
    telephone: "+91-9636635216"
  },
  publisher: {
    "@type": "Organization",
    name: "Rajasthan Institute of Social Science Research (RISSR)",
    parentOrganization: {
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
  }
};

export default function ReformingResearchLayout({ children }) {
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
