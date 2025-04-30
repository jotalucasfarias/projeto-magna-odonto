import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",  
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

export const metadata: Metadata = {
  title: {
    default: "Clínica Magna Odonto | Tratamentos Odontológicos em Porto Velho",
    template: "%s | Clínica Magna Odonto"
  },
  description: "Tratamentos odontológicos completos em Porto Velho, com excelência e conforto. Nossa clínica oferece uma variedade de serviços para cuidar da sua saúde bucal, desde consultas de rotina até tratamentos especializados. Agende sua consulta hoje mesmo!",
  keywords: "odontologia, dentista Porto Velho, ortodontia, implantes dentários, clínica odontológica, tratamento dentário, Magna Odonto, consultório dentário Porto Velho, saúde bucal",
  authors: [{ name: "Magna Odonto" }],
  creator: "Clínica Magna Odonto",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    title: "Clínica Magna Odonto | Tratamentos Odontológicos em Porto Velho",
    description: "Tratamentos odontológicos completos em Porto Velho com excelência e conforto. Agende sua consulta!",
    siteName: "Clínica Magna Odonto",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Clínica Magna Odonto em Porto Velho"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Clínica Magna Odonto | Tratamentos Odontológicos em Porto Velho",
    description: "Tratamentos odontológicos completos em Porto Velho com excelência e conforto. Agende sua consulta!",
    images: [`${siteUrl}/og-image.png`], 
  },
  verification: {
    google: "verification_token",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" dir="ltr">
      <body className={`${dmSans.className} antialiased`}>
        <Toaster position="top-center" />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
