import { useState, useEffect } from "react";
import { appointmentService } from "@/services/appointment";
import { toast } from "react-hot-toast";
import { criarHorariosDisponiveis, verificarFeriado } from "../utils/utilsHorarios";
import type { TimeSlot } from "@/lib/types/appointment";

//Hook para gerenciar os horários disponíveis para agendamento
export const useHorariosDisponiveis = (dataSelecionada: string) => {
  const [horarios, setHorarios] = useState<TimeSlot[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [isHoliday, setIsHoliday] = useState(false);
  const [holidayDescription, setHolidayDescription] = useState("");

  useEffect(() => {
    const buscarHorarios = async () => {
      if (dataSelecionada) {
        setCarregando(true);
        try {
          // Verificar primeiro se é feriado ou dia especial
          const feriado = await verificarFeriado(dataSelecionada);
          setIsHoliday(feriado.isHoliday);
          setHolidayDescription(feriado.description || "");
          
          if (feriado.isHoliday) {
            // Se for feriado, retorna todos os horários como indisponíveis
            const todosHorarios = criarHorariosDisponiveis();
            setHorarios(todosHorarios.map(slot => ({
              ...slot,
              isAvailable: false
            })));
            
            toast.error(`Não há atendimento nesta data: ${feriado.description || "Fechamento especial"}`);
          } else {
            // Se não for feriado, procede normalmente
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
          }
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

  return { horarios, carregando, isHoliday, holidayDescription };
};
