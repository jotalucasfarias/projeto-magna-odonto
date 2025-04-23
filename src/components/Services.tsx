"use client";
import { ServiceCard } from "./ui/ServiceCard";
import { services } from "@/data/ServicesData";

export function Services() {
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
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>

        
      </div>
    </section>
  );
}
