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
} from "@fortawesome/free-solid-svg-icons";

export default function AppointmentsPanel() {
  const {
    appointments,
    selectedDate,
    setSelectedDate,
    fetchAppointments,
    handleDeleteAppointment,
    filterAppointmentsByDate,
  } = useAppointments();

  return (
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

      <AppointmentsTable 
        appointments={filterAppointmentsByDate(appointments)}
        onDelete={handleDeleteAppointment}
      />
    </div>
  );
}

interface AppointmentsTableProps {
  appointments: AdminAppointment[];
  onDelete: (id: string) => void;
}

function AppointmentsTable({ appointments, onDelete }: AppointmentsTableProps) {
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
                <button
                  onClick={() => onDelete(appointment.id)}
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
  );
}
