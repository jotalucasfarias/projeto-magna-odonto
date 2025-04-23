import Image from "next/image";
import { DetailedService } from "@/data/ServicesDetailedData";

interface ServiceHeaderProps {
  service: DetailedService;
}

export default function ServiceHeader({ service }: ServiceHeaderProps) {
  return (
    <div className="w-full bg-primary-light-blue">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-headline">
              {service.title}
            </h1>
            <p className="text-lg text-gray-paragraph leading-relaxed">
              {service.longDescription}
            </p>
          </div>
          <div className="w-full md:w-1/2 mt-6 md:mt-0">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <Image
                src={service.image}
                alt={service.title}
                className="w-full h-auto object-cover"
                width={600}
                height={400}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
