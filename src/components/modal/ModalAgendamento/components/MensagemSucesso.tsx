import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons/faCircleCheck";
import { PropsMensagemSucesso } from "../types";

/** Componente exibido após agendamento bem-sucedido */
export const MensagemSucesso = ({ onClose }: PropsMensagemSucesso) => {
  return (
    <div className="text-center">
      <FontAwesomeIcon
        icon={faCircleCheck}
        className="w-20 h-20 text-green-500 mx-auto mb-4"
      />
      <h2 className="text-2xl font-bold text-green-700 mb-4">
        Consulta confirmada com sucesso!
      </h2>
      <p className="text-green-600 mb-8">
        Caso precise cancelar, ligue para (69) 9960-2179.
      </p>
      <div className="mt-6">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
