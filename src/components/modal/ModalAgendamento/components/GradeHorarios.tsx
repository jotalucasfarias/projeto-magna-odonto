import { PropsGradeHorarios } from "../types";

/**Componente de grid de horários disponíveis */
export const GradeHorarios = ({
  horarios,
  horarioSelecionado,
  onSelecionarHorario,
  carregando,
}: PropsGradeHorarios) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {horarios.map((horario) => (
        <button
          key={horario.id}
          onClick={() => onSelecionarHorario(horario.time)}
          className={`p-2 rounded-lg text-sm ${
            horarioSelecionado === horario.time
              ? "bg-primary-blue text-white"
              : "bg-primary-light-blue text-primary-dark-blue hover:bg-primary-blue hover:text-white"
          } ${
            !horario.isAvailable || carregando
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={!horario.isAvailable || carregando}
        >
          {horario.time}
        </button>
      ))}
    </div>
  );
};
