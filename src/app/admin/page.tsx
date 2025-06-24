"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminHeader from "@/components/admin/AdminHeader";
import AppointmentsPanel from "@/components/admin/AppointmentsPanel";
import ReportsPanel from "@/components/admin/ReportsPanel";
import MessagesPanel from "@/components/admin/MessagesPanel";
import ClinicSettingsPanel from "@/components/admin/ClinicSettingsPanel";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChartBar, 
  faMessage, 
  faCalendarCheck,
  faCog
} from "@fortawesome/free-solid-svg-icons";

export default function AdminDashboard() {
  const { isLoading, isAuthenticated, handleLogout } = useAuth();
  const [activeTab, setActiveTab] = useState<"appointments" | "reports" | "messages" | "settings">("appointments");
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamanho da tela
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
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
      case "settings":
        return "Atualize as informações da clínica exibidas no site.";
    }
  };

  // Ícone da aba ativa
  const getActiveIcon = () => {
    switch (activeTab) {
      case "appointments":
        return faCalendarCheck;
      case "reports":
        return faChartBar;
      case "messages":
        return faMessage;
      case "settings":
        return faCog;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <AdminHeader onLogout={handleLogout} />
        
        {/* Abas de navegação - Design responsivo */}
        <div className="mb-4">
          {isMobile ? (
            // Layout móvel com menu de dropdown ou grid
            <div className="bg-white rounded-lg shadow-sm p-2">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-primary-blue flex items-center">
                  <FontAwesomeIcon icon={getActiveIcon()} className="mr-2" />
                  {activeTab === "appointments" ? "Agendamentos" : 
                   activeTab === "reports" ? "Relatórios" : 
                   activeTab === "messages" ? "Mensagens" : "Configurações"}
                </h2>
              </div>
              
              <div className="grid grid-cols-4 gap-1 text-center">
                <button
                  onClick={() => setActiveTab("appointments")}
                  className={`py-2 px-1 rounded-md ${
                    activeTab === "appointments"
                      ? "bg-primary-blue text-white font-medium"
                      : "bg-gray-100 text-gray-600"
                  } text-xs flex flex-col items-center justify-center`}
                >
                  <FontAwesomeIcon icon={faCalendarCheck} className="mb-1" />
                  Agenda
                </button>
                <button
                  onClick={() => setActiveTab("reports")}
                  className={`py-2 px-1 rounded-md ${
                    activeTab === "reports"
                      ? "bg-primary-blue text-white font-medium"
                      : "bg-gray-100 text-gray-600"
                  } text-xs flex flex-col items-center justify-center`}
                >
                  <FontAwesomeIcon icon={faChartBar} className="mb-1" />
                  Relatórios
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`py-2 px-1 rounded-md ${
                    activeTab === "messages"
                      ? "bg-primary-blue text-white font-medium"
                      : "bg-gray-100 text-gray-600"
                  } text-xs flex flex-col items-center justify-center`}
                >
                  <FontAwesomeIcon icon={faMessage} className="mb-1" />
                  Mensagens
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`py-2 px-1 rounded-md ${
                    activeTab === "settings"
                      ? "bg-primary-blue text-white font-medium"
                      : "bg-gray-100 text-gray-600"
                  } text-xs flex flex-col items-center justify-center`}
                >
                  <FontAwesomeIcon icon={faCog} className="mb-1" />
                  Config
                </button>
              </div>
            </div>
          ) : (
            // Layout Desktop com tabs tradicionais
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("appointments")}
                  className={`py-4 px-1 border-b-2 font-medium cursor-pointer ${
                    activeTab === "appointments"
                      ? "border-primary-blue text-primary-blue font-bold text-base"
                      : "border-transparent text-gray-500 hover:text-gray-700 text-sm"
                  }`}
                >
                  <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
                  Agendamentos
                </button>
                <button
                  onClick={() => setActiveTab("reports")}
                  className={`py-4 px-1 border-b-2 font-medium cursor-pointer ${
                    activeTab === "reports"
                      ? "border-primary-blue text-primary-blue font-bold text-base"
                      : "border-transparent text-gray-500 hover:text-gray-700 text-sm"
                  }`}
                >
                  <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                  Relatórios
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`py-4 px-1 border-b-2 font-medium cursor-pointer ${
                    activeTab === "messages"
                      ? "border-primary-blue text-primary-blue font-bold text-base"
                      : "border-transparent text-gray-500 hover:text-gray-700 text-sm"
                  }`}
                >
                  <FontAwesomeIcon icon={faMessage} className="mr-2" />
                  Mensagens
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`py-4 px-1 border-b-2 font-medium cursor-pointer ${
                    activeTab === "settings"
                      ? "border-primary-blue text-primary-blue font-bold text-base"
                      : "border-transparent text-gray-500 hover:text-gray-700 text-sm"
                  }`}
                >
                  <FontAwesomeIcon icon={faCog} className="mr-2" />
                  Configurações
                </button>
              </nav>
            </div>
          )}
        </div>

        {/* Subtítulo explicativo - esconde em mobile */}
        {!isMobile && <p className="text-gray-600 mb-6 pl-1">{getSubtitle()}</p>}

        {activeTab === "appointments" && <AppointmentsPanel />}
        {activeTab === "reports" && <ReportsPanel />}
        {activeTab === "messages" && <MessagesPanel />}
        {activeTab === "settings" && <ClinicSettingsPanel />}
      </div>
    </div>
  );
}