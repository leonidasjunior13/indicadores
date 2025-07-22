//Hooks Nativos do React
import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "react-toastify";

// Tipagem do usuário
type UserProps = {
  id: number;
  email: string;
  name: string;
  token: string;
  Sites?: {
    id: string;
    name: string;
  };
};

// Tipagem do contexto
type UserContextType = {
  user: UserProps | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

// Tipagem das props do Provider
type UserContextProviderProps = {
  children: ReactNode;
};

// Criação do contexto
export const UserContext = createContext({} as UserContextType);

// Provider do contexto
export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<any>(null);
  // const navigate = useNavigate(); // ✅ CORRETO

  async function login(email: string, password: string) {
    try {
      const { data } = await axios.post("http://localhost:3333/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("area", data.user.position);
      localStorage.setItem("role", data.user.role);

      setUser(data.user);
      toast.success("Logado com sucesso");

      // navigate("/"); // ✅ Redireciona após login, se desejar
      return true;
    } catch (err: any) {
      console.error("Erro ao fazer login:", err);
      if (err.response?.status === 404) {
        toast.error("Usuário ou senha incorreto(s)");
      } else {
        toast.error("Erro ao tentar logar");
      }
      setUser(null);
      localStorage.removeItem("site");
      return false; // Retorna false se o login falhar
    }
  }

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("area");
    localStorage.removeItem("role");

    setUser(null);
    toast.success("Você saiu do sistema");
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
