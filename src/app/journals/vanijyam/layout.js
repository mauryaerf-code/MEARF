import React from 'react';

export const metadata = {
  title: "Vanijyam (VIJCMBS) | Peer-Reviewed Journal of Commerce & Management",
  description: "Vanijyam (VIJCMBS) is an annual peer-reviewed multi-language journal published under RISSR (MERF) covering Commerce, Management, Economics, Finance, and Business Studies.",
  keywords: [
    "Vanijyam (VIJCMBS)",
    "Vanijyam International Journal of Commerce Management and Business Studies",
    "Vanijyam International Journal of Commerce, Management and Business Studies (VIJCMBS)",
    "Vanijyam journal",
    "VIJCMBS",
    "Peer-Reviewed Journal of Commerce & Management",
    "commerce management research journal India",
    "annual peer reviewed commerce journal",
    "Dr Vinod Kumar Meena journal",
    "publish economics research paper",
    "business studies research paper publication",
    "finance banking research journal",
    "multilingual commerce journal India",
    "MERF commerce publications",
    "RISSR Vanijyam journal"
  ],
  alternates: {
    canonical: "/journals/vanijyam",
  },
  openGraph: {
    title: "Vanijyam (VIJCMBS) | Peer-Reviewed Journal of Commerce & Management",
    description: "Annual peer-reviewed multidisciplinary commerce and business journal under RISSR (MERF).",
    url: "https://www.mauryaerf.com/journals/vanijyam",
    siteName: "Maurya Education and Research Foundation",
    images: [{ url: "/assets/home/vanijyam.png", width: 600, height: 800, alt: "Vanijyam Journal Cover" }],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "Vanijyam (VIJCMBS) | Commerce & Business Studies Journal",
    description: "Annual peer-reviewed multidisciplinary research journal in commerce and management.",
    images: ["/assets/home/vanijyam.png"],
  },
};

const vanijyamSchema = {
  "@context": "https://schema.org",
  "@type": "Periodical",
  name: "Vanijyam International Journal of Commerce Management and Business Studies (VIJCMBS)",
  alternateName: "Vanijyam Journal",
  inLanguage: ["en", "hi"],
  url: "https://www.mauryaerf.com/journals/vanijyam",
  description: "Annual peer-reviewed multi-language research journal in commerce, management, economics, and business studies.",
  editor: {
    "@type": "Person",
    name: "Dr. Vinod Kumar Meena",
    jobTitle: "Chief Editor & Assistant Professor, MLSU, Udaipur"
  },
  publisher: {
    "@type": "Organization",
    name: "Rajasthan Institute of Social Science Research (RISSR)",
    parentOrganization: {
      "@type": "EducationalOrganization",
      name: "Maurya Education and Research Foundation",
      url: "https://www.mauryaerf.com"
    }
  }
};

export default function VanijyamLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vanijyamSchema) }}
      />
      {children}
    </>
  );
}
