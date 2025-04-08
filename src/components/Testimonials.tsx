"use client";
import { useState, useEffect } from "react";
import { Testimonial } from "@/lib/types/testimonial";
import { testimonialService } from "@/services/testimonial";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./ui/Button";
import ModalDepoimento from "./modal/ModalDepoimento";

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const data = await testimonialService.getApprovedTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error("Erro ao carregar depoimentos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTestimonials();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={index < rating ? solidStar : regularStar}
        className={
          index < rating ? "text-yellow-400" : "text-gray-300"
        }
      />
    ));
  };

  return (
    <section id="testimonials" className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-sm font-bold text-center mb-6 uppercase text-primary-dark-blue">
          Depoimentos
        </h2>
        <h1 className="font-bold text-3xl md:text-4xl text-gray-headline text-center mx-auto mb-12 md:w-[600px]">
          O que nossos pacientes dizem sobre nosso atendimento
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-primary-beige p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <FontAwesomeIcon
                    icon={faQuoteLeft}
                    className="text-primary-light-blue text-3xl"
                  />
                  <div className="flex">{renderStars(testimonial.rating)}</div>
                </div>
                <p className="text-gray-paragraph mb-4 italic">"{testimonial.comment}"</p>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-headline">
                    {testimonial.name}
                  </span>
                  <span className="text-sm text-gray-500">{testimonial.service}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            Ainda não temos depoimentos.
          </div>
        )}

        <div className="mt-12 text-center">
          <Button 
            text="DEIXE SEU DEPOIMENTO" 
            onClick={() => setIsModalOpen(true)} 
            className="mx-auto"
          />
        </div>

        {/* Modal para enviar depoimento */}
        {isModalOpen && (
          <ModalDepoimento onClose={() => setIsModalOpen(false)} />
        )}
      </div>
    </section>
  );
}