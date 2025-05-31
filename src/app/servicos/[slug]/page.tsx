// src/app/servicos/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  findServiceBySlug,
  getAllServiceSlugs,
} from "@/data/ServicesDetailedData";
import ServiceHeader from "@/components/services/ServiceHeader";
import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServiceFAQ from "@/components/services/ServiceFAQ";
import ServiceCTA from "@/components/services/ServiceCTA";

interface ServicePageProps {
  // Agora params é um Promise<{ slug: string }>
  params: Promise<{ slug: string }>;
}

// Continua igual
export function generateStaticParams() {
  const slugs = getAllServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Torna async e await params
export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = findServiceBySlug(slug);

  if (!service) {
    return {
      title: "Serviço não encontrado | Magna Odonto",
      description: "O serviço que você está procurando não foi encontrado.",
    };
  }

  return {
    title: `${service.title} | Magna Odonto`,
    description: service.metaDescription,
  };
}

// Componente também async e await params
export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = findServiceBySlug(slug);

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
