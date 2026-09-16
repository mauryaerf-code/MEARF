import React from 'react';

export const metadata = {
  title: "Academic Events, Conferences & FDPs",
  description: "Explore national and international conferences, seminars, Faculty Development Programs (FDP), and Skill Development Programs (SDP) organized by MERF.",
  keywords: [
    "Academic Events, Conferences & FDPs",
    "Academic Events & Conferences",
    "MERF conferences",
    "national conference Jaipur 2026",
    "international academic conference India",
    "faculty development programme FDP Rajasthan",
    "skill development programme SDP",
    "NEP 2020 teacher training workshop",
    "academic seminar registration Jaipur",
    "call for conference papers",
    "MERF academic conferences",
    "academic workshop certificates India",
    "higher education seminar Rajasthan"
  ],
  alternates: {
    canonical: "/events",
  },
  openGraph: {
    title: "Academic Events & Extension Programs | MERF",
    description: "Explore national and international conferences, FDPs, and academic workshops organized by MERF.",
    url: "https://www.mauryaerf.com/events",
    siteName: "Maurya Education and Research Foundation",
    images: [{ url: "/assets/logo.jpeg", width: 800, height: 800, alt: "MERF Academic Events" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Academic Events & Extension Programs | MERF",
    description: "Conferences, seminars, and FDP workshops by MERF in Jaipur, Rajasthan.",
    images: ["/assets/logo.jpeg"],
  },
};

const eventsSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "MERF Academic Events, Conferences & FDPs",
  url: "https://www.mauryaerf.com/events",
  description: "Schedule of national and international conferences, FDPs, SDPs, and teacher training seminars.",
  publisher: {
    "@type": "EducationalOrganization",
    name: "Maurya Education and Research Foundation",
    url: "https://www.mauryaerf.com"
  }
};

export default function EventsLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsSchema) }}
      />
      {children}
    </>
  );
}
