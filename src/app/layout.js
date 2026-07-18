import "./globals.css";
import { Outfit, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const outfitFont = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

const playfairFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata = {
  title: {
    default: "Maurya Education and Research Foundation (MERF) | Academic Excellence & Social Innovation",
    template: "%s | Maurya Education and Research Foundation"
  },
  description: "Maurya Education and Research Foundation (MERF) is a Section 8 NGO in Jaipur, Rajasthan, dedicated to academic research, journal publication, book distribution, and community welfare.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
  keywords: [
    "Maurya Education and Research Foundation",
    "MERF",
    "MERF India",
    "Rajasthan Institute of Social Science Research",
    "RISSR",
    "academic research India",
    "education research organization",
    "education NGO India",
    "multidisciplinary research journal",
    "peer reviewed journal India",
    "refereed journal publications",
    "Shodh Unnayan Journal",
    "The Scholar's Real View Journal",
    "Vanijyam Journal",
    "VIJCMBS",
    "Online Journal",
    "multidisciplinary online journal",
    "ISBN book publication services",
    "publish book with ISBN",
    "academic book publisher India",
    "faculty development programme FDP",
    "skill development programme SDP",
    "national international seminar",
    "academic conferences 2026",
    "social welfare organization",
    "women empowerment education",
    "NEP 2020 teacher training",
    "Indian Knowledge System IKS",
    "best research organization in India",
    "publish research paper online",
    "conference proceedings publication"
  ],
  authors: [{ name: "Dr. Shailendar Maurya" }],
  creator: "Maurya Education and Research Foundation",
  publisher: "Maurya Education and Research Foundation",
  metadataBase: new URL("https://www.mauryaerf.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Maurya Education and Research Foundation (MERF)",
    description: "Maurya Education and Research Foundation (MERF) is a Section 8 NGO in Jaipur, Rajasthan, dedicated to academic research, journal publication, book distribution, and community welfare.",
    url: "https://www.mauryaerf.com",
    siteName: "Maurya Education and Research Foundation",
    images: [
      {
        url: "/assets/logo.png",
        width: 800,
        height: 800,
        alt: "MERF Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Maurya Education and Research Foundation (MERF)",
    description: "Maurya Education and Research Foundation (MERF) is a Section 8 NGO in Jaipur, Rajasthan, dedicated to academic research, journal publication, book distribution, and community welfare.",
    images: ["/assets/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* FontAwesome for Icons */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={`${outfitFont.variable} ${playfairFont.variable}`}>
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-F50EX3QEBS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F50EX3QEBS');
          `}
        </Script>
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
