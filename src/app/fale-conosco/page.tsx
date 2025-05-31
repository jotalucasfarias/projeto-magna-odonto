"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faPhone,
  faEnvelope,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import AppointmentModal from "@/components/modal/ModalAgendamento";
import { Button } from "@/components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function ContatoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    
    if (numbers.length <= 11) {
      let phone = "";
      if (numbers.length > 0) {
        phone = `(${numbers.slice(0, 2)}`;
        if (numbers.length > 2) {
          phone += `) ${numbers.slice(2, 7)}`;
          if (numbers.length > 7) {
            phone += `-${numbers.slice(7, 11)}`;
          }
        }
      }
      return phone;
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    e.target.value = formatPhoneNumber(value);
    handleChange(e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Salvar a mensagem no Firebase
      await addDoc(collection(db, "messages"), {
        ...formData,
        status: "não-lido", // Status inicial da mensagem
        createdAt: serverTimestamp(), // Adiciona timestamp
      });
      
      toast.success("Mensagem enviada com sucesso! Em breve entraremos em contato.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Tente novamente mais tarde.");
      console.error("Erro ao enviar formulário:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      <main>
        {/* Banner principal */}
        <div className="bg-primary-dark-blue text-white py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Fale Conosco</h1>
            <p className="text-lg mb-0">
              Estamos à disposição para tirar suas dúvidas e agendar sua consulta
            </p>
          </div>
        </div>

        {/* Seção de informações de contato e formulário */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Coluna da esquerda - Informações de contato */}
              <div className="w-full lg:w-1/3 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-headline mb-6">
                    Informações de Contato
                  </h2>
                  
                  <ul className="space-y-6">
                    <li className="flex items-start">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="text-xl text-primary-dark-blue mt-1"
                      />
                      <span className="text-gray-paragraph ml-4">
                        Av. Jatuarana n°4941 sala 01 Nova Floresta.
                        <br />
                        Porto Velho - RO
                      </span>
                    </li>
                    <li className="flex items-center">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="text-xl text-primary-dark-blue"
                      />
                      <a 
                        href="https://api.whatsapp.com/send?phone=556996021979" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-paragraph ml-4 hover:text-primary-blue transition-colors"
                      >
                        (69) 99602-1979
                      </a>
                    </li>
                    <li className="flex items-center">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="text-xl text-primary-dark-blue"
                      />
                      <span className="text-gray-paragraph ml-4">magnamartinha@hotmail.com</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="text-xl text-primary-dark-blue mt-1"
                      />
                      <div className="text-gray-paragraph ml-4">
                        <p className="mb-1 font-medium">Horário de Atendimento</p>
                        <p className="mb-0">Segunda a Sexta: 08:00 às 11:30</p>
                        <p className="mb-0">14:00 às 18:00</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <h2 className="text-2xl font-bold text-gray-headline mb-6">
                    Agende sua Consulta
                  </h2>
                  <p className="text-gray-paragraph mb-4">
                    Prefere agendar diretamente? Clique no botão abaixo para marcar sua consulta.
                  </p>
                  <Button text="AGENDAR CONSULTA" onClick={openModal} />
                </div>
              </div>

              {/* Coluna da direita - Formulário de contato */}
              <div className="w-full lg:w-2/3 bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-headline mb-6">
                  Envie-nos uma mensagem
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-headline mb-1">
                        Nome completo
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-off-white rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-primary-beige outline-none"
                        placeholder="Digite seu nome"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-headline mb-1">
                        E-mail
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-off-white rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-primary-beige outline-none"
                        placeholder="exemplo@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-headline mb-1">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className="w-full p-2 border border-off-white rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-primary-beige outline-none"
                        placeholder="(00) 00000-0000"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-headline mb-1">
                        Assunto
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full p-2 border border-off-white rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-primary-beige outline-none cursor-pointer"
                        required
                      >
                        <option value="">Selecione um assunto</option>
                        <option value="Dúvidas sobre serviços">Dúvidas sobre serviços</option>
                        <option value="Orçamento">Orçamento</option>
                        <option value="Cancelamento">Cancelamento</option>
                        <option value="Elogio ou Sugestão">Elogio ou Sugestão</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-headline mb-1">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full p-2 border border-off-white rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-primary-beige outline-none"
                      placeholder="Digite sua mensagem aqui..."
                      required
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-hover-blue transition-colors font-bold cursor-pointer"
                    >
                      {loading ? (
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
                        "Enviar Mensagem"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Mapa de localização */}
        <section className="mb-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-2xl font-bold text-gray-headline mb-6 text-center">
              Como Chegar
            </h2>
            <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.321488175978!2d-63.874666!3d-8.7608199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92325c71cdd4b617%3A0xd49b310dfd486ee5!2sAv.%20Jatuarana%2C%204941%20-%20Nova%20Floresta%2C%20Porto%20Velho%20-%20RO%2C%2076807-441!5e0!3m2!1spt-BR!2sbr!4v1702070172860!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de localização da Clínica Magna Odonto em Porto Velho"
              ></iframe>
            </div>
          </div>
        </section>
      </main>

      {isModalOpen && <AppointmentModal onClose={closeModal} />}
    </>
  );
}
