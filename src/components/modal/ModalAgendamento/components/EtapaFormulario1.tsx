import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import { PropsCampoFormulario } from "../types";

/**
 * Componente da primeira etapa do formulário (dados pessoais)
 */
export const EtapaFormulario1 = ({
  dadosFormulario,
  erros,
  camposModificados,
  carregando,
  handleChange,
  handleBlur,
}: PropsCampoFormulario) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-headline mb-1">
          Nome Completo
        </label>
        <div className="relative">
          <FontAwesomeIcon
            icon={faUser}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-dark-blue w-5 h-5"
          />
          <input
            type="text"
            name="name"
            value={dadosFormulario.name}
            onChange={handleChange}
            onBlur={() => handleBlur("name")}
            className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-primary-beige ${
              erros.name && camposModificados.name
                ? "border-red-500"
                : "border-off-white"
            }`}
            placeholder="Digite seu nome"
            disabled={carregando}
          />
        </div>
        {erros.name && camposModificados.name && (
          <p className="mt-1 text-sm text-red-500">{erros.name}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-headline mb-1">
          Telefone
        </label>
        <div className="relative">
          <FontAwesomeIcon
            icon={faPhone}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-dark-blue w-5 h-5"
          />
          <input
            type="tel"
            name="phone"
            value={dadosFormulario.phone}
            onChange={handleChange}
            onBlur={() => handleBlur("phone")}
            className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-primary-beige ${
              erros.phone && camposModificados.phone
                ? "border-red-500"
                : "border-off-white"
            }`}
            placeholder="(00) 00000-0000"
            disabled={carregando}
          />
        </div>
        {erros.phone && camposModificados.phone && (
          <p className="mt-1 text-sm text-red-500">{erros.phone}</p>
        )}
      </div>
      {/* Termo de consentimento */}
      <div className="flex items-start mt-4">
        <input
          type="checkbox"
          id="consent-agendamento"
          name="consent"
          checked={dadosFormulario.consent}
          onChange={handleChange}
          required
          className="mt-1 mr-2"
        />
        <label
          htmlFor="consent-agendamento"
          className="text-xs text-gray-600"
        >
          Li e concordo com a utilização dos meus dados para contato e agendamento, conforme a{" "}
          <a
            href="/politica-de-privacidade"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary-blue hover:text-primary-dark-blue"
          >
            Política de Privacidade
          </a>
          .
        </label>
      </div>
      {erros.consent && camposModificados.consent && (
        <p className="mt-1 text-xs text-red-500">{erros.consent}</p>
      )}
    </div>
  );
};
