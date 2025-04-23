import { ServiceBenefit } from "@/data/ServicesDetailedData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

interface ServiceBenefitsProps {
  benefits: ServiceBenefit[];
}

export default function ServiceBenefits({ benefits }: ServiceBenefitsProps) {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-headline text-center mb-12">
          Benefícios deste Tratamento
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="flex items-start p-6 bg-primary-beige rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mr-4 mt-1 text-primary-blue">
                <FontAwesomeIcon icon={faCheckCircle} className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-headline">
                  {benefit.title}
                </h3>
                <p className="text-gray-paragraph">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
