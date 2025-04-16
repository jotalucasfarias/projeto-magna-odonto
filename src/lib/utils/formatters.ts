/**
 * Formata um número de telefone para o padrão brasileiro
 * @param value Valor a ser formatado
 * @returns String com telefone formatado como (XX) XXXXX-XXXX
 */
export const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, "");

  if (numbers.length <= 11) {
    let phone = "";
    if (numbers.length > 0) {
      phone = `(${numbers.slice(0, 2)}`;
      if (numbers.length > 2) {
        phone += `) ${numbers.slice(2, 7)}`;
        if (numbers.length > 7) {
          phone += `-${numbers.slice(7, 11)}`;
        }
      }
    }
    return phone;
  }

  return value;
};

/**
 * Formata uma data no formato YYYY-MM-DD para DD/MM/YYYY
 * @param dateString Data no formato YYYY-MM-DD
 * @returns Data formatada como DD/MM/YYYY
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  try {
    return new Date(dateString).toLocaleDateString("pt-BR");
  } catch {
    return dateString;
  }
};

/**
 * Valida um email
 * @param email Email a ser validado
 * @returns Boolean indicando se o email é válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
