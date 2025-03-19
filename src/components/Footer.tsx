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

export function Footer() {
  return (
    <footer className="bg-blue-500 text-white py-8">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-0 ">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src={Logo}
                className="max-w-60 mb-3"
                alt="Logo Magna Odonto"
              />
            </div>
            <p className="mb-4">©2024 - Magna Odonto.</p>
            <p>Todos os direitos reservados.</p>
          </div>

          {/* Ícones das redes sociais */}
          <div className="flex space-x-6">
            <Link
              href="https://www.instagram.com/magnaodontoclinica?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              className="hover:opacity-75 transition-opacity"
              target="_blank"
            >
              <FontAwesomeIcon
                icon={faInstagram}
                className="text-3xl text-white"
              />
            </Link>
            <Link
              href="https://www.facebook.com/magnaodonto"
              className="hover:opacity-75 transition-opacity"
              target="_blank"
            >
              <FontAwesomeIcon
                icon={faFacebookF}
                className="text-3xl text-white"
              />
            </Link>
            <Link
              href="https://wa.me/5569996021979?text=Oi%2C%20estou%20entrando%20em%20contato%20atrav%C3%A9s%20do%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20odontol%C3%B3gicos.%20Pode%20me%20ajudar%3F"
              className="hover:opacity-75 transition-opacity"
              target="_blank"
            >
              <FontAwesomeIcon
                icon={faWhatsapp}
                className="text-3xl text-white"
              />
            </Link>
          </div>
        </div>

        {/* Copyright - Espaço para uma mensagem de copyright */}
        <div className="mt-8 text-sm text-center md:text-left"></div>
      </div>
    </footer>
  );
}
