import type { TimeSlot } from "@/lib/types/appointment";

/**
 * Gera os horários disponíveis para agendamento, das 8h às 18h
 */
export const criarHorariosDisponiveis = (): TimeSlot[] => {
  const horarios: TimeSlot[] = [];
  for (let hora = 8; hora <= 18; hora++) {
    horarios.push({
      id: `${hora}:00`,
      time: `${hora}:00`,
      isAvailable: true,
    });
  }
  return horarios;
};

/**
 * Verifica se uma data é válida para agendamento
 * @param dataString Data no formato YYYY-MM-DD
 * @returns Objeto com status de validade e mensagem de erro
 */
export const validarData = (
  dataString: string
): { isValid: boolean; message?: string } => {
  if (!dataString) {
    return { isValid: false, message: "Selecione uma data" };
  }

  // Cria uma data a partir dos componentes para evitar problemas de fuso horário
  const partesData = dataString.split("-");
  const ano = parseInt(partesData[0]);
  const mes = parseInt(partesData[1]) - 1; // Mês em JS começa em 0
  const dia = parseInt(partesData[2]);

  const data = new Date(ano, mes, dia);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  if (data < hoje) {
    return { isValid: false, message: "A data não pode ser no passado" };
  }

  // 0=domingo, 1=segunda, ..., 6=sábado
  const diaSemana = data.getDay();
  if (diaSemana === 0 || diaSemana === 6) {
    return { isValid: false, message: "Não atendemos aos finais de semana" };
  }

  return { isValid: true };
};
