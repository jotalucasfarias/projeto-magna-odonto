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

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-blue-500 text-white py-12">
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Coluna 1: Sobre a clínica */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <Image
                src={Logo}
                className="max-w-52"
                alt="Logo Magna Odonto"
                priority={false}
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
            <ul className="space-y-3">
              <li className="flex items-start">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 mt-1 w-4" />
                <span className="text-sm">Av. Jatuarana n°4941 sala 01<br />Nova Floresta, Porto Velho - RO</span>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faPhone} className="mr-3 w-4" />
                <span className="text-sm">(69) 99602-1979</span>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-3 w-4" />
                <span className="text-sm">magnamartinha@hotmail.com</span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faClock} className="mr-3 mt-1 w-4" />
                <div className="text-sm">
                  <p>Segunda a Sexta:</p>
                  <p>08:00 às 11:30 / 14:00 às 18:00</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Links úteis */}
          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-white/20 pb-2">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm flex items-center hover:underline">
                  <FontAwesomeIcon icon={faChevronRight} className="mr-2 w-3 h-3" />
                  Início
                </Link>
              </li>
              <li>
                <Link href="/servicos" className="text-sm flex items-center hover:underline">
                  <FontAwesomeIcon icon={faChevronRight} className="mr-2 w-3 h-3" />
                  Nossos Serviços
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-sm flex items-center hover:underline">
                  <FontAwesomeIcon icon={faChevronRight} className="mr-2 w-3 h-3" />
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/fale-conosco" className="text-sm flex items-center hover:underline">
                  <FontAwesomeIcon icon={faChevronRight} className="mr-2 w-3 h-3" />
                  Fale Conosco
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Serviços */}
          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-white/20 pb-2">Serviços</h3>
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
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-white/20 pt-6 pb-2">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">©{currentYear} - Magna Odonto. Todos os direitos reservados.</p>
            </div>

            {/* Ícones das redes sociais */}
            <div className="flex space-x-6">
              <Link
                href="https://www.instagram.com/magnaodontoclinica?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                className="hover:opacity-75 transition-opacity"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Magna Odonto"
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
                aria-label="Facebook da Magna Odonto"
              >
                <FontAwesomeIcon
                  icon={faFacebookF}
                  className="text-2xl text-white"
                />
              </Link>
              <Link
                href="https://wa.me/5569996021979?text=Oi%2C%20estou%20entrando%20em%20contato%20atrav%C3%A9s%20do%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20odontol%C3%B3gicos.%20Pode%20me%20ajudar%3F"
                className="hover:opacity-75 transition-opacity"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp da Magna Odonto"
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
