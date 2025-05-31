export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://projeto-magna-odonto.vercel.app';

const seoConfig = {
  defaultTitle: "Clínica Magna Odonto | Tratamentos Odontológicos em Porto Velho",
  titleTemplate: "%s | Clínica Magna Odonto",
  description: "Tratamentos odontológicos completos em Porto Velho, com excelência e conforto. Nossa clínica oferece uma variedade de serviços para cuidar da sua saúde bucal, desde consultas de rotina até tratamentos especializados.",
  canonical: siteUrl,
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteUrl,
    site_name: 'Clínica Magna Odonto',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Clínica Magna Odonto em Porto Velho',
      },
    ],
  },
  twitter: {
    cardType: 'summary_large_image',
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
  ],
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'keywords',
      content: 'odontologia, dentista Porto Velho, ortodontia, implantes dentários, clínica odontológica, tratamento dentário, Magna Odonto',
    },
    {
      name: 'author',
      content: 'Magna Odonto',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
  ],
};

export default seoConfig;
