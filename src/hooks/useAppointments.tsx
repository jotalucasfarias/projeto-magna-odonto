import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  where,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { AdminAppointment } from "@/types/admin";

export function useAppointments() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [services, setServices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const appointmentsRef = collection(db, "appointments");
      const q = query(appointmentsRef, orderBy("date", "asc"));
      const querySnapshot = await getDocs(q);

      const appointmentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AdminAppointment[];

      setAppointments(appointmentsData);

      // Extract unique services list for report filters
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
        await fetchAppointments();
      } catch (err) {
        console.error("Erro ao deletar agendamento:", err);
      }
    }
  };

  const filterAppointmentsByDate = (appointments: AdminAppointment[]) => {
    return appointments.filter((app) => app.date === selectedDate);
  };

  // Custom function for report generation
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

      // Filter by period
      if (reportType === "daily") {
        constraints.push(where("date", "==", startDate));
      } else {
        constraints.push(where("date", ">=", startDate));
        constraints.push(where("date", "<=", endDate));
      }

      // Build the query with filters
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

      // Additional filter by service (if not "all")
      if (selectedService !== "todos") {
        filteredData = filteredData.filter(
          (app) => app.service === selectedService
        );
      }

      setIsLoading(false);
      return filteredData;
    } catch (err) {
      console.error("Erro ao gerar relatório:", err);
      setIsLoading(false);
      return [];
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

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
    generateReport
  };
}
