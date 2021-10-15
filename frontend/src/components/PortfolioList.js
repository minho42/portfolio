import { useContext } from "react";
import { PortfolioContext } from "../PortfolioContext";

import StakeList from "./StakeList";
import CoinbaseList from "./CoinbaseList";
import IngList from "./IngList";
import PortfolioInfoPieChart from "./PortfolioInfoPieChart";

const PortfolioList = () => {
  const { portfolioInfo, totalValue } = useContext(PortfolioContext);

  return (
    <div className="flex justify-center w-full p-3 space-x-2 bg-gray-100 ">
      <div className="flex flex-col space-y-2">
        <PortfolioInfoPieChart portfolioInfo={portfolioInfo} totalValue={totalValue} />
        <IngList />
        <CoinbaseList />
      </div>
      <div className="flex">
        <StakeList />
      </div>
    </div>
    // <div className="grid grid-rows-2 grid-cols-3 grid-flow-col gap-3 p-3 bg-gray-100 ">
    //   <div className="">
    //     <PortfolioInfoPieChart portfolioInfo={portfolioInfo} totalValue={totalValue} />
    //     <IngList />
    //     <CoinbaseList />
    //   </div>
    //   <div className="">
    //     <StakeList />
    //   </div>
    // </div>
  );
};

export default PortfolioList;
