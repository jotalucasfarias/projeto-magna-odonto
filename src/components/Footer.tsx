import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo-white.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faClock,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Script from "next/script";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Local Business structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "name": "Clínica Magna Odonto",
    "image": "https://magnaodonto.com.br/logo.png",
    "url": "https://magnaodonto.com.br",
    "telephone": "+556996021979",
    "email": "magnamartinha@hotmail.com",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Jatuarana n°4941 sala 01",
      "addressLocality": "Porto Velho",
      "addressRegion": "RO",
      "postalCode": "",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -8.7608199,
      "longitude": -63.874666
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
    ]
  };

  return (
    <footer className="bg-blue-500 text-white py-12" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Rodapé - Informações de contato e links úteis</h2>
      <Script id="dental-clinic-structured-data" type="application/ld+json">
        {JSON.stringify(structuredData)}
      </Script>
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Coluna 1: Sobre a clínica */}
          <div>
            <Link href="/" className="flex items-center mb-4" aria-label="Página inicial da Clínica Magna Odonto">
              <Image
                src={Logo}
                className="max-w-52"
                alt="Logo Clínica Magna Odonto"
                priority={false}
                width={200}
                height={80}
              />
            </Link>
            <p className="mb-4 text-sm leading-relaxed">
              Cuidando do seu sorriso com excelência e dedicação. Oferecemos tratamentos odontológicos de qualidade para toda a família em um ambiente acolhedor.
            </p>
            <p className="text-sm">
              <strong>RT:</strong> Magna Ribeiro CRo/RO: 2736
            </p>
          </div>

          {/* Coluna 2: Informações de contato */}
          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-white/20 pb-2">Contato</h3>
            <address className="not-italic">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 mt-1 w-4" aria-hidden="true" />
                  <span className="text-sm">Av. Jatuarana n°4941 sala 01<br />Nova Floresta, Porto Velho - RO</span>
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faPhone} className="mr-3 w-4" aria-hidden="true" />
                  <a href="tel:+556996021979" className="text-sm hover:underline">(69) 99602-1979</a>
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-3 w-4" aria-hidden="true" />
                  <a href="mailto:magnamartinha@hotmail.com" className="text-sm hover:underline">magnamartinha@hotmail.com</a>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faClock} className="mr-3 mt-1 w-4" aria-hidden="true" />
                  <div className="text-sm">
                    <p>Segunda a Sexta:</p>
                    <p>08:00 às 11:30 / 14:00 às 18:00</p>
                  </div>
                </li>
              </ul>
            </address>
          </div>

          {/* Coluna 3: Links úteis */}
          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-white/20 pb-2">Links Úteis</h3>
            <nav aria-label="Links de navegação do site">
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-sm flex items-center hover:underline">
                    <FontAwesomeIcon icon={faChevronRight} className="mr-2 w-3 h-3" aria-hidden="true" />
                    Início
                  </Link>
                </li>
                <li>
                  <Link href="/servicos" className="text-sm flex items-center hover:underline">
                    <FontAwesomeIcon icon={faChevronRight} className="mr-2 w-3 h-3" aria-hidden="true" />
                    Nossos Serviços
                  </Link>
                </li>
                <li>
                  <Link href="/#about" className="text-sm flex items-center hover:underline">
                    <FontAwesomeIcon icon={faChevronRight} className="mr-2 w-3 h-3" aria-hidden="true" />
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="/fale-conosco" className="text-sm flex items-center hover:underline">
                    <FontAwesomeIcon icon={faChevronRight} className="mr-2 w-3 h-3" aria-hidden="true" />
                    Fale Conosco
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Coluna 4: Serviços */}
          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-white/20 pb-2">Serviços</h3>
            <nav aria-label="Links de serviços odontológicos">
              <ul className="space-y-2">
                <li>
                  <Link href="/servicos/ortodontia" className="text-sm flex items-center hover:underline">
                    <FontAwesomeIcon icon={faChevronRight} className="mr-2 w-3 h-3" />
                    Ortodontia
                  </Link>
                </li>
                <li>
                  <Link href="/servicos/implantes-dentarios" className="text-sm flex items-center hover:underline">
                    <FontAwesomeIcon icon={faChevronRight} className="mr-2 w-3 h-3" />
                    Implantes Dentários
                  </Link>
                </li>
                <li>
                  <Link href="/servicos/avaliacao-odontologica" className="text-sm flex items-center hover:underline">
                    <FontAwesomeIcon icon={faChevronRight} className="mr-2 w-3 h-3" />
                    Avaliação Odontológica
                  </Link>
                </li>
                <li>
                  <Link href="/servicos/endodontia" className="text-sm flex items-center hover:underline">
                    <FontAwesomeIcon icon={faChevronRight} className="mr-2 w-3 h-3" />
                    Endodontia (Canal)
                  </Link>
                </li>
                <li>
                  <Link href="/servicos/proteses-dentarias" className="text-sm flex items-center hover:underline">
                    <FontAwesomeIcon icon={faChevronRight} className="mr-2 w-3 h-3" />
                    Próteses Dentárias
                  </Link>
                </li>
                <li>
                  <Link href="/servicos/gengivoplastia" className="text-sm flex items-center hover:underline">
                    <FontAwesomeIcon icon={faChevronRight} className="mr-2 w-3 h-3" />
                    Gengivoplastia
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-white/20 pt-6 pb-2">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">©{currentYear} - Clínica Magna Odonto. Todos os direitos reservados.</p>
            </div>

            {/* Ícones das redes sociais */}
            <div className="flex space-x-6">
              <Link
                href="https://www.instagram.com/magnaodontoclinica?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                className="hover:opacity-75 transition-opacity"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Clínica Magna Odonto"
              >
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="text-2xl text-white"
                />
              </Link>
              <Link
                href="https://www.facebook.com/magnaodonto"
                className="hover:opacity-75 transition-opacity"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook da Clínica Magna Odonto"
              >
                <FontAwesomeIcon
                  icon={faFacebookF}
                  className="text-2xl text-white"
                />
              </Link>
              <Link
                href="https://api.whatsapp.com/send?phone=556996021979"
                className="hover:opacity-75 transition-opacity"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp da Clínica Magna Odonto"
              >
                <FontAwesomeIcon
                  icon={faWhatsapp}
                  className="text-2xl text-white"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
