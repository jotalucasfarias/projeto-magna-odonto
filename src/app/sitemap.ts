import { MetadataRoute } from 'next'
import { detailedServices } from "@/data/ServicesDetailedData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://magnaodonto.vercel.app'
  const currentDate = new Date().toISOString().split('T')[0]
  
  // Cria entradas para páginas de serviços
  const servicePages = detailedServices.map(service => ({
    url: `${baseUrl}/servicos/${service.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  
  return [
    // Páginas principais
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/servicos`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/perguntas-frequentes`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fale-conosco`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    // Adiciona páginas de serviços individuais
    ...servicePages
  ]
}