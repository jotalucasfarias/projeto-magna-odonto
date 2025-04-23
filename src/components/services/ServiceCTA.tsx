"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import AppointmentModal from "@/components/modal/ModalAgendamento";

export default function ServiceCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-headline mb-6">
          Pronto para transformar seu sorriso?
        </h2>
        <p className="text-gray-paragraph max-w-2xl mx-auto mb-8">
          Agende uma consulta e converse com nossos especialistas sobre como podemos ajudar você a conseguir o sorriso que sempre desejou.
        </p>
        
        <Button text="AGENDAR CONSULTA" onClick={openModal} className="mx-auto" />
        
        {isModalOpen && <AppointmentModal onClose={closeModal} />}
      </div>
    </div>
  );
}
