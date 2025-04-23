"use client";

import { FAQ } from "@/data/ServicesDetailedData";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

interface ServiceFAQProps {
  faqs: FAQ[];
}

export default function ServiceFAQ({ faqs }: ServiceFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-primary-beige py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-headline text-center mb-12">
          Perguntas Frequentes
        </h2>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="mb-4 border border-primary-light-blue rounded-lg overflow-hidden bg-white"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-gray-headline">{faq.question}</span>
                <FontAwesomeIcon 
                  icon={openIndex === index ? faChevronUp : faChevronDown} 
                  className="w-4 h-4 text-primary-blue"
                />
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index 
                    ? "max-h-96 py-4 opacity-100" 
                    : "max-h-0 py-0 opacity-0"
                }`}
              >
                <p className="text-gray-paragraph">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
