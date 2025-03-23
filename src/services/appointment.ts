import { db } from "@/lib/firebase/config";
import { Appointment } from "@/lib/types/appointment";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

// Serviço para gerenciar agendamentos
class AppointmentService {
  // Coleção de agendamentos no Firestore
  private appointmentsCollection = collection(db, "appointments");

  // Verifica se um horário específico está disponível
  async checkAvailability(date: string, timeSlot: string): Promise<boolean> {
    try {
      // Consulta o Firebase para verificar se já existe agendamento nesse horário
      const q = query(
        this.appointmentsCollection,
        where("date", "==", date),
        where("timeSlot", "==", timeSlot)
      );

      const snapshot = await getDocs(q);

      // Se não houver agendamentos, o horário está disponível
      return snapshot.empty;
    } catch (error) {
      console.error("Erro ao verificar disponibilidade:", error);
      // Em caso de erro, assumimos que o horário não está disponível por segurança
      return false;
    }
  }

  // Busca os horários disponíveis para uma data específica
  async getAvailableTimeSlots(
    date: string,
    allTimeSlots: string[]
  ): Promise<string[]> {
    try {
      // Busca todos os agendamentos para a data selecionada
      const q = query(this.appointmentsCollection, where("date", "==", date));

      const snapshot = await getDocs(q);

      // Extrai os horários já agendados
      const bookedTimeSlots = snapshot.docs.map(
        (doc) => doc.data().timeSlot as string
      );

      // Filtra os horários disponíveis (remove os já agendados)
      return allTimeSlots.filter((slot) => !bookedTimeSlots.includes(slot));
    } catch (error) {
      console.error("Erro ao buscar horários disponíveis:", error);
      return [];
    }
  }

  // Cria um novo agendamento
  async createAppointment(appointmentData: any): Promise<string> {
    try {
      // Prepara os dados para salvar no Firebase
      const appointment: Omit<Appointment, "id"> = {
        ...appointmentData,
        createdAt: new Date(),
      };

      // Adiciona o documento no Firestore
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
}

// Exporta uma instância do serviço
export const appointmentService = new AppointmentService();
