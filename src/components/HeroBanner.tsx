"use client";
import { useState } from "react";
import Image from "next/image";
import Woman from "@/assets/woman.png";
import { Button } from "./ui/Button";
import AppointmentModal from "./modal/ModalAgendamento";

export function HeroBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section id="home" className="relative w-full bg-primary-light-blue overflow-hidden">
      <div className="container mx-auto px-4 pt-8 lg:py-12 flex flex-col lg:flex-row items-center justify-between max-w-7xl relative">
        {/* Texto à esquerda */}
        <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
          <p className="mb-8 lg:mb-12 uppercase font-bold text-primary-dark-blue">
            Boas-Vindas a Magna Odonto <span className="ml-1">🌟</span>
          </p>
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-headline mb-6 leading-tight">
            Cuidados odontológicos <br /> simplificados para todos
          </h1>
          <p className="text-gray-paragraph text-lg mb-8">
            Os dentistas da Clínica Magna Odonto vão além dos problemas
            aparentes para tratar a causa raiz de sua saúde bucal,
            proporcionando um tratamento eficaz e duradouro.
          </p>

          {/* Botão de agendamento */}
          <Button text="AGENDE SUA CONSULTA" onClick={openModal} />
        </div>

        {/* Imagem à direita em telas maiores */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0 lg:absolute lg:right-4 lg:bottom-0 lg:h-full">
          <div className="relative w-full max-w-md flex items-end justify-center h-full">
            <Image
              src={Woman}
              alt="Paciente sorrindo em atendimento odontológico na Magna Odonto em Porto Velho"
              width={540}
              height={540}
              priority
              className="rounded-lg object-contain object-bottom w-auto max-h-[540px]"
            />
          </div>
        </div>
      </div>

      {/* Modal de Agendamento */}
      {isModalOpen && <AppointmentModal onClose={closeModal} />}
    </section>
  );
}
