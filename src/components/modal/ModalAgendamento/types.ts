import { TimeSlot } from "@/lib/types/appointment";

export interface DadosFormulario {
  name: string;
  phone: string;
  service: string;
  date: string;
  timeSlot: string;
  message: string;
  consent: boolean;
}

export interface ErrosValidacao {
  name?: string;
  phone?: string;
  service?: string;
  date?: string;
  timeSlot?: string;
  consent?: string;
}

export interface PropsModalAgendamento {
  onClose: () => void;
}

// Lista de serviços odontológicos oferecidos
export const SERVICOS = [
  "Ortodontia",
  "Implantes Dentários",
  "Avaliação Odontológica",
  "Endodontia",
  "Próteses Dentárias",
  "Gengivoplastia",
] as const;

export type TipoServico = typeof SERVICOS[number];

export interface PropsCampoFormulario {
  dadosFormulario: DadosFormulario;
  erros: ErrosValidacao;
  camposModificados: Record<string, boolean>;
  carregando: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (campo: string) => void;
}

export interface PropsGradeHorarios {
  horarios: TimeSlot[];
  horarioSelecionado: string;
  onSelecionarHorario: (horario: string) => void;
  carregando: boolean;
}

export interface PropsIndicadorProgresso {
  etapaAtual: number;
  totalEtapas: number;
}

export interface PropsEtapaFormulario extends PropsCampoFormulario {
  dataSelecionada: string;
  horarios: TimeSlot[];
}

export interface PropsMensagemSucesso {
  onClose: () => void;
}
