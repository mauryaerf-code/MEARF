import React from 'react';

export const metadata = {
  title: "Books Publications & ISBN Book Publishing | Maurya Publications",
  description: "Publish your academic books, research monographs, and edited volumes with registered ISBN. Maurya Publications & Distributors provides end-to-end publishing and distribution services.",
  keywords: [
    "Books Publications & ISBN Book Publishing",
    "Books Publications",
    "Maurya Publications",
    "Maurya Publications and Distributors",
    "ISBN Book Publishing",
    "publish book with ISBN India",
    "ISBN book publication services Jaipur",
    "academic book publisher Rajasthan",
    "publish research monograph ISBN",
    "edited book chapter publication call",
    "conference proceedings publication with ISBN",
    "academic textbook publisher Jaipur",
    "get ISBN for my book India",
    "low cost ISBN publication India",
    "MERF book publication"
  ],
  alternates: {
    canonical: "/books-publications",
  },
  openGraph: {
    title: "Books Publications & ISBN Book Publishing | Maurya Publications",
    description: "Get your academic book or monograph published with registered ISBN through Maurya Publications & Distributors.",
    url: "https://www.mauryaerf.com/books-publications",
    siteName: "Maurya Education and Research Foundation",
    images: [{ url: "/assets/logo.jpeg", width: 800, height: 800, alt: "Maurya Publications" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Books Publications & ISBN Book Publishing Services | MERF",
    description: "Publish academic books, monographs, and conference proceedings with ISBN.",
    images: ["/assets/logo.jpeg"],
  },
};

const publicationsSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Maurya Publications & Distributors - ISBN Book Publishing",
  url: "https://www.mauryaerf.com/books-publications",
  description: "Catalogue of published academic books, monographs, and ISBN book publishing guidelines.",
  publisher: {
    "@type": "Organization",
    name: "Maurya Publications & Distributors",
    parentOrganization: {
      "@type": "EducationalOrganization",
      name: "Maurya Education and Research Foundation"
    }
  }
};

export default function PublicationsLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(publicationsSchema) }}
      />
      {children}
    </>
  );
}
