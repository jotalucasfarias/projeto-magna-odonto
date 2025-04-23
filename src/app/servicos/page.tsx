import Link from "next/link";
import Image from "next/image";
import { detailedServices } from "@/data/ServicesDetailedData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Serviços Odontológicos | Magna Odonto",
  description: "Conheça todos os serviços odontológicos oferecidos pela Magna Odonto em Porto Velho. Tratamentos especializados para um sorriso saudável e bonito.",
};

export default function ServicosPage() {
  return (
    <main>
      {/* Banner principal */}
      <div className="bg-primary-dark-blue text-white py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Nossos Serviços</h1>
          <p className="text-lg mb-0">
            Conheça os tratamentos odontológicos especializados oferecidos na Magna Odonto
          </p>
        </div>
      </div>

      {/* Lista de serviços */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {detailedServices.map((service) => (
              <div key={service.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    priority={false}
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-headline mb-3">{service.title}</h2>
                  <p className="text-gray-paragraph mb-4">{service.shortDescription}</p>
                  <Link 
                    href={`/servicos/${service.slug}`} 
                    className="inline-flex items-center text-primary-blue font-medium hover:text-primary-dark-blue"
                  >
                    Saiba mais
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
