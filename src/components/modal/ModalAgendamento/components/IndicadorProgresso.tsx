import { PropsIndicadorProgresso } from "../types";

/** Componente que exibe o indicador de progresso do formulário */
export const IndicadorProgresso = ({
  etapaAtual,
  totalEtapas,
}: PropsIndicadorProgresso) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalEtapas }, (_, i) => i + 1).map((num) => (
          <div key={num} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                etapaAtual >= num
                  ? "bg-primary-blue text-white"
                  : "bg-primary-light-blue text-primary-dark-blue"
              }`}
            >
              {num}
            </div>
            {num < totalEtapas && (
              <div className="w-24 h-1 mx-2">
                <div
                  className={`h-full ${
                    etapaAtual > num
                      ? "bg-primary-blue"
                      : "bg-primary-light-blue"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
