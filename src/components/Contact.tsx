"use client";

import Image from "next/image";
import GuyImage from "../assets/guy.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./ui/Button";

export function Contact() {
  return (
    <section
      id="contact"
      className="w-full max-w-7xl mx-auto py-12 px-4 md:px-0"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Texto e informações de contato */}
        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-headline mb-4">
            Entre em contato com a gente!
          </h2>

          {/* Endereço e telefone */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-2xl text-primary-dark-blue"
              />
              <span className="text-gray-paragraph ml-2">
                Av. Jatuarana n°4941, Nova Floresta. Sala 01
                <br />
                Porto Velho - RO
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faPhone}
                className="text-2xl text-primary-dark-blue"
              />
              <span className="text-gray-paragraph ml-1">(69) 99602-1979</span>
            </div>
          </div>

          {/* Botão de Agendar */}
          <Button text="AGENDE SUA CONSULTA" />
        </div>

        {/* Imagem ao lado direito */}
        <div className="w-full md:w-1/2">
          <Image
            src={GuyImage}
            alt="Paciente sorrindo"
            max-width={575}
            className="h-auto"
          />
        </div>
      </div>
    </section>
  );
}
