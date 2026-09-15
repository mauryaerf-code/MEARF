import React from 'react';

export const metadata = {
  title: "Vanijyam (VIJCMBS) | Journal of Commerce, Management & Business Studies",
  description: "Vanijyam (VIJCMBS) is an annual peer-reviewed multi-language journal published by MERF covering Commerce, Management, Economics, Finance, and Business Studies.",
  keywords: [
    "Vanijyam journal",
    "VIJCMBS journal",
    "Vanijyam International Journal of Commerce Management and Business Studies",
    "commerce management research journal India",
    "annual peer reviewed commerce journal",
    "publish economics research paper",
    "business studies research paper publication",
    "finance banking research journal",
    "multilingual commerce journal India",
    "MERF commerce publications"
  ],
  alternates: {
    canonical: "/journals/vanijyam",
  },
  openGraph: {
    title: "Vanijyam (VIJCMBS) | Journal of Commerce & Management",
    description: "Annual peer-reviewed multidisciplinary commerce and business journal under MERF.",
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
  url: "https://www.mauryaerf.com/journals/vanijyam",
  description: "Annual peer-reviewed multi-language research journal in commerce, management, economics, and business studies.",
  publisher: {
    "@type": "EducationalOrganization",
    name: "Maurya Education and Research Foundation",
    url: "https://www.mauryaerf.com"
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
