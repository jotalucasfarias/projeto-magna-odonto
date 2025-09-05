import { db } from '@/lib/firebase/config';
import { ContactMessage } from '@/types/admin';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export function useMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messageFilter, setMessageFilter] = useState('all'); // all, read, unread
  const [isLoading, setIsLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const messagesRef = collection(db, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const messagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ContactMessage[];

      setMessages(messagesData);
      setIsLoading(false);
    } catch (err) {
      console.error('Erro ao buscar mensagens:', err);
      setIsLoading(false);
    }
  };

  // Função para marcar uma mensagem como lida/não lida
  const toggleMessageStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'lido' ? 'não-lido' : 'lido';
      await updateDoc(doc(db, 'messages', id), {
        status: newStatus,
      });
      await fetchMessages();
    } catch (err) {
      console.error('Erro ao atualizar status da mensagem:', err);
    }
  };

  // Função para excluir uma mensagem
  const handleDeleteMessage = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta mensagem?')) {
      try {
        await deleteDoc(doc(db, 'messages', id));
        await fetchMessages();
      } catch (err) {
        console.error('Erro ao deletar mensagem:', err);
      }
    }
  };

  // Filtrar mensagens por status
  const getFilteredMessages = () => {
    if (messageFilter === 'all') return messages;
    return messages.filter(
      (m) => m.status === (messageFilter === 'read' ? 'lido' : 'não-lido'),
    );
  };

  // Busca inicial ao montar o componente
  useEffect(() => {
    fetchMessages();
  }, []);

  return {
    messages,
    messageFilter,
    setMessageFilter,
    isLoading,
    fetchMessages,
    toggleMessageStatus,
    handleDeleteMessage,
    getFilteredMessages,
  };
}
