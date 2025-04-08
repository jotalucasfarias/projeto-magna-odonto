"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { testimonialService } from "@/services/testimonial";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { SERVICOS } from "@/components/modal/ModalAgendamento/types";

interface ModalDepoimentoProps {
  onClose: () => void;
}

export default function ModalDepoimento({ onClose }: ModalDepoimentoProps) {
  const [nome, setNome] = useState("");
  const [servico, setServico] = useState("");
  const [comentario, setComentario] = useState("");
  const [avaliacao, setAvaliacao] = useState(5);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim() || !servico || !comentario.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    try {
      setEnviando(true);
      await testimonialService.createTestimonial({
        name: nome,
        service: servico,
        comment: comentario,
        rating: avaliacao,
      });
      setEnviado(true);
      toast.success("Depoimento enviado com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar depoimento. Tente novamente.");
      console.error("Erro ao enviar depoimento:", error);
    } finally {
      setEnviando(false);
    }
  };

  const renderStarInput = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setAvaliacao(star)}
            className="text-xl focus:outline-none"
          >
            <FontAwesomeIcon
              icon={star <= avaliacao ? solidStar : regularStar}
              className={star <= avaliacao ? "text-yellow-400" : "text-gray-300"}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-paragraph hover:text-primary-dark-blue"
        >
          <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
        </button>

        {!enviado ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-primary-blue">
                Conte sua experiência
              </h2>
              <p className="text-gray-paragraph">
                Sua opinião é muito importante para nós
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-headline mb-1">
                  Seu Nome
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full p-2 border border-off-white rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-primary-beige"
                  placeholder="Digite seu nome"
                  disabled={enviando}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-headline mb-1">
                  Serviço Utilizado
                </label>
                <select
                  value={servico}
                  onChange={(e) => setServico(e.target.value)}
                  className="w-full p-2 border border-off-white rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-primary-beige"
                  disabled={enviando}
                  required
                >
                  <option value="">Selecione um serviço</option>
                  {SERVICOS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-headline mb-1">
                  Sua Avaliação
                </label>
                {renderStarInput()}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-headline mb-1">
                  Seu Comentário
                </label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="w-full p-2 border border-off-white rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-primary-beige"
                  rows={4}
                  placeholder="Conte sua experiência..."
                  disabled={enviando}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full py-2 px-4 bg-primary-blue text-white rounded-lg hover:bg-hover-blue transition-colors"
              >
                {enviando ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  "Enviar Depoimento"
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
              <h3 className="font-bold text-xl mb-2">Obrigado pelo seu depoimento!</h3>
              <p>
                Seu comentário foi enviado e será revisado pela nossa equipe antes de ser publicado.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-hover-blue"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}