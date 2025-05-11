import { useMessages } from "@/hooks/useMessages";
import { formatMessageDate } from "@/utils/formatters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faCircle,
  faCheckCircle,
} from "@fortawesome/free-regular-svg-icons";
import {
  faTrash,
  faEnvelopeOpen,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { ContactMessage } from "@/types/admin";

export default function MessagesPanel() {
  const {
    messageFilter,
    setMessageFilter,
    fetchMessages,
    toggleMessageStatus,
    handleDeleteMessage,
    getFilteredMessages
  } = useMessages();

  const filteredMessages = getFilteredMessages();

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
        Mensagens do Formulário de Contato
      </h2>

      {/* Filters for messages */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por Status
          </label>
          <select
            value={messageFilter}
            onChange={(e) => setMessageFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
          >
            <option value="all">Todas</option>
            <option value="unread">Não lidas</option>
            <option value="read">Lidas</option>
          </select>
        </div>
        <button
          onClick={fetchMessages}
          className="mt-6 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-dark-blue"
        >
          Atualizar
        </button>
      </div>

      {/* Message list */}
      {filteredMessages.length > 0 ? (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onToggleStatus={toggleMessageStatus}
              onDelete={handleDeleteMessage}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          Nenhuma mensagem encontrada. Ajuste os filtros ou aguarde novas mensagens.
        </div>
      )}
    </div>
  );
}

interface MessageCardProps {
  message: ContactMessage;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
}

function MessageCard({ message, onToggleStatus, onDelete }: MessageCardProps) {
  return (
    <div 
      className={`border rounded-lg p-4 ${
        message.status === "não-lido" 
          ? "bg-blue-50 border-blue-200" 
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon 
            icon={message.status === "não-lido" ? faCircle : faCheckCircle} 
            className={`${
              message.status === "não-lido" ? "text-blue-500" : "text-green-500"
            }`} 
          />
          <h3 className="text-lg font-semibold">{message.subject}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleStatus(message.id, message.status)}
            className={`p-1 rounded ${
              message.status === "não-lido" 
                ? "text-green-600 hover:bg-green-100" 
                : "text-blue-600 hover:bg-blue-100"
            }`}
            title={message.status === "não-lido" ? "Marcar como lida" : "Marcar como não lida"}
          >
            <FontAwesomeIcon icon={message.status === "não-lido" ? faCheck : faEnvelopeOpen} />
          </button>
          <button
            onClick={() => onDelete(message.id)}
            className="p-1 text-red-600 hover:bg-red-100 rounded"
            title="Excluir mensagem"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-sm text-gray-500">De:</p>
          <p className="font-medium">{message.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email:</p>
          <p className="font-medium">{message.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Telefone:</p>
          <p className="font-medium">{message.phone || "Não informado"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Data:</p>
          <p className="font-medium">{formatMessageDate(message.createdAt)}</p>
        </div>
      </div>

      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500 mb-1">Mensagem:</p>
        <p className="whitespace-pre-line">{message.message}</p>
      </div>
    </div>
  );
}
