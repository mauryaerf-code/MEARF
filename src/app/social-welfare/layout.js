import React from 'react';

export const metadata = {
  title: "Social Welfare & Community Impact (SVBSPS) | MERF",
  description: "Learn about Swami Vivekanand Balika Shiksha Prachar Samiti (SVBSPS), the registered social welfare wing of MERF dedicated to girl-child education, women empowerment, health, and environmental sustainability.",
  keywords: [
    "Swami Vivekanand Balika Shiksha Prachar Samiti",
    "SVBSPS",
    "MERF social welfare",
    "girl child education Rajasthan",
    "women empowerment NGO Jaipur",
    "free computer training rural youth",
    "rural healthcare awareness camp",
    "tree plantation drive Rajasthan",
    "education NGO India"
  ],
  alternates: {
    canonical: "/social-welfare",
  },
  openGraph: {
    title: "Social Welfare & Community Impact (SVBSPS) | MERF",
    description: "Community empowerment, girl-child education, and social sustainability by SVBSPS (MERF).",
    url: "https://www.mauryaerf.com/social-welfare",
    siteName: "Maurya Education and Research Foundation",
    images: [{ url: "/assets/logo.jpeg", width: 800, height: 800, alt: "SVBSPS Social Welfare" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Social Welfare & Community Impact | SVBSPS (MERF)",
    description: "Women empowerment, girl child education, and environmental protection in Rajasthan.",
    images: ["/assets/logo.jpeg"],
  },
};

const welfareSchema = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "Swami Vivekanand Balika Shiksha Prachar Samiti (SVBSPS)",
  parentOrganization: {
    "@type": "EducationalOrganization",
    name: "Maurya Education and Research Foundation"
  },
  url: "https://www.mauryaerf.com/social-welfare",
  description: "Social wing of MERF working for women education, empowerment, healthcare, and tree plantation in Rajasthan."
};

export default function SocialWelfareLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(welfareSchema) }}
      />
      {children}
    </>
  );
}
