import { createContext, useState } from "react";

export const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  // const [totalValue, setTotalValue] = useState(null);
  // const [portfolioInfo, setPortfolioInfo] = useState([]);

  return (
    <PortfolioContext.Provider
    // value={{ totalValue, setTotalValue, portfolioInfo, setPortfolioInfo }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
