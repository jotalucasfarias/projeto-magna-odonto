"use client";

import { useState, useEffect } from "react";
import { faqCategories } from "@/data/FAQData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("geral");
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamanho da tela
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Verificar inicialmente
    checkIsMobile();

    // Adicionar listener para mudanças no tamanho da tela
    window.addEventListener('resize', checkIsMobile);

    // Remover listener quando componente for desmontado
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const selectedCategory = faqCategories.find(cat => cat.id === activeCategory) || faqCategories[0];

  return (
    <main>
      {/* Banner principal */}
      <div className="bg-primary-dark-blue text-white py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Perguntas Frequentes</h1>
          <p className="text-lg mb-0">
            Encontre respostas para as dúvidas mais comuns sobre nossos serviços e procedimentos
          </p>
        </div>
      </div>

      {/* Conteúdo principal */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Navegação lateral das categorias (em desktop) ou abas (em mobile) */}
            {isMobile ? (
              <div className="w-full mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <select
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  >
                    {faqCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="w-full md:w-1/4">
                <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                  <h3 className="text-xl font-bold text-gray-headline mb-4">Categorias</h3>
                  <nav className="space-y-2">
                    {faqCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          activeCategory === category.id
                            ? "bg-primary-light-blue text-primary-dark-blue font-medium"
                            : "hover:bg-gray-50 text-gray-paragraph"
                        }`}
                      >
                        {category.title}
                      </button>
                    ))}
                  </nav>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-paragraph mb-4">
                      Não encontrou o que procura?
                    </p>
                    <Link
                      href="/fale-conosco"
                      className="text-primary-blue hover:text-primary-dark-blue font-medium text-sm"
                    >
                      Entre em contato conosco →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Lista de perguntas e respostas */}
            <div className="w-full md:w-3/4">
              <h2 className="text-2xl font-bold text-gray-headline mb-6">
                {selectedCategory.title}
              </h2>

              <div className="space-y-4">
                {selectedCategory.questions.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggleQuestion(`${selectedCategory.id}-${index}`)}
                      className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
                    >
                      <h3 className="text-lg font-medium text-gray-headline">
                        {faq.question}
                      </h3>
                      <FontAwesomeIcon
                        icon={expandedQuestions[`${selectedCategory.id}-${index}`] ? faChevronUp : faChevronDown}
                        className={`w-5 h-5 transition-transform ${
                          expandedQuestions[`${selectedCategory.id}-${index}`] ? 'text-primary-blue' : 'text-gray-400'
                        }`}
                      />
                    </button>

                    {expandedQuestions[`${selectedCategory.id}-${index}`] && (
                      <div className="p-5 pt-0 border-t border-gray-100">
                        <p className="text-gray-paragraph">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* CTA para fale conosco (apenas em mobile) */}
              {isMobile && (
                <div className="mt-10 p-6 bg-primary-light-blue rounded-lg text-center">
                  <p className="text-gray-headline mb-4">
                    Não encontrou o que procura?
                  </p>
                  <Link
                    href="/fale-conosco"
                    className="px-6 py-3 bg-primary-blue text-white rounded-lg inline-block hover:bg-primary-dark-blue transition-colors"
                  >
                    Fale Conosco
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
