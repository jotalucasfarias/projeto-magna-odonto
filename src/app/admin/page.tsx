"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminHeader from "@/components/admin/AdminHeader";
import AppointmentsPanel from "@/components/admin/AppointmentsPanel";
import ReportsPanel from "@/components/admin/ReportsPanel";
import MessagesPanel from "@/components/admin/MessagesPanel";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar, faMessage } from "@fortawesome/free-solid-svg-icons";

export default function AdminDashboard() {
  const { isLoading, isAuthenticated, handleLogout } = useAuth();
  const [activeTab, setActiveTab] = useState<"appointments" | "reports" | "messages">("appointments");

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Funções para obter o subtítulo baseado na aba ativa
  const getSubtitle = () => {
    switch (activeTab) {
      case "appointments":
        return "Veja os agendamentos do dia selecionado e gerencie as consultas.";
      case "reports":
        return "Consulte relatórios e estatísticas sobre os atendimentos da clínica.";
      case "messages":
        return "Visualize e responda as mensagens enviadas pelos pacientes.";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <AdminHeader onLogout={handleLogout} />
        
        {/* Abas de navegação com melhor destaque visual */}
        <div className="mb-2">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("appointments")}
                className={`py-4 px-1 border-b-2 font-medium ${
                  activeTab === "appointments"
                    ? "border-primary-blue text-primary-blue font-bold text-base"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 text-sm"
                }`}
              >
                Agendamentos
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`py-4 px-1 border-b-2 font-medium ${
                  activeTab === "reports"
                    ? "border-primary-blue text-primary-blue font-bold text-base"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 text-sm"
                }`}
              >
                <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                Relatórios
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className={`py-4 px-1 border-b-2 font-medium ${
                  activeTab === "messages"
                    ? "border-primary-blue text-primary-blue font-bold text-base"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 text-sm"
                }`}
              >
                <FontAwesomeIcon icon={faMessage} className="mr-2" />
                Mensagens
              </button>
            </nav>
          </div>
        </div>

        {/* Subtítulo explicativo sobre a seção atual */}
        <p className="text-gray-600 mb-6 pl-1">{getSubtitle()}</p>

        {activeTab === "appointments" && <AppointmentsPanel />}
        {activeTab === "reports" && <ReportsPanel />}
        {activeTab === "messages" && <MessagesPanel />}
      </div>
    </div>
  );
}