import StakeList from "./StakeList";
import CoinbaseList from "./CoinbaseList";
import IngList from "./IngList";

const PortfolioList = () => {
  return (
    <div className="grid grid-rows-2 grid-flow-col gap-3 p-3 bg-gray-100 ">
      {/* <IngList /> */}
      {/* <CoinbaseList /> */}
      <div className="row-span-2">
        <StakeList />
      </div>
    </div>
  );
};

export default PortfolioList;
