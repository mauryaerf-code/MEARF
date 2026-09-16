import React from 'react';

export const metadata = {
  title: "News, Press & Media Gallery",
  description: "Browse photo galleries and event highlights from academic conferences, FDPs, award ceremonies, and social welfare programs organized by MERF.",
  keywords: [
    "News, Press & Media Gallery",
    "News & Gallery MERF",
    "MERF photo gallery",
    "academic conference photos Jaipur",
    "national seminar gallery",
    "MERF news and updates",
    "education foundation gallery Rajasthan",
    "community welfare events photos"
  ],
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "News & Gallery | Maurya Education and Research Foundation",
    description: "Browse event photos and news from MERF academic conferences and social drives.",
    url: "https://www.mauryaerf.com/gallery",
    siteName: "Maurya Education and Research Foundation",
    images: [{ url: "/assets/logo.jpeg", width: 800, height: 800, alt: "MERF Gallery" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "News & Gallery | MERF",
    description: "Conferences, seminars, and community welfare photo gallery by MERF.",
    images: ["/assets/logo.jpeg"],
  },
};

export default function GalleryLayout({ children }) {
  return children;
}
