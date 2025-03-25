"use client";
import { useState } from "react";
import Image from "next/image";
import LogoDark from "../assets/logo-blue-dark.png";
import { Button } from "./ui/Button";
import AppointmentModal from "./modal/ModalAgendamento";

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para rolar suavemente até a seção sem mudar a URL
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Função para abrir o modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <header className="w-full h-20 fixed top-0 left-0 right-0 flex flex-wrap items-center bg-primary-light-blue">
        <div className="container mx-auto px-4 flex items-center justify-between max-w-7xl">
          <button
            onClick={() => scrollToSection("home")}
            className="flex items-center"
          >
            <Image
              src={LogoDark}
              alt="Magna Odonto Logo"
              width={150}
              height={50}
              className="h-auto"
            />
          </button>

          {/* Menu de navegação para telas maiores */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="p-[27px] flex items-center border-b-2 border-primary-dark-blue font-bold text-primary-dark-blue"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="p-[27px] flex items-center border-b-2 border-transparent hover:border-primary-dark-blue font-normal text-primary-dark-blue"
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="p-[27px] flex items-center border-b-2 border-transparent hover:border-primary-dark-blue font-normal text-primary-dark-blue"
            >
              Sobre
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="p-[27px] flex items-center border-b-2 border-transparent hover:border-primary-dark-blue font-normal text-primary-dark-blue"
            >
              Contato
            </button>
          </nav>

          {/* Botão de agendamento para telas maiores */}
          <Button
            text="AGENDAR CONSULTA"
            className="hidden md:block"
            onClick={openModal}
          />

          {/* Botão de menu para dispositivos móveis */}
          <button className="md:hidden z-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary-dark-blue"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Espaço para compensar o header fixo */}
      <div className="h-20"></div>

      {/* Modal de Agendamento */}
      {isModalOpen && <AppointmentModal onClose={closeModal} />}
    </>
  );
}
