import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { SERVICOS, PropsEtapaFormulario } from "../types";
import { GradeHorarios } from "./GradeHorarios";

/**
 * Componente da segunda etapa do formulário (serviço, data e horário)
 */
export const EtapaFormulario2 = ({
  dadosFormulario,
  erros,
  camposModificados,
  carregando,
  handleChange,
  handleBlur,
  dataSelecionada,
  horarios,
}: PropsEtapaFormulario) => {
  // Função para selecionar horário
  const selecionarHorario = (horario: string) => {
    const evento = {
      target: { name: "timeSlot", value: horario },
    } as React.ChangeEvent<HTMLInputElement>;

    handleChange(evento);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-headline mb-1">
          Serviço Desejado
        </label>
        <select
          name="service"
          value={dadosFormulario.service}
          onChange={handleChange}
          onBlur={() => handleBlur("service")}
          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-primary-beige ${
            erros.service && camposModificados.service
              ? "border-red-500"
              : "border-off-white"
          }`}
          disabled={carregando}
        >
          <option value="">Selecione um serviço</option>
          {SERVICOS.map((servico) => (
            <option key={servico} value={servico}>
              {servico}
            </option>
          ))}
        </select>
        {erros.service && camposModificados.service && (
          <p className="mt-1 text-sm text-red-500">{erros.service}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-headline mb-1">
          Data da Consulta
        </label>
        <div className="relative">
          <FontAwesomeIcon
            icon={faClock}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-dark-blue w-5 h-5"
          />
          <input
            type="date"
            name="date"
            value={dadosFormulario.date}
            onChange={handleChange}
            onBlur={() => handleBlur("date")}
            min={new Date().toISOString().split("T")[0]}
            className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-primary-beige ${
              erros.date && camposModificados.date
                ? "border-red-500"
                : "border-off-white"
            }`}
            disabled={carregando}
          />
        </div>
        {erros.date && camposModificados.date && (
          <p className="mt-1 text-sm text-red-500">{erros.date}</p>
        )}
      </div>
      {dataSelecionada && (
        <div>
          <label className="block text-sm font-medium text-gray-headline mb-1">
            Horário Disponível
          </label>
          <GradeHorarios
            horarios={horarios}
            horarioSelecionado={dadosFormulario.timeSlot}
            onSelecionarHorario={selecionarHorario}
            carregando={carregando}
          />
          {erros.timeSlot && camposModificados.timeSlot && (
            <p className="mt-1 text-sm text-red-500">{erros.timeSlot}</p>
          )}
        </div>
      )}
    </div>
  );
};
