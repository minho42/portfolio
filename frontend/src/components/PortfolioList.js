import { StakeList } from "./StakeList";
import { CoinbaseList } from "./CoinbaseList";
import { IngList } from "./IngList";
import { PortfolioInfoPieChart } from "./PortfolioInfoPieChart";

export const PortfolioList = () => {
  return (
    <div className="flex justify-center p-2 space-x-2 bg-gray-100 ">
      <div className="flex flex-col space-y-2">
        <PortfolioInfoPieChart />
        <IngList />
        <CoinbaseList />
      </div>
      <div className="flex flex-grow">
        <StakeList />
      </div>
    </div>
  );
};
