import { useState } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { AdminAppointment } from "@/types/admin";
import { formatDateToBrazilian } from "@/utils/formatters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faUser,
  faFileAlt,
} from "@fortawesome/free-regular-svg-icons";
import {
  faPhone,
  faDownload,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

export default function ReportsPanel() {
  const { services, generateReport } = useAppointments();
  const [isLoading, setIsLoading] = useState(false);
  
  // Report states
  const [reportType, setReportType] = useState("daily");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedService, setSelectedService] = useState("todos");
  const [reportData, setReportData] = useState<AdminAppointment[]>([]);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    const data = await generateReport(reportType, startDate, endDate, selectedService);
    setReportData(data);
    setIsLoading(false);
  };

  // Export report as CSV
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

    // Create filename
    const period = reportType === "daily" ? `_${startDate}` : `_${startDate}_a_${endDate}`;
    const service = selectedService === "todos" ? "" : `_${selectedService}`;

    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio${period}${service}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
        Relatórios Personalizados
      </h2>

      {/* Report filters */}
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
          onClick={handleGenerateReport}
          disabled={isLoading}
          className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-dark-blue flex items-center"
        >
          <FontAwesomeIcon icon={faFilter} className="mr-2" />
          {isLoading ? "Gerando..." : "Gerar Relatório"}
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

      {/* Report results */}
      {reportData.length > 0 && (
        <>
          <ReportSummary reportData={reportData} />

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
                          {formatDateToBrazilian(appointment.date)}
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
  );
}

interface ReportSummaryProps {
  reportData: AdminAppointment[];
}

function ReportSummary({ reportData }: ReportSummaryProps) {
  const totalAppointments = reportData.length;

  // Grouping by service
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
}
