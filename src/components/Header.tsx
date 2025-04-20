"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LogoDark from "../assets/logo-dark.png";
import LogoWhite from "../assets/logo-white.png";
import { Button } from "./ui/Button";
import AppointmentModal from "./modal/ModalAgendamento";

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  // Detectar seção ativa quando estiver na página inicial
  useEffect(() => {
    if (!isHomePage) return;

    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px 0px 0px", // Ajuste para considerar o header fixo
      threshold: 0.3, // Elemento é considerado visível quando 30% dele está visível
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observar cada seção
    const sections = ["home", "services", "about"];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) sectionObserver.observe(element);
    });

    return () => {
      // Limpar observer ao desmontar
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) sectionObserver.unobserve(element);
      });
    };
  }, [isHomePage]);

  // Função para verificar se uma seção é a ativa
  const isActive = (section: string) => {
    // Se não estiver na home page, não destaque nenhuma seção
    if (!isHomePage) return false;
    return section === activeSection;
  };

  // Função para navegar para seções
  const navigateToSection = (id: string) => {
    if (isHomePage) {
      // Se estiver na página principal, apenas role para a seção
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSection(id); // Atualiza manualmente ao clicar
      }
    } else {
      // Se estiver em outra página, navegue para a home com o identificador da seção
      router.push(`/#${id}`);
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

  // Função para fechar o menu mobile
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        className={`w-full h-20 fixed top-0 left-0 right-0 flex flex-wrap items-center ${
          isMenuOpen ? "bg-primary-dark-blue" : "bg-primary-light-blue"
        } z-40 transition-colors duration-300`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center z-50">
            <Image
              src={isMenuOpen ? LogoWhite : LogoDark}
              alt="Magna Odonto Logo"
              width={150}
              height={50}
              className="h-auto relative"
            />
          </Link>

          {/* Menu de navegação para telas maiores */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigateToSection("home")}
              className={`p-[27px] flex items-center border-b-2 ${
                isActive("home")
                  ? "border-primary-dark-blue font-bold" 
                  : "border-transparent hover:border-primary-dark-blue font-normal"
              } text-primary-dark-blue`}
            >
              Início
            </button>
            <button
              onClick={() => navigateToSection("services")}
              className={`p-[27px] flex items-center border-b-2 ${
                isActive("services")
                  ? "border-primary-dark-blue font-bold" 
                  : "border-transparent hover:border-primary-dark-blue font-normal"
              } text-primary-dark-blue`}
            >
              Serviços
            </button>
            <button
              onClick={() => navigateToSection("about")}
              className={`p-[27px] flex items-center border-b-2 ${
                isActive("about")
                  ? "border-primary-dark-blue font-bold" 
                  : "border-transparent hover:border-primary-dark-blue font-normal"
              } text-primary-dark-blue`}
            >
              Sobre
            </button>
            <Link 
              href="/fale-conosco"
              className="p-[27px] flex items-center border-b-2 border-transparent hover:border-primary-dark-blue font-normal text-primary-dark-blue"
            >
              Fale conosco
            </Link>
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
              onClick={() => navigateToSection("home")}
              className={`py-3 w-full text-white ${isActive("home") ? "font-bold" : "font-normal"} text-xl`}
            >
              Início
            </button>
            <button
              onClick={() => navigateToSection("services")}
              className={`py-3 w-full text-white ${isActive("services") ? "font-bold" : "font-normal"} text-xl`}
            >
              Serviços
            </button>
            <button
              onClick={() => navigateToSection("about")}
              className={`py-3 w-full text-white ${isActive("about") ? "font-bold" : "font-normal"} text-xl`}
            >
              Sobre
            </button>
            <Link 
              href="/fale-conosco"
              className="py-3 w-full text-white font-normal text-xl"
              onClick={closeMenu}
            >
              Fale conosco
            </Link>

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
