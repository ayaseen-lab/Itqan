import { SITE, SITE_URL } from "@/lib/seo";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function SiteJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    alternateName: SITE.tagline,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description: SITE.description,
    founder: {
      "@type": "Person",
      name: SITE.creator,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: SITE.whatsapp,
      availableLanguage: ["English", "Urdu", "Arabic"],
    },
    sameAs: ["https://raahban.com/"],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    alternateName: SITE.tagline,
    url: SITE_URL,
    description: SITE.description,
    inLanguage: ["en", "ur", "ar"],
    publisher: { "@type": "Organization", name: SITE.name },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/quran?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE.name,
    url: SITE_URL,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "AI Hifz memorization",
      "Tajweed recitation feedback",
      "Quran with Urdu and English translation",
      "Hadith of the day",
      "Digital tasbih",
      "Prayer times",
      "Family learning competitions",
    ],
  };

  return <JsonLd data={[organization, website, webApp]} />;
}

export function FaqJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}

export function SurahJsonLd({
  id,
  name,
  arabicName,
  translatedName,
  verseCount,
  revelationPlace,
}: {
  id: number;
  name: string;
  arabicName: string;
  translatedName: string;
  verseCount: number;
  revelationPlace: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Chapter",
        name: `Surah ${name}`,
        alternateName: arabicName,
        description: `${name} (${translatedName}) — Surah ${id} of the Quran with ${verseCount} verses. Revelation: ${revelationPlace}.`,
        url: `${SITE_URL}/surah/${id}`,
        isPartOf: {
          "@type": "Book",
          name: "The Holy Quran",
        },
        inLanguage: "ar",
        position: id,
      }}
    />
  );
}
