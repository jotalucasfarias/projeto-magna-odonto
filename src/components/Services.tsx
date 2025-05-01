"use client";
import { ServiceCard } from "./ui/ServiceCard";
import { detailedServices } from "@/data/ServicesDetailedData";
import { useState, useEffect } from "react";

export function Services() {
  // Estado para controlar se os dados estão carregando
  const [isLoading, setIsLoading] = useState(true);

  // Simula o carregamento dos recursos
  useEffect(() => {
    // Pré-carregar recursos antes de exibir os cards reais
    const preloadImages = async () => {
      try {
        // Aguarda um momento para garantir que outros recursos da página sejam carregados
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsLoading(false);
      } catch (error) {
        console.error("Error preloading images:", error);
        setIsLoading(false);
      }
    };

    preloadImages();
  }, []);

  return (
    <section id="services" className="my-24 py-12 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-sm font-bold text-center mb-8 uppercase text-primary-dark-blue">
          Serviços
        </h2>

        <h1 className="font-bold text-3xl md:text-4xl text-gray-headline text-center mx-auto mb-12 md:w-[500px]">
          Como podemos ajudá-lo a cuidar melhor do seu sorriso?
        </h1>

        {/* Grid para exibição dos cards de serviços */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeletons para reservar espaço durante o carregamento
            Array(detailedServices.length).fill(0).map((_, index) => (
              <div 
                key={`skeleton-${index}`} 
                className="bg-gray-100 rounded-lg p-6 h-64 animate-pulse flex flex-col"
              >
                <div className="h-7 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 mb-2"></div>
                <div className="mt-auto h-10 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))
          ) : (
            // Cards reais quando o carregamento estiver concluído
            detailedServices.map((service) => (
              <ServiceCard
                key={service.id}
                slug={service.slug}
                title={service.title}
                shortDescription={service.shortDescription}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
