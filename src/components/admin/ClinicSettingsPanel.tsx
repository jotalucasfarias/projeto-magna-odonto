import React, { useState, useEffect } from 'react';
import { useClinicSettings } from '@/hooks/useClinicSettings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faSpinner, faTrash, faPlus, faUndo } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';

type ClinicService = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
};

type SpecialClosureDate = {
  id: string;
  date: string;
  description: string;
};

export default function ClinicSettingsPanel() {
  const { settings, updateSettings, isLoading } = useClinicSettings();
  
  const [formData, setFormData] = useState({
    name: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      postalCode: '',
    },
    contact: {
      phone: '',
      whatsapp: '',
      email: '',
    },
    socialMedia: {
      instagram: '',
      facebook: '',
    },
    businessHours: {
      weekdaysStart: '',
      weekdaysEnd: '',
      weekdaysAfternoonStart: '',
      weekdaysAfternoonEnd: '',
      saturday: false,
      saturdayStart: '',
      saturdayEnd: '',
    },
    services: [] as ClinicService[],
    responsibleDentist: {
      name: '',
      cro: '',
    },
    specialClosures: [] as SpecialClosureDate[]
  });
  
  const [newClosureDate, setNewClosureDate] = useState('');
  const [newClosureDescription, setNewClosureDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState<typeof formData | null>(null);

  // Carregar dados iniciais
  useEffect(() => {
    if (settings && !isLoading) {
      setFormData({
        name: settings.name || '',
        address: {
          street: settings.address?.street || '',
          number: settings.address?.number || '',
          complement: settings.address?.complement || '',
          neighborhood: settings.address?.neighborhood || '',
          city: settings.address?.city || '',
          state: settings.address?.state || '',
          postalCode: settings.address?.postalCode || '',
        },
        contact: {
          phone: settings.contact?.phone || '',
          whatsapp: settings.contact?.whatsapp || '',
          email: settings.contact?.email || '',
        },
        socialMedia: {
          instagram: settings.socialMedia?.instagram || '',
          facebook: settings.socialMedia?.facebook || '',
        },
        businessHours: {
          weekdaysStart: settings.businessHours?.weekdaysStart || '',
          weekdaysEnd: settings.businessHours?.weekdaysEnd || '',
          weekdaysAfternoonStart: settings.businessHours?.weekdaysAfternoonStart || '',
          weekdaysAfternoonEnd: settings.businessHours?.weekdaysAfternoonEnd || '',
          saturday: settings.businessHours?.saturday || false,
          saturdayStart: settings.businessHours?.saturdayStart || '',
          saturdayEnd: settings.businessHours?.saturdayEnd || '',
        },
        services: settings.services || [],
        responsibleDentist: {
          name: settings.responsibleDentist?.name || '',
          cro: settings.responsibleDentist?.cro || '',
        },
        specialClosures: settings.specialClosures || [],
      });
      // Guardar cópia inicial para detectar alterações e permitir reset
      setInitialData({
        name: settings.name || '',
        address: {
          street: settings.address?.street || '',
          number: settings.address?.number || '',
          complement: settings.address?.complement || '',
          neighborhood: settings.address?.neighborhood || '',
          city: settings.address?.city || '',
          state: settings.address?.state || '',
          postalCode: settings.address?.postalCode || '',
        },
        contact: {
          phone: settings.contact?.phone || '',
          whatsapp: settings.contact?.whatsapp || '',
          email: settings.contact?.email || '',
        },
        socialMedia: {
          instagram: settings.socialMedia?.instagram || '',
          facebook: settings.socialMedia?.facebook || '',
        },
        businessHours: {
          weekdaysStart: settings.businessHours?.weekdaysStart || '',
          weekdaysEnd: settings.businessHours?.weekdaysEnd || '',
          weekdaysAfternoonStart: settings.businessHours?.weekdaysAfternoonStart || '',
          weekdaysAfternoonEnd: settings.businessHours?.weekdaysAfternoonEnd || '',
          saturday: settings.businessHours?.saturday || false,
          saturdayStart: settings.businessHours?.saturdayStart || '',
          saturdayEnd: settings.businessHours?.saturdayEnd || '',
        },
        services: settings.services || [],
        responsibleDentist: {
          name: settings.responsibleDentist?.name || '',
          cro: settings.responsibleDentist?.cro || '',
        },
        specialClosures: settings.specialClosures || [],
      });
    }
  }, [settings, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Lidar com campos aninhados usando notação de ponto
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...((prev[section as keyof typeof prev] ?? {}) as object),
          [field]: value
        }
      }));
      
      // Log para depuração
      console.log(`Updating ${section}.${field} to:`, value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...((prev[section as keyof typeof prev] ?? {}) as object),
          [field]: checked
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: checked }));
    }
  };

  const handleServiceChange = (serviceId: string, isActive: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map(service => 
        service.id === serviceId ? { ...service, active: isActive } : service
      )
    }));
  };

  const handleAddSpecialClosure = () => {
    if (!newClosureDate) {
      toast.error('Selecione uma data para adicionar');
      return;
    }

    const today = new Date();
    const selectedDate = new Date(newClosureDate);
    
    // Reset time part for accurate comparison
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error('Não é possível adicionar datas passadas');
      return;
    }

    // Check if date already exists
    const dateAlreadyExists = formData.specialClosures.some(
      closure => closure.date === newClosureDate
    );

    if (dateAlreadyExists) {
      toast.error('Esta data já está cadastrada como feriado/fechamento');
      return;
    }

    const newClosure: SpecialClosureDate = {
      id: Date.now().toString(),
      date: newClosureDate,
      description: newClosureDescription.trim() || 'Clínica fechada'
    };

    setFormData(prev => ({
      ...prev,
      specialClosures: [...prev.specialClosures, newClosure]
    }));

    setNewClosureDate('');
    setNewClosureDescription('');
    toast.success('Data de fechamento adicionada');
  };

  const handleRemoveSpecialClosure = (id: string) => {
    setFormData(prev => ({
      ...prev,
      specialClosures: prev.specialClosures.filter(closure => closure.id !== id)
    }));
    toast.success('Data de fechamento removida');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Log completo do formulário antes de enviar
      console.log('Enviando dados completos:', formData);
      await updateSettings(formData);
      toast.success('Informações da clínica atualizadas com sucesso!');
  // Atualizar snapshot inicial após salvar
  setInitialData(JSON.parse(JSON.stringify(formData)));
    } catch (error) {
      toast.error('Erro ao atualizar informações da clínica.');
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setSaving(false);
    }
  };

  // Format date to Brazilian format (dd/mm/yyyy)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Detectar mudanças entre formData e initialData
  const isDirty = Boolean(initialData) && JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleReset = () => {
    if (!initialData) return;
    setFormData(JSON.parse(JSON.stringify(initialData)));
    toast('Revertido para os últimos dados salvos');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-primary-blue" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Configurações da Clínica</h2>
          <p className="text-sm text-gray-500">Edite as informações da clínica. Lembre-se de salvar as alterações.</p>
        </div>

        {/* Preview rápido */}
        <aside className="ml-auto w-64 bg-gray-50 border border-gray-100 rounded-md p-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Pré-visualização</h4>
          <p className="text-base font-bold text-gray-800">{formData.name || '— Nome da clínica —'}</p>
          <p className="text-sm text-gray-600">{formData.contact.phone || '— Telefone —'}</p>
          <div className="mt-2 text-sm text-gray-700">
            <div>Horário:</div>
            <div className="text-sm text-gray-600">
              {formData.businessHours.weekdaysStart && formData.businessHours.weekdaysEnd
                ? `${formData.businessHours.weekdaysStart} - ${formData.businessHours.weekdaysEnd}`
                : '— Não configurado —'}
            </div>
          </div>
        </aside>
      </div>
      
      <form onSubmit={handleSubmit}>

        {/* Banner de alterações não salvas */}
        {isDirty && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded flex items-center justify-between">
            <div>Existem alterações não salvas.</div>
            <button type="button" onClick={handleReset} className="text-sm text-yellow-800 underline flex items-center">
              <FontAwesomeIcon icon={faUndo} className="mr-2" /> Reverter
            </button>
          </div>
        )}
        {/* Informações Básicas */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Informações Básicas</h3>
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Clínica
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
              required
            />
          </div>

          {/* Dentista Responsável */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="responsibleDentist.name" className="block text-sm font-medium text-gray-700 mb-1">
                Dentista Responsável
              </label>
              <input
                type="text"
                id="responsibleDentist.name"
                name="responsibleDentist.name"
                value={formData.responsibleDentist.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                required
              />
            </div>
            <div>
              <label htmlFor="responsibleDentist.cro" className="block text-sm font-medium text-gray-700 mb-1">
                CRO
              </label>
              <input
                type="text"
                id="responsibleDentist.cro"
                name="responsibleDentist.cro"
                value={formData.responsibleDentist.cro}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                required
              />
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Endereço</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-1">
                Rua/Avenida
              </label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address.number" className="block text-sm font-medium text-gray-700 mb-1">
                Número
              </label>
              <input
                type="text"
                id="address.number"
                name="address.number"
                value={formData.address.number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="address.complement" className="block text-sm font-medium text-gray-700 mb-1">
              Complemento
            </label>
            <input
              type="text"
              id="address.complement"
              name="address.complement"
              value={formData.address.complement}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="mb-4">
              <label htmlFor="address.neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                Bairro
              </label>
              <input
                type="text"
                id="address.neighborhood"
                name="address.neighborhood"
                value={formData.address.neighborhood}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <input
                type="text"
                id="address.city"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <input
                type="text"
                id="address.state"
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                required
                maxLength={2}
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700 mb-1">
              CEP
            </label>
            <input
              type="text"
              id="address.postalCode"
              name="address.postalCode"
              value={formData.address.postalCode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>
        </div>

        {/* Contato */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Contato</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="contact.phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                id="contact.phone"
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="contact.whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <input
                type="tel"
                id="contact.whatsapp"
                name="contact.whatsapp"
                value={formData.contact.whatsapp}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="contact.email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="contact.email"
              name="contact.email"
              value={formData.contact.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
              required
            />
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Redes Sociais</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="socialMedia.instagram" className="block text-sm font-medium text-gray-700 mb-1">
                Instagram (URL completa)
              </label>
              <input
                type="url"
                id="socialMedia.instagram"
                name="socialMedia.instagram"
                value={formData.socialMedia.instagram}
                onChange={handleInputChange}
                placeholder="https://www.instagram.com/suaclinica"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="socialMedia.facebook" className="block text-sm font-medium text-gray-700 mb-1">
                Facebook (URL completa)
              </label>
              <input
                type="url"
                id="socialMedia.facebook"
                name="socialMedia.facebook"
                value={formData.socialMedia.facebook}
                onChange={handleInputChange}
                placeholder="https://www.facebook.com/suaclinica"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
          </div>
        </div>

        {/* Horário de Funcionamento */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Horário de Funcionamento</h3>
          
          <div className="mb-4">
            <h4 className="text-md font-medium text-gray-700 mb-2">Dias de semana</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="businessHours.weekdaysStart" className="block text-sm font-medium text-gray-700 mb-1">
                  Abertura (manhã)
                </label>
                <input
                  type="time"
                  id="businessHours.weekdaysStart"
                  name="businessHours.weekdaysStart"
                  value={formData.businessHours.weekdaysStart}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  required
                />
              </div>
              <div>
                <label htmlFor="businessHours.weekdaysEnd" className="block text-sm font-medium text-gray-700 mb-1">
                  Fechamento (manhã)
                </label>
                <input
                  type="time"
                  id="businessHours.weekdaysEnd"
                  name="businessHours.weekdaysEnd"
                  value={formData.businessHours.weekdaysEnd}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  required
                />
              </div>
              <div>
                <label htmlFor="businessHours.weekdaysAfternoonStart" className="block text-sm font-medium text-gray-700 mb-1">
                  Abertura (tarde)
                </label>
                <input
                  type="time"
                  id="businessHours.weekdaysAfternoonStart"
                  name="businessHours.weekdaysAfternoonStart"
                  value={formData.businessHours.weekdaysAfternoonStart}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  required
                />
              </div>
              <div>
                <label htmlFor="businessHours.weekdaysAfternoonEnd" className="block text-sm font-medium text-gray-700 mb-1">
                  Fechamento (tarde)
                </label>
                <input
                  type="time"
                  id="businessHours.weekdaysAfternoonEnd"
                  name="businessHours.weekdaysAfternoonEnd"
                  value={formData.businessHours.weekdaysAfternoonEnd}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="businessHours.saturday"
                name="businessHours.saturday"
                checked={formData.businessHours.saturday}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
              />
              <label htmlFor="businessHours.saturday" className="ml-2 block text-sm text-gray-700">
                Atendimento aos sábados
              </label>
            </div>
            
            {formData.businessHours.saturday && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pl-6">
                <div>
                  <label htmlFor="businessHours.saturdayStart" className="block text-sm font-medium text-gray-700 mb-1">
                    Abertura (sábado)
                  </label>
                  <input
                    type="time"
                    id="businessHours.saturdayStart"
                    name="businessHours.saturdayStart"
                    value={formData.businessHours.saturdayStart}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    required={formData.businessHours.saturday}
                  />
                </div>
                <div>
                  <label htmlFor="businessHours.saturdayEnd" className="block text-sm font-medium text-gray-700 mb-1">
                    Fechamento (sábado)
                  </label>
                  <input
                    type="time"
                    id="businessHours.saturdayEnd"
                    name="businessHours.saturdayEnd"
                    value={formData.businessHours.saturdayEnd}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    required={formData.businessHours.saturday}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Serviços */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Serviços Oferecidos</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.services.map(service => (
              <div key={service.id} className="flex items-center p-3 border rounded-md">
                <input
                  type="checkbox"
                  id={`service-${service.id}`}
                  checked={service.active}
                  onChange={(e) => handleServiceChange(service.id, e.target.checked)}
                  className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
                />
                <label htmlFor={`service-${service.id}`} className="ml-2 block text-sm text-gray-700">
                  {service.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Feriados e Dias sem Atendimento */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Feriados e Fechamentos Especiais</h3>
          
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="newClosureDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  id="newClosureDate"
                  value={newClosureDate}
                  onChange={(e) => setNewClosureDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
              </div>
              <div>
                <label htmlFor="newClosureDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição (opcional)
                </label>
                <input
                  type="text"
                  id="newClosureDescription"
                  value={newClosureDescription}
                  onChange={(e) => setNewClosureDescription(e.target.value)}
                  placeholder="Ex: Feriado nacional, Recesso, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddSpecialClosure}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Adicionar
                </button>
              </div>
            </div>
          </div>

          {formData.specialClosures.length > 0 ? (
            <div className="mt-4">
              <h4 className="text-md font-medium text-gray-700 mb-2">Datas cadastradas:</h4>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {formData.specialClosures
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((closure) => (
                        <tr key={closure.id} className="bg-white">
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{formatDate(closure.date)}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{closure.description}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => handleRemoveSpecialClosure(closure.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Nenhum feriado ou fechamento especial cadastrado.</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty || saving}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 flex items-center"
            aria-label="Reverter alterações"
          >
            <FontAwesomeIcon icon={faUndo} className="mr-2" />
            Reverter
          </button>

          <button
            type="submit"
            disabled={saving || !isDirty}
            className="px-6 py-2 bg-primary-blue text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue disabled:opacity-50 flex items-center"
            aria-label="Salvar alterações"
          >
            {saving && <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />}
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}
