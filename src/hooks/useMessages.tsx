import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { ContactMessage } from "@/types/admin";

export function useMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messageFilter, setMessageFilter] = useState("all"); // all, read, unread
  const [isLoading, setIsLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const messagesRef = collection(db, "messages");
      const q = query(messagesRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const messagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ContactMessage[];

      setMessages(messagesData);
      setIsLoading(false);
    } catch (err) {
      console.error("Erro ao buscar mensagens:", err);
      setIsLoading(false);
    }
  };

  // Function to mark a message as read/unread
  const toggleMessageStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "lido" ? "não-lido" : "lido";
      await updateDoc(doc(db, "messages", id), {
        status: newStatus,
      });
      await fetchMessages();
    } catch (err) {
      console.error("Erro ao atualizar status da mensagem:", err);
    }
  };

  // Function to delete a message
  const handleDeleteMessage = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta mensagem?")) {
      try {
        await deleteDoc(doc(db, "messages", id));
        await fetchMessages();
      } catch (err) {
        console.error("Erro ao deletar mensagem:", err);
      }
    }
  };

  // Filter messages by status
  const getFilteredMessages = () => {
    if (messageFilter === "all") return messages;
    return messages.filter(m => m.status === (messageFilter === "read" ? "lido" : "não-lido"));
  };

  // Initial fetch on component mount
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
    getFilteredMessages
  };
}
