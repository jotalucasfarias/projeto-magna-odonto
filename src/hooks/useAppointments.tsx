import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  deleteDoc,
  doc,
  where,
  QueryConstraint,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { AdminAppointment } from "@/types/admin";
import { appointmentService } from "@/services/appointment";
import { toast } from "react-hot-toast";

export function useAppointments() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [services, setServices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<AdminAppointment | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Escuta em tempo real os agendamentos
  useEffect(() => {
    setIsLoading(true);
    const appointmentsRef = collection(db, "appointments");
    const q = query(appointmentsRef, orderBy("date", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let appointmentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AdminAppointment[];

      // Ordena por timeSlot dentro do mesmo dia
      appointmentsData = appointmentsData.sort((a, b) => {
        if (a.date === b.date) {
          return a.timeSlot.localeCompare(b.timeSlot);
        }
        return a.date.localeCompare(b.date);
      });

      setAppointments(appointmentsData);

      // Lista de serviços únicos para os filtros de relatório
      const uniqueServices = [
        ...new Set(appointmentsData.map((app) => app.service)),
      ];
      setServices(uniqueServices);
      setIsLoading(false);
    }, (err) => {
      console.error("Erro ao buscar agendamentos:", err);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Função manual para forçar atualização (pode ser útil para outros usos)
  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const appointmentsRef = collection(db, "appointments");
      const q = query(appointmentsRef, orderBy("date", "asc"));
      const querySnapshot = await getDocs(q);

      let appointmentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AdminAppointment[];

      // Ordena por timeSlot dentro do mesmo dia
      appointmentsData = appointmentsData.sort((a, b) => {
        if (a.date === b.date) {
          return a.timeSlot.localeCompare(b.timeSlot);
        }
        return a.date.localeCompare(b.date);
      });

      setAppointments(appointmentsData);

      const uniqueServices = [
        ...new Set(appointmentsData.map((app) => app.service)),
      ];
      setServices(uniqueServices);
      setIsLoading(false);
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
      setIsLoading(false);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (window.confirm("Tem certeza que deseja cancelar este agendamento?")) {
      try {
        await deleteDoc(doc(db, "appointments", id));
        // Não precisa chamar fetchAppointments, pois o onSnapshot já atualiza
      } catch (err) {
        console.error("Erro ao deletar agendamento:", err);
      }
    }
  };

  const filterAppointmentsByDate = (appointments: AdminAppointment[]) => {
    return appointments.filter((app) => app.date === selectedDate);
  };

  // Função para geração de relatórios (continua usando getDocs para filtros customizados)
  const generateReport = async (
    reportType: string,
    startDate: string,
    endDate: string,
    selectedService: string
  ) => {
    try {
      setIsLoading(true);

      const appointmentsRef = collection(db, "appointments");
      const constraints: QueryConstraint[] = [];

      // Filtros por período
      if (reportType === "daily") {
        constraints.push(where("date", "==", startDate));
      } else {
        constraints.push(where("date", ">=", startDate));
        constraints.push(where("date", "<=", endDate));
      }

      // Construir a consulta com os filtros
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

      // Filtro adicional por serviço
      if (selectedService !== "todos") {
        filteredData = filteredData.filter(
          (app) => app.service === selectedService
        );
      }

      // Ordena por timeSlot dentro do mesmo dia
      filteredData = filteredData.sort((a, b) => {
        if (a.date === b.date) {
          return a.timeSlot.localeCompare(b.timeSlot);
        }
        return a.date.localeCompare(b.date);
      });

      setIsLoading(false);
      return filteredData;
    } catch (err) {
      console.error("Erro ao gerar relatório:", err);
      setIsLoading(false);
      return [];
    }
  };

  const openEditModal = (appointment: AdminAppointment) => {
    setEditingAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingAppointment(null);
    setIsEditModalOpen(false);
  };

  const handleEditAppointment = async (updatedAppointment: AdminAppointment) => {
    if (!updatedAppointment.id) return;
    
    try {
      setIsLoading(true);
      
      if (editingAppointment && 
          (editingAppointment.date !== updatedAppointment.date || 
           editingAppointment.timeSlot !== updatedAppointment.timeSlot)) {
        const isAvailable = await appointmentService.checkAvailability(
          updatedAppointment.date, 
          updatedAppointment.timeSlot
        );
        
        if (!isAvailable) {
          toast.error("Este horário já está ocupado por outro agendamento");
          setIsLoading(false);
          return false;
        }
      }
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdAt, id, ...appointmentForUpdate } = updatedAppointment;
      
      await appointmentService.updateAppointment(updatedAppointment.id, appointmentForUpdate);
      
      // Não precisa atualizar manualmente appointments, pois o onSnapshot já faz isso
      toast.success("Agendamento atualizado com sucesso!");
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error("Erro ao atualizar agendamento:", err);
      toast.error("Erro ao atualizar agendamento");
      setIsLoading(false);
      return false;
    }
  };

  return {
    appointments,
    setAppointments,
    selectedDate,
    setSelectedDate,
    services,
    isLoading,
    fetchAppointments,
    handleDeleteAppointment,
    filterAppointmentsByDate,
    generateReport,
    editingAppointment,
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    handleEditAppointment
  };
}
