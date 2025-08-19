import { useState, useRef, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faSpinner,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminLogin() {
  const { email, setEmail, password, setPassword, error, handleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // validação mínima
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }
    setLoading(true);
    try {
      await Promise.resolve(handleLogin(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl transition-all">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-primary-blue rounded-full flex items-center justify-center mb-5">
            <FontAwesomeIcon icon={faUser} className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Área Administrativa</h2>
          <p className="mt-2 text-gray-600">Digite suas credenciais para acessar o painel — acesso restrito à equipe.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {error && (
            <div role="alert" aria-live="polite" className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          <div className="rounded-md space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  ref={emailRef}
                  id="email"
                  name="email"
                  autoComplete="email"
                  type="email"
                  required
                  aria-label="Email do administrador"
                  className="pl-10 appearance-none rounded-lg relative z-0 block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm transition duration-150 bg-white"
                  placeholder="seu@exemplo.com"
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  aria-label="Senha do administrador"
                  className="pl-10 appearance-none rounded-lg relative z-0 block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm transition duration-150 bg-white"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-blue hover:bg-primary-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue shadow-md transition duration-150 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-60"
            aria-live="polite"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin className="h-5 w-5 text-white" />
              ) : (
                <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-primary-light-blue group-hover:text-white transition ease-in-out duration-150" />
              )}
            </span>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
