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
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faUser,
  faFileAlt,
  faEnvelope,
  faCheckCircle,
  faCircle,
} from "@fortawesome/free-regular-svg-icons";
import {
  faPhone,
  faTrash,
  faDownload,
  faChartBar,
  faFilter,
  faLock,
  faEnvelopeOpen,
  faMessage,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

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

// Interface para as mensagens
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "lido" | "não-lido";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any;
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

  // Estados para a funcionalidade de mensagens
  const [showMessagesPanel, setShowMessagesPanel] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messageFilter, setMessageFilter] = useState("all"); // all, read, unread

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
      if (user) {
        fetchAppointments();
        fetchMessages(); // Buscar mensagens quando o usuário estiver autenticado
      }
    });

    return () => unsubscribe();
  }, [auth]);

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
        await fetchAppointments();
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

  // Função para buscar mensagens do formulário de contato
  const fetchMessages = async () => {
    try {
      const messagesRef = collection(db, "messages");
      const q = query(messagesRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const messagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ContactMessage[];

      setMessages(messagesData);
    } catch (err) {
      console.error("Erro ao buscar mensagens:", err);
    }
  };

  // Função para marcar mensagem como lida/não-lida
  const toggleMessageStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "lido" ? "não-lido" : "lido";
      await updateDoc(doc(db, "messages", id), {
        status: newStatus,
      });
      await fetchMessages();
    } catch (err) {
      console.error("Erro ao atualizar status da mensagem:", err);
    }
  };

  // Função para excluir mensagem
  const handleDeleteMessage = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta mensagem?")) {
      try {
        await deleteDoc(doc(db, "messages", id));
        await fetchMessages();
      } catch (err) {
        console.error("Erro ao deletar mensagem:", err);
      }
    }
  };

  // Filtrar mensagens conforme o status
  const getFilteredMessages = () => {
    if (messageFilter === "all") return messages;
    return messages.filter(m => m.status === (messageFilter === "read" ? "lido" : "não-lido"));
  };

  // Formatar data de criação
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatMessageDate = (timestamp: any) => {
    if (!timestamp) return "--";
    
    // Converter para data brasileira com horário
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
    } catch (e) {
      return "error" + e;
    }
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl transition-all">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-primary-blue rounded-full flex items-center justify-center mb-5">
              <FontAwesomeIcon icon={faUser} className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Área Administrativa
            </h2>
            <p className="mt-2 text-gray-600">
              Digite suas credenciais para acessar o painel
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm flex items-center">
                <FontAwesomeIcon icon={faFilter} className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}
            <div className="rounded-md space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="pl-10 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue focus:z-10 sm:text-sm transition duration-150"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="pl-10 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue focus:z-10 sm:text-sm transition duration-150"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-blue hover:bg-primary-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue shadow-md transition duration-150 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-primary-light-blue group-hover:text-white transition ease-in-out duration-150" />
              </span>
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

        {/* Tabs para navegação */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => {
                  setShowReportPanel(false);
                  setShowMessagesPanel(false);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  !showReportPanel && !showMessagesPanel
                    ? "border-primary-blue text-primary-blue"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Agendamentos
              </button>
              <button
                onClick={() => {
                  setShowReportPanel(true);
                  setShowMessagesPanel(false);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  showReportPanel && !showMessagesPanel
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
                  setShowMessagesPanel(true);
                  fetchMessages(); // Atualizar mensagens ao clicar na aba
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  showMessagesPanel
                    ? "border-primary-blue text-primary-blue"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FontAwesomeIcon icon={faMessage} className="mr-2" />
                Mensagens
              </button>
            </nav>
          </div>
        </div>

        {!showReportPanel && !showMessagesPanel ? (
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
                  {filterAppointmentsByDate(appointments).map((appointment) => (
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
                        <button
                          onClick={() =>
                            handleDeleteAppointment(appointment.id)
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : showReportPanel ? (
          // Painel de Relatórios (existente)
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
          // Painel de Mensagens (novo)
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              Mensagens do Formulário de Contato
            </h2>

            {/* Filtros para mensagens */}
            <div className="flex items-center gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por Status
                </label>
                <select
                  value={messageFilter}
                  onChange={(e) => setMessageFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
                >
                  <option value="all">Todas</option>
                  <option value="unread">Não lidas</option>
                  <option value="read">Lidas</option>
                </select>
              </div>
              <button
                onClick={fetchMessages}
                className="mt-6 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-dark-blue"
              >
                Atualizar
              </button>
            </div>

            {/* Lista de mensagens */}
            {getFilteredMessages().length > 0 ? (
              <div className="space-y-4">
                {getFilteredMessages().map((message) => (
                  <div 
                    key={message.id} 
                    className={`border rounded-lg p-4 ${
                      message.status === "não-lido" 
                        ? "bg-blue-50 border-blue-200" 
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon 
                          icon={message.status === "não-lido" ? faCircle : faCheckCircle} 
                          className={`${
                            message.status === "não-lido" ? "text-blue-500" : "text-green-500"
                          }`} 
                        />
                        <h3 className="text-lg font-semibold">{message.subject}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleMessageStatus(message.id, message.status)}
                          className={`p-1 rounded ${
                            message.status === "não-lido" 
                              ? "text-green-600 hover:bg-green-100" 
                              : "text-blue-600 hover:bg-blue-100"
                          }`}
                          title={message.status === "não-lido" ? "Marcar como lida" : "Marcar como não lida"}
                        >
                          <FontAwesomeIcon icon={message.status === "não-lido" ? faCheck : faEnvelopeOpen} />
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Excluir mensagem"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-sm text-gray-500">De:</p>
                        <p className="font-medium">{message.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email:</p>
                        <p className="font-medium">{message.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Telefone:</p>
                        <p className="font-medium">{message.phone || "Não informado"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Data:</p>
                        <p className="font-medium">{formatMessageDate(message.createdAt)}</p>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Mensagem:</p>
                      <p className="whitespace-pre-line">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                Nenhuma mensagem encontrada. Ajuste os filtros ou aguarde novas mensagens.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}