import { useContext } from "react";
import { PortfolioContext } from "../PortfolioContext";

import StakeList from "./StakeList";
import CoinbaseList from "./CoinbaseList";
import IngList from "./IngList";
import PortfolioInfoPieChart from "./PortfolioInfoPieChart";

const PortfolioList = () => {
  const { portfolioInfo, totalValue } = useContext(PortfolioContext);

  return (
    <div className="grid grid-rows-2 grid-cols-2 grid-flow-col  gap-3 p-3 bg-gray-100 ">
      <div className="row-span-2">
        <PortfolioInfoPieChart portfolioInfo={portfolioInfo} totalValue={totalValue} />
      </div>
      <IngList />
      <CoinbaseList />
      <div className="row-span-2">
        <StakeList />
      </div>
    </div>
  );
};

export default PortfolioList;
