import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";

import { BookingProvider } from "@/components/booking/booking-provider";
import { MotionObserver } from "@/components/motion-observer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SITE, TWO_GIS, VERIFIED } from "@/lib/company";

import "./globals.css";

const bodyFont = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body-sans",
  display: "swap",
});

const displayFont = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display-sans",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: "%s · Lux Car",
  },
  description: SITE.description,
  keywords: [
    "автосервис Семей",
    "Lux car Семей",
    "СТО Семей",
    "ремонт автомобилей Семей",
    "диагностика автомобиля Семей",
    "ГБО Семей",
  ],
  applicationName: "Lux Car",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_KZ",
    url: SITE.url,
    siteName: "Lux Car",
    title: SITE.title,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: "Lux car — автосервис в Семее",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  icons: { icon: "/icon.svg" },
  robots: { index: true, follow: true },
  category: "automotive",
};

export const viewport: Viewport = {
  themeColor: "#07080a",
  colorScheme: "dark",
};

/**
 * Structured data contains ONLY facts confirmed by the 2GIS card: name, address,
 * geo coordinates, phone, opening hours and the public rating source of truth.
 * No price range, no services list, no invented founding date.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: VERIFIED.name,
  description:
    "Автосервис в Семее: диагностика, обслуживание и ремонт легковых автомобилей.",
  url: SITE.url,
  telephone: VERIFIED.phone,
  image: `${SITE.url}${SITE.ogImage}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: VERIFIED.address,
    addressLocality: VERIFIED.city,
    addressCountry: "KZ",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: VERIFIED.geo.lat,
    longitude: VERIFIED.geo.lng,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: VERIFIED.hoursSchema.opens,
      closes: VERIFIED.hoursSchema.closes,
    },
  ],
  paymentAccepted: VERIFIED.payments.join(", "),
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: VERIFIED.rating,
    ratingCount: VERIFIED.ratingsCount,
    reviewCount: VERIFIED.reviewsCount,
  },
  sameAs: [TWO_GIS.cardUrl],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="min-h-dvh antialiased">
        {/* Pre-paint flag: lets CSS hide elements that JS will animate in, so
            counters never flash their final value. No JS or reduced motion
            simply keeps the static server-rendered output. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.motion='on'}}catch(e){}",
          }}
        />
        <BookingProvider>
          {children}
          <ScrollReveal />
          <MotionObserver />
        </BookingProvider>
        <script
          type="application/ld+json"
          // Static, author-controlled JSON: no user input reaches this tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
