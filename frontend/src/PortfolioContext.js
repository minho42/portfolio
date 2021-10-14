import { createContext, useState } from "react";

export const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  const [totalValue, setTotalValue] = useState(0);
  const [portfolioInfo, setPortfolioInfo] = useState([
    {
      name: "Stake",
      label: ["Stock"],
      value: 0,
    },
    {
      name: "ING",
      label: ["Savings"],
      value: 0,
    },
    {
      name: "Coinbase",
      label: ["Crypto"],
      value: 0,
    },
  ]);

  return (
    <PortfolioContext.Provider value={{ totalValue, setTotalValue, portfolioInfo, setPortfolioInfo }}>
      {children}
    </PortfolioContext.Provider>
  );
};
