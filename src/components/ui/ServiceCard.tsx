import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface ServiceCardProps {
  title: string;
  shortDescription: string;
  slug: string;
}

export function ServiceCard({ title, shortDescription, slug  }: ServiceCardProps) {
  return (
    <div className="bg-white border border-primary-light-blue rounded-lg overflow-hidden p-6 text-start flex flex-col h-[275px]">
      <div className="flex-grow">
        {/* Ícone check no card */}
        <div className="mb-4">
          <FontAwesomeIcon
            icon={faCheck}
            className="h-4 w-4 p-1 text-blue-600 bg-primary-light-blue rounded-2xl"
          />
        </div>

        {/* Nome do serviço */}
        <h3 className="text-xl text-gray-headline font-semibold mb-2">{title}</h3>

        {/* Descrição do serviço */}
        <p className="text-gray-paragraph mb-4">{shortDescription}</p>
      </div>
    
      <div className="mt-auto">
        <Link 
          href={`/servicos/${slug}`} 
          className="inline-flex items-center text-primary-blue font-medium hover:text-primary-dark-blue"
        >
          Saiba mais
          <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
