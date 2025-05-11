import { faTooth } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="relative">
        {/* Círculo de fora azul girando */}
        <div className="absolute inset-0 rounded-full border-4 border-primary-blue border-t-transparent animate-spin"></div>
        
        {/* Ícone de dente no meio */}
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
          <FontAwesomeIcon 
            icon={faTooth} 
            className="text-primary-blue h-8 w-8 animate-pulse" 
          />
        </div>
      </div>
      <p className="mt-4 text-primary-blue font-medium">Carregando...</p>
    </div>
  );
}
