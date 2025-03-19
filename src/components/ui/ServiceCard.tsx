import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface ServiceCardProps {
  title: string;
  description: string;
}

export function ServiceCard({ title, description }: ServiceCardProps) {
  return (
    <div className="bg-white border border-primary-light-blue rounded-lg overflow-hidden p-6 text-start">
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
      <p className="text-gray-paragraph mb-4">{description}</p>
    </div>
  );
}
