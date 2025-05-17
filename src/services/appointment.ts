import { db } from "@/lib/firebase/config";
import { Appointment } from "@/lib/types/appointment";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

class AppointmentService {
  private appointmentsCollection = collection(db, "appointments");

  async checkAvailability(date: string, timeSlot: string): Promise<boolean> {
    try {
      const q = query(
        this.appointmentsCollection,
        where("date", "==", date),
        where("timeSlot", "==", timeSlot)
      );

      const snapshot = await getDocs(q);
      return snapshot.empty;
    } catch (error) {
      console.error("Erro ao verificar disponibilidade:", error);
      return false;
    }
  }

  async getAvailableTimeSlots(
    date: string,
    allTimeSlots: string[]
  ): Promise<string[]> {
    try {
      const q = query(this.appointmentsCollection, where("date", "==", date));

      const snapshot = await getDocs(q);
      const bookedTimeSlots = snapshot.docs.map(
        (doc) => doc.data().timeSlot as string
      );

      return allTimeSlots.filter((slot) => !bookedTimeSlots.includes(slot));
    } catch (error) {
      console.error("Erro ao buscar horários disponíveis:", error);
      return [];
    }
  }

  async createAppointment(appointmentData: Appointment): Promise<string> {
    try {
      // Prepara objeto com data de criação
      const appointment: Omit<Appointment, "id"> = {
        ...appointmentData,
        createdAt: new Date(),
      };

      // Adiciona documento usando timestamp do servidor
      const docRef = await addDoc(this.appointmentsCollection, {
        ...appointment,
        createdAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      throw error;
    }
  }

  async updateAppointment(id: string, appointmentData: Partial<Appointment>): Promise<void> {
    try {
      // Remove campos id e createdAt para evitar erros na atualização
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _, createdAt, ...dataToUpdate } = appointmentData;
      
      // Atualiza apenas os campos seguros
      const appointmentRef = doc(db, "appointments", id);
      await updateDoc(appointmentRef, dataToUpdate);
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      throw error;
    }
  }
  
  // Método para enviar lembretes de agendamento via WhatsApp
  async sendAppointmentReminder(appointment: Appointment): Promise<boolean> {
    try {
      // Formatar a data para exibição amigável
      const dateParts = appointment.date.split('-');
      const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      
      // Formatação do texto da mensagem
      const message = `Olá ${appointment.name}, este é um lembrete da sua consulta na Magna Odonto:\n\n📅 Data: ${formattedDate}\n🕐 Horário: ${appointment.timeSlot}\n🏥 Serviço: ${appointment.service}\n\nPor favor, confirme seu agendamento respondendo esta mensagem. Em caso de imprevisto, entre em contato para reagendamento.`;
      
      // Formatar o número de telefone (remover caracteres não numéricos)
      const phone = appointment.phone.replace(/\D/g, '');
      
      // URL do WhatsApp com a mensagem codificada
      const whatsappUrl = `https://api.whatsapp.com/send?phone=55${phone}&text=${encodeURIComponent(message)}`;
      
      // Abrir o WhatsApp Web ou app em uma nova janela
      window.open(whatsappUrl, '_blank');
      
      // Atualizar o documento para registrar que o lembrete foi enviado
      if (appointment.id) {
        const appointmentRef = doc(db, "appointments", appointment.id);
        await updateDoc(appointmentRef, {
          reminderSent: true,
          lastReminderDate: serverTimestamp()
        });
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao enviar lembrete:", error);
      return false;
    }
  }
}

export const appointmentService = new AppointmentService();