import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AdminAppointment } from '@/types/admin';
import { appointmentService } from '@/services/appointment';
import { toast } from 'react-hot-toast';

interface ReminderButtonProps {
  appointment: AdminAppointment;
  onSuccess?: () => void;
}

export default function ReminderButton({ appointment, onSuccess }: ReminderButtonProps) {
  const [isSending, setIsSending] = useState(false);

  const handleSendReminder = async () => {
    setIsSending(true);
    try {
      const compatibleAppointment = {
        ...appointment,
        createdAt: new Date(appointment.createdAt)
      };
      
      const success = await appointmentService.sendAppointmentReminder(compatibleAppointment);
      
      if (success) {
        toast.success("WhatsApp aberto com mensagem de lembrete!");
        if (onSuccess) onSuccess();
      } else {
        toast.error("Não foi possível enviar o lembrete");
      }
    } catch (error) {
      console.error("Erro ao enviar lembrete:", error);
      toast.error("Erro ao preparar lembrete");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <button
      onClick={handleSendReminder}
      disabled={isSending}
      className="text-green-600 hover:text-green-800 focus:outline-none"
      title="Enviar lembrete de consulta"
    >
      {isSending ? (
        <FontAwesomeIcon icon={faSpinner} className="h-5 w-5 animate-spin" />
      ) : (
        <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
      )}
    </button>
  );
}
