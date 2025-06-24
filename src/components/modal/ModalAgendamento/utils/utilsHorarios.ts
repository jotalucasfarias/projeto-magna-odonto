import type { TimeSlot } from "@/lib/types/appointment";

/**
 * Gera os horários disponíveis para agendamento
 * Horário de atendimento: Segunda a Sexta 08:00 às 11:30 / 14:00 às 18:00
 */
export const criarHorariosDisponiveis = (): TimeSlot[] => {
  const horarios: TimeSlot[] = [];
  
  // Período da manhã: 8:00 às 11:30
  for (let hora = 8; hora <= 11; hora++) {
    // Adiciona slots de 30 em 30 minutos
    horarios.push({
      id: `${hora}:00`,
      time: `${hora}:00`,
      isAvailable: true,
    });
    
    // Não adicionar 11:30 se for 11:30
    if (hora < 11) {
      horarios.push({
        id: `${hora}:30`,
        time: `${hora}:30`,
        isAvailable: true,
      });
    } else {
      // Para 11h, adicionar apenas o slot de 11:30
      horarios.push({
        id: `${hora}:30`,
        time: `${hora}:30`,
        isAvailable: true,
      });
    }
  }
  
  // Período da tarde: 14:00 às 18:00
  for (let hora = 14; hora <= 18; hora++) {
    horarios.push({
      id: `${hora}:00`,
      time: `${hora}:00`,
      isAvailable: true,
    });
    
    // Não adicionar 18:30
    if (hora < 18) {
      horarios.push({
        id: `${hora}:30`,
        time: `${hora}:30`,
        isAvailable: true,
      });
    }
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

  // Limite máximo: 30 dias a partir de hoje
  const limite = new Date(hoje);
  limite.setDate(limite.getDate() + 30);

  if (data < hoje) {
    return { isValid: false, message: "A data não pode ser no passado" };
  }

  if (data > limite) {
    return { isValid: false, message: "Só é possível agendar com até 30 dias de antecedência" };
  }

  // 0=domingo, 1=segunda, ..., 6=sábado
  const diaSemana = data.getDay();
  if (diaSemana === 0 || diaSemana === 6) {
    return { isValid: false, message: "Não atendemos aos finais de semana" };
  }

  return { isValid: true };
};
