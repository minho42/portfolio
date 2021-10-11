import { useEffect, useContext } from "react";
import { PortfolioContext } from "../PortfolioContext";

export const useUpdatePortfolioInfo = (name, value) => {
  const { portfolioInfo, setPortfolioInfo } = useContext(PortfolioContext);

  const updatePortfolioInfo = (name, value) => {
    if (!value || !portfolioInfo) return;

    const index = portfolioInfo.findIndex((obj) => obj.name === name);
    if (index >= 0) {
      const newPortfolioInfo = [...portfolioInfo];
      newPortfolioInfo[index].value = Number.parseFloat(value);
      const newPortfolioInfoSorted = [...newPortfolioInfo].sort((a, b) => {
        if (a.value < b.value) return 1;
        else return -1;
      });
      setPortfolioInfo(newPortfolioInfoSorted);
    }
  };

  useEffect(() => {
    updatePortfolioInfo(name, value);
  }, [value]);

  return null;
};
