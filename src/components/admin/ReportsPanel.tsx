import { useState, useEffect } from "react";
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
  faFilePdf,
  faFileExcel,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import ExcelJS from "exceljs";


export default function ReportsPanel() {
  const { services, generateReport } = useAppointments();
  const [isLoading, setIsLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  
  const [reportType, setReportType] = useState("daily");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedService, setSelectedService] = useState("todos");
  const [reportData, setReportData] = useState<AdminAppointment[]>([]);
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

  const handleGenerateReport = async () => {
    setIsLoading(true);
    const data = await generateReport(reportType, startDate, endDate, selectedService);
    setReportData(data);
    setIsLoading(false);
  };

  // Função para gerar nome do arquivo baseado nos filtros atuais
  const getFilenameBase = () => {
    const period = reportType === "daily" ? `_${startDate}` : `_${startDate}_a_${endDate}`;
    const service = selectedService === "todos" ? "" : `_${selectedService}`;
    return `relatorio${period}${service}`;
  };

  // Exportar Relatorio para PDF usando pdf-lib
  const exportReportToPdf = async () => {
    if (reportData.length === 0) return;
    setExportLoading('pdf');

    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const margin = 40;
      const lineHeight = 20;
      let y = height - margin;

      try {
        const logoUrl = '/logo-clinica.png';
        const response = await fetch(logoUrl);
        if (response.ok) {
          const logoImageBytes = await response.arrayBuffer();
          const logoImage = await pdfDoc.embedPng(logoImageBytes);
          const logoDims = logoImage.scale(0.33);
          page.drawImage(logoImage, {
            x: (width - logoDims.width) / 2,
            y: (height - logoDims.height) / 2,
            width: logoDims.width,
            height: logoDims.height,
            opacity: 0.12,
          });
        }
      } catch {}

      const title = `Relatório de Agendamentos - ${selectedService === 'todos' ? 'Todos os serviços' : selectedService}`;
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      page.drawText(title, { x: margin, y, size: 15, font, color: rgb(0.16, 0.5, 0.73) });
      y -= lineHeight + 5;

      // Período
      const periodo = reportType === "daily"
        ? `Data: ${formatDateToBrazilian(startDate)}`
        : `Período: ${formatDateToBrazilian(startDate)} a ${formatDateToBrazilian(endDate)}`;
      page.drawText(periodo, { x: margin, y, size: 11, font: await pdfDoc.embedFont(StandardFonts.Helvetica) });
      y -= lineHeight;

      // Total de agendamentos
      page.drawText(`Total de agendamentos: ${reportData.length}`, { x: margin, y, size: 11, font: await pdfDoc.embedFont(StandardFonts.Helvetica) });
      y -= lineHeight;

      // Espaço extra antes do cabeçalho da tabela
      y -= 10;

      // Cabeçalho da tabela
      const headers = ['Nome', 'Telefone', 'Serviço', 'Data', 'Horário'];
      // Calcular larguras proporcionais para ocupar toda a largura da página
      const tableWidth = width - margin * 2;
      const colWidths = [0.28, 0.18, 0.24, 0.15, 0.15].map(p => Math.floor(tableWidth * p));
      // Ajustar para somar exatamente tableWidth
      const widthDiff = tableWidth - colWidths.reduce((a, b) => a + b, 0);
      colWidths[0] += widthDiff; // Corrige diferença de arredondamento
      let x = margin;

      // Fundo do cabeçalho
      page.drawRectangle({
        x: margin - 2,
        y: y - 2,
        width: tableWidth + 4,
        height: lineHeight + 4,
        color: rgb(0.16, 0.5, 0.73),
        opacity: 0.9,
        borderColor: rgb(0.16, 0.5, 0.73),
      });

      // Escrever o cabeçalho
      headers.forEach((header, idx) => {
        page.drawText(header, { x, y: y + 4, size: 11, font, color: rgb(1, 1, 1) });
        x += colWidths[idx];
      });
      y -= lineHeight + 4;

      // Função para quebrar texto em múltiplas linhas
      function wrapText(text: string, font: typeof rowFont, size: number, maxWidth: number): string[] {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        for (const word of words) {
          const testLine = currentLine ? currentLine + ' ' + word : word;
          const testWidth = font.widthOfTextAtSize(testLine, size);
          if (testWidth > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
      }

      // Dados da tabela
      const rowFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      for (const item of reportData) {
        x = margin;
        // Quebra de texto para cada célula
        const row = [
          item.name,
          item.phone,
          item.service,
          formatDateToBrazilian(item.date),
          item.timeSlot,
        ];
        // Quebrar cada célula conforme largura da coluna
        const wrappedCells = row.map((cell, idx) => wrapText(cell, rowFont, 10, colWidths[idx] - 4));
        // Descobrir quantas linhas serão necessárias para esta linha
        const maxLines = Math.max(...wrappedCells.map(lines => lines.length));
        // Escrever cada linha da célula
        for (let lineIdx = 0; lineIdx < maxLines; lineIdx++) {
          let cellX = margin;
          for (let colIdx = 0; colIdx < row.length; colIdx++) {
            const line = wrappedCells[colIdx][lineIdx] || '';
            page.drawText(line, { x: cellX, y, size: 10, font: rowFont, color: rgb(0, 0, 0) });
            cellX += colWidths[colIdx];
          }
          y -= lineHeight - 6; // Menor espaçamento entre linhas da mesma célula
          if (y < margin + lineHeight * 2) {
            // Nova página se necessário
            y = height - margin;
            pdfDoc.addPage();
          }
        }
        y -= 6; // Espaço extra entre linhas da tabela
        if (y < margin + lineHeight * 2) {
          y = height - margin;
          pdfDoc.addPage();
        }
      }

      // Download do PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${getFilenameBase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao exportar para PDF:", error);
    } finally {
      setExportLoading(null);
    }
  };

  // Exporta Relatorio para Excel usando exceljs
  const exportReportToExcel = async () => {
    if (reportData.length === 0) return;
    setExportLoading('excel');

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Agendamentos');

      worksheet.columns = [
        { header: 'Nome', key: 'name', width: 30 },
        { header: 'Telefone', key: 'phone', width: 18 },
        { header: 'Serviço', key: 'service', width: 25 },
        { header: 'Data', key: 'date', width: 15 },
        { header: 'Horário', key: 'timeSlot', width: 12 },
        { header: 'Observações', key: 'message', width: 40 },
      ];

      reportData.forEach(item => {
        worksheet.addRow({
          name: item.name,
          phone: item.phone,
          service: item.service,
          date: formatDateToBrazilian(item.date),
          timeSlot: item.timeSlot,
          message: item.message || '',
        });
      });

      // Estilizar cabeçalho
      worksheet.getRow(1).font = { bold: true };

      // Gerar arquivo e baixar
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${getFilenameBase()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao exportar para Excel:", error);
    } finally {
      setExportLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 lg:p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
        Relatórios Personalizados
      </h2>

      {/* Filtros do Relatorio - Layout melhorado para responsividade */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={handleGenerateReport}
          disabled={isLoading}
          className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-dark-blue flex items-center w-full sm:w-auto justify-center sm:justify-start mb-2 sm:mb-0 cursor-pointer"
        >
          <FontAwesomeIcon icon={faFilter} className="mr-2" />
          {isLoading ? "Gerando..." : "Gerar Relatório"}
        </button>

        {reportData.length > 0 && (
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={exportReportToExcel}
              disabled={exportLoading !== null}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 flex items-center flex-1 sm:flex-auto justify-center cursor-pointer"
            >
              <FontAwesomeIcon 
                icon={exportLoading === 'excel' ? faDownload : faFileExcel} 
                className={`mr-2 ${exportLoading === 'excel' ? 'animate-spin' : ''}`} 
              />
              {exportLoading === 'excel' ? 'Exportando...' : 'Excel'}
            </button>
            
            <button
              onClick={exportReportToPdf}
              disabled={exportLoading !== null}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center flex-1 sm:flex-auto justify-center cursor-pointer"
            >
              <FontAwesomeIcon 
                icon={exportLoading === 'pdf' ? faDownload : faFilePdf} 
                className={`mr-2 ${exportLoading === 'pdf' ? 'animate-spin' : ''}`} 
              />
              {exportLoading === 'pdf' ? 'Exportando...' : 'PDF'}
            </button>
          </div>
        )}
      </div>

      {/* Resultado do Relatório */}
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-blue"></div>
          <p className="mt-2 text-gray-600">Gerando relatório...</p>
        </div>
      ) : reportData.length > 0 ? (
        <>
          <ReportSummary reportData={reportData} />

          {isMobile ? (
            <ReportMobileList reportData={reportData} />
          ) : (
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
          )}
        </>
      ) : (
        <div className="text-center py-10 text-gray-500">
          Nenhum resultado encontrado. Ajuste os filtros e tente
          novamente.
        </div>
      )}
    </div>
  );
}

// Componente para exibir lista de relatórios em formato mobile
function ReportMobileList({ reportData }: { reportData: AdminAppointment[] }) {
  return (
    <div className="space-y-4">
      {reportData.map((appointment) => (
        <div key={appointment.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-primary-blue" />
            <h3 className="font-semibold text-gray-900">{appointment.name}</h3>
          </div>

          <div className="grid grid-cols-1 gap-2 mt-3">
            <div className="flex items-center text-sm">
              <FontAwesomeIcon icon={faStethoscope} className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-600">Serviço:</span>
              <span className="ml-2 font-medium">{appointment.service}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <FontAwesomeIcon icon={faCalendar} className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-600">Data:</span>
              <span className="ml-2 font-medium">{formatDateToBrazilian(appointment.date)}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-600">Horário:</span>
              <span className="ml-2 font-medium">{appointment.timeSlot}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <FontAwesomeIcon icon={faPhone} className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-600">Telefone:</span>
              <span className="ml-2 font-medium">{appointment.phone}</span>
            </div>
          </div>

          {appointment.message && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Observações: {appointment.message}</p>
            </div>
          )}
        </div>
      ))}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(serviceCount).map(([service, count]) => (
              <div key={service} className="flex justify-between">
                <span className="text-sm truncate pr-2">{service}:</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
