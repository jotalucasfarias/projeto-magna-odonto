import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useFormularioAgendamento } from "./hooks/useFormularioAgendamento";
import { useHorariosDisponiveis } from "./hooks/useHorariosDisponiveis";
import { IndicadorProgresso } from "./components/IndicadorProgresso";
import { EtapaFormulario1 } from "./components/EtapaFormulario1";
import { EtapaFormulario2 } from "./components/EtapaFormulario2";
import { EtapaFormulario3 } from "./components/EtapaFormulario3";
import { MensagemSucesso } from "./components/MensagemSucesso";
import type { PropsModalAgendamento } from "./types";

//Modal de agendamento de consultas
export default function ModalAgendamento({ onClose }: PropsModalAgendamento) {
  const {
    etapa,
    carregando,
    sucesso,
    dadosFormulario,
    erros,
    camposModificados,
    dataSelecionada,
    handleChange,
    handleBlur,
    avancarEtapa,
    voltarEtapa,
    enviarFormulario,
  } = useFormularioAgendamento();

  const { horarios } = useHorariosDisponiveis(dataSelecionada);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div
        className={`${
          sucesso ? "bg-green-50" : "bg-white"
        } rounded-lg shadow-xl max-w-md w-full p-6 relative`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-paragraph hover:text-primary-dark-blue"
        >
          <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
        </button>

        {!sucesso ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-primary-blue">
                Agende sua Consulta
              </h2>
              <p className="text-gray-paragraph">
                {carregando
                  ? "Carregando..."
                  : "Preencha os dados para agendamento"}
              </p>
            </div>

            {/* Indicador de progresso */}
            <IndicadorProgresso etapaAtual={etapa} totalEtapas={3} />

            {/* Formulário multi-etapas */}
            {etapa === 1 && (
              <EtapaFormulario1
                dadosFormulario={dadosFormulario}
                erros={erros}
                camposModificados={camposModificados}
                carregando={carregando}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            )}

            {etapa === 2 && (
              <EtapaFormulario2
                dadosFormulario={dadosFormulario}
                erros={erros}
                camposModificados={camposModificados}
                carregando={carregando}
                handleChange={handleChange}
                handleBlur={handleBlur}
                dataSelecionada={dataSelecionada}
                horarios={horarios}
              />
            )}

            {etapa === 3 && (
              <EtapaFormulario3
                dadosFormulario={dadosFormulario}
                erros={erros}
                camposModificados={camposModificados}
                carregando={carregando}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            )}

            {/* Botões de navegação */}
            <div className="flex justify-between mt-6">
              {etapa > 1 && (
                <button
                  onClick={voltarEtapa}
                  className="px-4 py-2 border border-primary-blue text-primary-blue rounded-lg hover:bg-primary-light-blue"
                  disabled={carregando}
                >
                  Voltar
                </button>
              )}
              <button
                onClick={etapa < 3 ? avancarEtapa : enviarFormulario}
                disabled={carregando}
                className={`px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-hover-blue ${
                  etapa === 1 ? "ml-auto" : ""
                }`}
              >
                {carregando ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Processando...
                  </span>
                ) : etapa < 3 ? (
                  "Próximo"
                ) : (
                  "Confirmar Agendamento"
                )}
              </button>
            </div>
          </>
        ) : (
          <MensagemSucesso onClose={onClose} />
        )}
      </div>
    </div>
  );
}
