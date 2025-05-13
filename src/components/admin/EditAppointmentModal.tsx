import { useState, useEffect } from "react";
import { AdminAppointment } from "@/types/admin";
import { formatarTelefone } from "@/components/modal/ModalAgendamento/utils/formatadores";
import { SERVICOS } from "@/components/modal/ModalAgendamento/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { criarHorariosDisponiveis } from "@/components/modal/ModalAgendamento/utils/utilsHorarios";
import { appointmentService } from "@/services/appointment";
import { TimeSlot } from "@/lib/types/appointment";

interface EditAppointmentModalProps {
  appointment: AdminAppointment;
  onClose: () => void;
  onSave: (updatedAppointment: AdminAppointment) => Promise<boolean>;
  isLoading: boolean;
}

export default function EditAppointmentModal({
  appointment,
  onClose,
  onSave,
  isLoading
}: EditAppointmentModalProps) {
  const [formData, setFormData] = useState<AdminAppointment>({ ...appointment });
  const [horarios, setHorarios] = useState<TimeSlot[]>([]);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  
  // Atualizar o formulário quando o agendamento mudar
  useEffect(() => {
    setFormData({ ...appointment });
  }, [appointment]);

  // Carregar horários disponíveis quando a data mudar
  useEffect(() => {
    const buscarHorarios = async () => {
      if (formData.date) {
        setCarregandoHorarios(true);
        try {
          // Obter todos os horários possíveis
          const todosHorarios = criarHorariosDisponiveis().map(slot => slot.time);
          
          // Obter horários livres da API (excluindo o horário do próprio agendamento)
          const horariosOcupados = await appointmentService.getAvailableTimeSlots(
            formData.date,
            todosHorarios
          );
          
          // Marcar todos os horários como disponíveis inicialmente
          const horariosAtualizados = todosHorarios.map(time => ({
            id: time,
            time,
            // Um horário está disponível se estiver livre ou se for o horário original deste agendamento
            isAvailable: horariosOcupados.includes(time) || time === appointment.timeSlot
          }));
          
          setHorarios(horariosAtualizados);
        } catch (error) {
          console.error("Erro ao carregar horários:", error);
        } finally {
          setCarregandoHorarios(false);
        }
      }
    };
    
    buscarHorarios();
  }, [formData.date, appointment.timeSlot]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      setFormData({
        ...formData,
        [name]: formatarTelefone(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSelectTimeSlot = (horario: string) => {
    setFormData({
      ...formData,
      timeSlot: horario
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (await onSave(formData)) {
      onClose();
    }
  };
  
  // Formatação de hora para exibição por período (manhã/tarde)
  const agruparHorariosPorPeriodo = () => {
    const manha: TimeSlot[] = [];
    const tarde: TimeSlot[] = [];
    
    horarios.forEach(horario => {
      const hora = parseInt(horario.time.split(':')[0]);
      if (hora < 12) {
        manha.push(horario);
      } else {
        tarde.push(horario);
      }
    });
    
    return { manha, tarde };
  };
  
  const { manha, tarde } = agruparHorariosPorPeriodo();
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-bold text-primary-blue mb-6">
          Editar Agendamento
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Paciente
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
              disabled={isLoading}
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
              disabled={isLoading}
              required
            />
          </div>
          
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
              Serviço
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
              disabled={isLoading}
              required
            >
              <option value="">Selecione um serviço</option>
              {SERVICOS.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
              disabled={isLoading}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horário
            </label>
            
            {carregandoHorarios ? (
              <div className="text-center py-4">
                <svg className="animate-spin h-6 w-6 mx-auto text-primary-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <p className="mt-2 text-sm text-gray-500">Carregando horários...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Período da manhã */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Manhã</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {manha.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => handleSelectTimeSlot(slot.time)}
                        className={`p-2 text-sm rounded-md ${
                          formData.timeSlot === slot.time 
                            ? 'bg-primary-blue text-white' 
                            : slot.isAvailable 
                              ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                        }`}
                        disabled={!slot.isAvailable || isLoading}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Período da tarde */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Tarde</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {tarde.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => handleSelectTimeSlot(slot.time)}
                        className={`p-2 text-sm rounded-md ${
                          formData.timeSlot === slot.time 
                            ? 'bg-primary-blue text-white' 
                            : slot.isAvailable 
                              ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                        }`}
                        disabled={!slot.isAvailable || isLoading}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
                
                {formData.timeSlot && (
                  <div className="text-sm text-green-600 font-medium">
                    Horário selecionado: {formData.timeSlot}
                  </div>
                )}
                
                {!formData.timeSlot && (
                  <div className="text-sm text-red-500">
                    Selecione um horário
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message || ""}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-blue focus:border-primary-blue"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-primary-dark-blue"
              disabled={isLoading || !formData.timeSlot}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Salvando...
                </span>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
