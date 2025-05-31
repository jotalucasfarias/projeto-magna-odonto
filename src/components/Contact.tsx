"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./ui/Button";
import AppointmentModal from "./modal/ModalAgendamento";

export function Contact() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Simula o carregamento dos recursos
  useEffect(() => {
    const preloadResources = async () => {
      try {
        // Aguarda um momento para garantir que outros recursos da página sejam carregados
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsLoading(false);
      } catch (error) {
        console.error("Error preloading resources:", error);
        setIsLoading(false);
      }
    };

    preloadResources();
  }, []);

  return (
    <section
      id="contact"
      className="w-full max-w-7xl mx-auto py-12 px-4 lg:px-0"
    >
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Texto e informações de contato */}
        <div className="w-full lg:w-1/2 space-y-6">
          {isLoading ? (
            // Skeleton para informações de contato
            <>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5 ml-2 animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/5 ml-1 animate-pulse"></div>
                </div>
              </div>
              
              <div className="h-10 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </>
          ) : (
            <>
              <h2 className="text-2xl lg:text-4xl font-bold text-gray-headline mb-4">
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
              <Button text="AGENDE SUA CONSULTA" onClick={openModal} />
            </>
          )}
        </div>

        {/* Mapa */}
        <div className="w-full lg:w-1/2 h-[400px] rounded-lg overflow-hidden shadow-lg">
          {isLoading ? (
            // Skeleton para o mapa
            <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
          ) : (
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.1867156509723!2d-63.89792642529667!3d-8.772927591751894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92325c71dfc5d52d%3A0xfaca78cf8b8042fd!2sAv.%20Jatuarana%2C%204941%20-%20Nova%20Floresta%2C%20Porto%20Velho%20-%20RO%2C%2076807-013!5e0!3m2!1sen!2sbr!4v1715720412345!5m2!1sen!2sbr"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de localização da Clínica Magna Odonto em Porto Velho"
              className="rounded-lg"
            ></iframe>
          )}
        </div>
      </div>

      {/* Modal de Agendamento */}
      {isModalOpen && <AppointmentModal onClose={closeModal} />}
    </section>
  );
}
