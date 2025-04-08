"use client";
import { useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  where,
  QueryConstraint,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../lib/firebase/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faUser,
  faFileAlt,
  
} from "@fortawesome/free-regular-svg-icons";
import {
  faPhone,
  faTrash,
  faDownload,
  faChartBar,
  faFilter,
  faCommentMedical,
  faCheck,
  faBan,
  faStar as solidStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Testimonial } from "@/lib/types/testimonial";
import { testimonialService } from "@/services/testimonial";
import toast from "react-hot-toast";

interface AdminAppointment {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  timeSlot: string;
  message: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Estados para a funcionalidade de relatório
  const [showReportPanel, setShowReportPanel] = useState(false);
  const [reportType, setReportType] = useState("daily");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedService, setSelectedService] = useState("todos");
  const [reportData, setReportData] = useState<AdminAppointment[]>([]);
  const [services, setServices] = useState<string[]>([]);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showTestimonialsPanel, setShowTestimonialsPanel] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
      if (user) {
        // Não precisamos chamar fetchAppointments e fetchTestimonials aqui
        // pois usaremos listeners em tempo real
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const appointmentsRef = collection(db, "appointments");
    const q = query(appointmentsRef, orderBy("date", "asc"));
    
    // Este listener vai atualizar os dados sempre que houver mudanças
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appointmentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AdminAppointment[];

      setAppointments(appointmentsData);

      // Extrair lista única de serviços para o filtro de relatórios
      const uniqueServices = [
        ...new Set(appointmentsData.map((app) => app.service)),
      ];
      setServices(uniqueServices);
    });

    // Retorne a função de limpeza para remover o listener
    return () => unsubscribe();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Aqui você precisa obter uma referência à coleção de depoimentos
    const testimonialsRef = collection(db, "testimonials");
    
    const unsubscribe = onSnapshot(testimonialsRef, (querySnapshot) => {
      const testimonialData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Testimonial[];
      
      setTestimonials(testimonialData);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
    } catch (err) {
      setError("Email ou senha inválidos");
      console.error("Login error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const appointmentsRef = collection(db, "appointments");
      const q = query(appointmentsRef, orderBy("date", "asc"));
      const querySnapshot = await getDocs(q);

      const appointmentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AdminAppointment[];

      setAppointments(appointmentsData);

      // Extrair lista única de serviços para o filtro de relatórios
      const uniqueServices = [
        ...new Set(appointmentsData.map((app) => app.service)),
      ];
      setServices(uniqueServices);
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (window.confirm("Tem certeza que deseja cancelar este agendamento?")) {
      try {
        await deleteDoc(doc(db, "appointments", id));
        // Não precisa chamar fetchAppointments() aqui
        // O listener onSnapshot atualizará automaticamente os dados
      } catch (err) {
        console.error("Erro ao deletar agendamento:", err);
      }
    }
  };

  const filterAppointmentsByDate = (appointments: AdminAppointment[]) => {
    return appointments.filter((app) => app.date === selectedDate);
  };

  // Função para gerar relatório
  const generateReport = async () => {
    try {
      setIsLoading(true);

      const appointmentsRef = collection(db, "appointments");
      const constraints: QueryConstraint[] = [];

      // Filtro por período
      if (reportType === "daily") {
        constraints.push(where("date", "==", startDate));
      } else {
        constraints.push(where("date", ">=", startDate));
        constraints.push(where("date", "<=", endDate));
      }

      // Montar a query com os filtros
      let q;
      if (constraints.length > 0) {
        q = query(appointmentsRef, ...constraints, orderBy("date", "asc"));
      } else {
        q = query(appointmentsRef, orderBy("date", "asc"));
      }

      const querySnapshot = await getDocs(q);
      let filteredData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AdminAppointment[];

      // Filtro adicional por serviço (se não for "todos")
      if (selectedService !== "todos") {
        filteredData = filteredData.filter(
          (app) => app.service === selectedService
        );
      }

      setReportData(filteredData);
      setIsLoading(false);
    } catch (err) {
      console.error("Erro ao gerar relatório:", err);
      setIsLoading(false);
    }
  };

  // Função para exportar relatório como CSV
  const exportReportToCsv = () => {
    if (reportData.length === 0) return;

    const headers = [
      "Nome",
      "Telefone",
      "Serviço",
      "Data",
      "Horário",
      "Mensagem",
    ];

    const csvRows = [
      headers.join(","),
      ...reportData.map((item) => {
        return [
          `"${item.name}"`,
          `"${item.phone}"`,
          `"${item.service}"`,
          `"${item.date}"`,
          `"${item.timeSlot}"`,
          `"${item.message?.replace(/"/g, '""') || ""}"`,
        ].join(",");
      }),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Criar nome de arquivo
    const period =
      reportType === "daily" ? `_${startDate}` : `_${startDate}_a_${endDate}`;
    const service = selectedService === "todos" ? "" : `_${selectedService}`;

    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio${period}${service}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Componente para métricas resumidas
  const ReportSummary = () => {
    const totalAppointments = reportData.length;

    // Agrupamento por serviço
    const serviceCount: Record<string, number> = {};
    reportData.forEach((app) => {
      serviceCount[app.service] = (serviceCount[app.service] || 0) + 1;
    });

    return (
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Resumo do Relatório
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-md shadow">
            <p className="text-sm text-gray-500">Total de Agendamentos</p>
            <p className="text-2xl font-bold text-primary-blue">
              {totalAppointments}
            </p>
          </div>

          <div className="bg-white p-3 rounded-md shadow md:col-span-2">
            <p className="text-sm text-gray-500 mb-2">
              Agendamentos por Serviço
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(serviceCount).map(([service, count]) => (
                <div key={service} className="flex justify-between">
                  <span className="text-sm">{service}:</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleApproveTestimonial = async (id: string) => {
    try {
      await testimonialService.updateApprovalStatus(id, true);
      // Não precisa chamar fetchTestimonials() aqui
      toast.success("Depoimento aprovado com sucesso!");
    } catch (err) {
      console.error("Erro ao aprovar depoimento:", err);
      toast.error("Erro ao aprovar depoimento");
    }
  };

  const handleRejectTestimonial = async (id: string) => {
    if (window.confirm("Tem certeza que deseja rejeitar este depoimento?")) {
      try {
        await testimonialService.updateApprovalStatus(id, false);
        // Não precisa chamar fetchTestimonials() aqui
        toast.success("Depoimento rejeitado com sucesso!");
      } catch (err) {
        console.error("Erro ao rejeitar depoimento:", err);
        toast.error("Erro ao rejeitar depoimento");
      }
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este depoimento?")) {
      try {
        await testimonialService.deleteTestimonial(id);
        // Não precisa chamar fetchTestimonials() aqui
        toast.success("Depoimento excluído com sucesso!");
      } catch (err) {
        console.error("Erro ao excluir depoimento:", err);
        toast.error("Erro ao excluir depoimento");
      }
    }
  };

  // Adicione esta função para formatar o número de telefone para o WhatsApp
  const formatWhatsAppNumber = (phone: string): string => {
    // Remove caracteres não numéricos
    const numbersOnly = phone.replace(/\D/g, '');
    
    // Se começar com 0, remova-o
    let formattedNumber = numbersOnly.startsWith('0') 
      ? numbersOnly.substring(1) 
      : numbersOnly;
    
    // Se não tiver o código do país, adicione +55 (Brasil)
    if (!formattedNumber.startsWith('55')) {
      formattedNumber = `55${formattedNumber}`;
    }
    
    return formattedNumber;
  };

  // Adicione esta função para criar o link do WhatsApp com uma mensagem predefinida
  const createWhatsAppLink = (phone: string, name: string, date: string, timeSlot: string, service: string): string => {
    const formattedPhone = formatWhatsAppNumber(phone);
    const message = encodeURIComponent(
      `Olá ${name}, gostaríamos de confirmar seu agendamento para ${service} em ${date} às ${timeSlot}. Contamos com sua presença! Magna Odonto.`
    );
    
    return `https://wa.me/${formattedPhone}?text=${message}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Área Administrativa
            </h2>
            <p className="mt-2 text-gray-600">
              Faça login para acessar o painel
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-blue focus:border-primary-blue focus:z-10 sm:text-sm"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-blue focus:border-primary-blue focus:z-10 sm:text-sm"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-blue hover:bg-primary-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Painel Administrativo
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Sair
          </button>
        </div>

        {/* Tabs para navegação entre agendamentos e relatórios */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => {
                  setShowReportPanel(false);
                  setShowTestimonialsPanel(false);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  !showReportPanel && !showTestimonialsPanel
                    ? "border-primary-blue text-primary-blue"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Agendamentos
              </button>
              <button
                onClick={() => {
                  setShowReportPanel(true);
                  setShowTestimonialsPanel(false);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  showReportPanel && !showTestimonialsPanel
                    ? "border-primary-blue text-primary-blue"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                Relatórios
              </button>
              <button
                onClick={() => {
                  setShowReportPanel(false);
                  setShowTestimonialsPanel(true);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  showTestimonialsPanel
                    ? "border-primary-blue text-primary-blue"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FontAwesomeIcon icon={faCommentMedical} className="mr-2" />
                Depoimentos
              </button>
            </nav>
          </div>
        </div>

        {!showReportPanel && !showTestimonialsPanel ? (
          // Painel de Agendamentos (existente)
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por Data
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
                />
              </div>
              <button
                onClick={fetchAppointments}
                className="mt-6 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-dark-blue"
              >
                Atualizar
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serviço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filterAppointmentsByDate(appointments).length > 0 ? (
                    filterAppointmentsByDate(appointments).map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="h-5 w-5 text-gray-400 mr-2"
                            />
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {appointment.service}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FontAwesomeIcon
                              icon={faCalendar}
                              className="h-5 w-5 text-gray-400 mr-2"
                            />
                            <div className="text-sm text-gray-900">
                              {appointment.date}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FontAwesomeIcon
                              icon={faClock}
                              className="h-5 w-5 text-gray-400 mr-2"
                            />
                            <div className="text-sm text-gray-900">
                              {appointment.timeSlot}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FontAwesomeIcon
                              icon={faPhone}
                              className="h-5 w-5 text-gray-400 mr-2"
                            />
                            <div className="text-sm text-gray-900">
                              {appointment.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-3">
                            <a
                              href={createWhatsAppLink(
                                appointment.phone,
                                appointment.name,
                                appointment.date,
                                appointment.timeSlot,
                                appointment.service
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800"
                              title="Enviar lembrete"
                            >
                              <FontAwesomeIcon icon={faWhatsapp} className="h-5 w-5" />
                            </a>
                            <button
                              onClick={() => handleDeleteAppointment(appointment.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Cancelar agendamento"
                            >
                              <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Nenhum agendamento para esta data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : showReportPanel ? (
          // Painel de Relatórios (novo)
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
              Relatórios Personalizados
            </h2>

            {/* Filtros de relatório */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Relatório
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
                >
                  <option value="daily">Diário</option>
                  <option value="period">Por Período</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {reportType === "daily" ? "Data" : "Data Inicial"}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
                />
              </div>

              {reportType === "period" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Final
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serviço
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
                >
                  <option value="todos">Todos os serviços</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <button
                onClick={generateReport}
                className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-dark-blue flex items-center"
              >
                <FontAwesomeIcon icon={faFilter} className="mr-2" />
                Gerar Relatório
              </button>

              <button
                onClick={exportReportToCsv}
                disabled={reportData.length === 0}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  reportData.length > 0
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Exportar CSV
              </button>
            </div>

            {/* Resultados do relatório */}
            {reportData.length > 0 && (
              <>
                <ReportSummary />

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Paciente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Serviço
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Horário
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contato
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FontAwesomeIcon
                                icon={faUser}
                                className="h-5 w-5 text-gray-400 mr-2"
                              />
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {appointment.service}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FontAwesomeIcon
                                icon={faCalendar}
                                className="h-5 w-5 text-gray-400 mr-2"
                              />
                              <div className="text-sm text-gray-900">
                                {appointment.date}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FontAwesomeIcon
                                icon={faClock}
                                className="h-5 w-5 text-gray-400 mr-2"
                              />
                              <div className="text-sm text-gray-900">
                                {appointment.timeSlot}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FontAwesomeIcon
                                icon={faPhone}
                                className="h-5 w-5 text-gray-400 mr-2"
                              />
                              <div className="text-sm text-gray-900">
                                {appointment.phone}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {reportData.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                Nenhum resultado encontrado. Ajuste os filtros e tente
                novamente.
              </div>
            )}
          </div>
        ) : (
          // Painel de Depoimentos (novo)
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              <FontAwesomeIcon icon={faCommentMedical} className="mr-2" />
              Gerenciar Depoimentos
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serviço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avaliação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comentário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {testimonials.length > 0 ? (
                    testimonials.map((testimonial) => (
                      <tr key={testimonial.id} className={!testimonial.approved ? "bg-gray-50" : ""}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {testimonial.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {testimonial.service}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <FontAwesomeIcon
                                key={i}
                                icon={i < testimonial.rating ? solidStar : regularStar}
                                className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {testimonial.comment}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              testimonial.approved
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {testimonial.approved ? "Aprovado" : "Pendente"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {!testimonial.approved && (
                              <button
                                onClick={() => handleApproveTestimonial(testimonial.id!)}
                                className="text-green-600 hover:text-green-900"
                                title="Aprovar"
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                            )}
                            {testimonial.approved && (
                              <button
                                onClick={() => handleRejectTestimonial(testimonial.id!)}
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Rejeitar"
                              >
                                <FontAwesomeIcon icon={faBan} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteTestimonial(testimonial.id!)}
                              className="text-red-600 hover:text-red-900"
                              title="Excluir"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Nenhum depoimento encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}