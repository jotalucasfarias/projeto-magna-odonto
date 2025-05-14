import { useAppointments } from "@/hooks/useAppointments";
import { AdminAppointment } from "@/types/admin";
import { formatDateToBrazilian } from "@/utils/formatters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import {
  faPhone,
  faTrash,
  faPencilAlt,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";
import EditAppointmentModal from "./EditAppointmentModal";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

export default function AppointmentsPanel() {
  const {
    appointments,
    selectedDate,
    setSelectedDate,
    fetchAppointments,
    handleDeleteAppointment,
    filterAppointmentsByDate,
    // Novos estados e funções para edição
    editingAppointment,
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    handleEditAppointment,
    isLoading,
  } = useAppointments();

  // Estado para controlar o tamanho da tela
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

  // Filtrar agendamentos pela data selecionada
  const filteredAppointments = filterAppointmentsByDate(appointments);

  return (
    <div className="bg-white rounded-lg shadow p-4 lg:p-6 mb-8">
      <Toaster position="top-center" />
      
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por Data
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
          />
        </div>
        <button
          onClick={fetchAppointments}
          className="w-full sm:w-auto mt-2 sm:mt-auto px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-dark-blue flex items-center justify-center"
        >
          Atualizar
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-blue"></div>
          <p className="mt-2 text-gray-600">Carregando agendamentos...</p>
        </div>
      ) : filteredAppointments.length > 0 ? (
        isMobile ? (
          <AppointmentsMobileList 
            appointments={filteredAppointments}
            onDelete={handleDeleteAppointment}
            onEdit={openEditModal}
          />
        ) : (
          <AppointmentsTable 
            appointments={filteredAppointments}
            onDelete={handleDeleteAppointment}
            onEdit={openEditModal}
          />
        )
      ) : (
        <div className="text-center py-10 text-gray-500">
          Nenhum agendamento encontrado para esta data.
        </div>
      )}

      {/* Modal de edição */}
      {isEditModalOpen && editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          onClose={closeEditModal}
          onSave={(updatedAppointment) => 
            handleEditAppointment(updatedAppointment).then(result => result === true)
          }
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

interface AppointmentsTableProps {
  appointments: AdminAppointment[];
  onDelete: (id: string) => void;
  onEdit: (appointment: AdminAppointment) => void;
}

// Versão para desktop
function AppointmentsTable({ appointments, onDelete, onEdit }: AppointmentsTableProps) {
  return (
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
          {appointments.map((appointment) => (
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
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onEdit(appointment)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Editar agendamento"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(appointment.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Excluir agendamento"
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Versão para dispositivos móveis usando cards
function AppointmentsMobileList({ appointments, onDelete, onEdit }: AppointmentsTableProps) {
  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2 mb-2">
              <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-primary-blue" />
              <h3 className="font-semibold text-gray-900">{appointment.name}</h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(appointment)}
                className="text-blue-600 p-2 hover:bg-blue-50 rounded-full"
                title="Editar agendamento"
              >
                <FontAwesomeIcon icon={faPencilAlt} className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(appointment.id)}
                className="text-red-600 p-2 hover:bg-red-50 rounded-full"
                title="Excluir agendamento"
              >
                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
              </button>
            </div>
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
