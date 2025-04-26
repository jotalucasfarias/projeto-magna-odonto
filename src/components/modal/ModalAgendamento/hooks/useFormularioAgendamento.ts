
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { appointmentService } from "@/services/appointment";
import { formatarTelefone } from "../utils/formatadores";
import { validarCampo, validarCamposEtapa } from "../utils/validadores";
import type { DadosFormulario, ErrosValidacao } from "../types";

/** Hook para gerenciar o estado e a lógica do formulário de agendamento */
export const useFormularioAgendamento = () => {
  const [etapa, setEtapa] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [dadosFormulario, setDadosFormulario] = useState<DadosFormulario>({
    name: "",
    phone: "",
    service: "",
    date: "",
    timeSlot: "",
    message: "",
  });
  const [erros, setErros] = useState<ErrosValidacao>({});
  const [dataSelecionada, setDataSelecionada] = useState<string>("");
  const [camposModificados, setCamposModificados] = useState<Record<string, boolean>>({});

  /** Valida um campo específico */
  const validarCampoFormulario = useCallback((campo: string): boolean => {
    const erro = validarCampo(campo, dadosFormulario);

    setErros(prev => {
      const novosErros = { ...prev };
      if (erro) {
        novosErros[campo as keyof ErrosValidacao] = erro;
      } else {
        delete novosErros[campo as keyof ErrosValidacao];
      }
      return novosErros;
    });

    return !erro;
  }, [dadosFormulario]);

  /** Verifica campos quando dadosFormulario ou camposModificados mudam */
  useEffect(() => {
    Object.keys(camposModificados)
      .filter(campo => camposModificados[campo])
      .forEach(campo => validarCampoFormulario(campo));
  }, [camposModificados, validarCampoFormulario]);

  /** Manipula mudanças nos campos do formulário */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "date") {
      setDataSelecionada(value);
    }

    setCamposModificados(prev => ({ ...prev, [name]: true }));

    if (name === "phone") {
      setDadosFormulario(prev => ({
        ...prev,
        [name]: formatarTelefone(value),
      }));
    } else {
      setDadosFormulario(prev => ({ ...prev, [name]: value }));
    }
  };

  /** Marca um campo como modificado e o valida */
  const handleBlur = (campo: string) => {
    setCamposModificados(prev => ({ ...prev, [campo]: true }));
    validarCampoFormulario(campo);
  };

  /** Valida todos os campos da etapa atual */
  const validarEtapaAtual = (): boolean => {
    const camposParaValidar =
      etapa === 1
        ? ["name", "phone"]
        : etapa === 2
        ? ["service", "date", "timeSlot"]
        : [];

    const novosCamposModificados = { ...camposModificados };
    camposParaValidar.forEach(campo => {
      novosCamposModificados[campo] = true;
    });
    setCamposModificados(novosCamposModificados);

    const errosEtapa = validarCamposEtapa(etapa, dadosFormulario);
    setErros(errosEtapa);

    const temErros = Object.keys(errosEtapa).length > 0;
    if (temErros) {
      const primeiroErro = Object.values(errosEtapa)[0];
      if (primeiroErro) {
        toast.error(primeiroErro);
      }
    }

    return !temErros;
  };

  // Avança para a próxima etapa
  const avancarEtapa = () => {
    if (validarEtapaAtual() && etapa < 3) {
      setEtapa(prev => prev + 1);
    }
  };

  // Retorna para a etapa anterior
  const voltarEtapa = () => {
    if (etapa > 1) {
      setEtapa(prev => prev - 1);
    }
  };

  // Submete o formulário
  const enviarFormulario = async () => {
    if (!validarEtapaAtual()) return;

    setCarregando(true);
    try {
      const disponivel = await appointmentService.checkAvailability(
        dadosFormulario.date,
        dadosFormulario.timeSlot
      );

      if (!disponivel) {
        toast.error("Este horário já foi reservado. Por favor, escolha outro.");
        setEtapa(2);
        return;
      }

      await appointmentService.createAppointment({
        ...dadosFormulario,
        createdAt: new Date(),
      });
      setSucesso(true);
      toast.success("Consulta agendada com sucesso!");
    } catch (error) {
      toast.error("Erro ao agendar consulta. Tente novamente.");
      console.error("Erro ao criar agendamento:", error);
    } finally {
      setCarregando(false);
    }
  };

  // Seleciona horário
  const selecionarHorario = (horario: string) => {
    setDadosFormulario(prev => ({ ...prev, timeSlot: horario }));
    setCamposModificados(prev => ({ ...prev, timeSlot: true }));
  };

  return {
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
    selecionarHorario,
  };
};