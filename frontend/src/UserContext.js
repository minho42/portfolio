import { createContext, useState, useEffect } from "react";
import { CheckUser } from "./CheckUser";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [stakeToken, setStakeToken] = useState(null);
  const [isStakeAuthLoading, setIsStakeAuthLoading] = useState(true);

  useEffect(() => {
    // console.log("UserContext.useEffect");
    CheckUser(setStakeToken, setIsStakeAuthLoading);
  }, []);

  return (
    <UserContext.Provider value={{ stakeToken, setStakeToken, isStakeAuthLoading, setIsStakeAuthLoading }}>
      {children}
    </UserContext.Provider>
  );
};
