import "./globals.css";
import { Outfit, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    icon: "/vercel.svg"
  },
  keywords: ["MERF", "Maurya Education and Research Foundation", "NGO", "Section 8 Company", "Research publishing", "Jaipur", "Rajasthan", "Shodh Unnayan", "The Scholar's Real View"],
  authors: [{ name: "Dr. Shailendar Maurya" }],
  creator: "Maurya Education and Research Foundation",
  publisher: "Maurya Education and Research Foundation",
  metadataBase: new URL("https://merfindia.org"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Maurya Education and Research Foundation (MERF)",
    description: "Maurya Education and Research Foundation (MERF) is a Section 8 NGO in Jaipur, Rajasthan, dedicated to academic research, journal publication, book distribution, and community welfare.",
    url: "https://merfindia.org",
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
        <link rel="icon" href="/vercel.svg" />
      </head>
      <body className={`${outfitFont.variable} ${playfairFont.variable}`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
