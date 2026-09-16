import React from 'react';

export const metadata = {
  title: "About Us",
  description: "Learn about Maurya Education and Research Foundation (MERF), a NITI Aayog recognized NGO in Jaipur, Rajasthan, driving academic research, journal publishing, and social innovation.",
  keywords: [
    "About Us Maurya Education and Research Foundation",
    "About Maurya Education and Research Foundation",
    "About MERF",
    "Maurya Education and Research Foundation",
    "MERF Jaipur",
    "NITI Aayog registered NGO",
    "academic research organization Rajasthan",
    "Dr Shailendar Maurya",
    "educational research institute India",
    "MERF Rajasthan",
    "academic advisory board MERF",
    "multidisciplinary research foundation",
    "social welfare NGO Jaipur"
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Maurya Education and Research Foundation (MERF)",
    description: "Learn about Maurya Education and Research Foundation (MERF), a NITI Aayog recognized NGO in Jaipur, Rajasthan.",
    url: "https://www.mauryaerf.com/about",
    siteName: "Maurya Education and Research Foundation",
    images: [{ url: "/assets/logo.jpeg", width: 800, height: 800, alt: "MERF About Us" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About Us | Maurya Education and Research Foundation",
    description: "Learn about Maurya Education and Research Foundation (MERF) in Jaipur, Rajasthan.",
    images: ["/assets/logo.jpeg"],
  },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Maurya Education and Research Foundation",
  url: "https://www.mauryaerf.com/about",
  description: "Detailed overview of MERF's journey, vision, leadership, and academic initiatives.",
  mainEntity: {
    "@type": "EducationalOrganization",
    name: "Maurya Education and Research Foundation",
    founder: {
      "@type": "Person",
      name: "Dr. Shailendar Maurya",
      jobTitle: "Founder & Chief Editor",
      telephone: "+91-9636635216"
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      addressCountry: "IN"
    }
  }
};

export default function AboutLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      {children}
    </>
  );
}
