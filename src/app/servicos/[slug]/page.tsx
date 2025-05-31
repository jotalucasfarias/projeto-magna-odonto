// src/app/servicos/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { detailedServices } from "@/data/ServicesDetailedData";
import ServiceHeader from "@/components/services/ServiceHeader";
import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServiceFAQ from "@/components/services/ServiceFAQ";
import ServiceCTA from "@/components/services/ServiceCTA";

interface ServicePageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const service = detailedServices.find(
    (service) => service.slug === params.slug
  );

  if (!service) {
    return {
      title: "Serviço não encontrado | Magna Odonto",
      description: "O serviço solicitado não foi encontrado em nosso catálogo.",
    };
  }

  return {
    title: `${service.title} | Magna Odonto`,
    description: service.metaDescription,
    openGraph: {
      title: `${service.title} | Magna Odonto`,
      description: service.metaDescription,
      url: `/servicos/${service.slug}`,
      siteName: "Magna Odonto",
      locale: "pt_BR",
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  return detailedServices.map((service) => ({
    slug: service.slug,
  }));
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = detailedServices.find(
    (service) => service.slug === params.slug
  );

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
