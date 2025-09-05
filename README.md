# Magna Odonto — Website institucional

[![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=fff)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232a?logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Hosted_on-Vercel-000?logo=vercel&logoColor=fff)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#licença)

Website institucional da Clínica Magna Odonto (Porto Velho), desenvolvido com foco em performance, SEO e acessibilidade. Inclui páginas de serviços, FAQ e um fluxo de agendamento com modal.

Principais arquivos/páginas:
- Layout e metadados: [src/app/layout.tsx](src/app/layout.tsx)
- Sitemap: [src/app/sitemap.ts](src/app/sitemap.ts)
- Página de serviços: [src/app/servicos/page.tsx](src/app/servicos/page.tsx)
- FAQ: [src/app/perguntas-frequentes/page.tsx](src/app/perguntas-frequentes/page.tsx) e [src/app/perguntas-frequentes/metadata.ts](src/app/perguntas-frequentes/metadata.ts)
- Header/Footer: [src/components/Header.tsx](src/components/Header.tsx), [src/components/Footer.tsx](src/components/Footer.tsx)
- Modal de agendamento: [src/components/modal/ModalAgendamento](src/components/modal/ModalAgendamento)
- Dados dos serviços: [src/data/ServicesDetailedData.ts](src/data/ServicesDetailedData.ts)

## Tecnologias utilizadas

- Next.js (App Router), rotas em [src/app](src/app)
- React 18 + TypeScript (componentes em TSX)
- Tailwind CSS (estilos globais em [src/app/globals.css](src/app/globals.css))
- Next/Image e Next/Font (otimização de imagens e fontes)
- Font Awesome (ícones)
- react-hot-toast (notificações)
- @vercel/analytics (analytics)
- Deploy na Vercel

## Como contribuir

1. Faça um fork do repositório.
2. Crie um branch de feature: `git checkout -b feat/nome-da-feature`
3. Instale as dependências e rode localmente:
   - Windows (PowerShell):
     - `npm install`
     - `npm run dev`
   - Acesse http://localhost:3000
4. Siga as convenções:
   - Componentes em PascalCase (ex.: `Header.tsx`)
   - Hooks iniciando com `use` (ex.: `useClinic...`)
   - Páginas/rotas em kebab-case (ex.: `/perguntas-frequentes`)
   - Tailwind com classes utilitárias e sem CSS global desnecessário
5. Abra um Pull Request descrevendo claramente a mudança.

