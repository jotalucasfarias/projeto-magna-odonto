import { notFound } from "next/navigation";
import { Metadata } from "next";
import { findServiceBySlug, getAllServiceSlugs } from "@/data/ServicesDetailedData";
import ServiceHeader from "@/components/services/ServiceHeader";
import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServiceFAQ from "@/components/services/ServiceFAQ";
import ServiceCTA from "@/components/services/ServiceCTA";

interface ServicePageProps {
  params: {
    slug: string;
  };
}

// Geração estática dos caminhos para todos os serviços
export function generateStaticParams() {
  const slugs = getAllServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Metadata dinâmica baseada no serviço específico
export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = findServiceBySlug(params.slug);
  
  if (!service) {
    return {
      title: 'Serviço não encontrado | Magna Odonto',
      description: 'O serviço que você está procurando não foi encontrado.'
    };
  }
  
  return {
    title: `${service.title} | Magna Odonto`,
    description: service.metaDescription,
  };
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = findServiceBySlug(params.slug);
  
  // Se o serviço não existir, retorna a página 404
  if (!service) {
    notFound();
  }
  
  return (
    <main>
      <ServiceHeader service={service} />
      <ServiceBenefits benefits={service.benefits} />
      <ServiceFAQ faqs={service.faqs} />
      <ServiceCTA />
    </main>
  );
}
