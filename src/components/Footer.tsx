"use client";
import React, { useState, useEffect } from "react";
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
import { useClinicSettings } from "@/hooks/useClinicSettings";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings, isLoading } = useClinicSettings();
  const [structuredData, setStructuredData] = useState<Record<string, any>>({});

  // Preparar os dados estruturados para SEO quando as configurações carregarem
  useEffect(() => {
    if (settings && !isLoading) {
      const addressString = `${settings.address.street} ${settings.address.number}${
        settings.address.complement ? " " + settings.address.complement : ""
      }`;

      // Configurar horários de funcionamento para o Schema.org
      const openingHours = [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: settings.businessHours.weekdaysStart,
          closes: settings.businessHours.weekdaysEnd,
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: settings.businessHours.weekdaysAfternoonStart,
          closes: settings.businessHours.weekdaysAfternoonEnd,
        },
      ];

      // Adicionar horário de sábado se disponível
      if (settings.businessHours.saturday) {
        openingHours.push({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Saturday"],
          opens: settings.businessHours.saturdayStart,
          closes: settings.businessHours.saturdayEnd,
        });
      }

      const seoData = {
        "@context": "https://schema.org",
        "@type": "Dentist",
        name: settings.name,
        image: "https://magnaodonto.com.br/logo.png",
        url: "https://magnaodonto.com.br",
        telephone: settings.contact.whatsapp,
        email: settings.contact.email,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: addressString,
          addressLocality: settings.address.city,
          addressRegion: settings.address.state,
          postalCode: settings.address.postalCode,
          addressCountry: "BR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -8.7608199,
          longitude: -63.874666,
        },
        openingHoursSpecification: openingHours,
      };

      setStructuredData(seoData);
    }
  }, [settings, isLoading]);

  // Mostrar conteúdo placeholder durante o carregamento
  if (isLoading || !settings) {
    return (
      <footer className="bg-blue-500 text-white py-12">
        <div className="w-full max-w-7xl mx-auto px-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Placeholders para o conteúdo durante o carregamento */}
            <div className="space-y-4">
              <div className="h-10 bg-blue-400 rounded w-3/4"></div>
              <div className="h-20 bg-blue-400 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-blue-400 rounded w-1/2"></div>
              <div className="h-4 bg-blue-400 rounded w-full"></div>
              <div className="h-4 bg-blue-400 rounded w-3/4"></div>
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-blue-400 rounded w-1/2"></div>
              <div className="h-4 bg-blue-400 rounded w-3/4"></div>
              <div className="h-4 bg-blue-400 rounded w-full"></div>
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-blue-400 rounded w-1/2"></div>
              <div className="h-4 bg-blue-400 rounded w-3/4"></div>
              <div className="h-4 bg-blue-400 rounded w-full"></div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Função para formatar o endereço completo
  const formatFullAddress = () => {
    return `${settings.address.street} n°${settings.address.number}${
      settings.address.complement ? ` ${settings.address.complement}` : ""
    }\n${settings.address.neighborhood}, ${settings.address.city} - ${settings.address.state}`;
  };

  // Função para formatar o horário de funcionamento
  const formatBusinessHours = () => {
    let hours = `Segunda a Sexta:\n${settings.businessHours.weekdaysStart} às ${settings.businessHours.weekdaysEnd} / ${settings.businessHours.weekdaysAfternoonStart} às ${settings.businessHours.weekdaysAfternoonEnd}`;

    if (settings.businessHours.saturday) {
      hours += `\nSábado: ${settings.businessHours.saturdayStart} às ${settings.businessHours.saturdayEnd}`;
    }

    return hours;
  };

  return (
    <footer
      className="bg-blue-500 text-white py-12"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Rodapé - Informações de contato e links úteis
      </h2>
      <Script id="dental-clinic-structured-data" type="application/ld+json">
        {JSON.stringify(structuredData)}
      </Script>
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Coluna 1: Sobre a clínica */}
          <div>
            <Link
              href="/"
              className="flex items-center mb-4"
              aria-label="Página inicial da Clínica Magna Odonto"
            >
              <Image
                src={Logo}
                className="max-w-52"
                alt={`Logo da ${settings.name} em ${settings.address.city}`}
                priority={false}
                width={200}
                height={80}
              />
            </Link>
            <p className="mb-4 text-sm leading-relaxed">
              Cuidando do seu sorriso com excelência e dedicação. Oferecemos
              tratamentos odontológicos de qualidade para toda a família em um
              ambiente acolhedor.
            </p>
            <p className="text-sm">
              <strong>RT:</strong> {settings.responsibleDentist.name} CRo/
              {settings.address.state}: {settings.responsibleDentist.cro}
            </p>
          </div>

          {/* Coluna 2: Informações de contato */}
          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-white/20 pb-2">
              Contato
            </h3>
            <address className="not-italic">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="mr-3 mt-1 w-4"
                    aria-hidden="true"
                  />
                  <span className="text-sm">{formatFullAddress()}</span>
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="mr-3 w-4"
                    aria-hidden="true"
                  />
                  <a
                    href={`tel:${settings.contact.phone}`}
                    className="text-sm hover:underline"
                  >
                    {settings.contact.phone}
                  </a>
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="mr-3 w-4"
                    aria-hidden="true"
                  />
                  <a
                    href={`mailto:${settings.contact.email}`}
                    className="text-sm hover:underline"
                  >
                    {settings.contact.email}
                  </a>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="mr-3 mt-1 w-4"
                    aria-hidden="true"
                  />
                  <div className="text-sm whitespace-pre-line">
                    {formatBusinessHours()}
                  </div>
                </li>
              </ul>
            </address>
          </div>

          {/* Coluna 3: Links úteis */}
          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-white/20 pb-2">
              Links Úteis
            </h3>
            <nav aria-label="Links de navegação do site">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm flex items-center hover:underline"
                  >
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="mr-2 w-3 h-3"
                      aria-hidden="true"
                    />
                    Início
                  </Link>
                </li>
                <li>
                  <Link
                    href="/servicos"
                    className="text-sm flex items-center hover:underline"
                  >
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="mr-2 w-3 h-3"
                      aria-hidden="true"
                    />
                    Nossos Serviços
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#about"
                    className="text-sm flex items-center hover:underline"
                  >
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="mr-2 w-3 h-3"
                      aria-hidden="true"
                    />
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link
                    href="/perguntas-frequentes"
                    className="text-sm flex items-center hover:underline"
                  >
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="mr-2 w-3 h-3"
                      aria-hidden="true"
                    />
                    Perguntas Frequentes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/fale-conosco"
                    className="text-sm flex items-center hover:underline"
                  >
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="mr-2 w-3 h-3"
                      aria-hidden="true"
                    />
                    Fale Conosco
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Coluna 4: Serviços */}
          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-white/20 pb-2">
              Serviços
            </h3>
            <nav aria-label="Links de serviços odontológicos">
              <ul className="space-y-2">
                {settings.services
                  .filter((service) => service.active)
                  .slice(0, 6) // Limita a exibição aos 6 primeiros serviços ativos
                  .map((service) => (
                    <li key={service.id}>
                      <Link
                        href={`/servicos/${service.slug}`}
                        className="text-sm flex items-center hover:underline"
                      >
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          className="mr-2 w-3 h-3"
                        />
                        {service.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-white/20 pt-6 pb-2">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">
                ©{currentYear} - {settings.name}. Todos os direitos reservados.
              </p>
            </div>

            {/* Ícones das redes sociais */}
            <div className="flex space-x-6">
              {settings.socialMedia.instagram && (
                <Link
                  href={settings.socialMedia.instagram}
                  className="hover:opacity-75 transition-opacity"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram da ${settings.name}`}
                >
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className="text-2xl text-white"
                  />
                </Link>
              )}

              {settings.socialMedia.facebook && (
                <Link
                  href={settings.socialMedia.facebook}
                  className="hover:opacity-75 transition-opacity"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Facebook da ${settings.name}`}
                >
                  <FontAwesomeIcon
                    icon={faFacebookF}
                    className="text-2xl text-white"
                  />
                </Link>
              )}

              {settings.contact.whatsapp && (
                <Link
                  href={`https://api.whatsapp.com/send?phone=${settings.contact.whatsapp}`}
                  className="hover:opacity-75 transition-opacity"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`WhatsApp da ${settings.name}`}
                >
                  <FontAwesomeIcon
                    icon={faWhatsapp}
                    className="text-2xl text-white"
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
