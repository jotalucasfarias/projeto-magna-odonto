import { useState, useEffect } from "react";
import { appointmentService } from "@/services/appointment";
import { toast } from "react-hot-toast";
import { criarHorariosDisponiveis } from "../utils/utilsHorarios";
import type { TimeSlot } from "@/lib/types/appointment";

//Hook para gerenciar os horários disponíveis para agendamento
export const useHorariosDisponiveis = (dataSelecionada: string) => {
  const [horarios, setHorarios] = useState<TimeSlot[]>([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const buscarHorarios = async () => {
      if (dataSelecionada) {
        setCarregando(true);
        try {
          const todosHorarios = criarHorariosDisponiveis().map(
            (slot) => slot.time
          );
          const horariosLivres = await appointmentService.getAvailableTimeSlots(
            dataSelecionada,
            todosHorarios
          );

          setHorarios(
            todosHorarios.map((time) => ({
              id: time,
              time,
              isAvailable: horariosLivres.includes(time),
            }))
          );
        } catch (error) {
          toast.error("Erro ao carregar horários disponíveis");
          console.error("Erro ao buscar horários:", error);
        } finally {
          setCarregando(false);
        }
      } else {
        setHorarios([]);
      }
    };

    buscarHorarios();
  }, [dataSelecionada]);

  return { horarios, carregando };
};
