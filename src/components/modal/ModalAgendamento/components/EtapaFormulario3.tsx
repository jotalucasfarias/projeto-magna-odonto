import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { PropsCampoFormulario } from "../types";
import { formatarData } from "../utils/formatadores";

/**
 * Componente da terceira etapa do formulário (mensagem e resumo)
 */
export const EtapaFormulario3 = ({
  dadosFormulario,
  carregando,
  handleChange,
}: PropsCampoFormulario) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-headline mb-1">
          Mensagem Adicional
        </label>
        <div className="relative">
          <FontAwesomeIcon
            icon={faMessage}
            className="absolute left-3 top-3 text-primary-dark-blue w-5 h-5"
          />
          <textarea
            name="message"
            value={dadosFormulario.message}
            onChange={handleChange}
            className="pl-10 w-full p-2 border border-off-white rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-primary-beige outline-none"
            placeholder="Alguma observação importante?"
            rows={4}
            disabled={carregando}
          />
        </div>
      </div>

      {/* Resumo dos dados da consulta */}
      <div className="mt-4 p-4 bg-primary-light-blue rounded-lg">
        <h3 className="font-medium text-primary-dark-blue mb-2">
          Resumo da Consulta
        </h3>
        <ul className="space-y-1 text-sm">
          <li>
            <span className="font-medium">Nome:</span> {dadosFormulario.name}
          </li>
          <li>
            <span className="font-medium">Telefone:</span>{" "}
            {dadosFormulario.phone}
          </li>
          <li>
            <span className="font-medium">Serviço:</span>{" "}
            {dadosFormulario.service}
          </li>
          <li>
            <span className="font-medium">Data:</span>{" "}
            {formatarData(dadosFormulario.date)}
          </li>
          <li>
            <span className="font-medium">Horário:</span>{" "}
            {dadosFormulario.timeSlot}
          </li>
        </ul>
      </div>
    </div>
  );
};
