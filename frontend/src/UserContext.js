import { createContext, useState, useEffect } from "react";
import { CheckUser } from "./CheckUser";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // console.log("UserContext.useEffect");
    CheckUser(setToken, setIsAuthLoading);
  }, []);

  return (
    <UserContext.Provider value={{ token, setToken, isAuthLoading, setIsAuthLoading }}>
      {children}
    </UserContext.Provider>
  );
};
