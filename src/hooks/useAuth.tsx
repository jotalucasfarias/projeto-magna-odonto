import { useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
    } catch (err) {
      setError("Email ou senha inválidos");
      console.error("Login error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  return {
    isLoading,
    isAuthenticated,
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleLogin,
    handleLogout,
  };
}
