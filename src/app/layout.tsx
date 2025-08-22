import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script";


const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",  
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://magnaodonto.vercel.app';

export const metadata: Metadata = {
  title: {
    default: "Clínica Magna Odonto em Porto Velho | Dentista, Ortodontia, Implantes e Tratamentos Odontológicos",
    template: "%s | Clínica Magna Odonto Porto Velho"
  },
  description: "A Clínica Magna Odonto em Porto Velho oferece tratamentos odontológicos completos: ortodontia, implantes dentários, avaliação, canal, próteses, gengivoplastia e mais. Atendimento humanizado, tecnologia moderna e profissionais experientes para cuidar do seu sorriso com excelência. Agende sua consulta e descubra o diferencial Magna Odonto!",
  keywords: "odontologia Porto Velho, dentista Porto Velho, ortodontia Porto Velho, implantes dentários Porto Velho, clínica odontológica Porto Velho, tratamento dentário, Magna Odonto, consultório dentário, saúde bucal Porto Velho, avaliação odontológica, canal, próteses, gengivoplastia",
  authors: [{ name: "Magna Odonto" }],
  creator: "Clínica Magna Odonto",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    title: "Clínica Magna Odonto em Porto Velho | Dentista, Ortodontia, Implantes e Tratamentos Odontológicos",
    description: "Tratamentos odontológicos completos em Porto Velho: ortodontia, implantes, avaliação, canal, próteses, gengivoplastia e mais. Atendimento humanizado e tecnologia moderna.",
    siteName: "Clínica Magna Odonto",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Fachada da Clínica Magna Odonto em Porto Velho, Rondônia"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Clínica Magna Odonto em Porto Velho | Dentista, Ortodontia, Implantes e Tratamentos Odontológicos",
    description: "Tratamentos odontológicos completos em Porto Velho: ortodontia, implantes, avaliação, canal, próteses, gengivoplastia e mais. Atendimento humanizado e tecnologia moderna.",
    images: [`${siteUrl}/og-image.png`], 
  },
  verification: {
    google: "googleb1763076fe4934ae",
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'pt-BR': siteUrl,
    },
  },
  other: {
    'geo.region': 'BR-RO',
    'geo.placename': 'Porto Velho',
    'geo.position': '-8.761160;-63.902150',
    'ICBM': '-8.761160, -63.902150',
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" dir="ltr">
      <head>
        <title>Clínica Magna Odonto em Porto Velho | Dentista, Ortodontia, Implantes e Tratamentos Odontológicos</title>
        <meta
          name="description"
          content="A Clínica Magna Odonto em Porto Velho oferece tratamentos odontológicos completos: ortodontia, implantes dentários, avaliação, canal, próteses e gengivoplastia. Atendimento humanizado e tecnologia moderna."
        />
        <link rel="canonical" href={siteUrl} />
        <meta name="robots" content="index,follow" />

        <meta name="google-site-verification" content="t-il3FbsYzzcN-AUQK7OFown7GVsQj3lFnW3TnJWYz4" />

        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        {/* Meta tags explícitas para reforçar o nome do site para mecanismos de busca */}
        <meta name="application-name" content="Clínica Magna Odonto" />
        <meta name="apple-mobile-web-app-title" content="Clínica Magna Odonto" />
        <meta property="og:site_name" content="Clínica Magna Odonto" />
      </head>
      <body className={`${dmSans.className} antialiased`}>        <Script id="schema-dental-clinic" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Dentist",
              "name": "Clínica Magna Odonto",
              "image": "${siteUrl}/og-image.png",
              "url": "${siteUrl}",
              "email": "magnamartinha@hotmail.com",
              "telephone": "+5569996021979",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Av. Jatuarana, 4941, sala 01, Nova Floresta",
                "addressLocality": "Porto Velho",
                "addressRegion": "RO",
                "postalCode": "76807-441",
                "addressCountry": "BR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -8.761160,
                "longitude": -63.902150
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "08:00",
                  "closes": "11:30"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "14:00",
                  "closes": "18:00"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/magnaodonto",
                "https://www.instagram.com/magnaodontoclinica",
                "https://api.whatsapp.com/send?phone=556996021979"
              ],              "priceRange": "$$",
              "paymentAccepted": "Pagamento apenas presencial",
              "availableService": [
                {
                  "@type": "MedicalProcedure",
                  "name": "Ortodontia",
                  "procedureType": "http://schema.org/MedicalTherapy"
                },
                {
                  "@type": "MedicalProcedure",
                  "name": "Implantes Dentários",
                  "procedureType": "http://schema.org/MedicalTherapy"
                },
                {
                  "@type": "MedicalProcedure",
                  "name": "Tratamento de Canal",
                  "procedureType": "http://schema.org/MedicalTherapy"
                },
                {
                  "@type": "MedicalProcedure",
                  "name": "Próteses Dentárias",
                  "procedureType": "http://schema.org/MedicalTherapy"
                },
                {
                  "@type": "MedicalProcedure",
                  "name": "Gengivoplastia",
                  "procedureType": "http://schema.org/MedicalTherapy"
                }
              ]
            }
          `}
        </Script>
        <Toaster position="top-center" />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
         <Analytics />
      </body>
    </html>
  );
}
