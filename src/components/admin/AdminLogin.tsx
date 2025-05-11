import { useAuth } from "@/hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faEnvelope, 
  faLock,
  faFilter
} from "@fortawesome/free-solid-svg-icons";

export default function AdminLogin() {
  const { email, setEmail, password, setPassword, error, handleLogin } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl transition-all">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-primary-blue rounded-full flex items-center justify-center mb-5">
            <FontAwesomeIcon icon={faUser} className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Área Administrativa
          </h2>
          <p className="mt-2 text-gray-600">
            Digite suas credenciais para acessar o painel
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm flex items-center">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}
          <div className="rounded-md space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-10 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue focus:z-10 sm:text-sm transition duration-150"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue focus:z-10 sm:text-sm transition duration-150"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-blue hover:bg-primary-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue shadow-md transition duration-150 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-primary-light-blue group-hover:text-white transition ease-in-out duration-150" />
            </span>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
