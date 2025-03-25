import { useState, ChangeEvent, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { appointmentService } from "@/services/appointment";
import { toast } from "react-hot-toast";
import type { TimeSlot } from "@/lib/types/appointment";
import {
  faClock,
  faMessage,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons/faCircleCheck";

interface FormData {
  name: string;
  phone: string;
  service: string;
  date: string;
  timeSlot: string;
  message: string;
}

interface ValidationErrors {
  name?: string;
  phone?: string;
  service?: string;
  date?: string;
  timeSlot?: string;
}

interface AppointmentModalProps {
  onClose: () => void;
}

const services = [
  "Ortodontia",
  "Implantes Dentários",
  "Clínica Geral",
  "Endodontia",
  "Próteses Dentárias",
  "Lentes de Contato",
] as const;

const makeTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 8; hour <= 18; hour++) {
    slots.push({
      id: `${hour}:00`,
      time: `${hour}:00`,
      isAvailable: true,
    });
  }
  return slots;
};

export default function AppointmentModal({ onClose }: AppointmentModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    service: "",
    date: "",
    timeSlot: "",
    message: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Carrega horários disponíveis quando a data muda
  useEffect(() => {
    const getSlots = async () => {
      if (selectedDate) {
        setLoading(true);
        try {
          const allTimes = makeTimeSlots().map((slot) => slot.time);
          const freeTimes = await appointmentService.getAvailableTimeSlots(
            selectedDate,
            allTimes
          );

          setSlots(
            allTimes.map((time) => ({
              id: time,
              time,
              isAvailable: freeTimes.includes(time),
            }))
          );
        } catch (error) {
          toast.error("Erro ao carregar horários disponíveis");
          console.error("Erro ao buscar horários:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    getSlots();
  }, [selectedDate]);

  // Valida os dados do formulário a cada alteração
  useEffect(() => {
    checkField();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "date") {
      setSelectedDate(value);
    }

    setTouched({ ...touched, [name]: true });

    // Campo de telefone - permite apenas números e formatação
    if (name === "phone") {
      const numbers = value.replace(/\D/g, "");
      if (numbers.length <= 11) {
        // Formata o número de telefone como (XX) XXXXX-XXXX
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
        setFormData({ ...formData, [name]: phone });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const checkField = (field?: string): boolean => {
    const newErrors: ValidationErrors = {};
    let valid = true;

    const fieldsToCheck = field
      ? [field]
      : Object.keys(touched).filter((f) => touched[f]);

    fieldsToCheck.forEach((field) => {
      switch (field) {
        case "name":
          if (!formData.name.trim()) {
            newErrors.name = "Nome é obrigatório";
            valid = false;
          } else if (formData.name.trim().length < 3) {
            newErrors.name = "Nome deve ter pelo menos 3 caracteres";
            valid = false;
          }
          break;

        case "phone":
          const digits = formData.phone.replace(/\D/g, "");
          if (!formData.phone) {
            newErrors.phone = "Telefone é obrigatório";
            valid = false;
          } else if (digits.length !== 11) {
            newErrors.phone = "Telefone deve ter 11 dígitos (DDD + número)";
            valid = false;
          }
          break;

        case "service":
          if (!formData.service) {
            newErrors.service = "Selecione um serviço";
            valid = false;
          }
          break;

        case "date":
          if (!formData.date) {
            newErrors.date = "Selecione uma data";
            valid = false;
          } else {
            const date = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (date < today) {
              newErrors.date = "A data não pode ser no passado";
              valid = false;
            } else {
              // Verifica se é fim de semana
              const day = date.getDay();
              if (day === 0 || day === 6) {
                newErrors.date = "Não atendemos aos finais de semana";
                valid = false;
              }
            }
          }
          break;

        case "timeSlot":
          if (!formData.timeSlot) {
            newErrors.timeSlot = "Selecione um horário";
            valid = false;
          }
          break;
      }
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return valid;
  };

  const checkForm = (): boolean => {
    // Marca todos os campos da etapa atual como tocados
    const fieldsToMark: Record<string, boolean> = {};

    if (step === 1) {
      fieldsToMark.name = true;
      fieldsToMark.phone = true;
    } else if (step === 2) {
      fieldsToMark.service = true;
      fieldsToMark.date = true;
      fieldsToMark.timeSlot = true;
    }

    setTouched((prev) => ({ ...prev, ...fieldsToMark }));

    // Valida todos os campos da etapa atual
    const stepFields = Object.keys(fieldsToMark);
    let valid = true;

    stepFields.forEach((field) => {
      if (!checkField(field)) {
        valid = false;
      }
    });

    if (!valid) {
      // Mostra mensagem de erro
      const errorList = Object.values(errors).filter(Boolean);
      if (errorList.length > 0) {
        toast.error(errorList[0]);
      } else {
        toast.error("Por favor, corrija os campos destacados");
      }
    }

    return valid;
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    checkField(field);
  };

  const goNext = () => {
    if (checkForm() && step < 3) {
      setStep(step + 1);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const submitForm = async () => {
    if (!checkForm()) return;

    setLoading(true);
    try {
      // Verifica disponibilidade antes de criar
      const available = await appointmentService.checkAvailability(
        formData.date,
        formData.timeSlot
      );

      if (!available) {
        toast.error("Este horário já foi reservado. Por favor, escolha outro.");
        setStep(2);
        return;
      }

      // Cria agendamento no Firebase
      await appointmentService.createAppointment(formData);

      // Marca como confirmado
      setSuccess(true);
      toast.success("Consulta agendada com sucesso!");
    } catch (error) {
      toast.error("Erro ao agendar consulta. Tente novamente.");
      console.error("Erro ao criar agendamento:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div
        className={`${
          success ? "bg-green-50" : "bg-white"
        } rounded-lg shadow-xl max-w-md w-full p-6 relative`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-paragraph hover:text-primary-dark-blue"
        >
          <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
        </button>

        {!success ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-primary-blue">
                Agende sua Consulta
              </h2>
              <p className="text-gray-paragraph">
                {loading
                  ? "Carregando..."
                  : "Preencha os dados para agendamento"}
              </p>
            </div>

            {/* Progresso do andamento do agendamento */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step >= num
                          ? "bg-primary-blue text-white"
                          : "bg-primary-light-blue text-primary-dark-blue"
                      }`}
                    >
                      {num}
                    </div>
                    {num < 3 && (
                      <div className="w-24 h-1 mx-2">
                        <div
                          className={`h-full ${
                            step > num
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

            {/* Aba 1 */}
            {step === 1 && (
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
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur("name")}
                      className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-primary-beige ${
                        errors.name && touched.name
                          ? "border-red-500"
                          : "border-off-white"
                      }`}
                      placeholder="Digite seu nome"
                      disabled={loading}
                    />
                  </div>
                  {errors.name && touched.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
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
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur("phone")}
                      className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-primary-beige ${
                        errors.phone && touched.phone
                          ? "border-red-500"
                          : "border-off-white"
                      }`}
                      placeholder="(00) 00000-0000"
                      disabled={loading}
                    />
                  </div>
                  {errors.phone && touched.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>
            )}

            {/* Aba 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-headline mb-1">
                    Serviço Desejado
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    onBlur={() => handleBlur("service")}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-primary-beige ${
                      errors.service && touched.service
                        ? "border-red-500"
                        : "border-off-white"
                    }`}
                    disabled={loading}
                  >
                    <option value="">Selecione um serviço</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                  {errors.service && touched.service && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.service}
                    </p>
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
                      value={formData.date}
                      onChange={handleChange}
                      onBlur={() => handleBlur("date")}
                      min={new Date().toISOString().split("T")[0]}
                      className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-primary-beige ${
                        errors.date && touched.date
                          ? "border-red-500"
                          : "border-off-white"
                      }`}
                      disabled={loading}
                    />
                  </div>
                  {errors.date && touched.date && (
                    <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                  )}
                </div>
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-headline mb-1">
                      Horário Disponível
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {slots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => {
                            setFormData({ ...formData, timeSlot: slot.time });
                            setTouched({
                              ...touched,
                              timeSlot: true,
                            });
                          }}
                          className={`p-2 rounded-lg text-sm ${
                            formData.timeSlot === slot.time
                              ? "bg-primary-blue text-white"
                              : "bg-primary-light-blue text-primary-dark-blue hover:bg-primary-blue hover:text-white"
                          } ${
                            !slot.isAvailable || loading
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={!slot.isAvailable || loading}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                    {errors.timeSlot && touched.timeSlot && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.timeSlot}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Aba 3 */}
            {step === 3 && (
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
                      value={formData.message}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border border-off-white rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-primary-beige outline-none"
                      placeholder="Alguma observação importante?"
                      rows={4}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Resumo da consulta */}
                <div className="mt-4 p-4 bg-primary-light-blue rounded-lg">
                  <h3 className="font-medium text-primary-dark-blue mb-2">
                    Resumo da Consulta
                  </h3>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <span className="font-medium">Nome:</span> {formData.name}
                    </li>
                    <li>
                      <span className="font-medium">Telefone:</span>{" "}
                      {formData.phone}
                    </li>
                    <li>
                      <span className="font-medium">Serviço:</span>{" "}
                      {formData.service}
                    </li>
                    <li>
                      <span className="font-medium">Data:</span>{" "}
                      {formData.date &&
                        new Date(formData.date).toLocaleDateString("pt-BR")}
                    </li>
                    <li>
                      <span className="font-medium">Horário:</span>{" "}
                      {formData.timeSlot}
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Botões de Navegação */}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  onClick={goBack}
                  className="px-4 py-2 border border-primary-blue text-primary-blue rounded-lg hover:bg-primary-light-blue"
                  disabled={loading}
                >
                  Voltar
                </button>
              )}
              <button
                onClick={step < 3 ? goNext : submitForm}
                disabled={loading}
                className={`px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-hover-blue ${
                  step === 1 ? "ml-auto" : ""
                }`}
              >
                {loading ? (
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
                ) : step < 3 ? (
                  "Próximo"
                ) : (
                  "Confirmar Agendamento"
                )}
              </button>
            </div>
          </>
        ) : (
          // Tela de confirmação (nova interface após agendamento confirmado)
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
        )}
      </div>
    </div>
  );
}
