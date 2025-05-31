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
  },
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
