import { createContext, useState } from "react";

export const SiteStatusContext = createContext(null);

export const SiteStatusProvider = ({ children }) => {
  const [isStateChartModalOpen, setIsStateChartModalOpen] = useState(false);

  return (
    <SiteStatusContext.Provider value={{ isStateChartModalOpen, setIsStateChartModalOpen }}>
      {children}
    </SiteStatusContext.Provider>
  );
};
