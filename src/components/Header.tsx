"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import LogoDark from "../assets/logo-blue-dark.png";
import LogoWhite from "../assets/logo-white.png";
import { Button } from "./ui/Button";
import AppointmentModal from "./modal/ModalAgendamento";

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Função para controlar a visibilidade do header durante o scroll
  const controlHeader = () => {
    const currentScrollY = window.scrollY;
    
    // Se estamos rolando para baixo e não estamos no topo da página
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setVisible(false);
    } 
    // Se estamos rolando para cima ou no topo da página
    else {
      setVisible(true);
    }
    
    // Atualiza a posição do último scroll
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    // Adicionar o evento de scroll somente no cliente
    window.addEventListener("scroll", controlHeader);
    
    // Função de limpeza para remover o evento quando o componente é desmontado
    return () => {
      window.removeEventListener("scroll", controlHeader);
    };
  }, [lastScrollY]);

  // Função para rolar suavemente até a seção sem mudar a URL
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // Fechar o menu ao clicar em uma seção
    if (isMenuOpen) setIsMenuOpen(false);
  };

  // Função para abrir o modal
  const openModal = () => {
    setIsModalOpen(true);
    // Fechar o menu mobile ao abrir o modal
    if (isMenuOpen) setIsMenuOpen(false);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Função para alternar o menu mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header
        className={`w-full h-20 fixed top-0 left-0 right-0 flex flex-wrap items-center ${
          isMenuOpen ? "bg-primary-dark-blue" : "bg-primary-light-blue"
        } z-40 transition-all duration-300 ${
          visible ? "translate-y-0 shadow-md" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between max-w-7xl">
          <button
            onClick={() => scrollToSection("home")}
            className="flex items-center z-50"
          >
            <Image
              src={isMenuOpen ? LogoWhite : LogoDark}
              alt="Magna Odonto Logo"
              width={150}
              height={50}
              className="h-auto relative"
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
              onClick={() => scrollToSection("testimonials")}
              className="p-[27px] flex items-center border-b-2 border-transparent hover:border-primary-dark-blue font-normal text-primary-dark-blue"
            >
              Depoimentos
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
          <button className="md:hidden z-50" onClick={toggleMenu}>
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
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
            )}
          </button>
        </div>
      </header>

      {/* Espaço para compensar o header fixo */}
      <div className="h-20"></div>

      {/* Menu mobile */}
      <aside
        className={`fixed inset-0 bg-primary-dark-blue transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden z-30`}
      >
        <div className="container mx-auto px-4 py-20">
          {/* Items do menu mobile */}
          <nav className="flex flex-col items-center space-y-6 text-center">
            <button
              onClick={() => scrollToSection("home")}
              className="py-3 w-full text-white font-bold text-xl"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="py-3 w-full text-white font-normal text-xl"
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="py-3 w-full text-white font-normal text-xl"
            >
              Sobre
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="py-3 w-full text-white font-normal text-xl"
            >
              Depoimentos
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="py-3 w-full text-white font-normal text-xl"
            >
              Contato
            </button>

            {/* Botão de agendar no menu mobile */}
            <button
              onClick={openModal}
              className={`items-center font-bold bg-primary-light-blue text-primary-dark-blue px-6 py-3 rounded-full 
            hover:bg-hover-blue hover:text-primary-light-blue transition-colors cursor-pointer`}
            >
              AGENDAR CONSULTA
            </button>
          </nav>
        </div>
      </aside>

      {/* Modal de Agendamento */}
      {isModalOpen && <AppointmentModal onClose={closeModal} />}
    </>
  );
}
