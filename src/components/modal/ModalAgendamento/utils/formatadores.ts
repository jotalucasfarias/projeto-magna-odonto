/**
 * Formata um número de telefone para o padrão brasileiro
 * @param valor Valor a ser formatado
 * @returns String com telefone formatado como (XX) XXXXX-XXXX
 */
export const formatarTelefone = (valor: string): string => {
  const numeros = valor.replace(/\D/g, "");

  if (numeros.length <= 11) {
    let telefone = "";
    if (numeros.length > 0) {
      telefone = `(${numeros.slice(0, 2)}`;
      if (numeros.length > 2) {
        telefone += `) ${numeros.slice(2, 7)}`;
        if (numeros.length > 7) {
          telefone += `-${numeros.slice(7, 11)}`;
        }
      }
    }
    return telefone;
  }

  return valor;
};

/**
 * Formata uma data no formato YYYY-MM-DD para DD/MM/YYYY
 * @param dataString Data no formato YYYY-MM-DD
 * @returns Data formatada como DD/MM/YYYY
 */
export const formatarData = (dataString: string): string => {
  if (!dataString) return "";

  try {
    return new Date(dataString).toLocaleDateString("pt-BR");
  } catch {
    return dataString;
  }
};
