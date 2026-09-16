import React from 'react';

export const metadata = {
  title: "Contact Us & Editorial Office",
  description: "Get in touch with Maurya Education and Research Foundation (MERF) in Jaipur, Rajasthan for research journal submissions, ISBN book publishing, and academic inquiries.",
  keywords: [
    "Contact Us & Editorial Office",
    "Contact Maurya Education and Research Foundation",
    "contact MERF",
    "MERF editorial office contact",
    "Maurya Education and Research Foundation address Jaipur",
    "research paper submission enquiry",
    "publish book with ISBN contact",
    "journal editorial office Jaipur",
    "MERF phone number email",
    "academic publishing support Jaipur",
    "Dr Shailendar Maurya contact",
    "MERF Jaipur office phone"
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Maurya Education and Research Foundation",
    description: "Get in touch with MERF for research journal submissions, ISBN book publishing, and academic conference partnerships in Jaipur.",
    url: "https://www.mauryaerf.com/contact",
    siteName: "Maurya Education and Research Foundation",
    images: [{ url: "/assets/logo.jpeg", width: 800, height: 800, alt: "Contact MERF" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | Maurya Education and Research Foundation",
    description: "Contact MERF for academic research inquiries and publications in Jaipur, Rajasthan.",
    images: ["/assets/logo.jpeg"],
  },
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Maurya Education and Research Foundation",
  url: "https://www.mauryaerf.com/contact",
  mainEntity: {
    "@type": "EducationalOrganization",
    name: "Maurya Education and Research Foundation",
    telephone: "+91-9636635216",
    email: "drshailendar@mauryaerf.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      addressCountry: "IN"
    }
  }
};

export default function ContactLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      {children}
    </>
  );
}
