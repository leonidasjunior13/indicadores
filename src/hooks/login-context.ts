//Importa o contexto de autenticação
import { UserContext } from "../context/userContext";
//Importa a Api de contexto do React
import { useContext } from "react";

//Exporta o a função(useAuth)
export function useUser() {
  //define o valor de value com o contexto
  const value = useContext(UserContext);

  //Retorna value
  return value;
}
