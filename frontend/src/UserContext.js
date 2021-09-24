import { createContext, useState, useEffect } from "react";
import { CheckUser } from "./CheckUser";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // console.log("UserContext.useEffect");
    CheckUser(setToken, setIsLoading);
  }, []);

  return <UserContext.Provider value={{ token, setToken, isLoading }}>{children}</UserContext.Provider>;
};
