import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import PortfolioItem from "./PortfolioItem";

const PortfolioList = () => {
  const { token } = useContext(UserContext);
  const [stakeEquityPositions, setStakeEquityPositions] = useState([]);
  const [stakeEquityValue, setStakeEquityValue] = useState(0);
  const [totalChangeSum, setTotalChangeSum] = useState(0);
  const [totalChangePercentage, setTotalChangePercentage] = useState(0);

  const isPositive = (str) => {
    return Math.sign(Number.parseFloat(str)) >= 0;
  };

  const showValueWithSign = (str) => {
    return Math.sign(Number.parseFloat(str)) >= 0
      ? `+${Number.parseFloat(str).toLocaleString()}`
      : Number.parseFloat(str).toLocaleString();
  };

  const fetchStakeData = async () => {
    if (!token) {
      setStakeEquityPositions([]);
      setStakeEquityValue(0);
      setTotalChangeSum(0);
      setTotalChangePercentage(0);
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/stake/api/stake", {
        credentials: "include",
      });

      const {
        data: { equityPositions, equityValue },
      } = await res.json();
      setStakeEquityPositions(equityPositions);
      setStakeEquityValue(equityValue);

      let sum = 0;
      equityPositions.map((position) => {
        sum += Number.parseFloat(position.unrealizedPL);
      });
      setTotalChangeSum(sum.toFixed(2));
      setTotalChangePercentage(
        (Number.parseFloat(sum.toFixed(2)) / Number.parseFloat(equityValue)) * 100
      ).toFixed(2);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStakeData();
  }, [token]);

  return (
    <div className="flex flex-col px-3 py-3 space-y-3">
      <div className="flex justify-center space-y-2 w-full">
        {stakeEquityValue && (
          <div className="uppercase text-xs tracking-wider">
            Equity value
            <div className="text-2xl ">
              ${stakeEquityValue.toLocaleString()}
              <span className={`ml-2 ${isPositive(totalChangeSum) ? "text-green-600" : "text-red-600"}`}>
                {showValueWithSign(totalChangeSum)} ({`${showValueWithSign(totalChangePercentage)}%`})
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        {stakeEquityPositions ? (
          <table className="w-11/12">
            <thead>
              <tr className="border-b-2 border-gray-700">
                <th className="text-sm uppercase font-medium">Stock</th>
                <th className="text-sm uppercase font-medium">Units</th>
                <th className="text-sm uppercase font-medium">Value</th>
                <th className="text-sm uppercase font-medium">Day change</th>
                <th className="text-sm uppercase font-medium">Total change</th>
              </tr>
            </thead>
            <tbody>
              {stakeEquityPositions.map((position) => {
                return (
                  <PortfolioItem
                    key={position.symbol}
                    data={position}
                    isPositive={isPositive}
                    showValueWithSign={showValueWithSign}
                  />
                );
              })}
            </tbody>
          </table>
        ) : (
          "Loading"
        )}
      </div>
    </div>
  );
};

export default PortfolioList;
