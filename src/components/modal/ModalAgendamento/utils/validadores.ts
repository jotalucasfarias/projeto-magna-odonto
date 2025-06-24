import { validarData } from "./utilsHorarios";
import type { DadosFormulario, ErrosValidacao } from "../types";

/**
 * Valida o campo nome
 */
export const validarNome = (nome: string): string | undefined => {
  if (!nome.trim()) {
    return "Nome é obrigatório";
  } else if (nome.trim().length < 3) {
    return "Nome deve ter pelo menos 3 caracteres";
  }
  return undefined;
};

/**
 * Valida o campo telefone
 */
export const validarTelefone = (telefone: string): string | undefined => {
  const digitos = telefone.replace(/\D/g, "");
  if (!telefone) {
    return "Telefone é obrigatório";
  } else if (digitos.length !== 11) {
    return "Telefone deve ter 11 dígitos (DDD + número)";
  }
  return undefined;
};

/**
 * Valida o campo serviço
 */
export const validarServico = (servico: string): string | undefined => {
  if (!servico) {
    return "Selecione um serviço";
  }
  return undefined;
};

/**
 * Valida o campo data
 */
export const validarCampoData = async (data: string): Promise<string | undefined> => {
  const validacao = await validarData(data);
  return validacao.isValid ? undefined : validacao.message;
};

/**
 * Valida o campo horário
 */
export const validarHorario = (horario: string): string | undefined => {
  if (!horario) {
    return "Selecione um horário";
  }
  return undefined;
};

/**
 * Valida o campo consentimento
 */
export const validarConsentimento = (consent: boolean): string | undefined => {
  if (!consent) {
    return "É necessário aceitar o termo de consentimento para continuar";
  }
  return undefined;
};

/**
 * Valida um campo específico do formulário
 */
export const validarCampo = async (
  campo: string,
  dadosFormulario: DadosFormulario
): Promise<string | undefined> => {
  switch (campo) {
    case "name":
      return validarNome(dadosFormulario.name);
    case "phone":
      return validarTelefone(dadosFormulario.phone);
    case "service":
      return validarServico(dadosFormulario.service);
    case "date":
      return await validarCampoData(dadosFormulario.date);
    case "timeSlot":
      return validarHorario(dadosFormulario.timeSlot);
    case "consent":
      return validarConsentimento(dadosFormulario.consent);
    default:
      return undefined;
  }
};

/**
 * Valida os campos necessários para uma etapa específica do formulário
 */
export const validarCamposEtapa = async (
  etapa: number,
  dadosFormulario: DadosFormulario
): Promise<ErrosValidacao> => {
  const erros: ErrosValidacao = {};

  if (etapa === 1) {
    const erroNome = validarNome(dadosFormulario.name);
    if (erroNome) erros.name = erroNome;

    const erroTelefone = validarTelefone(dadosFormulario.phone);
    if (erroTelefone) erros.phone = erroTelefone;

    const erroConsent = validarConsentimento(dadosFormulario.consent);
    if (erroConsent) erros.consent = erroConsent;
  } else if (etapa === 2) {
    const erroServico = validarServico(dadosFormulario.service);
    if (erroServico) erros.service = erroServico;

    const erroData = await validarCampoData(dadosFormulario.date);
    if (erroData) erros.date = erroData;

    const erroHorario = validarHorario(dadosFormulario.timeSlot);
    if (erroHorario) erros.timeSlot = erroHorario;
  }

  return erros;
};
