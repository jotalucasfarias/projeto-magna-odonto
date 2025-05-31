"use client";
import Image from "next/image";
import Woman from "@/assets/woman-2.png";
import { useState, useEffect } from "react";

export function AboutUs() {
  // Estado para controlar se os dados estão carregando
  const [isLoading, setIsLoading] = useState(true);

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
    <section id="about" className="bg-primary-beige py-24 px-4">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center gap-6 lg:gap-8 max-w-7xl">
        {isLoading ? (
          // Skeleton para imagem
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <div className="bg-gray-200 rounded-3xl shadow-md animate-pulse" style={{ width: 520, height: 448 }}></div>
          </div>
        ) : (
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <Image
              src={Woman}
              alt="Paciente sorrindo em atendimento odontológico na Magna Odonto em Porto Velho"
              width={520}
              height={448}
              className="rounded-3xl shadow-md"
            />
          </div>
        )}

        <div className="w-full lg:w-1/2 lg:text-left">
          {isLoading ? (
            // Skeleton para texto
            <>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-4/5 mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </>
          ) : (
            <>
              <h4 className="text-sm font-bold mb-6 uppercase text-primary-dark-blue">
                Sobre Nós
              </h4>
              <h2 className="text-2xl lg:text-4xl font-bold text-gray-headline mb-4">
                Entenda quem somos e por que existimos
              </h2>
              <p className="text-gray-paragraph mb-4 leading-relaxed">
                Na Magna Odonto somos apaixonados por cuidar do seu sorriso. Nossa
                missão é proporcionar um atendimento odontológico de qualidade,
                priorizando a saúde bucal e o bem-estar de nossos pacientes. <br />
                Com uma equipe dedicada de profissionais, oferecemos serviços
                completos que vão desde a prevenção até tratamentos especializados.
                Nossa abordagem é centrada no paciente, sempre buscando as melhores
                soluções para atender suas necessidades. <br /> Estamos aqui para
                transformar sua experiência em um momento positivo, criando um
                ambiente acolhedor e confiável, onde você pode se sentir à vontade
                para cuidar da sua saúde bucal.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
