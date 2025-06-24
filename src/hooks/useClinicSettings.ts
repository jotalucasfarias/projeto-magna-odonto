import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// Tipo para as configurações da clínica
export type ClinicSettings = {
  name: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
  };
  socialMedia: {
    instagram: string;
    facebook: string;
  };
  businessHours: {
    weekdaysStart: string;
    weekdaysEnd: string;
    weekdaysAfternoonStart: string;
    weekdaysAfternoonEnd: string;
    saturday: boolean;
    saturdayStart: string;
    saturdayEnd: string;
  };
  services: Array<{
    id: string;
    name: string;
    slug: string;
    active: boolean;
  }>;
  responsibleDentist: {
    name: string;
    cro: string;
  };
  lastUpdated?: Date;
  specialClosures: Array<{
    id: string;
    date: string; // YYYY-MM-DD format
    description: string;
  }>;
};

// Valores padrão para novos documentos
const defaultServices = [
  { id: 'ortodontia', name: 'Ortodontia', slug: 'ortodontia', active: true },
  { id: 'implantes', name: 'Implantes Dentários', slug: 'implantes-dentarios', active: true },
  { id: 'avaliacao', name: 'Avaliação Odontológica', slug: 'avaliacao-odontologica', active: true },
  { id: 'endodontia', name: 'Endodontia (Canal)', slug: 'endodontia', active: true },
  { id: 'proteses', name: 'Próteses Dentárias', slug: 'proteses-dentarias', active: true },
  { id: 'gengivoplastia', name: 'Gengivoplastia', slug: 'gengivoplastia', active: true },
  { id: 'limpeza', name: 'Limpeza Dental', slug: 'limpeza-dental', active: true },
  { id: 'clareamento', name: 'Clareamento Dental', slug: 'clareamento-dental', active: true },
  { id: 'restauracao', name: 'Restauração', slug: 'restauracao', active: true },
  { id: 'extracao', name: 'Extração', slug: 'extracao', active: true }
];

const defaultSettings: ClinicSettings = {
  name: 'Clínica Magna Odonto',
  address: {
    street: 'Av. Jatuarana',
    number: '4941',
    complement: 'sala 01',
    neighborhood: 'Nova Floresta',
    city: 'Porto Velho',
    state: 'RO',
    postalCode: '',
  },
  contact: {
    phone: '(69) 99602-1979',
    whatsapp: '556996021979',
    email: 'magnamartinha@hotmail.com',
  },
  socialMedia: {
    instagram: 'https://www.instagram.com/magnaodontoclinica',
    facebook: 'https://www.facebook.com/magnaodonto',
  },
  businessHours: {
    weekdaysStart: '08:00',
    weekdaysEnd: '11:30',
    weekdaysAfternoonStart: '14:00',
    weekdaysAfternoonEnd: '18:00',
    saturday: false,
    saturdayStart: '',
    saturdayEnd: '',
  },
  services: defaultServices,
  responsibleDentist: {
    name: 'Magna Ribeiro',
    cro: '2736',
  },
  specialClosures: []
};

export function useClinicSettings() {
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Carregar as configurações do Firestore
  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      try {
        const settingsRef = doc(db, 'settings', 'clinic');
        const settingsSnap = await getDoc(settingsRef);
        
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data() as ClinicSettings);
        } else {
          // Se não existir, criar com valores padrão
          await setDoc(settingsRef, defaultSettings);
          setSettings(defaultSettings);
        }
      } catch (err) {
        console.error('Erro ao carregar configurações:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setIsLoading(false);
      }
    }
    
    loadSettings();
  }, []);

  // Função para atualizar as configurações
  const updateSettings = async (updatedSettings: ClinicSettings) => {
    try {
      const settingsRef = doc(db, 'settings', 'clinic');
      
      // Adiciona a data de última atualização
      const dataToUpdate = {
        ...updatedSettings,
        lastUpdated: new Date()
      };
      
      await updateDoc(settingsRef, dataToUpdate);
      setSettings(dataToUpdate);
      return true;
    } catch (err) {
      console.error('Erro ao atualizar configurações:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      throw err;
    }
  };

  return { settings, isLoading, error, updateSettings };
}
