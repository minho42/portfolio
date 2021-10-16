import { useContext } from "react";
import { PortfolioContext } from "../PortfolioContext";

import StakeList from "./StakeList";
import CoinbaseList from "./CoinbaseList";
import IngList from "./IngList";
import PortfolioInfoPieChart from "./PortfolioInfoPieChart";

const PortfolioList = () => {
  const { portfolioInfo, totalValue } = useContext(PortfolioContext);

  return (
    <div className="flex justify-center p-3 space-x-2 bg-gray-100 ">
      <div className="flex flex-col space-y-2">
        <PortfolioInfoPieChart portfolioInfo={portfolioInfo} totalValue={totalValue} />
        <IngList />
        <CoinbaseList />
      </div>
      <div className="flex flex-grow">
        <StakeList />
      </div>
    </div>
  );
};

export default PortfolioList;
